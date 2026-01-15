// Pinia - Axios
import { setActivePinia, createPinia } from 'pinia'

// Interfaces
import { IFundInfoRequest, IIndexingListRequest } from '@/interfaces/customs'

// Utils
import { URL_PATH_FICS } from '@/constants/apis'
import { executeApi } from '@/apis'

// Stores
import { useIndexingIpcStoreV1 } from './indexing-ipc-v1'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({
    showCatchError: jest.fn(() => 'catch error'),
  })),
  useUtils: jest.fn(() => ({
    getNameBlob: jest.fn(() => 'archivo.xlsx'),
    downloadBlobXlxx: jest.fn(),
  })),
}))

describe('useIndexingIpcStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches list successfully', async () => {
    const store = useIndexingIpcStoreV1()

    const mockResponse = {
      data: {
        success: true,
        message: 'OK',
        data: {
          data: [{ id: 1 }],
          current_page: 2,
          last_page: 4,
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getIndexingIpcList('type=1')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/indexation?paginate=1&type=1`
    )
    expect(store.indexing_ipc_list).toEqual([{ id: 1 }])
    expect(store.indexing_ipc_pages).toEqual({
      currentPage: 2,
      lastPage: 4,
    })
  })

  it('handles success=false in list', async () => {
    const store = useIndexingIpcStoreV1()

    const mockResponse = {
      data: {
        success: false,
        message: 'FAIL',
        data: {
          data: [],
          current_page: 0,
          last_page: 0,
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getIndexingIpcList('x=1')

    expect(store.indexing_ipc_list).toEqual([])
  })

  it('handles incomplete data in list', async () => {
    const store = useIndexingIpcStoreV1()

    const mockResponse = { data: { success: true, message: 'OK', data: {} } }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getIndexingIpcList('z=1')

    expect(store.indexing_ipc_pages.currentPage).toBe(0)
    expect(store.indexing_ipc_pages.lastPage).toBe(0)
  })

  it('handles catch error in list', async () => {
    const store = useIndexingIpcStoreV1()

    const mockGet = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getIndexingIpcList('err=1')

    expect(store.indexing_ipc_list).toEqual([])
  })

  it('creates indexing ipc successfully', async () => {
    const store = useIndexingIpcStoreV1()

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Created' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createIndexingIpc('1', '0.5')

    expect(mockPost).toHaveBeenCalledWith(URL_PATH_FICS + '/indexation', {
      fund_id: '1',
      rate: '0.5',
    })
    expect(result).toBe(true)
  })

  it('returns false when create fails (success=false)', async () => {
    const store = useIndexingIpcStoreV1()

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: false, message: 'NOPE' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createIndexingIpc('1', null)
    expect(result).toBe(false)
  })

  it('returns false when create throws error', async () => {
    const store = useIndexingIpcStoreV1()

    const mockPost = jest.fn().mockRejectedValue(new Error('err'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createIndexingIpc('2', '0.1')
    expect(result).toBe(false)
  })

  it('process indexing successfully', async () => {
    const store = useIndexingIpcStoreV1()

    const mockResponse = {
      data: {
        success: true,
        message: 'OK',
        data: {
          data: [{ id: 10 }],
          current_page: 3,
          last_page: 7,
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._processIndexingIpc('55')

    expect(store.indexing_ipc_process_list).toEqual([{ id: 10 }])
    expect(store.indexing_process_ipc_pages).toEqual({
      currentPage: 3,
      lastPage: 7,
    })
  })

  it('handles process indexing error (catch)', async () => {
    const store = useIndexingIpcStoreV1()

    const mockGet = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._processIndexingIpc('33')

    expect(store.indexing_ipc_process_list).toEqual([])
  })

  it('downloads file successfully (origin=create)', async () => {
    const store = useIndexingIpcStoreV1()

    const mockBlobResponse = {
      data: new Blob(['123']),
      headers: { 'content-type': 'file/xlsx' },
    }

    const mockGet = jest.fn().mockResolvedValue(mockBlobResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._downloadIndexingIpc('1', 'C01', 'create')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/indexation/export-process/1`,
      { responseType: 'blob' }
    )
  })

  it('downloads file successfully (origin=other)', async () => {
    const store = useIndexingIpcStoreV1()

    const mockGet = jest.fn().mockResolvedValue({
      data: new Blob(['abc']),
      headers: { 'content-type': 'file/xlsx' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._downloadIndexingIpc('1', 'C01', 'other')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/indexation/export/1`,
      { responseType: 'blob' }
    )
  })

  it('handles error in download', async () => {
    const store = useIndexingIpcStoreV1()

    const mockGet = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._downloadIndexingIpc('1', 'C', 'read')

    expect(store.indexing_ipc_list).toEqual([])
  })

  it('cleans state correctly', () => {
    const store = useIndexingIpcStoreV1()

    store.indexing_ipc_list = [{ id: 99 }] as IIndexingListRequest[]
    store.indexing_ipc_pages = { currentPage: 5, lastPage: 9 }
    store.indexing_fund = {
      fund_id: 'A',
      fund_rate: '2',
      fund_info: {} as IFundInfoRequest,
    }

    store._cleanData()

    expect(store.indexing_ipc_list).toEqual([])
    expect(store.indexing_ipc_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
    expect(store.indexing_fund.fund_id).toBe(null)
    expect(store.indexing_fund.fund_rate).toBe(null)
  })
})
