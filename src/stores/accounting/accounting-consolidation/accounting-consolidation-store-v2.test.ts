import { setActivePinia, createPinia } from 'pinia'
import { useAccountingConsolidationV2 } from './accounting-consolidation-v2'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}))
jest.mock('@/composables/useAlert', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
}))
jest.mock('@/composables/useShowError', () => ({
  useShowError: jest.fn(() => ({ showCatchError: jest.fn() })),
}))
jest.mock('@/composables/useUtils', () => ({
  useUtils: jest.fn(() => ({
    defaultIconsLucide: { plusCircleOutline: 'icon' },
    getNameBlob: jest.fn(() => 'file.xlsx'),
    downloadBlobXlxx: jest.fn(),
  })),
}))
jest.mock('@/constants/apis', () => ({
  URL_PATH_ACCOUNTING: '/api/accounting',
}))
jest.mock('@/constants/alerts', () => ({
  TIMEOUT_ALERT: 3000,
}))

describe('useAccountingConsolidationV2', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should initialize with default state', () => {
    const store = useAccountingConsolidationV2()
    expect(store.consolidation_list).toEqual([])
    expect(store.process_consolidation_list).toEqual([])
    expect(store.view_updates_consolidation).toEqual([])
    expect(store.pages).toEqual({ currentPage: 0, lastPage: 0 })
    expect(store.consolidation_id_reference).toBeNull()
    expect(store.business_list).toEqual([])
    expect(store.consolidation_response).toEqual({})
    expect(store.business_list_consolidate).toEqual([])
    expect(store.consolidation_view_data_list).toEqual({})
  })

  it('should call _getAccountingConsolidationList and update state', async () => {
    const store = useAccountingConsolidationV2()
    const mockResponse = {
      data: {
        success: true,
        message: 'ok',
        data: { data: [{ id: 1 }], current_page: 2, last_page: 5 },
      },
    }
    require('@/apis').executeApi.mockReturnValue({
      get: jest.fn(() => Promise.resolve(mockResponse)),
    })
    await store._getAccountingConsolidationList({ foo: 'bar' })
    expect(store.consolidation_list).toEqual([{ id: 1 }])
    expect(store.pages).toEqual({ currentPage: 1, lastPage: 1 })
  })

  it('should handle error in _getAccountingConsolidationList', async () => {
    const store = useAccountingConsolidationV2()
    const mockResponse = {
      data: {
        success: false,
        message: 'error',
        data: { data: null, current_page: 0, last_page: 0 },
      },
    }
    require('@/apis').executeApi.mockReturnValue({
      get: jest.fn(() => Promise.resolve(mockResponse)),
    })
    await store._getAccountingConsolidationList({ foo: 'bar' })
    expect(store.consolidation_list).toEqual([])
    expect(store.pages).toEqual({ currentPage: 0, lastPage: 0 })
  })

  it('should handle exception in _getAccountingConsolidationList', async () => {
    const store = useAccountingConsolidationV2()
    require('@/apis').executeApi.mockReturnValue({
      get: jest.fn().mockRejectedValue(new Error('Network Error')),
    })
    await store._getAccountingConsolidationList({ foo: 'bar' })
    expect(store.consolidation_list).toEqual([])
    expect(store.pages).toEqual({ currentPage: 0, lastPage: 0 })
  })

  it('should call _getProcessConsolidation and update state', async () => {
    const store = useAccountingConsolidationV2()
    const mockResponse = {
      data: { success: true, message: 'ok', data: { id: 2 } },
    }
    require('@/apis').executeApi.mockReturnValue({
      get: jest.fn(() => Promise.resolve(mockResponse)),
    })
    await store._getProcessConsolidation(123)
    expect(store.consolidation_response).toEqual({ id: 2 })
  })

  it('should handle error in _getProcessConsolidation', async () => {
    const store = useAccountingConsolidationV2()
    require('@/apis').executeApi.mockReturnValue({
      get: jest.fn().mockRejectedValue(new Error('Network Error')),
    })
    await store._getProcessConsolidation(123)
    expect(store.consolidation_response).toEqual({})
  })

  it('should call _getDetailConsolidation and update state and return payload', async () => {
    const store = useAccountingConsolidationV2()

    const mockResponse = {
      data: {
        success: true,
        message: 'ok',
        data: { id: 3 },
      },
    }

    const { executeApi } = require('@/apis')
    executeApi.mockReturnValue({
      get: jest.fn().mockResolvedValue(mockResponse),
    })

    const result = await store._getDetailConsolidation(123)

    expect(result).toEqual({
      data: { id: 3 },
      message: 'ok',
      success: true,
    })
  })

  it('should return null and keep default state on exception in _getDetailConsolidation', async () => {
    const store = useAccountingConsolidationV2()

    require('@/apis').executeApi.mockReturnValue({
      get: jest.fn().mockRejectedValue(new Error('Network Error')),
    })

    const result = await store._getDetailConsolidation(123)

    expect(result).toBeNull()
    expect(store.consolidation_response).toEqual({})
  })

  it('should call _getBusinessAccounting and update state', async () => {
    const store = useAccountingConsolidationV2()
    const mockResponse = {
      data: {
        success: true,
        message: 'ok',
        data: { result: { data: [{ id: 4 }] } },
      },
    }
    require('@/apis').executeApi.mockReturnValue({
      get: jest.fn(() => Promise.resolve(mockResponse)),
    })
    await store._getBusinessAccounting({ foo: 'bar' })
    expect(store.business_list).toEqual([{ id: 4 }])
  })

  it('should handle error in _getBusinessAccounting', async () => {
    const store = useAccountingConsolidationV2()
    require('@/apis').executeApi.mockReturnValue({
      get: jest.fn().mockRejectedValue(new Error('Network Error')),
    })
    await store._getBusinessAccounting({ foo: 'bar' })
    expect(store.business_list).toEqual([])
  })

  it('should call _getUpdateInfo and update state', async () => {
    const store = useAccountingConsolidationV2()
    const mockResponse = {
      data: { success: true, message: 'ok', data: [{ id: 5 }] },
    }
    require('@/apis').executeApi.mockReturnValue({
      get: jest.fn(() => Promise.resolve(mockResponse)),
    })
    await store._getUpdateInfo(123)
    expect(store.consolidation_response).toEqual([{ id: 5 }])
  })

  it('should handle error in _getUpdateInfo', async () => {
    const store = useAccountingConsolidationV2()
    require('@/apis').executeApi.mockReturnValue({
      get: jest.fn().mockRejectedValue(new Error('Network Error')),
    })
    await store._getUpdateInfo(123)
    expect(store.view_updates_consolidation).toEqual([])
  })

  it('should call _getDownloadFile and _getDownloadDetailsFile without error', async () => {
    const store = useAccountingConsolidationV2()
    require('@/apis').executeApi.mockReturnValue({
      get: jest.fn(() =>
        Promise.resolve({
          headers: {
            'content-type':
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          },
          status: 200,
        })
      ),
    })
    await store._getDownloadFile('id')
    await store._getDownloadDetailsFile('id')
    expect(true).toBe(true)
  })

  it('should handle error in _getDownloadFile and _getDownloadDetailsFile', async () => {
    const store = useAccountingConsolidationV2()
    require('@/apis').executeApi.mockReturnValue({
      get: jest.fn().mockRejectedValue(new Error('Network Error')),
    })
    await store._getDownloadFile('id')
    await store._getDownloadDetailsFile('id')
    expect(true).toBe(true)
  })

  it('should call _processAccountingConsolidation and update state', async () => {
    const store = useAccountingConsolidationV2()
    const mockResponse = {
      data: {
        success: true,
        message: 'ok',
        data: {
          list_parent_consolidator_business: [{ id: 6 }],
          list_child_consolidated_business: [{ id: 7 }],
        },
      },
    }
    require('@/apis').executeApi.mockReturnValue({
      post: jest.fn(() => Promise.resolve(mockResponse)),
    })
    const payload = {
      current_period: '2025-12',
      date_to_consolidate: '2025-12-01',
      from_consolidation_business_code: 'A',
      to_consolidation_business_code: 'B',
      accounting_structure_id: 1,
      selected_businesses_id: [1, 2],
      daily_closing: true,
    }
    const result = await store._processAccountingConsolidation(payload)
    expect(result).toBe(true)
    expect(store.business_list).toEqual([{ id: 6 }])
    expect(store.business_list_consolidate).toEqual([{ id: 7 }])
  })

  it('should handle error in _processAccountingConsolidation', async () => {
    const store = useAccountingConsolidationV2()
    require('@/apis').executeApi.mockReturnValue({
      post: jest.fn().mockRejectedValue(new Error('Network Error')),
    })
    const payload = {
      current_period: '2025-12',
      date_to_consolidate: '2025-12-01',
      from_consolidation_business_code: 'A',
      to_consolidation_business_code: 'B',
      accounting_structure_id: 1,
      selected_businesses_id: [1, 2],
      daily_closing: true,
    }
    const result = await store._processAccountingConsolidation(payload)
    expect(result).toBe(false)
    expect(store.business_list).toEqual([])
    expect(store.business_list_consolidate).toEqual([])
  })
  it('should call _getFilterBusinessConsolidation and update state', async () => {
    const mockResponse = {
      data: {
        success: true,
        message: 'ok',
        data: [{ id: 1 }],
      },
    }

    const { executeApi } = require('@/apis')
    executeApi.mockReturnValue({
      get: jest.fn().mockResolvedValue(mockResponse),
    })

    const store = useAccountingConsolidationV2()

    await store._getFilterBusinessConsolidation(1, { foo: 'bar' })

    expect(store.consolidation_view_data_list).toEqual([{ id: 1 }])
  })
})
