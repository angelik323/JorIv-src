import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'
import { useQueryMovementAccountStoreV1 } from './type-query-movement-account-v1'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}))

const mockGetFileFromS3 = jest.fn()
const mockDownloadBlobXlxx = jest.fn()

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({ showCatchError: jest.fn(() => 'Error') })),
  useUtils: jest.fn(() => ({
    getFileFromS3: mockGetFileFromS3,
    downloadBlobXlxx: mockDownloadBlobXlxx,
  })),
}))

describe('useQueryMovementAccountStoreV1 store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches query movement accounts successfully', async () => {
    const store = useQueryMovementAccountStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'OK',
        data: {
          data: [{ id: 1 }],
          current_page: 2,
          last_page: 5,
          reportables: {
            report_excel_url: 'http://pruebadescarga.com/excel',
          },
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getQueryMovementAccounts('param=1')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/account-movements-report/generate-report?param=1`
    )
    expect(store.query_movement_list).toEqual([{ id: 1 }])
    expect(store.query_movement_account_pages).toEqual({
      currentPage: 2,
      lastPage: 5,
    })
    expect(store.excel_data_url).toBe('http://pruebadescarga.com/excel')
  })

  it('handles error in _getQueryMovementAccounts', async () => {
    const store = useQueryMovementAccountStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getQueryMovementAccounts('')

    expect(mockGet).toHaveBeenCalled()
  })

  it('does not set state when response success is false', async () => {
    const store = useQueryMovementAccountStoreV1()
    const mockResponse = { data: { success: false, message: 'No', data: {} } }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getQueryMovementAccounts('x=1')
    expect(store.query_movement_list).toEqual([])
  })

  it('gets URL report successfully and returns true', async () => {
    const store = useQueryMovementAccountStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'URL obtenida',
        data: {
          report_url: 'https://s3.amazonaws.com/bucket/report.xlsx',
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getUrlReport(123)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/reportables/get-url-report/123`
    )
    expect(store.url_file).toBe('https://s3.amazonaws.com/bucket/report.xlsx')
    expect(result).toBe(true)
  })

  it('handles error in _getUrlReport and returns false', async () => {
    const store = useQueryMovementAccountStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getUrlReport('abc')

    expect(mockGet).toHaveBeenCalled()
    expect(result).toBe(false)
  })

  it('downloads file successfully and returns true', async () => {
    const store = useQueryMovementAccountStoreV1()
    store.url_file = 'https://s3.amazonaws.com/bucket/report.xlsx?params=123'

    const mockFile = new File(['content'], 'report.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    mockGetFileFromS3.mockResolvedValue(mockFile)

    const result = await store._downloadFile()

    expect(mockGetFileFromS3).toHaveBeenCalledWith(
      'https://s3.amazonaws.com/bucket/report.xlsx?params=123',
      'report.xlsx'
    )
    expect(mockDownloadBlobXlxx).toHaveBeenCalled()
    expect(result).toBe(true)
  })

  it('returns false when getFileFromS3 returns null', async () => {
    const store = useQueryMovementAccountStoreV1()
    store.url_file = 'https://s3.amazonaws.com/bucket/report.xlsx'

    mockGetFileFromS3.mockResolvedValue(null)

    const result = await store._downloadFile()

    expect(mockGetFileFromS3).toHaveBeenCalled()
    expect(mockDownloadBlobXlxx).not.toHaveBeenCalled()
    expect(result).toBe(false)
  })

  it('handles error in _downloadFile and returns false', async () => {
    const store = useQueryMovementAccountStoreV1()
    store.url_file = 'https://s3.amazonaws.com/bucket/report.xlsx'

    mockGetFileFromS3.mockRejectedValue(new Error('Download error'))

    const result = await store._downloadFile()

    expect(mockGetFileFromS3).toHaveBeenCalled()
    expect(result).toBe(false)
  })
})
