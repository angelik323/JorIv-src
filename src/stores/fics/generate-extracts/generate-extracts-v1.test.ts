// Apis - Pinia
import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces - Constants
import { URL_PATH_FICS } from '@/constants/apis'
import {
  IFicsExtractGeneration,
  IFicsExtractGenerationRequest,
} from '@/interfaces/customs/fics/GenerateExtractst'

// Stores
import { useGenerateExtractsStoreV1 } from './generate-extracts-v1'

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
    downloadBlobXlxx: jest.fn(),
  })),
}))

describe('useGenerateExtractsStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches list and updates state on success', async () => {
    const store = useGenerateExtractsStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'List fetched',
        data: {
          data: [{ id: 1, business_code: '123' }],
          current_page: 1,
          last_page: 2,
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listAction({ type: 'test' })

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/extract-generations`,
      {
        params: { type: 'test', paginate: 1 },
      }
    )
    expect(store.generate_extracts_list).toEqual(mockResponse.data.data.data)
    expect(store.generate_extracts_pages).toEqual({
      currentPage: 1,
      lastPage: 2,
    })
  })

  it('handles error in list fetch', async () => {
    const store = useGenerateExtractsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listAction({ type: 'fail' })

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/extract-generations`,
      {
        params: { type: 'fail', paginate: 1 },
      }
    )
    expect(store.generate_extracts_list).toEqual([])
    expect(store.generate_extracts_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
  })

  it('creates a record successfully', async () => {
    const store = useGenerateExtractsStoreV1()
    const payload = {
      business_code: '12223456',
      extract_type: 'pdf',
      fund_code: '19',
      period_from: '2025-05',
      period_to: '2025-09',
      registration_date: '2025-10-06',
      status: 'Pendiente',
      generation_type: 'manual',
    }

    const mockPost = jest
      .fn()
      .mockResolvedValue({ data: { success: true, message: 'Created' } })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction(
      payload as IFicsExtractGenerationRequest
    )

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/extract-generations`,
      payload
    )
    expect(result).toBe(true)
  })

  it('handles error in create', async () => {
    const store = useGenerateExtractsStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction(
      {} as IFicsExtractGenerationRequest
    )
    expect(result).toBe(false)
  })

  it('resends extract successfully', async () => {
    const store = useGenerateExtractsStoreV1()
    const mockPost = jest
      .fn()
      .mockResolvedValue({ data: { success: true, message: 'Resent' } })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._resendAction(1)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/extract-generations/resend/1`
    )
    expect(result).toBe(true)
  })

  it('handles error in resend', async () => {
    const store = useGenerateExtractsStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._resendAction(1)
    expect(result).toBe(false)
  })

  it('downloads ZIP successfully', async () => {
    const store = useGenerateExtractsStoreV1()
    const mockBlob = new Blob(['data'], { type: 'application/zip' })
    const mockGet = jest.fn().mockResolvedValue({
      data: mockBlob,
      headers: {
        'content-type': 'application/zip',
        'content-disposition': 'attachment; filename="test.zip"',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._downloadZipAction(10)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/extract-generations/download/10`,
      {
        responseType: 'blob',
      }
    )
  })

  it('handles error in ZIP download', async () => {
    const store = useGenerateExtractsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._downloadZipAction(99)
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/extract-generations/download/99`,
      {
        responseType: 'blob',
      }
    )
  })

  it('clears data', () => {
    const store = useGenerateExtractsStoreV1()
    store.generate_extracts_list = [{ id: 1 }] as IFicsExtractGeneration[]
    store.generate_extracts_pages = { currentPage: 3, lastPage: 5 }

    store._clearData()

    expect(store.generate_extracts_list).toEqual([])
    expect(store.generate_extracts_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
  })
})
