import { setActivePinia, createPinia } from 'pinia'
import { useFiduciaryCommissionsStoreV1 } from './fiduciary-commission-v1'
import { executeApi } from '@/apis'
import { URL_PATH_SETTLEMENT_COMMISSIONS } from '@/constants/apis'
import {
  IFiduciaryCommissionForm,
  IFiduciaryCommissionLiquidate,
} from '@/interfaces/customs'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({ showCatchError: jest.fn(() => 'Error!') })),
}))

const mockFiduciaryCommisions = [
  {
    id: 1,
    business_trust_commissions_id: 3,
    comission_settlement_statuses_id: 25,
    base_amount: '6000000.00',
    iva_percentage: 19,
    iva_amount: '1140000.00',
    total_amount: '4860000.00',
    created_by: null,
    updated_by: null,
    created_at: '2025-09-09T12:37:59.000000Z',
    business_code_snapshot: '230',
    business_name_snapshot: 'Proyecto vial del norte',
    comission_settlement_statuses: null,
  },
]

const mockFiduciaryCommisionsResponse = {
  id: 2,
  business_trust_commissions_id: 3,
  base_amount: '6000000.00',
  iva_percentage: 19,
  iva_amount: '1140000.00',
  total_amount: '4860000.00',
  comission_settlement_statuses_id: 25,
  created_by: null,
  updated_by: null,
  created_at: '2025-09-09T12:37:59.000000Z',
  updated_at: '2025-09-09T12:37:59.000000Z',
  comission_settlement_statuses: null,
}

describe('useFiduciaryCommissionsStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should fetch list of settlement fiduciary commissions', async () => {
    const store = useFiduciaryCommissionsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          data: mockFiduciaryCommisions,
          current_page: 1,
          last_page: 2,
        },
        message: 'List fetched',
      },
      status: 200,
    })
    const params = { page: 1 }

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getFiduciaryCommissionList(params)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_SETTLEMENT_COMMISSIONS}/settlement-commissions`,
      {
        params: { ...params, paginate: 1 },
      }
    )
    expect(store.fiduciary_commission_list).toEqual(mockFiduciaryCommisions)
    expect(store.fiduciary_commission_pages.currentPage).toBe(1)
    expect(store.fiduciary_commission_pages.lastPage).toBe(2)
  })

  it('should handle error when fetching settlement fiduciary commissions', async () => {
    const store = useFiduciaryCommissionsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))
    const params = { page: 1 }

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getFiduciaryCommissionList(params)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_SETTLEMENT_COMMISSIONS}/settlement-commissions`,
      {
        params: { ...params, paginate: 1 },
      }
    )
    expect(store.fiduciary_commission_list).toEqual([])
  })

  it('should fetch settlement fiduciary commission by ID', async () => {
    const store = useFiduciaryCommissionsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: mockFiduciaryCommisionsResponse,
        message: 'Found',
      },
      status: 200,
    })

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdFiduciaryCommission(1)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_SETTLEMENT_COMMISSIONS}/settlement-commissions/1`
    )
    expect(store.fiduciary_commission_response).toEqual(
      mockFiduciaryCommisionsResponse
    )
  })

  it('should handle error when fetching settlement fiduciary commission by ID', async () => {
    const store = useFiduciaryCommissionsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdFiduciaryCommission(1)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_SETTLEMENT_COMMISSIONS}/settlement-commissions/1`
    )
    expect(store.fiduciary_commission_response).toBeNull()
  })

  it('should update a settlement fiduciary commission', async () => {
    const store = useFiduciaryCommissionsStoreV1()
    const form: IFiduciaryCommissionForm = {
      base_amount: 6000000,
      iva_percentage: 19,
      iva_amount: 1140000,
      total_amount: 4860000,
    }

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Updated' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateFiduciaryCommission(form, 1)

    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_SETTLEMENT_COMMISSIONS}/settlement-commissions/1`,
      form
    )
    expect(result).toBe(true)
  })

  it('should return false if update fails', async () => {
    const store = useFiduciaryCommissionsStoreV1()
    const form: IFiduciaryCommissionForm = {
      base_amount: 6000000,
      iva_percentage: 19,
      iva_amount: 1140000,
      total_amount: 4860000,
    }

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Error' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateFiduciaryCommission(form, 1)

    expect(result).toBe(false)
  })

  it('should liquidate a settlement fiduciary commission', async () => {
    const store = useFiduciaryCommissionsStoreV1()
    const form: IFiduciaryCommissionLiquidate = {
      ids: [1, 2, 3],
    }

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Updated' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPut })

    const result = await store._liquidateFiduciaryCommission(form)

    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_SETTLEMENT_COMMISSIONS}/settlement-commissions`,
      form
    )
    expect(result).toBe(true)
  })

  it('should return false if liquidate fails', async () => {
    const store = useFiduciaryCommissionsStoreV1()
    const form: IFiduciaryCommissionLiquidate = {
      ids: [1, 2, 3],
    }

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Error' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPut })

    const result = await store._liquidateFiduciaryCommission(form)

    expect(result).toBe(false)
  })

  it('should clear all data in the store', () => {
    const store = useFiduciaryCommissionsStoreV1()

    store.fiduciary_commission_list = mockFiduciaryCommisions
    store.fiduciary_commission_response = mockFiduciaryCommisionsResponse

    store.fiduciary_commission_pages = {
      currentPage: 2,
      lastPage: 3,
    }

    store._clearData()

    expect(store.fiduciary_commission_list).toEqual([])
    expect(store.fiduciary_commission_response).toBeNull()
    expect(store.fiduciary_commission_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })
})
