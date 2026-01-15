import { setActivePinia, createPinia } from 'pinia'
import { useBillingPeriodStoreV2 } from './billing-period-v2'
import { executeApi } from '@/apis'
import { URL_PATH_SETTLEMENT_COMMISSIONS } from '@/constants/apis'

const URL_PERIODS = `${URL_PATH_SETTLEMENT_COMMISSIONS}/billing-trusts`

const mockBillingPeriodList = [
  {
    id: 6,
    code: '00001',
    business_id: 5026,
    start_date: '2025-10-09',
    end_date: '2025-10-30',
    periodicity: 'Mensual',
    other: null,
    created_by: 14257,
    updated_by: null,
    business_code_snapshot: '23554',
    business_name_snapshot: 'Proyecto vial del norte',
    snapshotted_at: '2025-10-30',
    accounting_parameters: null,
  },
]

const mockBillingPeriodResponse = {
  id: 6,
  business_id: 5026,
  business_code_snapshot: '23554',
  business_name_snapshot: 'Proyecto vial del norte',
  snapshotted_at: '2025-10-30T19:25:32.403652Z',
  start_date: '2025-10-09',
  end_date: '2025-10-30',
  periodicity: 'Mensual',
  other: null,
  created_by: 14257,
  updated_by: 14257,
  created_at: '2025-10-30T15:09:51.000000Z',
  updated_at: '2025-10-30T19:25:32.000000Z',
  code: '00001',
  accounting_parameters: null,
}

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
  useShowError: jest.fn(() => ({ showCatchError: jest.fn(() => 'Error!') })),
}))
describe('useBillingPeriodStoreV2', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })
  it('should fetch list of billing periods', async () => {
    const store = useBillingPeriodStoreV2()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          data: mockBillingPeriodList,
          current_page: 1,
          last_page: 2,
        },
        message: 'List fetched',
      },
      status: 200,
    })
    const params = { page: 1 }
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    await store._getBillingPeriodList(params)
    expect(mockGet).toHaveBeenCalledWith(`${URL_PERIODS}`, {
      params: { ...params, paginate: 1 },
    })
    expect(store.billing_period_list).toEqual(mockBillingPeriodList)
    expect(store.billing_period_pages.currentPage).toBe(1)
    expect(store.billing_period_pages.lastPage).toBe(2)
  })
  it('should handle error when fetching billing periods', async () => {
    const store = useBillingPeriodStoreV2()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))
    const params = { page: 1 }
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    await store._getBillingPeriodList(params)
    expect(mockGet).toHaveBeenCalledWith(`${URL_PERIODS}`, {
      params: { ...params, paginate: 1 },
    })
    expect(store.billing_period_list).toEqual([])
  })
  it('should fetch billing period by ID', async () => {
    const store = useBillingPeriodStoreV2()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: mockBillingPeriodResponse,
        message: 'Found',
      },
      status: 200,
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    await store._getByIdBillingPeriod(1)
    expect(mockGet).toHaveBeenCalledWith(`${URL_PERIODS}/1`)
    expect(store.billing_period_response).toEqual(mockBillingPeriodResponse)
  })
  it('should handle error when fetching billing period by ID', async () => {
    const store = useBillingPeriodStoreV2()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    await store._getByIdBillingPeriod(1)
    expect(mockGet).toHaveBeenCalledWith(`${URL_PERIODS}/1`)
    expect(store.billing_period_response).toBeNull()
  })

  it('should delete billing period by ID', async () => {
    const store = useBillingPeriodStoreV2()
    const mockDelete = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: [],
        message: 'Registro eliminado exitosamente.',
      },
      status: 200,
    })
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    await store._deleteBillingPeriod(1)

    expect(mockDelete).toHaveBeenCalledWith(`${URL_PERIODS}/1`)
    expect(store.billing_period_response).toBeNull()
  })

  it('should handle error when deleting billing period by ID', async () => {
    const store = useBillingPeriodStoreV2()
    const mockDelete = jest.fn().mockRejectedValue(new Error('API Error'))

    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    await store._deleteBillingPeriod(1)

    expect(mockDelete).toHaveBeenCalledWith(`${URL_PERIODS}/1`)
    expect(store.billing_period_response).toBeNull()
  })

  it('should clear all data in the store', () => {
    const store = useBillingPeriodStoreV2()
    store.billing_period_list = mockBillingPeriodList
    store.billing_period_response = mockBillingPeriodResponse
    store.billing_period_pages = {
      currentPage: 2,
      lastPage: 3,
    }
    store._clearData()
    expect(store.billing_period_list).toEqual([])
    expect(store.billing_period_response).toBeNull()
    expect(store.billing_period_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })
})
