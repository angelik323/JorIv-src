import { useFiduciaryTrustStoreV1 } from './fiduciary-trust-v1'
import { TRUST_BUSINESS_API_URL } from '@/constants/apis'
import { IFiduciaryTrust } from '@/interfaces/customs'
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

const URL_PATH = `${TRUST_BUSINESS_API_URL}/fiduciary-mandate`

describe('useFiduciaryTrustStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches list and updates state on success', async () => {
    const store = useFiduciaryTrustStoreV1()
    const mockResponse = {
      data: {
        data: {
          data: [{ id: 1, code: 'X' }],
          current_page: 1,
          last_page: 2,
        },
        success: true,
        message: 'List fetched',
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listAction('type=1')

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/index?type=1`)
    expect(store.fiduciary_trust_list).toEqual(mockResponse.data.data.data)
    expect(store.fiduciary_trust_pages).toEqual({
      currentPage: mockResponse.data.data.current_page,
      lastPage: mockResponse.data.data.last_page,
    })
  })

  it('handles error in list fetch', async () => {
    const store = useFiduciaryTrustStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listAction('type=1')
    expect(store.fiduciary_trust_list).toEqual([])
    expect(store.fiduciary_trust_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })

  it('fetches single record successfully', async () => {
    const store = useFiduciaryTrustStoreV1()
    const mockResponse = {
      data: {
        success: true,
        data: { id: 1, code: 'XYZ' },
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._showAction(1)
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/show/1`)
    expect(result).toEqual(mockResponse.data.data)
  })

  it('handles error in show action', async () => {
    const store = useFiduciaryTrustStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._showAction(1)
    expect(result).toBe(null)
  })

  it('creates a record successfully', async () => {
    const store = useFiduciaryTrustStoreV1()
    const payload = {
      business_trust_id: 1,
      currency: 'USD',
      id: 1,
      investment_fund_id: 10,
      name: 'Trust Name',
      real_estate_project_id: 100,
      stage_id: 5,
      status: 'Active',
      status_id: 1,
    }
    const mockPost = jest
      .fn()
      .mockResolvedValue({ data: { success: true, message: 'Created' } })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction(payload as IFiduciaryTrust)
    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}/create`, payload)
    expect(result).toBe(true)
  })

  it('handles error in create', async () => {
    const store = useFiduciaryTrustStoreV1()
    const payload = {
      business_trust_id: 1,
      currency: 'USD',
      id: 1,
      investment_fund_id: 10,
      name: 'Trust Name',
      real_estate_project_id: 100,
      stage_id: 5,
      status: 'Active',
      status_id: 1,
    }
    const mockPost = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction(payload as IFiduciaryTrust)
    expect(result).toBe(false)
  })

  it('updates a record successfully', async () => {
    const store = useFiduciaryTrustStoreV1()
    const payload = {
      business_trust_id: 1,
      currency: 'USD',
      id: 1,
      investment_fund_id: 10,
      name: 'Trust Name',
      real_estate_project_id: 100,
      stage_id: 5,
      status: 'Active',
      status_id: 1,
    }
    const mockPut = jest
      .fn()
      .mockResolvedValue({ data: { success: true, message: 'Updated' } })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateAction(payload as IFiduciaryTrust)
    expect(mockPut).toHaveBeenCalledWith(`${URL_PATH}/update/1`, payload)
    expect(result).toBe(true)
  })

  it('handles error in update', async () => {
    const store = useFiduciaryTrustStoreV1()
    const payload = {
      business_trust_id: 1,
      currency: 'USD',
      id: 1,
      investment_fund_id: 10,
      name: 'Trust Name',
      real_estate_project_id: 100,
      stage_id: 5,
      status: 'Active',
      status_id: 1,
    }
    const mockPut = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateAction(payload as IFiduciaryTrust)
    expect(result).toBe(false)
  })

  it('deletes a record successfully', async () => {
    const store = useFiduciaryTrustStoreV1()
    const mockDelete = jest
      .fn()
      .mockResolvedValue({ data: { success: true, message: 'Deleted' } })
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const result = await store._deleteAction('1')
    expect(mockDelete).toHaveBeenCalledWith(`${URL_PATH}/delete/1`)
    expect(result).toBe(true)
  })

  it('handles error in delete', async () => {
    const store = useFiduciaryTrustStoreV1()
    const mockDelete = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const result = await store._deleteAction('1')
    expect(result).toBe(false)
  })

  it('clears data', () => {
    const store = useFiduciaryTrustStoreV1()
    store.fiduciary_trust_list = [
      {
        business_trust_id: 1,
        currency: 'USD',
        id: 1,
        investment_fund_id: 10,
        name: 'Trust Name',
        real_estate_project_id: 100,
        stage_id: 5,
        status: 'Active',
        status_id: 1,
      },
    ]
    store.fiduciary_trust_pages = { currentPage: 3, lastPage: 5 }

    store._clearData()

    expect(store.fiduciary_trust_list).toEqual([])
    expect(store.fiduciary_trust_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })
})
