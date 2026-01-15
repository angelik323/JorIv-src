// Vue - Vue Router - Pinia - Quasar
import { setActivePinia, createPinia } from 'pinia'

// Utils
import { URL_PATH_FICS } from '@/constants/apis'
import { executeApi } from '@/apis'

// Stores
import { useFundsTypesStoreV1 } from './funds-types-v1'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({
    showCatchError: jest.fn(() => 'catch error'),
  })),
}))

describe('useFundsTypesStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches fund types list successfully', async () => {
    const store = useFundsTypesStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Fetched',
        current_page: 2,
        last_page: 5,
        data: [{ id: 1, code: 'FT-A' }],
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getFundsTypesList()

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/fund-types-opearation-types/fund-types`
    )
    expect(store.funds_types_list).toEqual(mockResponse.data.data)
    expect(store.funds_types_pages).toEqual({
      currentPage: 2,
      lastPage: 5,
    })
  })

  it('handles error when fetching fund types list', async () => {
    const store = useFundsTypesStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getFundsTypesList()

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/fund-types-opearation-types/fund-types`
    )

    expect(store.funds_types_list).toEqual([])
    expect(store.funds_types_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
  })

  it('fetches fund types operation list successfully', async () => {
    const store = useFundsTypesStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Fetched ops',
        current_page: 3,
        last_page: 10,
        data: [{ id: 8, code: 'OP-1' }],
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getFundsTypesOperationList()

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/fund-types-opearation-types/operation-types`
    )
    expect(store.funds_types_operation_list).toEqual(mockResponse.data.data)
    expect(store.funds_types_pages).toEqual({
      currentPage: 3,
      lastPage: 10,
    })
  })

  it('handles error when fetching fund types operation list', async () => {
    const store = useFundsTypesStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('ops error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getFundsTypesOperationList()

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/fund-types-opearation-types/operation-types`
    )

    expect(store.funds_types_operation_list).toEqual([])
    expect(store.funds_types_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
  })
})
