import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'
import { useMarketabilityTypesCollectionStoreV1 } from './marketability-types-v1'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
  })),
}))
jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({ showCatchError: jest.fn() })),
}))

describe('useMarketabilityTypesCollectionStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should initialize with default state', () => {
    const store = useMarketabilityTypesCollectionStoreV1()
    expect(store.marketability_types_list).toEqual([])
    expect(store.marketability_types_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
    expect(store.data_information_form).toBeNull()
  })

  it('should call _getMarketabilityTypesList and update state', async () => {
    const store = useMarketabilityTypesCollectionStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'ok',
        data: [{ description: 'desc', code: 'cod' }],
      },
    }
    ;(executeApi as jest.Mock).mockReturnValue({
      get: jest.fn(() => Promise.resolve(mockResponse)),
    })
    await store._getMarketabilityTypesList('')
    expect(store.marketability_types_list).toEqual([
      { description: 'desc', code: 'cod' },
    ])
  })

  it('should call _getMarketabilityTypeById and update data_information_form', async () => {
    const store = useMarketabilityTypesCollectionStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'ok',
        data: { description: 'desc', code: 'cod', type: 'type' },
      },
    }
    ;(executeApi as jest.Mock).mockReturnValue({
      get: jest.fn(() => Promise.resolve(mockResponse)),
    })
    await store._getMarketabilityTypeById(1)
    expect(store.data_information_form).toEqual({
      description: 'desc',
      code: 'cod',
      type: 'type',
    })
  })
  it('should call _getMarketabilityTypeById and update data_information_form when success is false', async () => {
    const store = useMarketabilityTypesCollectionStoreV1()
    const mockResponse = {
      data: {
        success: false,
        message: 'ok',
        data: { description: 'desc', code: 'cod', type: 'type' },
      },
    }
    ;(executeApi as jest.Mock).mockReturnValue({
      get: jest.fn(() => Promise.resolve(mockResponse)),
    })
    await store._getMarketabilityTypeById(1)
    expect(store.data_information_form).toBeNull()
  })

  it('should call _createMarketabilityType and return success', async () => {
    const store = useMarketabilityTypesCollectionStoreV1()
    const mockResponse = { data: { success: true, message: 'created' } }
    ;(executeApi as jest.Mock).mockReturnValue({
      post: jest.fn(() => Promise.resolve(mockResponse)),
    })
    const result = await store._createMarketabilityType({
      description: 'desc',
      code: 'cod',
      type: 'type',
    })
    expect(result).toBe(true)
  })

  it('should call _updateMarketabilityType and return success', async () => {
    const store = useMarketabilityTypesCollectionStoreV1()
    const mockResponse = { data: { success: true, message: 'updated' } }
    ;(executeApi as jest.Mock).mockReturnValue({
      put: jest.fn(() => Promise.resolve(mockResponse)),
    })
    const result = await store._updateMarketabilityType(
      { description: 'desc', code: 'cod', type: 'type' },
      1
    )
    expect(result).toBe(true)
  })

  it('should set data_information_form with _setDataInformationForm', () => {
    const store = useMarketabilityTypesCollectionStoreV1()
    store._setDataInformationForm({
      description: 'desc',
      code: 'cod',
      type: 'type',
    })
    expect(store.data_information_form).toEqual({
      description: 'desc',
      code: 'cod',
      type: 'type',
    })
    store._setDataInformationForm(null)
    expect(store.data_information_form).toBeNull()
  })

  it('should handle error in _getMarketabilityTypesList gracefully', async () => {
    const store = useMarketabilityTypesCollectionStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    await store._getMarketabilityTypesList('')
    expect(store.marketability_types_list).toEqual([])
  })

  it('should handle error in _getMarketabilityTypeById gracefully', async () => {
    const store = useMarketabilityTypesCollectionStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    await store._getMarketabilityTypeById(1)
    expect(store.data_information_form).toBeNull()
  })

  it('should handle error in _createMarketabilityType gracefully', async () => {
    const store = useMarketabilityTypesCollectionStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })
    const result = await store._createMarketabilityType({
      description: 'desc',
      code: 'cod',
      type: 'type',
    })
    expect(result).toBe(false)
  })

  it('should handle error in _updateMarketabilityType gracefully', async () => {
    const store = useMarketabilityTypesCollectionStoreV1()
    const mockPut = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })
    const result = await store._updateMarketabilityType(
      { description: 'desc', code: 'cod', type: 'type' },
      1
    )
    expect(result).toBe(false)
  })
})
