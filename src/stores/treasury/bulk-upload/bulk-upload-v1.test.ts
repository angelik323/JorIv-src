import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'

import { IBulkUploadHistory, IBulkUploadPayload } from '@/interfaces/customs'
import { URL_PATH_TREASURIES } from '@/constants/apis'

import { useBulkUploadStoreV1 } from './bulk-upload-v1'

const mockDownloadBlob = jest.fn()
const mockGetNameBlob = jest.fn(() => 'test.csv')

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({ showCatchError: jest.fn(() => 'Error') })),
  useUtils: jest.fn(() => ({
    getNameBlob: mockGetNameBlob,
    downloadBlobXlxx: mockDownloadBlob,
  })),
}))

describe('useBulkUploadStoreV1', () => {
  const URL_PATH = `${URL_PATH_TREASURIES}/treasury-bulk-uploads`
  const URL_PATH_HISTORY = `${URL_PATH_TREASURIES}/treasury-bulk-uploads-history`

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('lists bulk uploads correctly', async () => {
    const store = useBulkUploadStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Ok',
        data: { data: [{ id: 1 }], current_page: 2, last_page: 3 },
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listHistoryAction({ page: 2 })

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH_HISTORY}`, {
      params: { page: 2, paginate: 1 },
    })
    expect(store.bulk_upload_history_list).toEqual([{ id: 1 }])
    expect(store.bulk_upload_history_pages.currentPage).toBe(2)
    expect(store.bulk_upload_history_pages.lastPage).toBe(3)
  })

  it('handles error in _listHistoryAction', async () => {
    const store = useBulkUploadStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Falló'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listHistoryAction({ page: 1 })

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH_HISTORY}`, {
      params: { page: 1, paginate: 1 },
    })
    expect(store.bulk_upload_history_list).toEqual([])
  })

  it('shows a bulk upload record successfully', async () => {
    const store = useBulkUploadStoreV1()
    const mockResponse = {
      data: { success: true, data: { id: 1 }, message: 'Ok' },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._showAction(1, 1)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/1/records/1`)
    expect(result).toEqual({ id: 1 })
  })

  it('returns null on _showAction error', async () => {
    const store = useBulkUploadStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Falló'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._showAction(99, 99)

    expect(result).toBeNull()
  })

  it('creates bulk upload successfully', async () => {
    const store = useBulkUploadStoreV1()
    const mockPost = jest
      .fn()
      .mockResolvedValue({ data: { success: true, message: 'Creado' } })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload: IBulkUploadPayload = {
      file: new File([''], 'test.csv'),
      operation_type: '',
      office_id: null,
      office_name: '',
      business_trust_id: null,
      bank_id: null,
      bank_account_id: null,
      date: '',
    }

    const result = await store._createAction(payload)

    expect(mockPost).toHaveBeenCalled()
    expect(result).toBeUndefined()
  })

  it('deletes bulk upload successfully', async () => {
    const store = useBulkUploadStoreV1()
    const mockDelete = jest
      .fn()
      .mockResolvedValue({ data: { success: true, message: 'Deleted' } })
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const success = await store._deleteAction(1)

    expect(mockDelete).toHaveBeenCalledWith(`${URL_PATH}/1`)
    expect(success).toBe(true)
  })

  it('downloads CSV structure successfully', async () => {
    const store = useBulkUploadStoreV1()
    const blobData = new Blob(['col1,col2'], { type: 'text/csv' })
    const mockGet = jest.fn().mockResolvedValue({
      data: blobData,
      headers: { 'content-type': 'text/csv' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getCsvStructureAction('op1')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH}/csv-structure?operation_type=op1`,
      { responseType: 'blob' }
    )
    expect(mockDownloadBlob).toHaveBeenCalled()
  })

  it('downloads error log history successfully', async () => {
    const store = useBulkUploadStoreV1()
    const blobData = new Blob(['error'], { type: 'text/plain' })
    const mockGet = jest.fn().mockResolvedValue({
      data: blobData,
      headers: { 'content-type': 'text/plain' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getErrorsLogHistoryAction(1)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH_HISTORY}/1/errors-log`, {
      responseType: 'blob',
    })
    expect(mockDownloadBlob).toHaveBeenCalled()
  })

  it('clears bulk upload history data', () => {
    const store = useBulkUploadStoreV1()
    store.bulk_upload_history_list = [{ id: 1 }] as IBulkUploadHistory[]
    store.bulk_upload_history_pages = { currentPage: 2, lastPage: 3 }

    store._clearDataHistory()

    expect(store.bulk_upload_history_list).toEqual([])
    expect(store.bulk_upload_history_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
  })
})
