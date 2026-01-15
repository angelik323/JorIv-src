import { executeApi } from '@/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { setActivePinia, createPinia } from 'pinia'
import { useConsolidatedBalanceInquiryV1 } from './consolidated-balance-inquiry-v1'
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
  const getNameBlobMock = jest.fn(
    () => 'Consulta_saldos_consolidados_2025-07-09.xlsx'
  )
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
    showAlertMock,
    showCatchErrorMock,
    useUtils,
    getNameBlobMock,
    downloadBlobXlxxMock,
  }
})

describe('useConsolidatedBalanceInquiryV1', () => {
  let store: ReturnType<typeof useConsolidatedBalanceInquiryV1>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useConsolidatedBalanceInquiryV1()

    jest.clearAllMocks()
  })

  it('should update the list and pages correctly when the response is successful', async () => {
    const store = useConsolidatedBalanceInquiryV1()

    const mockResponse = {
      data: {
        success: true,
        data: {
          data: [{ id: 1, name: 'Balance 1' }],
          current_page: 1,
          last_page: 5,
          route_export: '/export/balance.xlsx',
        },
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    const params = '&filter[period]=2023-03'
    await store._getConsolidatedBalanceInquiryList(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/consolidated-balance-inquiry?paginate=1${params}`
    )
    expect(store.consolidatedBalanceInquiryList).toEqual(
      mockResponse.data.data.data
    )
    expect(store.consolidatedBalanceInquiryPages.currentPage).toBe(1)
    expect(store.consolidatedBalanceInquiryPages.lastPage).toBe(5)
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

    await store._getConsolidatedBalanceInquiryList(params)

    expect(store.consolidatedBalanceInquiryList).toEqual([])
    expect(store.consolidatedBalanceInquiryPages.currentPage).toBe(1)
    expect(store.consolidatedBalanceInquiryPages.lastPage).toBe(1)
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
    await store._getConsolidatedBalanceInquiryList(params)

    expect(store.consolidatedBalanceInquiryList).toEqual([])
    expect(store.consolidatedBalanceInquiryPages.currentPage).toBe(1)
    expect(store.consolidatedBalanceInquiryPages.lastPage).toBe(1)
  })

  it('should handle API response with no success flag', async () => {
    const mockResponse = {
      data: {
        data: {
          data: [],
          current_page: 0,
          last_page: 0,
        },
        message: 'No hay datos disponibles',
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = '&filter[status]=1'

    await store._getConsolidatedBalanceInquiryList(params)

    expect(store.consolidatedBalanceInquiryList).toEqual([])
    expect(store.consolidatedBalanceInquiryPages.currentPage).toBe(0)
    expect(store.consolidatedBalanceInquiryPages.lastPage).toBe(0)
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

    await store._getConsolidatedBalanceInquiryList(params)

    expect(store.consolidatedBalanceInquiryList).toEqual([])
    expect(store.consolidatedBalanceInquiryPages.currentPage).toBe(1)
    expect(store.consolidatedBalanceInquiryPages.lastPage).toBe(1)
  })

  it('should handle errors correctly when the API fails', async () => {
    const store = useConsolidatedBalanceInquiryV1()
    const mockError = new Error('API Error')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const showCatchErrorMock = require('@/composables').showCatchErrorMock
    const showAlertMock = require('@/composables').showAlertMock

    await store._getConsolidatedBalanceInquiryList('&filter[period]=2023-03')

    expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
    expect(showAlertMock).toHaveBeenCalledWith(
      showCatchErrorMock(mockError),
      'error',
      undefined,
      TIMEOUT_ALERT
    )
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

    await store._exportConsolidateBalanceInquiryListXLS(gotUrl)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/consolidated-balance-inquiry/export?${gotUrl}`,
      { responseType: 'blob' }
    )
    const { getNameBlobMock, downloadBlobXlxxMock } = require('@/composables')
    expect(getNameBlobMock).toHaveBeenCalledWith(mockResponse)
    expect(downloadBlobXlxxMock).toHaveBeenCalledWith(
      mockResponse.data,
      'Consulta_saldos_consolidados_2025-07-09.xlsx'
    )
  })

  it('should display an error when the API fails', async () => {
    const mockError = new Error('Error al exportar el archivo')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const gotUrl = 'filter[status]=1'

    await store._exportConsolidateBalanceInquiryListXLS(gotUrl)

    const { showCatchErrorMock, showAlertMock } = require('@/composables')
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/consolidated-balance-inquiry/export?${gotUrl}`,
      { responseType: 'blob' }
    )
    expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
    expect(showAlertMock).toHaveBeenCalledWith(
      showCatchErrorMock(mockError),
      'error'
    )
  })
})
