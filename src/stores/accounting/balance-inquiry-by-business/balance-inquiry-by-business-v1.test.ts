import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'
import { useBalanceInquiryByBusiness } from './balance-inquiry-by-business-v1'
import { useAlert } from '@/composables'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'

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
  const getNameBlobMock = jest.fn(() => 'test-file.xlsx')
  const downloadBlobXlxxMock = jest.fn()

  const useAlert = jest.fn(() => ({ showAlert: showAlertMock }))
  const useShowError = jest.fn(() => ({ showCatchError: showCatchErrorMock }))
  const useUtils = jest.fn(() => ({
    getNameBlob: getNameBlobMock,
    downloadBlobXlxx: downloadBlobXlxxMock,
  }))

  return {
    useAlert,
    useShowError,
    useUtils,
    showAlertMock,
    showCatchErrorMock,
    getNameBlobMock,
    downloadBlobXlxxMock,
  }
})

describe('useBalanceInquiryByBusiness', () => {
  let store: ReturnType<typeof useBalanceInquiryByBusiness>
  beforeEach(() => {
    setActivePinia(createPinia())
    store = useBalanceInquiryByBusiness()
    jest.clearAllMocks()
  })

  it('should update the state correctly when the API responds successfully', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: {
          data: [
            {
              id: 1,
              code_business: 'BUS001',
              name_business: 'Business One',
              code_acount: 'AC001',
              name_acount: 'Account One',
              initial_balance: 1000,
              debit: 200,
              credit: 150,
              final_balance: 1050,
              foreign_currency_balance: 0,
            },
          ],
          current_page: 2,
          last_page: 5,
        },
        message: 'Datos obtenidos correctamente',
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = '&filter[status]=1'

    await store._getBalanceInquiryByBusinnesList(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/balance-inquiry-by-business?paginate=1${params}`
    )
    expect(store.balance_inquiry_by_business_list).toEqual(
      mockResponse.data.data.data
    )
  })

  it('should display an error when the API fails', async () => {
    const mockError = new Error('Error al obtnerer la lista de negocios')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = '&filter[status]=1'

    await store._getBalanceInquiryByBusinnesList(params)

    const { showCatchErrorMock } = require('@/composables')
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/balance-inquiry-by-business?paginate=1${params}`
    )
    expect(useAlert().showAlert).toHaveBeenCalledWith(
      showCatchErrorMock(mockError),
      'error',
      undefined,
      3000
    )
  })

  it('should update pagination state correctly', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: {
          data: [],
          current_page: 3,
          last_page: 10,
        },
        message: 'Datos obtenidos correctamente',
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = '&filter[status]=1'

    await store._getBalanceInquiryByBusinnesList(params)

    expect(store.balance_inquiry_by_business_pages.currentPage).toBe(3)
    expect(store.balance_inquiry_by_business_pages.lastPage).toBe(10)
  })

  it('should handle empty data response', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: {
          data: [],
          current_page: 1,
          last_page: 1,
        },
        message: 'No hay datos disponibles',
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = '&filter[status]=1'

    await store._getBalanceInquiryByBusinnesList(params)

    expect(store.balance_inquiry_by_business_list).toEqual([])
    expect(store.balance_inquiry_by_business_pages.currentPage).toBe(1)
    expect(store.balance_inquiry_by_business_pages.lastPage).toBe(1)
  })

  it('should handle API response with no data', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: {
          data: null,
          current_page: 1,
          last_page: 1,
        },
        message: 'No hay datos disponibles',
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = '&filter[status]=1'

    await store._getBalanceInquiryByBusinnesList(params)

    expect(store.balance_inquiry_by_business_list).toEqual([])
    expect(store.balance_inquiry_by_business_pages.currentPage).toBe(1)
    expect(store.balance_inquiry_by_business_pages.lastPage).toBe(1)
  })

  it('should handle API response with no success flag', async () => {
    const mockResponse = {
      data: {
        data: {
          data: [],
          current_page: 1,
          last_page: 1,
        },
        message: 'No hay datos disponibles',
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = '&filter[status]=1'

    await store._getBalanceInquiryByBusinnesList(params)

    expect(store.balance_inquiry_by_business_list).toEqual([])
    expect(store.balance_inquiry_by_business_pages.currentPage).toBe(1)
    expect(store.balance_inquiry_by_business_pages.lastPage).toBe(1)
  })

  it('should handle API response with empty data array', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: {
          data: [],
          current_page: 1,
          last_page: 1,
        },
        message: 'No hay datos disponibles',
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = '&filter[status]=1'

    await store._getBalanceInquiryByBusinnesList(params)

    expect(store.balance_inquiry_by_business_list).toEqual([])
    expect(store.balance_inquiry_by_business_pages.currentPage).toBe(1)
    expect(store.balance_inquiry_by_business_pages.lastPage).toBe(1)
  })

  it('should handle API response with unexpected structure', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: {
          unexpectedField: 'unexpectedValue',
        },
        message: 'Datos obtenidos correctamente',
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = '&filter[status]=1'

    await store._getBalanceInquiryByBusinnesList(params)

    expect(store.balance_inquiry_by_business_list).toEqual([])
    expect(store.balance_inquiry_by_business_pages.currentPage).toBe(0)
    expect(store.balance_inquiry_by_business_pages.lastPage).toBe(0)
  })

  it('should download the file when the API responds successfully', async () => {
    const mockResponse = {
      data: new Blob(['test data'], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }),
      headers: {
        'content-type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const gotUrl = 'filter[status]=1'

    await store._exportBalanceInquiryByBusinessListXLS(gotUrl)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/balance-inquiry-by-business/export?${gotUrl}`,
      { responseType: 'blob' }
    )
    const { getNameBlobMock, downloadBlobXlxxMock } = require('@/composables')
    expect(getNameBlobMock).toHaveBeenCalledWith(mockResponse)
    expect(downloadBlobXlxxMock).toHaveBeenCalledWith(
      mockResponse.data,
      'test-file.xlsx'
    )
  })

  it('should display an error when the API fails', async () => {
    const mockError = new Error('Error al exportar el archivo')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const gotUrl = 'filter[status]=1'

    await store._exportBalanceInquiryByBusinessListXLS(gotUrl)

    const { showCatchErrorMock, showAlertMock } = require('@/composables')
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/balance-inquiry-by-business/export?${gotUrl}`,
      { responseType: 'blob' }
    )
    expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
    expect(showAlertMock).toHaveBeenCalledWith(
      showCatchErrorMock(mockError),
      'error'
    )
  })
})
