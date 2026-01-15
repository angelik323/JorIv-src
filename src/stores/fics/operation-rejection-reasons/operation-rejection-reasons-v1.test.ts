// Vue - Vue Router - Pinia - Quasar
import { setActivePinia, createPinia } from 'pinia'

// Interfaces
import {
  IRejectionReasonChangeStatus,
  IRejectionReasonItemList,
  IRejectionReasonResponse,
  IRejectionReasonToEdit,
} from '@/interfaces/customs/fics/OperationRejectionReasons'

// Utils
import { URL_PATH_FICS } from '@/constants/apis'
import { executeApi } from '@/apis'

// Stores
import { useOperationRejectionReasonsStoreV1 } from './operation-rejection-reasons-v1'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({
    showCatchError: jest.fn(() => 'catch error'),
  })),
}))

describe('useOperationRejectionReasonsStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches rejection reasons list successfully', async () => {
    const store = useOperationRejectionReasonsStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'List ok',
        data: {
          data: [{ id: 1, reason: 'Test Reason' }],
          current_page: 3,
          last_page: 9,
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getRejectionReasonsList({ type: 1 })

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/rejection-reasons/get-reasons`,
      {
        params: { type: 1, paginate: 1 },
      }
    )
    expect(store.rejection_reasons_list).toEqual([
      { id: 1, reason: 'Test Reason' },
    ])
    expect(store.rejection_reasons_pages).toEqual({
      currentPage: 3,
      lastPage: 9,
    })
  })

  it('handles error when fetching rejection reasons list', async () => {
    const store = useOperationRejectionReasonsStoreV1()

    const mockGet = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getRejectionReasonsList({ type: 1 })

    expect(mockGet).toHaveBeenCalled()
    expect(store.rejection_reasons_list).toEqual([])
    expect(store.rejection_reasons_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })

  it('fetches rejection reason by id successfully', async () => {
    const store = useOperationRejectionReasonsStoreV1()

    const mockResponse = {
      data: {
        success: true,
        message: 'found',
        data: { id: 99, reason: 'Important Reason' },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdRejectionReason(99)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/rejection-reasons/get-reasons-by-id/99`
    )
    expect(store.rejection_reasons_response).toEqual({
      id: 99,
      reason: 'Important Reason',
    })
  })

  it('handles error when fetching rejection reason by id', async () => {
    const store = useOperationRejectionReasonsStoreV1()

    const mockGet = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdRejectionReason(50)

    expect(store.rejection_reasons_response).toBe(null)
  })

  it('creates rejection reason successfully', async () => {
    const store = useOperationRejectionReasonsStoreV1()

    const mockResponse = { data: { success: true, message: 'Created' } }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = { reason: 'New Reason', status: 1 }

    const result = await store._createRejectionReason(payload)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/rejection-reasons/create-reason`,
      payload
    )
    expect(result).toBe(true)
  })

  it('handles error when creating rejection reason', async () => {
    const store = useOperationRejectionReasonsStoreV1()

    const mockPost = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createRejectionReason({})

    expect(result).toBe(false)
  })

  it('updates rejection reason successfully', async () => {
    const store = useOperationRejectionReasonsStoreV1()

    const mockResponse = { data: { success: true, message: 'Updated' } }
    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const payload = { reason: 'Updated text' }

    const result = await store._updateRejectionReason(
      payload as Partial<IRejectionReasonToEdit>,
      10
    )

    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/rejection-reasons/10`,
      payload
    )
    expect(result).toBe(true)
  })

  it('handles error when updating rejection reason', async () => {
    const store = useOperationRejectionReasonsStoreV1()

    const mockPut = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateRejectionReason({}, 10)

    expect(result).toBe(false)
  })

  it('changes rejection reason status successfully', async () => {
    const store = useOperationRejectionReasonsStoreV1()

    const mockResponse = { data: { success: true, message: 'Toggled' } }
    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const payload = { status_id: 0 }

    const result = await store._changeStatus(
      payload as IRejectionReasonChangeStatus,
      7
    )

    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/rejection-reasons/toggle-status/7`,
      payload
    )
    expect(result).toBe(true)
  })

  it('handles error when changing status', async () => {
    const store = useOperationRejectionReasonsStoreV1()

    const mockPut = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._changeStatus(
      { status_id: 1 } as IRejectionReasonChangeStatus,
      7
    )

    expect(result).toBe(false)
  })

  it('clears data correctly', () => {
    const store = useOperationRejectionReasonsStoreV1()

    store.rejection_reasons_list = [{ id: 1 }] as IRejectionReasonItemList[]
    store.rejection_reasons_response = {
      id: 99,
    } as IRejectionReasonResponse | null
    store.rejection_reasons_pages = { currentPage: 5, lastPage: 10 }

    store._clearData()

    expect(store.rejection_reasons_list).toEqual([])
    expect(store.rejection_reasons_response).toBe(null)
    expect(store.rejection_reasons_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })
})
