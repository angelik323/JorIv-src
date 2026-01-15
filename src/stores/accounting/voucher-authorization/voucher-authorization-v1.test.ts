import { setActivePinia, createPinia } from 'pinia'
import { useVoucherAuthorizationStoreV1 } from './voucher-authorization-v1'
import { executeApi } from '@/apis'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { IVoucherAuthorizationPayload } from '@/interfaces/customs/accounting/VoucherAuthorization'

const URL_PATH = `${URL_PATH_ACCOUNTING}/voucher-authorizations`

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}))

jest.mock('@/composables', () => {
  const showAlertMock = jest.fn()
  const showCatchErrorMock = jest.fn(() => 'Handled error')
  const useAlert = jest.fn(() => ({ showAlert: showAlertMock }))
  const useShowError = jest.fn(() => ({ showCatchError: showCatchErrorMock }))

  return { useAlert, useShowError, showAlertMock, showCatchErrorMock }
})

describe('useVoucherAuthorizationStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should fetch pending vouchers and update state on success', async () => {
    const store = useVoucherAuthorizationStoreV1()
    const mockResponse = {
      data: {
        success: true,
        data: {
          data: [{ id: 1, code: 'V1' }],
          current_page: 2,
          last_page: 5,
        },
        message: 'Pendientes obtenidos.',
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = { status: 'pending' }

    const { showAlertMock } = require('@/composables')

    const response = await store._getPendingVouchers(params)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
      params: { paginate: 1, ...params },
    })
    expect(response).toMatchObject({
      list: mockResponse.data.data.data,
      pages: {
        currentPage: mockResponse.data.data.current_page,
        lastPage: mockResponse.data.data.last_page,
      },
    })
    expect(showAlertMock).toHaveBeenCalledWith(
      mockResponse.data.message,
      'success',
      undefined,
      expect.any(Number)
    )
  })

  it('should handle error when fetching pending vouchers', async () => {
    const store = useVoucherAuthorizationStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = { status: 'pending' }
    const { showAlertMock, showCatchErrorMock } = require('@/composables')

    const response = await store._getPendingVouchers(params)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
      params: { paginate: 1, ...params },
    })

    expect(response).toEqual(null)

    expect(showCatchErrorMock).toHaveBeenCalled()
    expect(showAlertMock).toHaveBeenCalledWith(
      expect.any(String),
      'error',
      undefined,
      expect.any(Number)
    )
  })

  it('should process voucher authorization successfully', async () => {
    const store = useVoucherAuthorizationStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Proceso exitoso.',
      },
    }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload: IVoucherAuthorizationPayload = {
      action: 'approve',
      voucher_ids: [1, 2],
      authorization_notes: '',
    }

    const { showAlertMock } = require('@/composables')

    const result = await store._processVoucherAuthorization(payload)

    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}/process`, payload)
    expect(result).toBe(true)
    expect(showAlertMock).toHaveBeenCalledWith(
      mockResponse.data.message,
      'success',
      undefined,
      expect.any(Number)
    )
  })

  it('should handle error when processing voucher authorization', async () => {
    const store = useVoucherAuthorizationStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('Network'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload: IVoucherAuthorizationPayload = {
      action: 'approve',
      voucher_ids: [1, 2],
      authorization_notes: '',
    }
    const { showAlertMock, showCatchErrorMock } = require('@/composables')

    const result = await store._processVoucherAuthorization(payload)

    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}/process`, payload)
    expect(result).toBe(false)
    expect(showCatchErrorMock).toHaveBeenCalled()
    expect(showAlertMock).toHaveBeenCalledWith(
      expect.any(String),
      'error',
      undefined,
      expect.any(Number)
    )
  })
})
