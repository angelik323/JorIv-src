// Vue - Vue Router - Pinia - Quasar
import { setActivePinia, createPinia } from 'pinia'

// Interfaces
import {
  IFreezeResourcesCreate,
  IFreezeResources,
} from '@/interfaces/customs/fics/FreezeResources'

// Utils
import { URL_PATH_FICS } from '@/constants/apis'
import { executeApi } from '@/apis'

// Stores
import { useFreezeResourcesStoreV1 } from './freeze-resources-store-v1'

const mockShowAlert = jest.fn()
const mockShowCatchError = jest.fn(() => 'catch error')

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useShowError: () => ({
    showCatchError: mockShowCatchError,
  }),
  useAlert: () => ({
    showAlert: mockShowAlert,
  }),
}))

describe('useFreezeResourcesStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches list of freeze resources successfully (success=true)', async () => {
    const store = useFreezeResourcesStoreV1()

    const mockResponse = {
      data: {
        success: true,
        message: 'Fetched successfully',
        data: {
          data: [{ id: 1, name: 'Freeze Test' }],
          current_page: 2,
          last_page: 5,
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListFreeze({ status: 1 })

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH_FICS}/freeze`, {
      params: { status: 1, paginate: 1 },
    })
    expect(store.freeze_resources_list).toEqual([
      { id: 1, name: 'Freeze Test' },
    ])
    expect(store.freeze_resources_pages).toEqual({
      currentPage: 2,
      lastPage: 5,
    })
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Fetched successfully',
      'success',
      undefined,
      expect.any(Number)
    )
  })

  it('fetches list but success=false', async () => {
    const store = useFreezeResourcesStoreV1()

    const mockResponse = {
      data: {
        success: false,
        message: 'Failed',
        data: { data: [], current_page: 0, last_page: 0 },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListFreeze({ page: 2 })

    expect(mockShowAlert).toHaveBeenCalledWith(
      'Failed',
      'error',
      undefined,
      expect.any(Number)
    )
  })

  it('handles error when fetching freeze list', async () => {
    const store = useFreezeResourcesStoreV1()

    const mockGet = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListFreeze({ status: 1 })

    expect(mockShowCatchError).toHaveBeenCalled()
    expect(mockShowAlert).toHaveBeenCalledWith(
      'catch error',
      'error',
      undefined,
      expect.any(Number)
    )
  })

  it('creates a freeze successfully (success=true)', async () => {
    const store = useFreezeResourcesStoreV1()
    const payload = { name: 'Freeze A', amount: 5000 }

    const mockPost = jest
      .fn()
      .mockResolvedValue({ data: { success: true, message: 'Created' } })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createFreeze(payload as IFreezeResourcesCreate)

    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH_FICS}/freeze`, payload)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Created',
      'success',
      undefined,
      expect.any(Number)
    )
    expect(result).toBe(true)
  })

  it('handles response with success=false when creating freeze', async () => {
    const store = useFreezeResourcesStoreV1()
    const payload = { name: 'Freeze B' }

    const mockPost = jest
      .fn()
      .mockResolvedValue({ data: { success: false, message: 'Not created' } })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createFreeze(payload as IFreezeResourcesCreate)

    expect(mockShowAlert).toHaveBeenCalledWith(
      'Not created',
      'error',
      undefined,
      expect.any(Number)
    )
    expect(result).toBe(false)
  })

  it('handles error when creating freeze', async () => {
    const store = useFreezeResourcesStoreV1()
    const payload = { name: 'Freeze Error' }

    const mockPost = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createFreeze(payload as IFreezeResourcesCreate)

    expect(mockShowCatchError).toHaveBeenCalled()
    expect(mockShowAlert).toHaveBeenCalledWith(
      'catch error',
      'error',
      undefined,
      expect.any(Number)
    )
    expect(result).toBe(false)
  })

  it('fetches freeze details by id successfully (success=true)', async () => {
    const store = useFreezeResourcesStoreV1()

    const mockResponse = {
      data: {
        success: true,
        message: 'Record found',
        data: { id: 10, name: 'Freeze X' },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getFreezeId(10)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH_FICS}/freeze/10`)
    expect(store.freeze_details_id).toEqual({ id: 10, name: 'Freeze X' })
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Record found',
      'success',
      undefined,
      expect.any(Number)
    )
  })

  it('fetches freeze details but success=false', async () => {
    const store = useFreezeResourcesStoreV1()

    const mockResponse = {
      data: {
        success: false,
        message: 'Not found',
        data: null,
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getFreezeId(99)

    expect(mockShowAlert).toHaveBeenCalledWith(
      'Not found',
      'error',
      undefined,
      expect.any(Number)
    )
  })

  it('handles error when fetching freeze details by id', async () => {
    const store = useFreezeResourcesStoreV1()

    const mockGet = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getFreezeId(5)

    expect(mockShowCatchError).toHaveBeenCalled()
    expect(mockShowAlert).toHaveBeenCalledWith(
      'catch error',
      'error',
      undefined,
      expect.any(Number)
    )
  })

  it('clears data properly', () => {
    const store = useFreezeResourcesStoreV1()
    store.freeze_resources_list = [{ id: 1 }] as IFreezeResources[]
    store.freeze_resources_pages = { currentPage: 4, lastPage: 9 }

    store._clearData()

    expect(store.freeze_resources_list).toEqual([])
    expect(store.freeze_resources_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
  })

  it('sets data_information_form correctly', () => {
    const store = useFreezeResourcesStoreV1()
    const data = { name: 'Freeze X', amount: 1000 } as IFreezeResourcesCreate

    store._setDataInformationForm(data)

    expect(store.data_information_form).toEqual(data)
  })

  it('fetches freeze details with success=true but data=null', async () => {
    const store = useFreezeResourcesStoreV1()

    const mockResponse = {
      data: {
        success: true,
        message: 'Ok but null',
        data: null,
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getFreezeId(15)

    expect(store.freeze_details_id).toEqual({})
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Ok but null',
      'success',
      undefined,
      expect.any(Number)
    )
  })

  it('handles list fetch when items is undefined (default empty array)', async () => {
    const store = useFreezeResourcesStoreV1()

    const mockResponse = {
      data: {
        success: true,
        message: 'No items but success',
        data: {
          current_page: 1,
          last_page: 3,
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListFreeze({ status: 1 })

    expect(store.freeze_resources_list).toEqual([])
    expect(store.freeze_resources_pages).toEqual({
      currentPage: 1,
      lastPage: 3,
    })
    expect(mockShowAlert).toHaveBeenCalledWith(
      'No items but success',
      'success',
      undefined,
      expect.any(Number)
    )
  })
  it('sets empty object when success=true but data is undefined', async () => {
    const store = useFreezeResourcesStoreV1()

    const mockResponse = {
      data: {
        success: true,
        message: 'Undefined data',
        data: undefined,
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getFreezeId(22)

    expect(store.freeze_details_id).toEqual({})
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Undefined data',
      'success',
      undefined,
      expect.any(Number)
    )
  })
  it('returns true even if message is empty when success=true', async () => {
    const store = useFreezeResourcesStoreV1()

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: '' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createFreeze({
      orderer_identification: 'X',
    } as IFreezeResourcesCreate)

    expect(result).toBe(true)
    expect(mockShowAlert).toHaveBeenCalled()
  })
  it('handles list fetch when items is an object instead of array (fails gracefully)', async () => {
    const store = useFreezeResourcesStoreV1()

    const mockResponse = {
      data: {
        success: true,
        message: 'Invalid items',
        data: {
          data: {},
          current_page: 1,
          last_page: 2,
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListFreeze({})

    expect(mockShowCatchError).toHaveBeenCalled()
    expect(mockShowAlert).toHaveBeenCalledWith(
      'catch error',
      'error',
      undefined,
      expect.any(Number)
    )
  })
})
