import { setActivePinia, createPinia } from 'pinia'
import { useInterestRatesStoreV1 } from './interest-rates-v1'
import { executeApi } from '@/apis'
import { IInterestRate } from '@/interfaces/customs'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}))

let mockShowAlert: jest.Mock
let mockShowCatchError: jest.Mock

jest.mock('@/composables', () => {
  mockShowAlert = jest.fn()
  mockShowCatchError = jest.fn().mockReturnValue('Error catch')

  return {
    useAlert: () => ({ showAlert: mockShowAlert }),
    useShowError: () => ({ showCatchError: mockShowCatchError }),
  }
})

describe('useInterestRatesStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  const interestRatePayload: IInterestRate = {
    id: 1,
    code: 'T001',
    interest_rate_description: 'Tasa Efectiva Anual',
    description: 'Tasa de prueba',
    mode: 'Vencido',
    modality_id: 2,
    modality_description: 'Vencido',
    payment_frequency: 'Mensual',
    periodicity_id: 1,
    periodicity_description: 'Mensual',
    number_months: '12',
    date: '2025-06-25',
    rate_value: '5.5',
    created_at: '2025-06-25',
    updated_at: '2025-06-26',
  }

  it('should fetch interest rate list successfully', async () => {
    const store = useInterestRatesStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'OK',
        data: {
          current_page: 1,
          last_page: 1,
          data: [interestRatePayload],
        },
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction('')
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/interest-rate/get?paginate=1`
    )
    expect(store.interest_rate_list).toMatchObject([interestRatePayload])
    expect(store.interest_rate_pages).toMatchObject({
      currentPage: 1,
      lastPage: 1,
    })
  })

  it('should handle failure when fetching interest rate list', async () => {
    const store = useInterestRatesStoreV1()
    const mockResponse = {
      data: {
        success: false,
        message: 'Error',
        data: null,
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction('')
    expect(store.interest_rate_list).toMatchObject([])
    expect(store.interest_rate_pages).toMatchObject({
      currentPage: 0,
      lastPage: 0,
    })
  })

  it('should handle catch error on _getListAction', async () => {
    const store = useInterestRatesStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('get error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction()
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error catch',
      'error',
      undefined,
      3000
    )
  })

  it('should create interest rate successfully', async () => {
    const store = useInterestRatesStoreV1()
    const mockResponse = { data: { success: true, message: 'Creado' } }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createInterestRate(interestRatePayload)
    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/interest-rate/new`,
      interestRatePayload
    )
    expect(result).toBe(true)
  })

  it('should handle failure when creating interest rate', async () => {
    const store = useInterestRatesStoreV1()
    const mockResponse = { data: { success: false, message: 'Error' } }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createInterestRate(interestRatePayload)
    expect(result).toBe(false)
  })

  it('should handle catch error on _createInterestRate', async () => {
    const store = useInterestRatesStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('create error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createInterestRate(interestRatePayload)
    expect(result).toBe(false)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error catch',
      'error',
      undefined,
      3000
    )
  })

  it('should get interest rate by ID', async () => {
    const store = useInterestRatesStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Encontrado',
        data: interestRatePayload,
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getInterestRate(1)
    expect(result).toMatchObject(interestRatePayload)
  })

  it('should return null if interest rate not found', async () => {
    const store = useInterestRatesStoreV1()
    const mockResponse = {
      data: {
        success: false,
        message: 'No encontrado',
        data: null,
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getInterestRate(999)
    expect(result).toBeNull()
  })

  it('should handle catch error on _getInterestRate', async () => {
    const store = useInterestRatesStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('get by id error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getInterestRate(1)
    expect(result).toBeNull()
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error catch',
      'error',
      undefined,
      3000
    )
  })

  it('should update interest rate successfully', async () => {
    const store = useInterestRatesStoreV1()
    const mockResponse = { data: { success: true, message: 'Actualizado' } }
    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateInterestRate(1, { rate_value: '6.00' })
    expect(result).toBe(true)
  })

  it('should handle failure when updating interest rate', async () => {
    const store = useInterestRatesStoreV1()
    const mockResponse = { data: { success: false, message: 'Error' } }
    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateInterestRate(1, { rate_value: '6.00' })
    expect(result).toBe(false)
  })

  it('should handle catch error on _updateInterestRate', async () => {
    const store = useInterestRatesStoreV1()
    const mockPut = jest.fn().mockRejectedValue(new Error('update error'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateInterestRate(1, { rate_value: '6.00' })
    expect(result).toBe(false)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error catch',
      'error',
      undefined,
      3000
    )
  })

  it('should delete interest rate successfully', async () => {
    const store = useInterestRatesStoreV1()
    const mockResponse = { data: { success: true, message: 'Eliminado' } }
    const mockDelete = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const result = await store._deleteInterestRate(1)
    expect(result).toBe(true)
  })

  it('should handle failure when deleting interest rate', async () => {
    const store = useInterestRatesStoreV1()
    const mockResponse = { data: { success: false, message: 'Error' } }
    const mockDelete = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const result = await store._deleteInterestRate(1)
    expect(result).toBe(false)
  })

  it('should handle catch error on _deleteInterestRate', async () => {
    const store = useInterestRatesStoreV1()
    const mockDelete = jest.fn().mockRejectedValue(new Error('delete error'))
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const result = await store._deleteInterestRate(1)
    expect(result).toBe(false)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error catch',
      'error',
      undefined,
      3000
    )
  })

  it('should select an interest rate', () => {
    const store = useInterestRatesStoreV1()
    store._selectInterestRate(interestRatePayload)
    expect(store.selected_interest_rate).toMatchObject(interestRatePayload)
  })
})
