import { setActivePinia, createPinia } from 'pinia'
import { useGenerateScatterGroupFileStoreV1 } from '@/stores/treasury/generate-scatter-group-file/generate-scatter-group-file-v1'
import { executeApi } from '@/apis'
import {
  IGenerateScatterGroupFileAuthorization,
  IGenerateScatterGroupFileCreate,
} from '@/interfaces/customs'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}))

const mockGetNameBlob = jest.fn(() => 'test.docx')
const mockDownloadGenericFile = jest.fn()
jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({
    showCatchError: jest.fn(() => 'Error capturado'),
  })),
  useUtils: jest.fn(() => ({
    getNameBlob: mockGetNameBlob,
    downloadGenericFile: mockDownloadGenericFile,
  })),
}))

describe('useGenerateScatterGroupFileStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('gets list and sets data correctly in _getListAction', async () => {
    const store = useGenerateScatterGroupFileStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'OK',
        data: { data: [{ id: 1 }] },
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction('&filter=test')

    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining('/listGroups?paginate=1&filter=test')
    )
    expect(store.generate_dispersion_group_file_list).toEqual([{ id: 1 }])
  })

  it('handles error in _getListAction', async () => {
    const store = useGenerateScatterGroupFileStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction('&filter=test')
    expect(store.generate_dispersion_group_file_list).toEqual([])
  })

  it('gets detail and sets data correctly in _getDetailAction', async () => {
    const store = useGenerateScatterGroupFileStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'OK',
        data: { data: [{ id: 2 }] },
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getDetailAction(123)
    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining('/listBreakdown?filter[group_id]=123')
    )
    expect(store.generate_dispersion_list_detail).toEqual([{ id: 2 }])
  })

  it('handles error in _getDetailAction', async () => {
    const store = useGenerateScatterGroupFileStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getDetailAction(123)
    expect(store.generate_dispersion_list_detail).toEqual([])
  })

  it('generates file and downloads when response is valid', async () => {
    const store = useGenerateScatterGroupFileStoreV1()
    const payload = { test: 'data' }
    const mockBlob = new Blob(['test'], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    })
    const mockPost = jest.fn().mockResolvedValue({
      data: mockBlob,
      headers: {
        'content-type':
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'content-disposition': 'attachment; filename="test.docx"',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })
    mockGetNameBlob.mockClear()
    mockDownloadGenericFile.mockClear()
    const result = await store._generateFile(
      payload as IGenerateScatterGroupFileCreate,
      'xlsx'
    )
    expect(mockPost).toHaveBeenCalled()
    expect(result).toBe(true)
    expect(mockGetNameBlob).toHaveBeenCalled()
    expect(mockDownloadGenericFile).toHaveBeenCalledWith(
      mockBlob,
      'test.docx',
      'xlsx'
    )
  })

  it('shows error if file is empty in _generateFile', async () => {
    const store = useGenerateScatterGroupFileStoreV1()
    const payload = { test: 'data' }
    const mockBlob = new Blob([], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    })
    const mockPost = jest.fn().mockResolvedValue({
      data: mockBlob,
      headers: {},
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })
    const mockGetNameBlob = jest.fn(() => 'test.docx')
    const mockDownloadGenericFile = jest.fn()
    jest.mock('@/composables', () => ({
      useUtils: jest.fn(() => ({
        getNameBlob: mockGetNameBlob,
        downloadGenericFile: mockDownloadGenericFile,
      })),
    }))
    const result = await store._generateFile(
      payload as IGenerateScatterGroupFileCreate,
      'xlsx'
    )
    expect(mockPost).toHaveBeenCalled()
    expect(result).toBe(false)
    expect(mockGetNameBlob).not.toHaveBeenCalled()
    expect(mockDownloadGenericFile).not.toHaveBeenCalled()
  })

  it('handles error in _generateFile', async () => {
    const store = useGenerateScatterGroupFileStoreV1()
    const payload = { test: 'data' }
    const mockPost = jest.fn().mockRejectedValue(new Error('Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._generateFile(
      payload as IGenerateScatterGroupFileCreate,
      'xlsx'
    )
    expect(mockPost).toHaveBeenCalled()
    expect(result).toBe(false)
  })

  it('generates authorization and returns true on success', async () => {
    const store = useGenerateScatterGroupFileStoreV1()
    const payload: IGenerateScatterGroupFileAuthorization = {
      group_id: 123,
      action: 'authorize',
      motives: 'test authorization',
    }
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Autorizado' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })
    const result = await store._generateAuthorization(payload)
    expect(mockPost).toHaveBeenCalled()
    expect(result).toBe(true)
  })

  it('returns false on error in _generateAuthorization', async () => {
    const store = useGenerateScatterGroupFileStoreV1()
    const payload: IGenerateScatterGroupFileAuthorization = {
      group_id: 123,
      action: 'authorize',
      motives: 'test authorization',
    }
    const mockPost = jest.fn().mockRejectedValue(new Error('Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })
    const result = await store._generateAuthorization(payload)
    expect(mockPost).toHaveBeenCalled()
    expect(result).toBe(false)
  })

  it('sets data filters with _setDataFilters', () => {
    const store = useGenerateScatterGroupFileStoreV1()
    const filters = { key: 'value' }
    store._setDataFilters(filters)
    expect(store.data_filters).toEqual(filters)
    store._setDataFilters(null)
    expect(store.data_filters).toBeNull()
  })

  it('cleans dispersion group data with _cleanDispersionGroupData', () => {
    const store = useGenerateScatterGroupFileStoreV1()
    store.generate_dispersion_group_file_list = [{ id: 1 }]
    store._cleanDispersionGroupData()
    expect(store.generate_dispersion_group_file_list).toEqual([])
  })

  it('has correct initial state', () => {
    const store = useGenerateScatterGroupFileStoreV1()
    expect(store.generate_scatter_group_file_detail_list).toEqual([])
    expect(store.generate_scatter_group_file_breakdown_list).toEqual([])
    expect(store.generate_dispersion_group_file_list).toEqual([])
    expect(store.generate_dispersion_list_detail).toEqual([])
    expect(store.generate_pages_dispersion).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
    expect(store.data_filters).toEqual({})
  })
})
