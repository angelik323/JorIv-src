import { executeApi } from '@/apis'
import { setActivePinia, createPinia } from 'pinia'
import { useTreasuryRecordsConsultationStoreV1 } from './treasury-records-consultation-v1'
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

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
  const getNameBlobMock = jest.fn(() => 'Registro_de_tesoreria.xlsx')
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

describe('useTreasuryRecordsConsultationStoreV1', () => {
  let store: ReturnType<typeof useTreasuryRecordsConsultationStoreV1>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useTreasuryRecordsConsultationStoreV1()

    jest.clearAllMocks()
  })

  it('should update the list and pages correctly when the response is successful', async () => {
    const store = useTreasuryRecordsConsultationStoreV1()

    const mockResponse = {
      data: {
        success: true,
        data: {
          data: [{ id: 1, name: 'Balance 1' }],
        },
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    const params = '&filter[period]=2023-03'
    await store._getTreasuryRecordsConsultationList(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/record-treasury?paginate=1${params}`
    )
    expect(store.treasury_records_consultation_list).toEqual(
      mockResponse.data.data.data
    )
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

    await store._getTreasuryRecordsConsultationList(params)

    expect(store.treasury_records_consultation_list).toEqual([])
    expect(store.treasury_records_consultation_pages.currentPage).toBe(1)
    expect(store.treasury_records_consultation_pages.lastPage).toBe(1)
  })
  it('should handle errors correctly when the API fails', async () => {
    const store = useTreasuryRecordsConsultationStoreV1()
    const mockError = new Error('Error de API')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const showCatchErrorMock = require('@/composables').showCatchErrorMock
    const showAlertMock = require('@/composables').showAlertMock

    const params =
      '&filter[business_code]=1&filter[from_period]=02-2023&filter[to_period]=03-2023'
    await store._getTreasuryRecordsConsultationList(params)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/record-treasury?paginate=1${params}`
    )
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

    await store._exportTreasuryRecordsConsultationListXLS(gotUrl)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/record-treasury/export?${gotUrl}`,
      { responseType: 'blob' }
    )
    const { getNameBlobMock, downloadBlobXlxxMock } = require('@/composables')
    expect(getNameBlobMock).toHaveBeenCalledWith(mockResponse)
    expect(downloadBlobXlxxMock).toHaveBeenCalledWith(
      mockResponse.data,
      'Registro_de_tesoreria.xlsx'
    )
  })
  it('should display an error when the API fails', async () => {
    const mockError = new Error('Error al exportar el archivo')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const gotUrl = 'filter[status]=1'

    await store._exportTreasuryRecordsConsultationListXLS(gotUrl)

    const { showCatchErrorMock, showAlertMock } = require('@/composables')
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/record-treasury/export?${gotUrl}`,
      { responseType: 'blob' }
    )
    expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
    expect(showAlertMock).toHaveBeenCalledWith(
      showCatchErrorMock(mockError),
      'error'
    )
  })
  it('should handle API response with no data', async () => {
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = '&filter[status]=1'
    await store._getTreasuryRecordsConsultationList(params)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/record-treasury?paginate=1${params}`
    )

    expect(store.treasury_records_consultation_list).toEqual([])
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

    await store._getTreasuryRecordsConsultationList(params)

    expect(store.treasury_records_consultation_list).toEqual([])
    expect(store.treasury_records_consultation_pages.currentPage).toBe(1)
    expect(store.treasury_records_consultation_pages.lastPage).toBe(1)
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

    await store._getTreasuryRecordsConsultationList(params)

    expect(store.treasury_records_consultation_list).toEqual([])
    expect(store.treasury_records_consultation_pages.currentPage).toBe(1)
    expect(store.treasury_records_consultation_pages.lastPage).toBe(1)
  })
  it('should handle errors correctly when the API fails', async () => {
    const mockError = new Error('API Error')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const showCatchErrorMock = require('@/composables').showCatchErrorMock
    const showAlertMock = require('@/composables').showAlertMock

    await store._getTreasuryRecordsConsultationList('&filter[period]=2023-03')

    expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
    expect(showAlertMock).toHaveBeenCalledWith(
      showCatchErrorMock(mockError),
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })
})
