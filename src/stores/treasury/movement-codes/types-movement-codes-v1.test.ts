import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'
import { useMovementCodesCollection } from './types-movement-codes-v1'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}))
jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({ showCatchError: jest.fn() })),
}))
jest.mock('quasar', () => ({
  Notify: {
    create: jest.fn(),
  },
}))

describe('useMovementCodesCollection', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should initialize with default state', () => {
    const store = useMovementCodesCollection()
    expect(store.movement_codes_list).toEqual([])
    expect(store.movement_codes_pages).toEqual({ currentPage: 0, lastPage: 0 })
    expect(store.data_information_form).toBeNull()
    expect(store.movement_codes_request).toBeNull()
  })

  it('should call _getMovementCodes and update state', async () => {
    const store = useMovementCodesCollection()
    const mockResponse = {
      data: {
        success: true,
        message: 'ok',
        data: {
          data: [{ description: 'desc', operation: 'op', nature: 'nat' }],
          current_page: 2,
          last_page: 5,
        },
      },
    }
    ;(executeApi as jest.Mock).mockReturnValue({
      get: jest.fn(() => Promise.resolve(mockResponse)),
    })
    await store._getMovementCodes('')
    expect(store.movement_codes_list).toEqual([
      { description: 'desc', operation: 'op', nature: 'nat' },
    ])
    expect(store.movement_codes_pages).toEqual({ currentPage: 2, lastPage: 5 })
  })

  it('should call _getAllMovementCodes and update all_movement_codes', async () => {
    const store = useMovementCodesCollection()
    const mockResponse = {
      data: {
        success: true,
        data: [{ description: 'desc', operation: 'op', nature: 'nat' }],
      },
    }
    ;(executeApi as jest.Mock).mockReturnValue({
      get: jest.fn(() => Promise.resolve(mockResponse)),
    })
    await store._getAllMovementCodes()
    expect(store.all_movement_codes).toEqual([
      { description: 'desc', operation: 'op', nature: 'nat' },
    ])
  })

  it('should call _createMovementCodes and return success', async () => {
    const store = useMovementCodesCollection()
    const mockResponse = { data: { success: true, message: 'created' } }
    ;(executeApi as jest.Mock).mockReturnValue({
      post: jest.fn(() => Promise.resolve(mockResponse)),
    })
    const result = await store._createMovementCodes({
      description: 'desc',
      operation: 'op',
      nature: 'nat',
    })
    expect(result).toBe(true)
  })

  it('should call _updateMovementCodes and return success', async () => {
    const store = useMovementCodesCollection()
    const mockResponse = { data: { success: true, message: 'updated' } }
    ;(executeApi as jest.Mock).mockReturnValue({
      put: jest.fn(() => Promise.resolve(mockResponse)),
    })
    const result = await store._updateMovementCodes(
      { description: 'desc', operation: 'op', nature: 'nat' },
      1
    )
    expect(result).toBe(true)
  })

  it('should call _deleteMovementCodes and return success', async () => {
    const store = useMovementCodesCollection()
    const mockResponse = { data: { success: true, message: 'deleted' } }
    ;(executeApi as jest.Mock).mockReturnValue({
      delete: jest.fn(() => Promise.resolve(mockResponse)),
    })
    const result = await store._deleteMovementCodes(1)
    expect(result).toBe(true)
  })

  it('should call _getByIdMovementCodes and update data_information_form', async () => {
    const store = useMovementCodesCollection()
    const mockResponse = {
      data: {
        success: true,
        message: 'ok',
        data: { description: 'desc', operation: 'op', nature: 'nat' },
      },
    }
    ;(executeApi as jest.Mock).mockReturnValue({
      get: jest.fn(() => Promise.resolve(mockResponse)),
    })
    await store._getByIdMovementCodes(1)
    expect(store.data_information_form).toEqual({
      description: 'desc',
      operation: 'op',
      nature: 'nat',
    })
  })

  it('should set data_information_form with _setDataInformationForm', () => {
    const store = useMovementCodesCollection()
    store._setDataInformationForm({
      description: 'desc',
      operation: 'op',
      nature: 'nat',
      code: 'cod',
    })
    expect(store.data_information_form).toEqual({
      description: 'desc',
      operation: 'op',
      nature: 'nat',
      code: 'cod',
    })
    store._setDataInformationForm(null)
    expect(store.data_information_form).toBeNull()
  })

  it('should handle error in _getMovementCodes gracefully', async () => {
    const store = useMovementCodesCollection()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    await store._getMovementCodes('')
    expect(store.movement_codes_list).toEqual([])
  })

  it('should handle error in _getAllMovementCodes gracefully', async () => {
    const store = useMovementCodesCollection()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    await store._getAllMovementCodes()
    expect(store.all_movement_codes).toEqual([])
  })

  it('should handle error in _createMovementCodes gracefully', async () => {
    const store = useMovementCodesCollection()
    const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })
    const result = await store._createMovementCodes({
      description: 'desc',
      operation: 'op',
      nature: 'nat',
      code: 'cod',
    })
    expect(result).toBe(false)
  })

  it('should handle error in _updateMovementCodes gracefully', async () => {
    const store = useMovementCodesCollection()
    const mockPut = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })
    const result = await store._updateMovementCodes(
      { description: 'desc', operation: 'op', nature: 'nat' },
      1
    )
    expect(result).toBe(false)
  })

  it('should handle error in _deleteMovementCodes gracefully', async () => {
    const store = useMovementCodesCollection()
    const mockDelete = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })
    const result = await store._deleteMovementCodes(1)
    expect(result).toBe(false)
  })

  it('should handle error in _getByIdMovementCodes gracefully', async () => {
    const store = useMovementCodesCollection()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    await store._getByIdMovementCodes(1)
    expect(store.data_information_form).toBeNull()
  })
})
