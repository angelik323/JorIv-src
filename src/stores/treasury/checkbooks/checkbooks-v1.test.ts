import { setActivePinia, createPinia } from 'pinia'
import { useCheckbooksStore } from '@/stores/treasury/checkbooks'
import { executeApi } from '@/apis'

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

describe('useCheckbooksStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches list of checkbooks with filters and pagination', async () => {
    const store = useCheckbooksStore('v1')
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Success',
        data: {
          data: [
            {
              id: 1,
              code: 101,
              business_trust_id: 1,
              bank_id: 1,
              bank_account_id: 1,
              range_from: '001',
              range_to: '100',
              assignment_date: '2024-01-01',
              next_consecutive: 1,
              status_id: 1,
              status: 'Activo',
            },
          ],
          current_page: 1,
          last_page: 3,
        },
      },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const filters = {
      page: 1,
      'filter[business_trust_id]': '1',
      'filter[bank_id]': '2',
      'filter[search]': 'chequera',
      'filter[bank_account_id]': '3',
      'filter[code]': '101',
      'filter[status_id]': '1',
    }

    // Act
    await store._getCheckbooks(filters)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      'treasuries/api/treasuries/checkbooks',
      {
        params: {
          ...filters,
          paginate: 1,
        },
      }
    )

    expect(store.data_list).toHaveLength(1)
    expect(store.data_list[0]?.status_id).toBe(1)
  })

  it('handles error when fetching checkbooks fails', async () => {
    const store = useCheckbooksStore('v1')
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getCheckbooks({ page: 1 })

    expect(mockGet).toHaveBeenCalled()
    expect(store.data_list).toHaveLength(0)
  })

  it('fetches checkbook by ID', async () => {
    const store = useCheckbooksStore('v1')
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Fetched',
        data: {
          id: 1,
          code: 101,
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdCheckbook(1)

    expect(mockGet).toHaveBeenCalledWith(
      'treasuries/api/treasuries/checkbooks/1'
    )
    expect(store.data_response?.id).toBe(1)
  })

  it('handles error when fetching checkbook by ID fails', async () => {
    const store = useCheckbooksStore('v1')
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdCheckbook(1)

    expect(mockGet).toHaveBeenCalledWith(
      'treasuries/api/treasuries/checkbooks/1'
    )
    expect(store.data_response).toBeNull()
  })

  it('creates a checkbook', async () => {
    const store = useCheckbooksStore('v1')
    const payload = { code: 101 }

    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Created',
        data: { id: 1, code: 101 },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const success = await store._createCheckbook(payload)

    expect(mockPost).toHaveBeenCalledWith(
      'treasuries/api/treasuries/checkbooks',
      payload
    )
    expect(success).toBe(true)
  })

  it('handles error when creating checkbook fails', async () => {
    const store = useCheckbooksStore('v1')
    const payload = { code: 101 }

    const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const success = await store._createCheckbook(payload)

    expect(mockPost).toHaveBeenCalledWith(
      'treasuries/api/treasuries/checkbooks',
      payload
    )
    expect(success).toBe(false)
  })

  it('updates a checkbook', async () => {
    const store = useCheckbooksStore('v1')
    const payload = { code: 101 }

    const mockPut = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Updated',
        data: { id: 1, code: 101 },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const success = await store._updateCheckbook(payload, 1)

    expect(mockPut).toHaveBeenCalledWith(
      'treasuries/api/treasuries/checkbooks/1',
      payload
    )
    expect(success).toBe(true)
  })

  it('handles error when updating checkbook fails', async () => {
    const store = useCheckbooksStore('v1')
    const payload = { code: 101 }

    const mockPut = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const success = await store._updateCheckbook(payload, 1)

    expect(mockPut).toHaveBeenCalledWith(
      'treasuries/api/treasuries/checkbooks/1',
      payload
    )
    expect(success).toBe(false)
  })

  it('handles error when deleting checkbook fails', async () => {
    const store = useCheckbooksStore('v1')
    const mockDelete = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    await store._deleteCheckbook(1)

    expect(mockDelete).toHaveBeenCalledWith(
      'treasuries/api/treasuries/checkbooks/1'
    )
  })
})
