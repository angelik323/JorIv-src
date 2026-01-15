import { setActivePinia, createPinia } from 'pinia'
import { useInvoiceGenerationOtherItemsStoreV1 } from './invoice-generation-other-items-v1'
import { executeApi } from '@/apis'
import { URL_PATH_BILLING } from '@/constants/apis'
import { IInvoiceGenerationOtherItemsForm } from '@/interfaces/customs'

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

const mockResponseInvoice = {
  id: 3,
  status_id: 20,
  issuer_business_code_snapshot: '2165161',
  issuer_business_name_snapshot: 'Alias aliquid at maiores vero at.',
  issuer_business_document_type_snapshot: '-',
  issuer_business_document_snapshot: '-',
  business_code_snapshot: '23849062',
  business_name_snapshot: 'Proyecto Vial Loboguerrero Buga',
  business_document_type_snapshot: '-',
  business_document_snapshot: '-',
  third_party_billing_document_type_snapshot: 'CC',
  third_party_billing_document_snapshot: '1020304050',
  third_party_billing_name_snapshot: 'Juan Pérez',
  movement_code_code_snapshot: '00025',
  movement_code_movement_snapshot: 'General',
  movement_code_descriptions_snapshot: 'General description',
  movement_code_has_iva_snapshot: false,
  movement_code_percentage_iva_snapshot: 0,
  base_amount: '123124.00',
  iva_amount: '0.00',
  total_amount: '123124.00',
  method_payment: 'Crédito',
  payday: 15,
  pdf_path: 'invoices_others/invoice_3.pdf',
  invoice_number: '0000000003',
  is_electronic: false,
  electronic_invoice_uuid: null,
  expire_at: '2025-10-30T05:00:00.000000Z',
  invoice_description: 'awewae',
  observations: 'test',
  snapshotted_at: null,
  paid_at: null,
  anulled_at: null,
  created_by: 14257,
  updated_by: 14257,
  created_at: '2025-10-15T12:57:09.000000Z',
  updated_at: '2025-10-15T12:57:12.000000Z',
  issuer_business_id: 5008,
  business_id: 5083,
  pdf_signed_url:
    'https://documents-fiduv2-dev.s3.amazonaws.com/invoices_others/invoice_3.pdf?response-content-type=application%2Fpdf&response-content-disposition=inline%3B%20filename%3D%22invoice_3.pdf%22&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEM%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJIMEYCIQCg1FnZ86nb0brs7nSbrWmUgcPdW6p0fpLhg%2BMxlTQTiwIhAJV1Dacfyaj%2FqVna%2BXaHOTABzRzk54oGu4ULdJ%2Bp7fUMKvEDCHgQABoMNzY3Mzk3OTg4NDkxIgwCib7AbfW14jnzougqzgMl9Xs3mW12L9gPtBN6uzl4Z4dOXWJIQ5ueXzxc4pXRuhoTdlntxu4wZRCStXI9L%2B%2FE7pEWKbLBRHFbEsR1yATL6cwXTHLXISIth2wXdE%2FGbU9dBEDj1CQOCsFfIVIMgN3bdhVEDARkMxty6JZCJJSWdHi56RNrevy6wumn2q%2BFzVP0uq1799D9YCIok7qCIHxAImIv9zc2nYiSSQHee0%2BGj9CNSRfYJdqSe%2BE8oXDanurT6IgaZOUXoc7fWgN5VVpitJRkBU5Yk6eeybZte8OQp8KI9S6Il4jIXWii347U1vf%2FuzdZW65LppGNaJIUzUj1Os2VJzHngWDirk24GEDueDnhHDKcN2cco%2FPetD%2Fj0KRQHIQAWI112vgPBn15k7FtaMe9X1xdTiDal7tiirEt4btPUHZ26IfbjWsbtOqQISxFXQEuqsNARME%2FOvHZC9sNqcffYOu544NMB%2BnSkaUkbYW7Ni0d9J7hHKBVF%2Bo6pZDGgSPJ5ledFbsbdR9lhUUQLM92I21Hu38eMAAGWIEW3LDElzfznQZkpMLjiZi92zpU9ofz1t%2FJRPiwZ43oyV8TBLI0FmodhSq9qzLroqNCovnY%2FWl2kORa8J9qLPYwneW%2BxwY6pAEdV10cflGrAsP3BIalRzzOpd%2BI4FPxsLrc81Mi3yHdjPJeH1qc83rlA2JG8Pa0Q7nXsyocRTLEZSFfmzyVGdKjUPmdNNcIc%2BTyS9Z8rR%2B7PFF9DrArAaIBZ0p%2BeRNVeyEBJ44m2YD3ILQkWsxi1X%2FSGMuAyqForD4FNai0uOmaanONQyTMuhXbxXTC%2BHnd9l53%2FScoSuoqKE4ts0rWOnRP0kKnVQ%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIA3FLD4BCFVCJ6MSEL%2F20251015%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251015T150001Z&X-Amz-SignedHeaders=host&X-Amz-Expires=900&X-Amz-Signature=f11b48e261665c984bed46111cf80189b179d5e0a6b83caf58a73c631e89ccbc',
  status: {
    id: 20,
    name: 'Pendiente de pago',
    created_by: null,
    created_at: '2025-09-26T14:21:55.000000Z',
    updated_at: '2025-09-26T14:21:55.000000Z',
  },
}

