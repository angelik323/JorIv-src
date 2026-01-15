import { executeApi } from '@/apis'
import { setActivePinia, createPinia } from 'pinia'
import { useConsecutiveQueriesOfReceiptv1 } from './consecutive-queries-of-receipts-v1'

const URL_PATH_ACCOUNTING = 'accounting/api/accounting'

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

describe('useConsecutiveQueriesOfReceiptv1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })
  it('should update the list and pages correctly when the response is successful', async () => {
    const store = useConsecutiveQueriesOfReceiptv1()

    const mockResponse = {
      data: {
        success: true,
        data: {
          data: [{ id: 1, name: 'Receipt 1' }],
          current_page: 1,
          last_page: 5,
        },
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    const params =
      '&filter[business_code]=1&filter[from_period]=02-2023&filter[to_period]=03-2023'
    await store._getConsecutiveQueriesOfReceiptsList(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/consecutive-vouchers?paginate=1${params}`
    )
    expect(store.consecutiveQueriesOfReceiptsList).toEqual(
      mockResponse.data.data.data
    )
  })

  it('should handle errors correctly when the API fails', async () => {
    const store = useConsecutiveQueriesOfReceiptv1()
    const mockError = new Error('Error de API')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const showCatchErrorMock = require('@/composables').showCatchErrorMock
    const showAlertMock = require('@/composables').showAlertMock

    const params =
      '&filter[business_code]=1&filter[from_period]=02-2023&filter[to_period]=03-2023'
    await store._getConsecutiveQueriesOfReceiptsList(params)

    expect(mockGet).toHaveBeenCalledWith(
      'accounting/api/accounting/consecutive-vouchers?paginate=1' + params
    )
    expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
    expect(showAlertMock).toHaveBeenCalledWith(
      showCatchErrorMock(mockError),
      'error',
      undefined,
      3000
    )
  })

  it('should update the state correctly when the response is successful', async () => {
    const store = useConsecutiveQueriesOfReceiptv1()

    const mockResponse = {
      data: {
        success: true,
        data: {
          route_export: '/export.xlsx',
          data: [{ id: 1, name: 'Receipt 1' }],
          current_page: 1,
          last_page: 5,
        },
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params =
      '&filter[business_code]=1&filter[from_period]=02-2023&filter[to_period]=03-2023'
    await store._getConsecutiveQueriesOfReceiptsList(params)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/consecutive-vouchers?paginate=1${params}`
    )
    expect(store.urlExportXlsx).toBe(mockResponse.data.data.route_export)
    expect(store.consecutiveQueriesOfReceiptsList).toEqual(
      mockResponse.data.data.data
    )
    expect(store.consecutiveQueriesOfReceiptspages.currentPage).toBe(
      mockResponse.data.data.current_page
    )
    expect(store.consecutiveQueriesOfReceiptspages.lastPage).toBe(
      mockResponse.data.data.last_page
    )
  })

  it('should handle errors correctly when the API fails', async () => {
    const store = useConsecutiveQueriesOfReceiptv1()
    const mockError = new Error('Error de API')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const showCatchErrorMock = require('@/composables').showCatchErrorMock
    const showAlertMock = require('@/composables').showAlertMock

    const params =
      '&filter[business_code]=1&filter[from_period]=02-2023&filter[to_period]=03-2023'
    await store._getConsecutiveQueriesOfReceiptsList(params)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/consecutive-vouchers?paginate=1${params}`
    )
    expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
    expect(showAlertMock).toHaveBeenCalledWith(
      showCatchErrorMock(mockError),
      'error',
      undefined,
      3000
    )
  })
})
