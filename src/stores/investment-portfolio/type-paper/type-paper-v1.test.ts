import { setActivePinia, createPinia } from 'pinia'
import { usePaperTypesStoreV1 } from './type-paper-v1'
import { executeApi } from '@/apis'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import {
  IPaperTypeListItem,
  ITypePaperToCreate,
  ITypePaperResponse,
} from '@/interfaces/customs/investment-portfolio/TypePaper'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({ showCatchError: jest.fn(() => 'Error!') })),
  useUtils: jest.fn(() => ({
    defaultIconsLucide: { plusCircleOutline: 'mocked-icon' },
  })),
}))

describe('usePaperTypesStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should fetch list of paper types', async () => {
    const store = usePaperTypesStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          data: [
            { id: 1, code: 'T01', description: 'Tipo 1' },
          ] as IPaperTypeListItem[],
          current_page: 1,
          last_page: 3,
        },
        message: 'List fetched successfully',
      },
    })

    const params = { page: 1 }
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction(params)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/paper-types`,
      { params: { ...params, paginate: 1 } }
    )
    expect(store.paper_type_list).toEqual([
      { id: 1, code: 'T01', description: 'Tipo 1' },
    ])
    expect(store.paper_type_pages.currentPage).toBe(1)
    expect(store.paper_type_pages.lastPage).toBe(3)
  })

  it('should handle error when fetching list', async () => {
    const store = usePaperTypesStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    const params = { page: 1 }

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction(params)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/paper-types`,
      { params: { ...params, paginate: 1 } }
    )
    expect(store.paper_type_list).toEqual([])
  })

  it('should create a new paper type successfully', async () => {
    const store = usePaperTypesStoreV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Created successfully' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const formData: ITypePaperToCreate = {
      code: 'T02',
      description: 'Nuevo tipo',
      currency_id: 1,
      inversion_type_id: 2,
      investment_class: 'Clase',
      rate_type: 'Fija',
      rate_class: 'Clase1',
      rate: 'CTF01',
      rate_mode: 'Anticipada',
      base_flow_rate: '360 días',
      flow_type: 'Regular',
      payment_flow: 'Pago',
      amortization_type: 'Manual',
    }

    const result = await store._createPaperType(formData)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/paper-types`,
      formData
    )
    expect(result).toBe(true)
  })

  it('should return false if creation fails', async () => {
    const store = usePaperTypesStoreV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Error' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createPaperType({
      code: 'X',
      description: 'Error test',
    })

    expect(result).toBe(false)
  })

  it('should handle API error during creation', async () => {
    const store = usePaperTypesStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('API Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createPaperType({
      code: 'Y',
      description: 'Test Error',
    })

    expect(result).toBe(false)
  })

  it('should fetch paper type by ID', async () => {
    const store = usePaperTypesStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Found',
        data: { id: 10, code: 'PT10', description: 'Tipo 10' },
      },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByPaperTypeId(10)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/paper-types/10`
    )
    expect(store.paper_type_response).toEqual({
      id: 10,
      code: 'PT10',
      description: 'Tipo 10',
    })
  })

  it('should handle error when fetching paper type by ID', async () => {
    const store = usePaperTypesStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Not Found'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByPaperTypeId(99)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/paper-types/99`
    )
    expect(store.paper_type_response).toBeNull()
  })

  it('should assign ITypePaperResponse correctly', async () => {
    const store = usePaperTypesStoreV1()

    const mockResponse: ITypePaperResponse = {
      id: 63,
      code: 'Refactor05',
      description: 'desc refactor renta fija con amortizacion',
      currency: 'PHP',
      investment_type: 'Renta fija',
      investment_class: 'DV - Disponible para la venta',
      rate_type: 'Variable',
      rate_class: 'Efectivo',
      rate: 'CTF005',
      rate_mode: 'Anticipada',
      base_flow_rate: '360 días',
      flow_type: 'Irregular',
      payment_flow: 'Cobro',
      amortization_type: 'Manual',
      created_at: '2025-10-21',
      creator_data: 'Nelson Uriel - 6110143936',
    }

    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Found',
        data: mockResponse,
      },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByPaperTypeId(63)

    expect(store.paper_type_response).toEqual(mockResponse)
    expect(store.paper_type_response?.currency).toBe('PHP')
    expect(store.paper_type_response?.investment_class).toContain('DV')
  })

  it('should clear all store data', () => {
    const store = usePaperTypesStoreV1()

    store.paper_type_list = [{ id: 1, code: 'P1', description: 'Paper' }]
    store.paper_type_response = { id: 1, code: 'P1', description: 'Paper' }
    store.paper_type_pages = { currentPage: 2, lastPage: 3 }

    store._clearData()

    expect(store.paper_type_list).toEqual([])
    expect(store.paper_type_response).toBeNull()
    expect(store.paper_type_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })
})