const mockList = [
  {
    id: 3,
    status_id: 20,
    business_code_snapshot: '23849062',
    business_name_snapshot: 'Proyecto Vial Loboguerrero Buga',
    third_party_billing_document_type_snapshot: 'CC',
    third_party_billing_document_snapshot: '1020304050',
    third_party_billing_name_snapshot: 'Juan Pérez',
    total_amount: '123124.00',
    invoice_number: '0000000003',
    created_at: '2025-10-15T12:57:09.000000Z',
  },
]

const mockCreate: IInvoiceGenerationOtherItemsForm = {
  issuer_business_code_snapshot: 'EMI001',
  business_document_snapshot: 'Fideicomiso',
  business_document_type_snapshot: '8020-1',
  business_code_snapshot: 'NEG001',

  third_party_billing_document_type_snapshot: 'CC',
  third_party_billing_document_snapshot: '1020304050',
  third_party_billing_name_snapshot: 'Juan Pérez',

  movement_code_code_snapshot: 'MC-100',
  movement_code_movement_snapshot: 'Servicio de consultoría',
  movement_code_has_iva_snapshot: true,
  movement_code_percentage_iva_snapshot: 19,

  base_amount: 1000000,
  method_payment: 'TRANSFER',
  payday: 30,

  invoice_description: 'Factura por servicios de consultoría octubre',
  observations: 'Generada por backoffice',
}

describe('useInvoiceGenerationOtherItemsStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should fetch list of invoice generation other items', async () => {
    const store = useInvoiceGenerationOtherItemsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          data: mockList,
          current_page: 1,
          last_page: 2,
        },
        message: 'List fetched',
      },
      status: 200,
    })
    const params = { page: 1 }

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getInvoiceGenerationOtherItemsList(params)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_BILLING}/generation-invoices-other-concepts`,
      {
        params: { ...params, paginate: 1 },
      }
    )
    expect(store.invoice_generation_other_items_list).toEqual(mockList)
    expect(store.invoice_generation_other_items_pages.currentPage).toBe(1)
    expect(store.invoice_generation_other_items_pages.lastPage).toBe(2)
  })

  it('should handle error when fetching invoice generation other items', async () => {
    const store = useInvoiceGenerationOtherItemsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))
    const params = { page: 1 }

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getInvoiceGenerationOtherItemsList(params)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_BILLING}/generation-invoices-other-concepts`,
      {
        params: { ...params, paginate: 1 },
      }
    )
    expect(store.invoice_generation_other_items_list).toEqual([])
  })

  it('should fetch rejection reason by ID', async () => {
    const store = useInvoiceGenerationOtherItemsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: mockResponseInvoice,
        message: 'Found',
      },
      status: 200,
    })

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdInvoiceGenerationOtherItem(1)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_BILLING}/generation-invoices-other-concepts/1`
    )
    expect(store.invoice_generation_other_items_response).toEqual(
      mockResponseInvoice
    )
  })

  it('should handle error when fetching rejection reason by ID', async () => {
    const store = useInvoiceGenerationOtherItemsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdInvoiceGenerationOtherItem(1)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_BILLING}/generation-invoices-other-concepts/1`
    )
    expect(store.invoice_generation_other_items_response).toBeNull()
  })

  it('should create a new invoice generation other item', async () => {
    const store = useInvoiceGenerationOtherItemsStoreV1()
    const formData: IInvoiceGenerationOtherItemsForm = mockCreate

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Invoice generation other item created' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createInvoiceGenerationOtherItem(formData)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_BILLING}/generation-invoices-other-concepts`,
      formData
    )
    expect(result).toBe(true)
  })

  it('should return false if creation fails', async () => {
    const store = useInvoiceGenerationOtherItemsStoreV1()
    const formData: IInvoiceGenerationOtherItemsForm = mockCreate

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Error' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createInvoiceGenerationOtherItem(formData)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_BILLING}/generation-invoices-other-concepts`,
      formData
    )
    expect(result).toBe(false)
  })

  it('should return false when API throws an error', async () => {
    const store = useInvoiceGenerationOtherItemsStoreV1()
    const formData: IInvoiceGenerationOtherItemsForm = mockCreate

    const mockPost = jest.fn().mockRejectedValue(new Error('Network error'))

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createInvoiceGenerationOtherItem(formData)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_BILLING}/generation-invoices-other-concepts`,
      formData
    )
    expect(result).toBe(false)
  })

  it('should clear all data in the store', () => {
    const store = useInvoiceGenerationOtherItemsStoreV1()

    store.invoice_generation_other_items_list = mockList

    store.invoice_generation_other_items_response = mockResponseInvoice

    store.invoice_generation_other_items_pages = {
      currentPage: 2,
      lastPage: 3,
    }

    store._clearData()

    expect(store.invoice_generation_other_items_list).toEqual([])
    expect(store.invoice_generation_other_items_response).toBeNull()
    expect(store.invoice_generation_other_items_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })
})
