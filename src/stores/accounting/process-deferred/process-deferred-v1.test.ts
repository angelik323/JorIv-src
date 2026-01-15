import { setActivePinia, createPinia } from 'pinia'
import { useProcessDeferredStoreV1 } from './process-deferred-v1'
import { executeApi } from '@/apis'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'

const URL_PATH = `${URL_PATH_ACCOUNTING}/deferred-processing`
jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    put: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  })),
}))

jest.mock('@/composables', () => {
  const showAlertMock = jest.fn()
  const showCatchErrorMock = jest.fn()

  const useAlert = jest.fn(() => ({ showAlert: showAlertMock }))
  const useShowError = jest.fn(() => ({ showCatchError: showCatchErrorMock }))

  return { useAlert, useShowError, showAlertMock, showCatchErrorMock }
})

describe('useProcessDeferred', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should clean process deferred data succesfully', async () => {
    // Arrange
    const store = useProcessDeferredStoreV1()

    // Act
    store._cleanProcessDeferredData()
    store._resetDeferredSchedule()

    // Assert
    expect(store.deferred_vouchers.list).toMatchObject([])
    expect(store.deferred_vouchers.pages).toMatchObject({
      currentPage: 0,
      lastPage: 0,
    })
    expect(store.deferred_schedule).toMatchObject({})
  })

  it('should process deferred voucher succesfully', async () => {
    // Arrange
    const store = useProcessDeferredStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Listado exitoso',
        data: {
          current_page: 1,
          last_page: 1,
          data: [{ id: 1, executed_at: '2025-06-01' }],
        },
      },
    }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = {
      account_structure_id: 1,
      from_business_trust_id: 1,
      to_business_trust_id: 1,
      period: '2025-07',
    }

    // Act
    const response = await store._processDeferredVouchers(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}/process`, payload)
    expect(response).toBeTruthy()
  })

  it('should handle error on process deferred voucher', async () => {
    // Arrange
    const store = useProcessDeferredStoreV1()
    const mockError = new Error('Network Error')
    const mockPost = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = {
      account_structure_id: 1,
      from_business_trust_id: 1,
      to_business_trust_id: 1,
      period: '2025-07',
    }

    // Act
    const response = await store._processDeferredVouchers(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}/process`, payload)
    expect(response).toBe(false)
  })

  it('should get the deferred process list succesfully', async () => {
    // Arrange
    const store = useProcessDeferredStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Listado exitoso',
        data: {
          current_page: 1,
          last_page: 1,
          data: [{ id: 1, executed_at: '2025-06-01' }],
        },
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = 'filter[search]=estructura'

    // Act
    await store._getDeferredVouchers(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1&${params}`)
    expect(store.deferred_vouchers.list).toMatchObject(
      mockResponse.data.data.data
    )
  })

  it('should handle error fetching deferred process list', async () => {
    // Arrange
    const store = useProcessDeferredStoreV1()
    const mockError = new Error('Network Error')

    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = 'filter[search]=estructura'

    // Act
    const response = await store._getDeferredVouchers(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1&${params}`)
    expect(response).toBe(false)
  })

  it('should handle response.data as null when fetching the deferred process list', async () => {
    // Arrange
    const store = useProcessDeferredStoreV1()
    const mockResponse = {
      data: {
        success: false,
        message: 'No se pudo obtener el listado',
        data: null,
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = 'filter[search]=estructura'

    // Act
    const response = await store._getDeferredVouchers(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1&${params}`)
    expect(response).toBe(false)
  })

  it('should get the deferred voucher details succesfully', async () => {
    // Arrange
    const store = useProcessDeferredStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Registro obtenido exitosamente',
        data: {
          id: 1,
          executed_at: '2025-06-01',
          account_structure_id: 1,
          from_business_trust_id: 1,
        },
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const voucherId = 1

    // Act
    const response = await store._showDeferredVoucherDetail(voucherId)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/1/show`)
    expect(response).toBe(true)
    expect(store.selected_deferred_voucher).toMatchObject(
      mockResponse.data.data
    )
  })

  it('should handle error fetching deferred process list', async () => {
    // Arrange
    const store = useProcessDeferredStoreV1()
    const mockError = new Error('Network Error')

    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const voucherId = 1

    // Act
    store._resetDeferredSchedule()

    const response = await store._showDeferredVoucherDetail(voucherId)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/1/show`)
    expect(response).toBe(false)
    expect(store.selected_deferred_voucher).toMatchObject({})
  })

  it('should get the deferred voucher details succesfully', async () => {
    // Arrange
    const store = useProcessDeferredStoreV1()
    const mockResponse = {
      data: {
        success: false,
        message: 'No se pudo obtener el registro',
        data: null,
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const voucherId = 1

    // Act
    store._resetDeferredSchedule()

    const response = await store._showDeferredVoucherDetail(voucherId)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/1/show`)
    expect(response).toBe(false)
    expect(store.selected_deferred_voucher).toMatchObject({})
  })
})
