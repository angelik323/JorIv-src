// Vue - Vue Router - Pinia - Quasar
import { setActivePinia, createPinia } from 'pinia'

// Interfaces
import {
  IWithdrawalContributionLimitRequest,
  IWithdrawalContributionLimit,
} from '@/interfaces/customs/fics/WithdrawalContributionLimits'

// Utils
import { URL_PATH_FICS } from '@/constants/apis'
import { executeApi } from '@/apis'

// Stores
import { useWithdrawalContributionLimitsStoreV1 } from './withdrawal-contribution-limits-v1'

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
  useShowError: jest.fn(() => ({
    showCatchError: jest.fn(() => 'catch error'),
  })),
}))

const URL_PATH = `${URL_PATH_FICS}/withdrawal-contribution-limits`

describe('useWithdrawalContributionLimitsStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches list successfully', async () => {
    const store = useWithdrawalContributionLimitsStoreV1()

    const mockResponse = {
      data: {
        success: true,
        message: 'Fetched data',
        data: {
          data: [{ id: 10, label: 'A' }],
          current_page: 3,
          last_page: 9,
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listAction({ type: 2 })

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/get-index`, {
      params: { type: 2, paginate: 1 },
    })

    expect(store.withdrawal_list).toEqual([{ id: 10, label: 'A' }])
    expect(store.withdrawal_pages).toEqual({
      currentPage: 3,
      lastPage: 9,
    })
  })

  it('handles error in list action', async () => {
    const store = useWithdrawalContributionLimitsStoreV1()

    const mockGet = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listAction({ type: 1 })

    expect(store.withdrawal_list).toEqual([])
    expect(store.withdrawal_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
  })

  it('fetches single record successfully', async () => {
    const store = useWithdrawalContributionLimitsStoreV1()

    const mockResponse = {
      data: {
        success: true,
        message: 'Found',
        data: { id: 50, name: 'Record' },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._showAction(50)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/show-record/50`)
    expect(result).toEqual({ id: 50, name: 'Record' })
  })

  it('returns null on show action error', async () => {
    const store = useWithdrawalContributionLimitsStoreV1()

    const mockGet = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._showAction(1)

    expect(result).toBe(null)
  })

  it('returns alert result when show has success=false', async () => {
    const store = useWithdrawalContributionLimitsStoreV1()

    const mockResponse = {
      data: {
        success: false,
        message: 'Not found',
        data: null,
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._showAction(99)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/show-record/99`)
    expect(result).toBeUndefined()
  })

  it('creates record successfully', async () => {
    const store = useWithdrawalContributionLimitsStoreV1()

    const payload = { id: 20, type: 1 }

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Created' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction(
      payload as IWithdrawalContributionLimitRequest
    )

    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}/create-record`, payload)

    expect(result).toBe(true)
  })

  it('handles error in create action', async () => {
    const store = useWithdrawalContributionLimitsStoreV1()

    const payload = { id: 999 }

    const mockPost = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction(
      payload as IWithdrawalContributionLimitRequest
    )

    expect(result).toBe(false)
  })

  it('updates record successfully', async () => {
    const store = useWithdrawalContributionLimitsStoreV1()

    const payload = { id: 20, type: 1 }

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Updated' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateAction(
      payload as IWithdrawalContributionLimitRequest
    )

    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH}/update-record/20`,
      payload
    )

    expect(result).toBe(true)
  })

  it('handles error in update action', async () => {
    const store = useWithdrawalContributionLimitsStoreV1()

    const payload = { id: 30 }

    const mockPut = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateAction(
      payload as IWithdrawalContributionLimitRequest
    )

    expect(result).toBe(false)
  })

  it('deletes record successfully', async () => {
    const store = useWithdrawalContributionLimitsStoreV1()

    const mockDelete = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Deleted' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const result = await store._deleteAction(10)

    expect(mockDelete).toHaveBeenCalledWith(`${URL_PATH}/delete-record/10`)

    expect(result).toBe(true)
  })

  it('handles error in delete action', async () => {
    const store = useWithdrawalContributionLimitsStoreV1()

    const mockDelete = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const result = await store._deleteAction(99)

    expect(result).toBe(false)
  })

  it('clears data', () => {
    const store = useWithdrawalContributionLimitsStoreV1()

    store.withdrawal_list = [{ id: 1 }] as IWithdrawalContributionLimit[]
    store.withdrawal_pages = { currentPage: 5, lastPage: 10 }

    store._clearData()

    expect(store.withdrawal_list).toEqual([])
    expect(store.withdrawal_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
  })
})
