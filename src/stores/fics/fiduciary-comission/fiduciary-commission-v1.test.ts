import { useFiduciaryCommissionStoreV1 } from './fiduciary-commission-v1'
import { setActivePinia, createPinia } from 'pinia'
import { URL_PATH_FICS } from '@/constants/apis'
import { executeApi } from '@/apis'
import {
  IFiduciaryCommissionRequest,
  IFiduciaryCommission,
} from '@/interfaces/customs/fics/FiduciaryCommission'

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

describe('useFiduciaryCommissionStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches list and updates state on success', async () => {
    const store = useFiduciaryCommissionStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'List fetched',
        data: {
          data: [{ id: 1, code: 'X' }],
          current_page: 1,
          last_page: 1,
        },
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listAction({ type: 1 })

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/fiduciary-commissions`,
      {
        params: { type: 1, paginate: 1 },
      }
    )
    expect(store.fiduciary_commission_list).toEqual(mockResponse.data.data.data)
    expect(store.fiduciary_commission_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
  })

  it('handles error in list fetch', async () => {
    const store = useFiduciaryCommissionStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listAction({ type: 1 })

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/fiduciary-commissions`,
      {
        params: { type: 1, paginate: 1 },
      }
    )
    expect(store.fiduciary_commission_list).toEqual([])
    expect(store.fiduciary_commission_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
  })

  it('shows error alert when success is false in list fetch', async () => {
    const store = useFiduciaryCommissionStoreV1()
    const mockResponse = {
      data: {
        success: false,
        message: 'Error',
        data: {
          data: [],
          current_page: 0,
          last_page: 0,
        },
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listAction({ type: 1 })

    expect(store.fiduciary_commission_list).toEqual([])
  })

  it('uses default values when data is incomplete', async () => {
    const store = useFiduciaryCommissionStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'OK',
        data: {},
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listAction({ type: 1 })

    expect(store.fiduciary_commission_list).toEqual([])
    expect(store.fiduciary_commission_pages.currentPage).toBe(0)
    expect(store.fiduciary_commission_pages.lastPage).toBe(0)
  })

  it('fetches single record successfully', async () => {
    const store = useFiduciaryCommissionStoreV1()
    const mockResponse = {
      data: {
        success: true,
        data: { id: 1, code: 'XYZ' },
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._showAction(1)
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/fiduciary-commissions/1`
    )
    expect(result).toEqual(mockResponse.data.data)
  })

  it('handles error in show action', async () => {
    const store = useFiduciaryCommissionStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._showAction(1)
    expect(result).toBe(null)
  })

  it('shows alert when success is false in show action', async () => {
    const store = useFiduciaryCommissionStoreV1()
    const mockResponse = {
      data: {
        success: false,
        message: 'Not found',
        data: null,
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._showAction(1)
    expect(result).toBeUndefined()
  })

  it('shows alert when success is undefined in show action', async () => {
    const store = useFiduciaryCommissionStoreV1()
    const mockResponse = {
      data: {
        message: 'No success field',
        data: null,
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._showAction(1)
    expect(result).toBeUndefined()
  })

  it('shows alert when success is truthy but data is missing', async () => {
    const store = useFiduciaryCommissionStoreV1()
    const mockResponse = {
      data: {
        success: 1,
        message: 'Success but no data',
        data: null,
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._showAction(1)
    expect(result).toBeNull()
  })

  it('creates a record successfully', async () => {
    const store = useFiduciaryCommissionStoreV1()
    const payload: IFiduciaryCommissionRequest = {
      code: '123',
      type: 1,
      description: 'Test',
      liquidation_base: 'SFF',
      rate_type: 'EF',
    }
    const mockPost = jest
      .fn()
      .mockResolvedValue({ data: { success: true, message: 'Created' } })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction(payload)
    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/fiduciary-commissions`,
      payload
    )
    expect(result).toBe(true)
  })

  it('handles error in create', async () => {
    const store = useFiduciaryCommissionStoreV1()
    const payload: IFiduciaryCommissionRequest = {
      code: '123',
      type: 1,
      description: 'Test',
      liquidation_base: 'SFF',
      rate_type: 'EF',
    }
    const mockPost = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction(payload)
    expect(result).toBe(false)
  })

  it('returns false when create success is false', async () => {
    const store = useFiduciaryCommissionStoreV1()
    const payload: IFiduciaryCommissionRequest = {
      code: '123',
      type: 1,
      description: 'Test',
      liquidation_base: 'SFF',
      rate_type: 'EF',
    }
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Failed' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction(payload)
    expect(result).toBe(false)
  })

  it('updates a record successfully', async () => {
    const store = useFiduciaryCommissionStoreV1()
    const payload: IFiduciaryCommissionRequest = {
      id: 1,
      code: '456',
      type: 2,
      description: 'Updated',
      liquidation_base: 'SIF',
      rate_type: 'NO',
    }
    const mockPut = jest
      .fn()
      .mockResolvedValue({ data: { success: true, message: 'Updated' } })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateAction(payload)
    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/fiduciary-commissions/1`,
      payload
    )
    expect(result).toBe(true)
  })

  it('handles error in update', async () => {
    const store = useFiduciaryCommissionStoreV1()
    const payload: IFiduciaryCommissionRequest = {
      id: 99,
      code: 'FAIL',
      type: 2,
      description: 'FAIL',
      liquidation_base: 'SIF',
      rate_type: 'NO',
    }
    const mockPut = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateAction(payload)
    expect(result).toBe(false)
  })

  it('returns false when update success is false', async () => {
    const store = useFiduciaryCommissionStoreV1()
    const payload: IFiduciaryCommissionRequest = {
      id: 1,
      code: '456',
      type: 2,
      description: 'Updated',
      liquidation_base: 'SIF',
      rate_type: 'NO',
    }
    const mockPut = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Failed' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateAction(payload)
    expect(result).toBe(false)
  })

  it('clears data', () => {
    const store = useFiduciaryCommissionStoreV1()
    store.fiduciary_commission_list = [{ id: 1 } as IFiduciaryCommission]
    store.fiduciary_commission_pages = { currentPage: 3, lastPage: 5 }

    store._clearData()

    expect(store.fiduciary_commission_list).toEqual([])
    expect(store.fiduciary_commission_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
  })
})
