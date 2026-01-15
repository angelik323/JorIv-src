import { setActivePinia, createPinia } from 'pinia'
import { useRegisterFixedIncomeLocalCurrencySaleStoreV1 } from './register-fixed-income-local-currency-sale-v1'
import { executeApi } from '@/apis'
import {
  IRegisterFixedIncomeLocalCurrencySalePayload,
  IIrrSaleForTitleRequest,
  ITitleLists,
} from '@/interfaces/customs'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    post: jest.fn(),
    get: jest.fn(),
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

describe('useRegisterFixedIncomeLocalCurrencySaleStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  const payload = {} as unknown as IRegisterFixedIncomeLocalCurrencySalePayload
  const EXPECTED_URL_CREATE = `${URL_PATH_INVESTMENT_PORTFOLIO}/sale-fixed-income-local-currency/new`
  const EXPECTED_URL_IRR = `${URL_PATH_INVESTMENT_PORTFOLIO}/sale-fixed-income-irr-sale/sale-irr`
  const EXPECTED_URL_TITLES = `${URL_PATH_INVESTMENT_PORTFOLIO}/title-handler/titles-list`

  it('should create operation successfully', async () => {
    const store = useRegisterFixedIncomeLocalCurrencySaleStoreV1()
    const mockResponse = { data: { success: true, message: 'Creado' } }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction(payload)

    expect(mockPost).toHaveBeenCalledWith(EXPECTED_URL_CREATE, payload)
    expect(result).toBe(true)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Creado',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('should handle failure when creating operation', async () => {
    const store = useRegisterFixedIncomeLocalCurrencySaleStoreV1()
    const mockResponse = { data: { success: false, message: 'Error' } }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction(payload)

    expect(mockPost).toHaveBeenCalledWith(EXPECTED_URL_CREATE, payload)
    expect(result).toBe(false)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('should handle catch error on _createAction', async () => {
    const store = useRegisterFixedIncomeLocalCurrencySaleStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('create error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction(payload)

    expect(mockPost).toHaveBeenCalledWith(EXPECTED_URL_CREATE, payload)
    expect(result).toBe(false)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error catch',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('should get irr sale value successfully', async () => {
    const store = useRegisterFixedIncomeLocalCurrencySaleStoreV1()
    const request = {
      title_id: 1,
      sale_value: 1000,
      operation_date: '2025-09-19',
      type_currency: 'local',
    } as IIrrSaleForTitleRequest
    const mockResponse = { data: { data: { irr_sale_value: 123.45 } } }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._getIrrSaleValue(request)

    expect(mockPost).toHaveBeenCalledWith(EXPECTED_URL_IRR, request)
    expect(result).toBe(123.45)
  })

  it('should handle catch error on _getIrrSaleValue', async () => {
    const store = useRegisterFixedIncomeLocalCurrencySaleStoreV1()
    const request = {
      title_id: 1,
      sale_value: 1000,
      operation_date: '2025-09-19',
      type_currency: 'local',
    } as IIrrSaleForTitleRequest
    const mockPost = jest.fn().mockRejectedValue(new Error('irr error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._getIrrSaleValue(request)

    expect(mockPost).toHaveBeenCalledWith(EXPECTED_URL_IRR, request)
    expect(result).toBeNull()
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error catch',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('should get titles list successfully', async () => {
    const store = useRegisterFixedIncomeLocalCurrencySaleStoreV1()
    const mockTitles: ITitleLists[] = [
      {
        id: 1,
        issuers_counterparty_id: 10,
        balance: 100,
        status_id: 1,
        unit_value: 50,
        purchase_value: null,
      },
      {
        id: 2,
        issuers_counterparty_id: 20,
        balance: 200,
        status_id: 1,
        unit_value: 75,
        purchase_value: 300,
      },
    ]
    const mockResponse = { data: { success: true, data: mockTitles } }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getTitlesList(99, 'local_fixed')

    expect(mockGet).toHaveBeenCalledWith(EXPECTED_URL_TITLES, {
      params: {
        'filter[issuers_counterparty_id]': 99,
        'filter[purchasable]': 'local_fixed',
      },
    })
    expect(result).toEqual(mockTitles)
  })

  it('should return null and show alert when backend responds with success=false in _getTitlesList', async () => {
    const store = useRegisterFixedIncomeLocalCurrencySaleStoreV1()
    const mockResponse = { data: { success: false, message: 'Error titles' } }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getTitlesList(77, 'local_fixed')

    expect(mockGet).toHaveBeenCalledWith(EXPECTED_URL_TITLES, {
      params: {
        'filter[issuers_counterparty_id]': 77,
        'filter[purchasable]': 'local_fixed',
      },
    })
    expect(result).toBeNull()
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error titles',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('should handle catch error on _getTitlesList', async () => {
    const store = useRegisterFixedIncomeLocalCurrencySaleStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('titles error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getTitlesList(55, 'local_fixed')

    expect(mockGet).toHaveBeenCalledWith(EXPECTED_URL_TITLES, {
      params: {
        'filter[issuers_counterparty_id]': 55,
        'filter[purchasable]': 'local_fixed',
      },
    })
    expect(result).toBeNull()
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error catch',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })
})
