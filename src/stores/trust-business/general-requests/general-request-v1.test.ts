import { useGeneralRequestsStoreV1 } from './general-request-v1'
import { TRUST_BUSINESS_API_URL } from '@/constants/apis'
import { IGeneralRequests } from '@/interfaces/customs'
import { setActivePinia, createPinia } from 'pinia'
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
  useShowError: jest.fn(() => ({
    showCatchError: jest.fn(() => 'catch error'),
  })),
}))

const URL_PATH = `${TRUST_BUSINESS_API_URL}/general-order`

describe('useGeneralRequestsStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches list and updates state on success', async () => {
    const store = useGeneralRequestsStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'List fetched',
        data: {
          data: [
            {
              id: 1,
              business_trust_id: 1,
              currency_id: 35,
              fund_id: 2,
              name: 'Request X',
              record_status_id: 1,
            } as IGeneralRequests,
          ],
          current_page: 1,
          last_page: 2,
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listAction('type=1')

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?type=1`)
    expect(store.general_requests_list).toEqual(mockResponse.data.data.data)
    expect(store.general_requests_pages).toEqual({
      currentPage: 1,
      lastPage: 2,
    })
  })

  it('handles error in list fetch', async () => {
    const store = useGeneralRequestsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listAction('type=1')
    expect(store.general_requests_list).toEqual([])
    expect(store.general_requests_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })

  it('fetches single record successfully', async () => {
    const store = useGeneralRequestsStoreV1()
    const mockResponse = {
      data: {
        success: true,
        data: {
          id: 1,
          business_trust_id: 1,
          currency_id: 35,
          fund_id: 2,
          name: 'Request XYZ',
          record_status_id: 1,
        } as IGeneralRequests,
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._showAction(1)
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/1`)
    expect(result).toEqual(mockResponse.data.data)
  })

  it('handles error in show action', async () => {
    const store = useGeneralRequestsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._showAction(1)
    expect(result).toBe(null)
  })

  it('creates a record successfully', async () => {
    const store = useGeneralRequestsStoreV1()
    const payload: IGeneralRequests = {
      business_trust_id: 1,
      currency_id: 35,
      fund_id: 2,
      name: 'Test',
      record_status_id: 1,
    }
    const mockPost = jest
      .fn()
      .mockResolvedValue({ data: { success: true, message: 'Created' } })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction(payload)
    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}`, payload)
    expect(result).toBe(true)
  })

  it('handles error in create', async () => {
    const store = useGeneralRequestsStoreV1()
    const payload: IGeneralRequests = {
      business_trust_id: 1,
      currency_id: 35,
      fund_id: 2,
      name: 'Test',
      record_status_id: 1,
    }
    const mockPost = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction(payload)
    expect(result).toBe(false)
  })

  it('updates a record successfully', async () => {
    const store = useGeneralRequestsStoreV1()
    const payload: IGeneralRequests = {
      id: 1,
      business_trust_id: 1,
      currency_id: 35,
      fund_id: 2,
      name: 'Updated',
      record_status_id: 1,
    }
    const mockPut = jest
      .fn()
      .mockResolvedValue({ data: { success: true, message: 'Updated' } })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateAction(payload)
    expect(mockPut).toHaveBeenCalledWith(`${URL_PATH}/1`, payload)
    expect(result).toBe(true)
  })

  it('handles error in update', async () => {
    const store = useGeneralRequestsStoreV1()
    const payload: IGeneralRequests = {
      id: 99,
      business_trust_id: 1,
      currency_id: 35,
      fund_id: 2,
      name: 'FAIL',
      record_status_id: 1,
    }
    const mockPut = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateAction(payload)
    expect(result).toBe(false)
  })

  it('deletes a record successfully', async () => {
    const store = useGeneralRequestsStoreV1()
    const mockDelete = jest
      .fn()
      .mockResolvedValue({ data: { success: true, message: 'Deleted' } })
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const result = await store._deleteAction(1)
    expect(mockDelete).toHaveBeenCalledWith(`${URL_PATH}/1`)
    expect(result).toBe(true)
  })

  it('handles error in delete', async () => {
    const store = useGeneralRequestsStoreV1()
    const mockDelete = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const result = await store._deleteAction(1)
    expect(result).toBe(false)
  })

  it('clears data', () => {
    const store = useGeneralRequestsStoreV1()
    store.general_requests_list = [
      {
        id: 1,
        business_trust_id: 1,
        currency_id: 35,
        fund_id: 2,
        name: 'ClearTest',
        record_status_id: 1,
      } as IGeneralRequests,
    ]
    store.general_requests_pages = { currentPage: 3, lastPage: 5 }

    store._clearData()

    expect(store.general_requests_list).toEqual([])
    expect(store.general_requests_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })
})
