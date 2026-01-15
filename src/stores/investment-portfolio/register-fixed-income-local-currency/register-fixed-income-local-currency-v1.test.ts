import { setActivePinia, createPinia } from 'pinia'
import { useRegisterFixedIncomeLocalCurrencyStoreV1 } from './register-fixed-income-local-currency-v1'
import { executeApi } from '@/apis'
import {
  IRegisterFixedIncomeLocalCurrencyPayload,
  IIrrFlowRequest,
  IIrrFlowResponse,
} from '@/interfaces/customs'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { TIMEOUT_ALERT, TIMEOUTS } from '@/constants/alerts'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    post: jest.fn(),
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

describe('useRegisterFixedIncomeLocalCurrencyStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  const payload = {} as unknown as IRegisterFixedIncomeLocalCurrencyPayload
  const irrPayload = {} as unknown as IIrrFlowRequest
  const EXPECTED_URL = `${URL_PATH_INVESTMENT_PORTFOLIO}/buy-fixed-income-local-currency/new`
  const EXPECTED_IRR_URL = `${URL_PATH_INVESTMENT_PORTFOLIO}/buy-fixed-income-local-currency/irr-flow`

  it('should create operation successfully', async () => {
    const store = useRegisterFixedIncomeLocalCurrencyStoreV1()
    const mockResponse = { data: { success: true, message: 'Creado' } }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction(payload)

    expect(mockPost).toHaveBeenCalledWith(EXPECTED_URL, payload)
    expect(result).toBe(true)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Creado',
      'success',
      undefined,
      TIMEOUTS.SEC_5
    )
  })

  it('should handle failure when creating operation', async () => {
    const store = useRegisterFixedIncomeLocalCurrencyStoreV1()
    const mockResponse = { data: { success: false, message: 'Error' } }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction(payload)

    expect(mockPost).toHaveBeenCalledWith(EXPECTED_URL, payload)
    expect(result).toBe(false)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error',
      'error',
      undefined,
      TIMEOUTS.SEC_5
    )
  })

  it('should handle catch error on _createAction', async () => {
    const store = useRegisterFixedIncomeLocalCurrencyStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('create error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction(payload)

    expect(mockPost).toHaveBeenCalledWith(EXPECTED_URL, payload)
    expect(result).toBe(false)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error catch',
      'error',
      undefined,
      TIMEOUTS.SEC_5
    )
  })

  it('should use default success message when backend does not send one', async () => {
    const store = useRegisterFixedIncomeLocalCurrencyStoreV1()
    const mockResponse = { data: { success: true, message: undefined } }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction(payload)

    expect(mockPost).toHaveBeenCalledWith(EXPECTED_URL, payload)
    expect(result).toBe(true)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Operación creada',
      'success',
      undefined,
      TIMEOUTS.SEC_5
    )
  })

  it('should use default error message when backend does not send one', async () => {
    const store = useRegisterFixedIncomeLocalCurrencyStoreV1()
    const mockResponse = { data: { success: false, message: undefined } }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction(payload)

    expect(mockPost).toHaveBeenCalledWith(EXPECTED_URL, payload)
    expect(result).toBe(false)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'No se pudo crear la operación',
      'error',
      undefined,
      TIMEOUTS.SEC_5
    )
  })

  it('should calculate IRR successfully and filter out investment type', async () => {
    const store = useRegisterFixedIncomeLocalCurrencyStoreV1()

    const mockData = {
      cashflows: [
        { type: 'investment', amount: -1000 },
        { type: 'coupon', amount: 100 },
        { type: 'capital', amount: 500 },
      ],
    } as unknown as IIrrFlowResponse

    const expectedFiltered = {
      cashflows: [
        { type: 'coupon', amount: 100 },
        { type: 'capital', amount: 500 },
      ],
    } as unknown as IIrrFlowResponse

    const mockResponse = {
      data: { success: true, message: 'TIR OK', data: mockData },
    }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._getIrrPurchaseFlow(irrPayload)

    expect(mockPost).toHaveBeenCalledWith(EXPECTED_IRR_URL, irrPayload)
    expect(result).toEqual(expectedFiltered)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'TIR OK',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('should handle failure on IRR calculation', async () => {
    const store = useRegisterFixedIncomeLocalCurrencyStoreV1()
    const mockResponse = { data: { success: false, message: 'IRR error' } }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._getIrrPurchaseFlow(irrPayload)

    expect(mockPost).toHaveBeenCalledWith(EXPECTED_IRR_URL, irrPayload)
    expect(result).toBeNull()
    expect(mockShowAlert).toHaveBeenCalledWith(
      'IRR error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('should handle catch error on IRR calculation', async () => {
    const store = useRegisterFixedIncomeLocalCurrencyStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('irr error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._getIrrPurchaseFlow(irrPayload)

    expect(mockPost).toHaveBeenCalledWith(EXPECTED_IRR_URL, irrPayload)
    expect(result).toBeNull()
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error catch',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })
})
