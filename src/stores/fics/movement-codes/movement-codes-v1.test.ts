// Vue - Vue Router - Pinia - Quasar
import { setActivePinia, createPinia } from 'pinia'

// Interfaces
import {
  IMovementCodesInformationForm,
  IMovementCodesItemList,
  IMovementCodesResponse,
} from '@/interfaces/customs/fics/MovementCodes'

// Utils
import { URL_PATH_FICS } from '@/constants/apis'
import { executeApi } from '@/apis'

// Stores
import { useMovementCodesStoreV1 } from './movement-codes-v1'

// Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
  })),
}))

const mockGetNameBlob = jest.fn(() => 'test.xlsx')
const mockDownloadBlobXlxx = jest.fn()

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({
    showAlert: jest.fn(),
  })),
  useShowError: jest.fn(() => ({
    showCatchError: jest.fn(() => 'catch error'),
  })),
  useUtils: jest.fn(() => ({
    getNameBlob: mockGetNameBlob,
    downloadBlobXlxx: mockDownloadBlobXlxx,
  })),
}))

describe('useMovementCodesStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches list successfully and updates state', async () => {
    const store = useMovementCodesStoreV1()

    const mockResponse = {
      data: {
        data: {
          data: [{ id: 1, code: 'AA' }],
          current_page: 2,
          last_page: 5,
        },
        message: 'List ok',
        success: true,
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getMovementCodesList({ type: 10 })

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH_FICS}/movement-codes`, {
      params: { type: 10, paginate: 1 },
    })

    expect(store.movement_codes_list).toEqual([{ id: 1, code: 'AA' }])
    expect(store.movement_codes_pages).toEqual({
      currentPage: 2,
      lastPage: 5,
    })
  })

  it('handles error in list fetch', async () => {
    const store = useMovementCodesStoreV1()

    const mockGet = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getMovementCodesList({ type: 10 })

    expect(store.movement_codes_list).toEqual([])
    expect(store.movement_codes_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })

  it('fetches single record successfully', async () => {
    const store = useMovementCodesStoreV1()

    const mockResponse = {
      data: {
        success: true,
        message: 'Fetched',
        data: { id: 8, code: 'MM' },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdMovementCodes(8)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH_FICS}/movement-codes/8`)
    expect(store.movement_codes_response).toEqual({ id: 8, code: 'MM' })
  })

  it('handles error in getById', async () => {
    const store = useMovementCodesStoreV1()

    const mockGet = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdMovementCodes(9)

    expect(store.movement_codes_response).toBe(null)
  })

  it('handles success=false in getById', async () => {
    const store = useMovementCodesStoreV1()

    const mockResponse = {
      data: {
        success: false,
        message: 'Not found',
        data: null,
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdMovementCodes(5)

    expect(store.movement_codes_response).toBe(null)
  })

  it('creates a record successfully', async () => {
    const store = useMovementCodesStoreV1()

    const payload = {
      code: 'A1',
      description: 'Test',
    } as IMovementCodesInformationForm

    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Created',
      },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createMovementCodes(
      payload as IMovementCodesInformationForm
    )

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/movement-codes`,
      payload
    )
    expect(result).toBe(true)
  })

  it('handles error in create', async () => {
    const store = useMovementCodesStoreV1()

    const payload = { code: 'A1', description: 'Test' }

    const mockPost = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createMovementCodes(
      payload as IMovementCodesInformationForm
    )

    expect(result).toBe(false)
  })

  it('returns false when API responds success=false', async () => {
    const store = useMovementCodesStoreV1()

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Fail create' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createMovementCodes(
      {} as IMovementCodesInformationForm
    )

    expect(result).toBe(false)
  })

  it('exports excel successfully', async () => {
    const store = useMovementCodesStoreV1()

    const mockResponse = {
      data: new Blob(['excel']),
      headers: { 'content-type': 'application/vnd.ms-excel' },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._exportExcelAction('type=3')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/movement-codes/export/excel?type=3`,
      { responseType: 'blob' }
    )
  })

  it('handles error in export excel', async () => {
    const store = useMovementCodesStoreV1()

    const mockGet = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._exportExcelAction('a=1')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/movement-codes/export/excel?a=1`,
      { responseType: 'blob' }
    )
  })

  it('calls utils to download excel', async () => {
    const store = useMovementCodesStoreV1()

    const mockResponse = {
      data: new Blob(['excel']),
      headers: { 'content-type': 'application/vnd.ms-excel' },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._exportExcelAction('x=0')

    expect(mockGetNameBlob).toHaveBeenCalled()
    expect(mockDownloadBlobXlxx).toHaveBeenCalled()
  })

  it('sets data information form', () => {
    const store = useMovementCodesStoreV1()

    const data = {
      code: '22',
      description: 'ss',
    } as IMovementCodesInformationForm | null

    store._setDataInformationForm(data)

    expect(store.data_information_form).toEqual({
      code: '22',
      description: 'ss',
    })
  })

  it('clears data information form when sending null', () => {
    const store = useMovementCodesStoreV1()

    store._setDataInformationForm(null)

    expect(store.data_information_form).toBe(null)
  })

  it('clears all store data', () => {
    const store = useMovementCodesStoreV1()

    store.movement_codes_list = [{ id: 99 }] as IMovementCodesItemList[]
    store.movement_codes_response = {
      code: 'ss',
    } as IMovementCodesResponse | null
    store.data_information_form = {
      code: 'ss',
    } as IMovementCodesInformationForm | null
    store.movement_codes_pages = { currentPage: 5, lastPage: 9 }

    store._clearData()

    expect(store.movement_codes_list).toEqual([])
    expect(store.movement_codes_response).toBe(null)
    expect(store.data_information_form).toBe(null)
    expect(store.movement_codes_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })

  it('handles success=false in list fetch', async () => {
    const store = useMovementCodesStoreV1()

    const mockResponse = {
      data: {
        data: { data: [], current_page: 0, last_page: 0 },
        message: 'Error list',
        success: false,
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getMovementCodesList({ type: 1 })

    expect(store.movement_codes_list).toEqual([])
    expect(store.movement_codes_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })

  it('sets null when success=true but data=null', async () => {
    const store = useMovementCodesStoreV1()

    const mockResponse = {
      data: {
        success: true,
        message: 'Empty',
        data: null,
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdMovementCodes(20)

    expect(store.movement_codes_response).toBe(null)
  })
  it('updates a record successfully', async () => {
    const store = useMovementCodesStoreV1()

    const payload = { code: '222' } as IMovementCodesInformationForm
    const id = 123

    const mockPatch = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Updated ok' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

    const result = await store._updateMovementCodes(id, payload)

    expect(mockPatch).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/movement-codes/${id}`,
      payload
    )

    expect(result).toBe(true)

    const { showAlert } =
      require('@/composables').useAlert.mock.results[0].value

    expect(showAlert).toHaveBeenCalledWith(
      'Updated ok',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('returns false when API responds success=false on update', async () => {
    const store = useMovementCodesStoreV1()

    const mockPatch = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Bad update' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

    const result = await store._updateMovementCodes(
      7,
      {} as IMovementCodesInformationForm
    )

    expect(result).toBe(false)

    const { showAlert } =
      require('@/composables').useAlert.mock.results[0].value

    expect(showAlert).toHaveBeenCalledWith(
      'Bad update',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('handles error in update and returns false', async () => {
    const store = useMovementCodesStoreV1()

    const mockPatch = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

    const result = await store._updateMovementCodes(
      7,
      {} as IMovementCodesInformationForm
    )

    expect(result).toBe(false)

    const { showCatchError } =
      require('@/composables').useShowError.mock.results[0].value

    const { showAlert } =
      require('@/composables').useAlert.mock.results[0].value

    expect(showCatchError).toHaveBeenCalled()
    expect(showAlert).toHaveBeenCalledWith(
      'catch error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })
})
