import { setActivePinia, createPinia } from 'pinia'
import { useRegisterShareSaleLocalCurrencyStoreV1 } from './register-sales-variable-income-share-local-currency-v1'
import { executeApi } from '@/apis'
import { IRegisterShareSaleLocalCurrencyPayload } from '@/interfaces/customs'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

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

describe('useRegisterShareSaleLocalCurrencyStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  const payload = {} as unknown as IRegisterShareSaleLocalCurrencyPayload
  const EXPECTED_URL = `${URL_PATH_INVESTMENT_PORTFOLIO}/variable-income-shares-currency-local/new`

  it('should create operation successfully', async () => {
    const store = useRegisterShareSaleLocalCurrencyStoreV1()
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
      TIMEOUT_ALERT
    )
  })

  it('should handle failure when creating operation', async () => {
    const store = useRegisterShareSaleLocalCurrencyStoreV1()
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
      TIMEOUT_ALERT
    )
  })

  it('should handle catch error on _createAction', async () => {
    const store = useRegisterShareSaleLocalCurrencyStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('create error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction(payload)

    expect(mockPost).toHaveBeenCalledWith(EXPECTED_URL, payload)
    expect(result).toBe(false)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error catch',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('should use default success message when backend does not send one', async () => {
    const store = useRegisterShareSaleLocalCurrencyStoreV1()
    const mockResponse = { data: { success: true, message: undefined } }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction(payload)

    expect(result).toBe(true)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Operación creada',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('should use default error message when backend does not send one', async () => {
    const store = useRegisterShareSaleLocalCurrencyStoreV1()
    const mockResponse = { data: { success: false, message: undefined } }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction(payload)

    expect(result).toBe(false)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'No se pudo crear la operación',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })
})
