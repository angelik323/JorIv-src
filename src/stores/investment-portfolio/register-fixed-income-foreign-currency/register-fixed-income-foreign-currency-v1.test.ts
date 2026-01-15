import { setActivePinia, createPinia } from 'pinia'
import { useRegisterFixedIncomeForeignCurrencyStoreV1 } from './register-fixed-income-foreign-currency-v1'
import { executeApi } from '@/apis'
import {
  IRegisterFixedIncomeForeignCurrencyPayload,
  IIrrFlowResponse,
  IIrrFlowForeignRequest,
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

describe('useRegisterFixedIncomeForeignCurrencyStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  const payload = {} as unknown as IRegisterFixedIncomeForeignCurrencyPayload
  const irrPayload = {} as unknown as IIrrFlowForeignRequest
  const EXPECTED_CREATE_URL = `${URL_PATH_INVESTMENT_PORTFOLIO}/buy-fixed-income-foreign-currency/new`
  const EXPECTED_IRR_URL = `${URL_PATH_INVESTMENT_PORTFOLIO}/buy-fixed-income-foreign-currency/irr-flow`

  it('should create operation successfully', async () => {
    const store = useRegisterFixedIncomeForeignCurrencyStoreV1()
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
      TIMEOUTS.SEC_5
    )
  })

  it('should handle failure when creating operation', async () => {
    const store = useRegisterFixedIncomeForeignCurrencyStoreV1()
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
      TIMEOUTS.SEC_5
    )
  })

  it('should handle catch error on _createAction', async () => {
    const store = useRegisterFixedIncomeForeignCurrencyStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('create error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction(payload)

    expect(mockPost).toHaveBeenCalledWith(EXPECTED_CREATE_URL, payload)
    expect(result).toBe(false)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error catch',
      'error',
      undefined,
      TIMEOUTS.SEC_5
    )
  })

  it('should use default success message when backend does not send one', async () => {
    const store = useRegisterFixedIncomeForeignCurrencyStoreV1()
    const mockResponse = { data: { success: true, message: undefined } }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction(payload)

    expect(mockPost).toHaveBeenCalledWith(EXPECTED_CREATE_URL, payload)
    expect(result).toBe(true)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Operación creada',
      'success',
      undefined,
      TIMEOUTS.SEC_5
    )
  })

  it('should use default error message when backend does not send one', async () => {
    const store = useRegisterFixedIncomeForeignCurrencyStoreV1()
    const mockResponse = { data: { success: false, message: undefined } }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction(payload)

    expect(mockPost).toHaveBeenCalledWith(EXPECTED_CREATE_URL, payload)
    expect(result).toBe(false)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'No se pudo crear la operación',
      'error',
      undefined,
      TIMEOUTS.SEC_5
    )
  })

  it('should get IRR flow successfully and filter out investment type', async () => {
    const store = useRegisterFixedIncomeForeignCurrencyStoreV1()

    const mockData = {
      face_value: '1000',
      purchase_value: '1000',
      cashflows: [
        { type: 'investment', amount: -1000 },
        { type: 'coupon', amount: 100 },
        { type: 'capital', amount: 1000 },
      ],
    } as unknown as IIrrFlowResponse

    const expectedFiltered = {
      ...mockData,
      cashflows: [
        { type: 'coupon', amount: 100 },
        { type: 'capital', amount: 1000 },
      ],
    }

    const mockResponse = { data: { success: true, data: mockData } }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    await store._getIrrFlow(irrPayload)

    expect(mockPost).toHaveBeenCalledWith(EXPECTED_IRR_URL, irrPayload)
    expect(store.irr_flow_response).toEqual(expectedFiltered)
  })

  it('should handle failure when getting IRR flow', async () => {
    const store = useRegisterFixedIncomeForeignCurrencyStoreV1()
    const mockResponse = { data: { success: false, message: 'Error flujo' } }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    await store._getIrrFlow(irrPayload)

    expect(mockPost).toHaveBeenCalledWith(EXPECTED_IRR_URL, irrPayload)
    expect(store.irr_flow_response).toBeNull()
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error flujo',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('should handle catch error on _getIrrFlow', async () => {
    const store = useRegisterFixedIncomeForeignCurrencyStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('irr error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    await store._getIrrFlow(irrPayload)

    expect(mockPost).toHaveBeenCalledWith(EXPECTED_IRR_URL, irrPayload)
    expect(store.irr_flow_response).toBeNull()
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error catch',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })
})
