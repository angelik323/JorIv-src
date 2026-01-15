import { setActivePinia, createPinia } from 'pinia'
import { useAccountingConsolidation } from './accounting-consolidation-v1'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}))
jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({ showCatchError: jest.fn() })),
}))
jest.mock('@/constants/apis', () => ({
  URL_PATH_ACCOUNTING: '/api/accounting',
}))

describe('useAccountingConsolidation', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should initialize with default state', () => {
    const store = useAccountingConsolidation()
    expect(store.data_accounting_business).toEqual([])
    expect(store.data_accounting_consolidation_form_create).toEqual([])
    expect(store.data_search_id).toBeNull()
    expect(store.accounting_consolidation_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
    expect(store.data_accounting_consolidation_view).toEqual({})
  })

  it('should call _getBussinesAccounting and update state', async () => {
    const store = useAccountingConsolidation()
    const mockResponse = {
      data: { success: true, message: 'ok', data: [{ id: 1 }] },
    }
    ;(require('@/apis').executeApi as jest.Mock).mockReturnValue({
      get: jest.fn(() => Promise.resolve(mockResponse)),
    })
    await store._getBussinesAccounting('foo=bar')
    expect(store.data_accounting_business).toEqual([{ id: 1 }])
  })

  it('should call _getAccountingBussinessById and update state', async () => {
    const store = useAccountingConsolidation()
    const mockResponse = {
      data: { success: true, message: 'ok', data: [{ id: 2 }] },
    }
    ;(require('@/apis').executeApi as jest.Mock).mockReturnValue({
      get: jest.fn(() => Promise.resolve(mockResponse)),
    })
    await store._getAccountingBussinessById('123')
    expect(store.data_accounting_consolidation_form_create).toEqual([{ id: 2 }])
  })

  it('should call _createAccountingConsolidation and return success', async () => {
    const store = useAccountingConsolidation()
    const mockResponse = { data: { success: true, message: 'created' } }
    ;(require('@/apis').executeApi as jest.Mock).mockReturnValue({
      post: jest.fn(() => Promise.resolve(mockResponse)),
    })
    const result = await store._createAccountingConsolidation({
      business_trust_id: 'bar',
    })
    expect(result).toBe(true)
  })

  it('should call _getAccountingConsolidationDetails and update state', async () => {
    const store = useAccountingConsolidation()
    const mockResponse = {
      data: { success: true, message: 'ok', data: [{ id: 3 }] },
    }
    ;(require('@/apis').executeApi as jest.Mock).mockReturnValue({
      get: jest.fn(() => Promise.resolve(mockResponse)),
    })
    await store._getAccountingConsolidationDetails('1')
    expect(store.data_accounting_consolidation_view).toEqual({ id: 3 })
  })

  it('should set data_search_id with _setDataSearch', () => {
    const store = useAccountingConsolidation()
    store._setDataSearch('abc')
    expect(store.data_search_id).toBe('abc')
  })

  it('should set data_accounting_consolidation_view with _setAccountingBussinessRequest', () => {
    const store = useAccountingConsolidation()
    store._setAccountingBussinessRequest({
      id: 1,
      business_trust_id: 1,
      business_code: 'A',
      business_name: 'B',
      current_period: '',
      last_consolidation_date: '',
      consolidation_type: '',
      accounting_period: '',
      execution_date: '',
      consolidated_businesses: [],
      is_consolidator: false,
      generates_daily_closure: false,
      last_verified: '',
    })
    expect(store.data_accounting_consolidation_view.id).toBe(1)
    store._setAccountingBussinessRequest(null)
    expect(store.data_accounting_consolidation_view).toEqual({})
  })

  it('should handle error in _getBussinesAccounting gracefully', async () => {
    const store = useAccountingConsolidation()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(require('@/apis').executeApi as jest.Mock).mockReturnValue({
      get: mockGet,
    })
    await store._getBussinesAccounting('')
    expect(store.data_accounting_business).toEqual([])
  })

  it('should handle error in _getAccountingBussinessById gracefully', async () => {
    const store = useAccountingConsolidation()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(require('@/apis').executeApi as jest.Mock).mockReturnValue({
      get: mockGet,
    })
    await store._getAccountingBussinessById('1')
    expect(store.data_accounting_consolidation_form_create).toEqual([])
  })

  it('should handle error in _createAccountingConsolidation gracefully', async () => {
    const store = useAccountingConsolidation()
    const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(require('@/apis').executeApi as jest.Mock).mockReturnValue({
      post: mockPost,
    })
    const result = await store._createAccountingConsolidation({
      business_trust_id: 'far',
    })
    expect(result).toBe(false)
  })

  it('should handle error in _getAccountingConsolidationDetails gracefully', async () => {
    const store = useAccountingConsolidation()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(require('@/apis').executeApi as jest.Mock).mockReturnValue({
      get: mockGet,
    })
    await store._getAccountingConsolidationDetails('1')
    expect(store.data_accounting_consolidation_view).toEqual({})
  })

  it('should call _getAccountingConsolidationList and update state', async () => {
    const store = useAccountingConsolidation()
    const mockResponse = {
      data: {
        success: true,
        message: 'ok',
        data: { data: [{ id: 10 }], current_page: 2, last_page: 5 },
      },
    }
    ;(require('@/apis').executeApi as jest.Mock).mockReturnValue({
      get: jest.fn(() => Promise.resolve(mockResponse)),
    })
    await store._getAccountingConsolidationList('?foo=bar')
    expect(store.data_accounting_consolidation_list).toEqual([{ id: 10 }])
    expect(store.accounting_consolidation_pages).toEqual({
      currentPage: 2,
      lastPage: 5,
    })
  })

  it('should handle error response in _getAccountingConsolidationList', async () => {
    const store = useAccountingConsolidation()
    const mockResponse = {
      data: {
        success: false,
        message: 'error',
        data: { data: null, current_page: 0, last_page: 0 },
      },
    }
    ;(require('@/apis').executeApi as jest.Mock).mockReturnValue({
      get: jest.fn(() => Promise.resolve(mockResponse)),
    })
    await store._getAccountingConsolidationList('?foo=bar')
    expect(store.data_accounting_consolidation_list).toEqual([])
    expect(store.accounting_consolidation_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })

  it('should handle error in _getAccountingConsolidationList (exception)', async () => {
    const store = useAccountingConsolidation()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(require('@/apis').executeApi as jest.Mock).mockReturnValue({
      get: mockGet,
    })
    await store._getAccountingConsolidationList('?foo=bar')
    expect(store.data_accounting_consolidation_list).toEqual([])
    expect(store.accounting_consolidation_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })
})
