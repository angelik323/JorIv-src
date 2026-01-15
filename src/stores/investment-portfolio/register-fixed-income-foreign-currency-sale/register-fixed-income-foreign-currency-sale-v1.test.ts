import { setActivePinia, createPinia } from 'pinia'
import { useRegisterFixedIncomeForeignCurrencySaleStoreV1 } from './register-fixed-income-foreign-currency-sale-v1'
import { executeApi } from '@/apis'
import {
  IRegisterFixedIncomeForeignCurrencySalePayload,
  IIrrSaleForTitleRequests,
  IComplianceFactorRequest,
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

describe('useRegisterFixedIncomeForeignCurrencySaleStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  const payload = {} as IRegisterFixedIncomeForeignCurrencySalePayload
  const EXPECTED_CREATE_URL = `${URL_PATH_INVESTMENT_PORTFOLIO}/sale-fixed-income-foreign-currency/new`
  const EXPECTED_IRR_URL = `${URL_PATH_INVESTMENT_PORTFOLIO}/sale-fixed-income-irr-sale/sale-irr`
  const EXPECTED_COMPLIANCE_URL = `${URL_PATH_INVESTMENT_PORTFOLIO}/sale-fixed-income-foreign-currency/compliance-factor`
  const EXPECTED_TITLES_URL = `${URL_PATH_INVESTMENT_PORTFOLIO}/title-handler/titles-list`

  it('should create operation successfully', async () => {
    const store = useRegisterFixedIncomeForeignCurrencySaleStoreV1()
    const mockResponse = { data: { success: true, message: 'Creado' } }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction(payload)

    expect(mockPost).toHaveBeenCalledWith(EXPECTED_CREATE_URL, payload)
    expect(result).toBe(true)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Creado',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('should handle failure when creating operation', async () => {
    const store = useRegisterFixedIncomeForeignCurrencySaleStoreV1()
    const mockResponse = { data: { success: false, message: 'Error' } }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction(payload)

    expect(mockPost).toHaveBeenCalledWith(EXPECTED_CREATE_URL, payload)
    expect(result).toBe(false)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('should handle catch error on _createAction', async () => {
    const store = useRegisterFixedIncomeForeignCurrencySaleStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('create error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction(payload)

    expect(mockPost).toHaveBeenCalledWith(EXPECTED_CREATE_URL, payload)
    expect(result).toBe(false)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error catch',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('should return irr_sale_value on success', async () => {
    const store = useRegisterFixedIncomeForeignCurrencySaleStoreV1()
    const mockRequest: IIrrSaleForTitleRequests = {
      title_id: 1,
      sale_value: 100,
      operation_date: '2025-09-19',
      type_currency: 'foreign',
    }
    const mockResponse = { data: { data: { irr_sale_value: 5.67 } } }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._getIrrSaleValue(mockRequest)

    expect(mockPost).toHaveBeenCalledWith(EXPECTED_IRR_URL, mockRequest)
    expect(result).toBe(5.67)
  })

  it('should return null and show alert on catch error in _getIrrSaleValue', async () => {
    const store = useRegisterFixedIncomeForeignCurrencySaleStoreV1()
    const mockRequest: IIrrSaleForTitleRequests = {
      title_id: 1,
      sale_value: 100,
      operation_date: '2025-09-19',
      type_currency: 'foreign',
    }
    const mockPost = jest.fn().mockRejectedValue(new Error('irr error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._getIrrSaleValue(mockRequest)

    expect(mockPost).toHaveBeenCalledWith(EXPECTED_IRR_URL, mockRequest)
    expect(result).toBeNull()
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error catch',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('should return compliance_factor on success', async () => {
    const store = useRegisterFixedIncomeForeignCurrencySaleStoreV1()
    const mockRequest: IComplianceFactorRequest = {
      currency_id: 114,
      origin_value: 1.17647,
      spot_rate: 3,
    }
    const mockResponse = {
      data: { success: true, data: { compliance_factor: 0.98765 } },
    }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._calculateComplianceFactor(mockRequest)

    expect(mockPost).toHaveBeenCalledWith(EXPECTED_COMPLIANCE_URL, mockRequest)
    expect(result).toBe(0.98765)
  })

  it('should return null and show alert when backend responds with success=false in _calculateComplianceFactor', async () => {
    const store = useRegisterFixedIncomeForeignCurrencySaleStoreV1()
    const mockRequest: IComplianceFactorRequest = {
      currency_id: 114,
      origin_value: 1.17647,
      spot_rate: 3,
    }
    const mockResponse = { data: { success: false, message: 'Error factor' } }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._calculateComplianceFactor(mockRequest)

    expect(mockPost).toHaveBeenCalledWith(EXPECTED_COMPLIANCE_URL, mockRequest)
    expect(result).toBeNull()
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error factor',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('should return null and show alert on catch error in _calculateComplianceFactor', async () => {
    const store = useRegisterFixedIncomeForeignCurrencySaleStoreV1()
    const mockRequest: IComplianceFactorRequest = {
      currency_id: 114,
      origin_value: 1.17647,
      spot_rate: 3,
    }
    const mockPost = jest.fn().mockRejectedValue(new Error('factor error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._calculateComplianceFactor(mockRequest)

    expect(mockPost).toHaveBeenCalledWith(EXPECTED_COMPLIANCE_URL, mockRequest)
    expect(result).toBeNull()
  })

  it('should return titles list on success', async () => {
    const store = useRegisterFixedIncomeForeignCurrencySaleStoreV1()
    const mockResponse = { data: { success: true, data: [{ id: 1 }] } }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getTitlesList(10, 'foreign_fixed')

    expect(mockGet).toHaveBeenCalledWith(EXPECTED_TITLES_URL, {
      params: {
        'filter[issuers_counterparty_id]': 10,
        'filter[purchasable]': 'foreign_fixed',
      },
    })
    expect(result).toEqual([{ id: 1 }])
  })

  it('should return null and show alert when backend responds with success=false in _getTitlesList', async () => {
    const store = useRegisterFixedIncomeForeignCurrencySaleStoreV1()
    const mockResponse = { data: { success: false, message: 'Error titles' } }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getTitlesList(20, 'foreign_fixed')

    expect(mockGet).toHaveBeenCalledWith(EXPECTED_TITLES_URL, {
      params: {
        'filter[issuers_counterparty_id]': 20,
        'filter[purchasable]': 'foreign_fixed',
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

  it('should return null and show alert on catch error in _getTitlesList', async () => {
    const store = useRegisterFixedIncomeForeignCurrencySaleStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('titles error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getTitlesList(30, 'foreign_fixed')

    expect(mockGet).toHaveBeenCalledWith(EXPECTED_TITLES_URL, {
      params: {
        'filter[issuers_counterparty_id]': 30,
        'filter[purchasable]': 'foreign_fixed',
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

  it('should return null and show alert when backend responds with success=false in _calculateComplianceFactor', async () => {
    const store = useRegisterFixedIncomeForeignCurrencySaleStoreV1()
    const mockRequest: IComplianceFactorRequest = {
      currency_id: 114,
      origin_value: 1.17647,
      spot_rate: 3,
    }
    const mockResponse = { data: { success: false, message: 'Error factor' } }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._calculateComplianceFactor(mockRequest)

    expect(mockPost).toHaveBeenCalledWith(EXPECTED_COMPLIANCE_URL, mockRequest)
    expect(result).toBeNull()
  })

  it('should return null and show alert on catch error in _calculateComplianceFactor', async () => {
    const store = useRegisterFixedIncomeForeignCurrencySaleStoreV1()
    const mockRequest: IComplianceFactorRequest = {
      currency_id: 114,
      origin_value: 1.17647,
      spot_rate: 3,
    }
    const mockPost = jest.fn().mockRejectedValue(new Error('factor error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._calculateComplianceFactor(mockRequest)

    expect(mockPost).toHaveBeenCalledWith(EXPECTED_COMPLIANCE_URL, mockRequest)
    expect(result).toBeNull()
  })

  // Test para _setCurrencyDescription
  it('should set currencyDescription', () => {
    const store = useRegisterFixedIncomeForeignCurrencySaleStoreV1()
    store._setCurrencyDescription('USD')
    expect(store.currencyDescription).toBe('USD')
  })

  // Test para _setPaperTypeId
  it('should set paperTypeId', () => {
    const store = useRegisterFixedIncomeForeignCurrencySaleStoreV1()
    store._setPaperTypeId(123)
    expect(store.paperTypeId).toBe(123)
  })

  // Test para _setNumberDays
  it('should set numberDays', () => {
    const store = useRegisterFixedIncomeForeignCurrencySaleStoreV1()
    store._setNumberDays(45)
    expect(store.numberDays).toBe(45)
  })

  // Test para _setNegotiation
  it('should set negotiation', () => {
    const store = useRegisterFixedIncomeForeignCurrencySaleStoreV1()
    store._setNegotiation('Operacion Forward')
    expect(store.negotiation).toBe('Operacion Forward')
  })
})
