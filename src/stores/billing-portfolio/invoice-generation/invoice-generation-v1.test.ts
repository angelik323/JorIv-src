import { setActivePinia, createPinia } from 'pinia'
import { useInvoiceGenerationStoreV1 } from './invoice-generation-v1'
import { executeApi } from '@/apis'
import { URL_PATH_BILLING } from '@/constants/apis'
import { ISettledCommision } from '@/interfaces/customs'

const mockSettledCommision: ISettledCommision = {
  business_code_snapshot: 'NEG-001',
  business_name_snapshot: 'Fiduciaria Principal S.A.',
  commission_type_catalog: 'Comisión Fiduciaria',
  commission_class_catalog: 'Administración',
  observation: 'Comisión mensual de administración',
  base_amount: '1500000',
  iva_amount: '285000',
  total_amount: '1785000',
  settlement_date: '2025-07-25',
  created_by: 123,
  updated_by: 1,
  created_at: '2025-07-25T14:30:00Z',
  updated_at: '2025-07-25T14:30:00Z',
  status: {
    id: 1,
    name: 'Activo',
  },
}
const mockInvoiceGenerationList = [
  {
    id: 1,
    authorization_date: '2025-07-28T10:00:00Z',
    business_code_snapshot: 'NEG-001',
    commission_class_catalog: 'Administración',
    commission_type_catalog: 'Comisión Fiduciaria',
    expire_at: '2025-08-28T23:59:59Z',
    status_id: 1,
    pdf_signed_url: 'https://storage.example.com/facturas/factura-001.pdf',
    created_by: 123,
    updated_by: null,
    created_at: '2025-08-01T00:00:00Z',
    updated_at: '2025-08-10T00:00:00Z',
    settled_commission: { ...mockSettledCommision },
  },
]

const mockInvoiceGenerationResponse = {
  id: 4,
  anulled_at: null,
  observations: 'Factura de comisión fiduciaria mensual',
  business_code_snapshot: 'NEG-001',
  invoice_number: 'FC-2025-001',
  status: {
    id: 1,
    name: 'Emitida',
  },
  created_by: 123,
  updated_by: null,
  created_at: '2025-08-01T10:15:00Z',
  updated_at: '2025-08-01T10:15:00Z',
  settled_commission: { ...mockSettledCommision },
}

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  })),
}))
jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({ showCatchError: jest.fn(() => 'Error!') })),
}))
describe('useInvoiceGenerationStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })
  it('should fetch list of invoices generation', async () => {
    const store = useInvoiceGenerationStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          data: mockInvoiceGenerationList,
          current_page: 1,
          last_page: 2,
        },
        message: 'List fetched',
      },
      status: 200,
    })
    const params = { page: 1 }
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    await store._getInvoiceGenerationList(params)
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_BILLING}/generation-commission-invoices`,
      {
        params: { ...params, paginate: 1 },
      }
    )
    expect(store.invoice_generation_list).toEqual(mockInvoiceGenerationList)
    expect(store.invoice_generation_pages.currentPage).toBe(1)
    expect(store.invoice_generation_pages.lastPage).toBe(2)
  })
  it('should handle error when fetching invoice generation list', async () => {
    const store = useInvoiceGenerationStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))
    const params = { page: 1 }
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    await store._getInvoiceGenerationList(params)
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_BILLING}/generation-commission-invoices`,
      {
        params: { ...params, paginate: 1 },
      }
    )
    expect(store.invoice_generation_list).toEqual([])
  })
  it('should fetch invoice generation by ID', async () => {
    const store = useInvoiceGenerationStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: mockInvoiceGenerationResponse,
        message: 'Found',
      },
      status: 200,
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    await store._getByIdInvoiceGeneration(1)
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_BILLING}/generation-commission-invoices/1`
    )
    expect(store.invoice_generation_response).toEqual(
      mockInvoiceGenerationResponse
    )
  })
  it('should handle error when fetching invoice generation by ID', async () => {
    const store = useInvoiceGenerationStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    await store._getByIdInvoiceGeneration(1)
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_BILLING}/generation-commission-invoices/1`
    )
    expect(store.invoice_generation_response).toBeNull()
  })

  it('should generate invoice', async () => {
    const store = useInvoiceGenerationStoreV1()

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Registro creado exitosamente.' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })
    const result = await store._generateInvoice(1)
    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_BILLING}/generation-commission-invoices/1/generate`
    )
    expect(result).toBe(true)
  })

  it('should return false if generate invoice fails', async () => {
    const store = useInvoiceGenerationStoreV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Error' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })
    const result = await store._generateInvoice(1)
    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_BILLING}/generation-commission-invoices/1/generate`
    )
    expect(result).toBe(false)
  })

  it('should clear all data in the store', () => {
    const store = useInvoiceGenerationStoreV1()
    store.invoice_generation_list = mockInvoiceGenerationList
    store.invoice_generation_response = mockInvoiceGenerationResponse
    store.invoice_generation_pages = {
      currentPage: 2,
      lastPage: 3,
    }
    store._clearData()
    expect(store.invoice_generation_list).toEqual([])
    expect(store.invoice_generation_response).toBeNull()
    expect(store.invoice_generation_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })
})
