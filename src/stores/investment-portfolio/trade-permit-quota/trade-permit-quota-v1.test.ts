import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'
import { useTradePermitQuotaCollectionStoreV1 } from './trade-permit-quota-v1'

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

describe('useTradePermitQuotaCollectionStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should initialize with default state', () => {
    const store = useTradePermitQuotaCollectionStoreV1()
    expect(store.trade_permit_quota_list).toEqual([])
    expect(store.trade_permit_quota_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
    expect(store.data_information_form).toBeNull()
  })

  it('should call _getTradePermitQuotaList and update state', async () => {
    const store = useTradePermitQuotaCollectionStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'ok',
        data: {
          data: [{ description: 'desc', code: 'cod' }],
        },
      },
    }
    ;(executeApi as jest.Mock).mockReturnValue({
      get: jest.fn(() => Promise.resolve(mockResponse)),
    })
    await store._getTradePermitQuotaList('')
    expect(store.trade_permit_quota_list).toEqual([
      { description: 'desc', code: 'cod' },
    ])
  })

  it('should call _createTradePermitQuota and return success', async () => {
    const store = useTradePermitQuotaCollectionStoreV1()
    const mockResponse = { data: { success: true, message: 'created' } }
    ;(executeApi as jest.Mock).mockReturnValue({
      post: jest.fn(() => Promise.resolve(mockResponse)),
    })
    const result = await store._createTradePermitQuota({
      trader_id: 1,
      general_quota: 1000,
      individual_quota: 500,
      investment_portfolio_id: 1,
      counterpart_id: 1,
      emitter_id: 1,
      paper_type_id: 1,
    })
    expect(result).toBe(true)
  })

  it('should call _updateTradePermitQuota and return success', async () => {
    const store = useTradePermitQuotaCollectionStoreV1()
    const mockResponse = { data: { success: true, message: 'updated' } }
    ;(executeApi as jest.Mock).mockReturnValue({
      put: jest.fn(() => Promise.resolve(mockResponse)),
    })
    const result = await store._updateTradePermitQuota(1, {
      trader_id: 1,
      general_quota: 1000,
      individual_quota: 500,
      investment_portfolio_id: 1,
      counterpart_id: 1,
      emitter_id: 1,
      paper_type_id: 1,
    })
    expect(result).toBe(true)
  })

  it('should call _getTradePermitQuotaById and update data_information_form', async () => {
    const store = useTradePermitQuotaCollectionStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'ok',
        data: { description: 'desc', code: 'cod' },
      },
    }
    ;(executeApi as jest.Mock).mockReturnValue({
      get: jest.fn(() => Promise.resolve(mockResponse)),
    })
    await store._getTradePermitQuotaById(1)
    expect(store.data_information_form).toEqual({
      description: 'desc',
      code: 'cod',
    })
  })

  it('should call _deleteTradePermitQuota and return success', async () => {
    const store = useTradePermitQuotaCollectionStoreV1()
    const mockResponse = { data: { success: true, message: 'deleted' } }
    ;(executeApi as jest.Mock).mockReturnValue({
      delete: jest.fn(() => Promise.resolve(mockResponse)),
    })
    const result = await store._deleteTradePermitQuota(1)
    expect(result).toBe(true)
  })

  it('should set data_information_form with _setDataInformationForm', () => {
    const store = useTradePermitQuotaCollectionStoreV1()
    store._setDataInformationForm({
      trader_id: 1,
      general_quota: 1000,
      individual_quota: 500,
      investment_portfolio_id: 1,
      counterpart_id: 1,
      emitter_id: 1,
      paper_type_id: 1,
    })
    expect(store.data_information_form).toEqual({
      trader_id: 1,
      general_quota: 1000,
      individual_quota: 500,
      investment_portfolio_id: 1,
      counterpart_id: 1,
      emitter_id: 1,
      paper_type_id: 1,
    })
    store._setDataInformationForm(null)
    expect(store.data_information_form).toBeNull()
  })

  it('should handle error in _getTradePermitQuotaList gracefully', async () => {
    const store = useTradePermitQuotaCollectionStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    await store._getTradePermitQuotaList('')
    expect(store.trade_permit_quota_list).toEqual([])
  })

  it('should handle error in _createTradePermitQuota gracefully', async () => {
    const store = useTradePermitQuotaCollectionStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })
    const result = await store._createTradePermitQuota({
      trader_id: 1,
      general_quota: 1000,
      individual_quota: 500,
      investment_portfolio_id: 1,
      counterpart_id: 1,
      emitter_id: 1,
      paper_type_id: 1,
    })
    expect(result).toBe(false)
  })

  it('should handle error in _updateTradePermitQuota gracefully', async () => {
    const store = useTradePermitQuotaCollectionStoreV1()
    const mockPut = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })
    const result = await store._updateTradePermitQuota(1, {
      trader_id: 1,
      general_quota: 1000,
      individual_quota: 500,
      investment_portfolio_id: 1,
      counterpart_id: 1,
      emitter_id: 1,
      paper_type_id: 1,
    })
    expect(result).toBe(false)
  })

  it('should handle error in _deleteTradePermitQuota gracefully', async () => {
    const store = useTradePermitQuotaCollectionStoreV1()
    const mockDelete = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })
    const result = await store._deleteTradePermitQuota(1)
    expect(result).toBe(false)
  })
})
