// Vue - pinia
import { setActivePinia, createPinia } from 'pinia'

// Interfaces
import { IConsolidatedInvestmentRequestAssign } from '@/interfaces/customs/fics/ConsolidatedInvestment'
import {
  IFiduciaryCommissionRequest,
  IFiduciaryCommission,
} from '@/interfaces/customs/fics/FiduciaryCommission'

// Utils
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_FICS } from '@/constants/apis'
import { executeApi } from '@/apis'

// Stores
import { useConsolidatedInvestmentStoreV1 } from './consolidated-investment'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  })),
}))

const mockShowAlert = jest.fn()
const mockShowCatchError = jest.fn(() => 'catch error')

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: mockShowAlert })),
  useShowError: jest.fn(() => ({ showCatchError: mockShowCatchError })),
}))

describe('useConsolidatedInvestmentStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches list successfully', async () => {
    const store = useConsolidatedInvestmentStoreV1()

    const mockResponse = {
      data: {
        success: true,
        message: 'OK',
        data: {
          data: [{ id: 1 }],
          current_page: 3,
          last_page: 9,
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listAction('x=1')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/consolidator-funds?x=1`
    )

    expect(store.consolidator_funds_list).toEqual([{ id: 1 }])
    expect(store.consolidator_funds_pages).toEqual({
      currentPage: 3,
      lastPage: 9,
    })

    expect(mockShowAlert).toHaveBeenCalledWith(
      'OK',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('handles error in list action', async () => {
    const store = useConsolidatedInvestmentStoreV1()

    const mockGet = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listAction('a=1')

    expect(mockShowAlert).toHaveBeenCalledWith(
      'catch error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('handles success=false in list action', async () => {
    const store = useConsolidatedInvestmentStoreV1()

    const mockResponse = {
      data: {
        success: false,
        message: 'Error message',
        data: {
          data: [],
          current_page: 0,
          last_page: 0,
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listAction('b=2')

    expect(store.consolidator_funds_list).toEqual([])
    expect(store.consolidator_funds_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })

    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error message',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('handles missing data fields in list action', async () => {
    const store = useConsolidatedInvestmentStoreV1()

    const mockResponse = {
      data: {
        success: true,
        message: 'OK',
        data: {},
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listAction('c=3')

    expect(store.consolidator_funds_list).toEqual([])
    expect(store.consolidator_funds_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
  })

  it('fetches compartments successfully', async () => {
    const store = useConsolidatedInvestmentStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'OK',
        data: {
          data: [{ id: 10 }],
          current_page: 2,
          last_page: 4,
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listActionCompartments(99, 'filter=1')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/consolidator-funds/99?paginate=1&filter=1`
    )

    expect(store.consolidator_funds_compartments_list).toEqual([{ id: 10 }])
    expect(store.consolidator_funds_compartments_pages).toEqual({
      currentPage: 2,
      lastPage: 4,
    })
  })

  it('fetches compartments without params', async () => {
    const store = useConsolidatedInvestmentStoreV1()

    const mockGet = jest.fn().mockResolvedValue({
      data: { success: true, message: 'OK', data: { data: [] } },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listActionCompartments(50)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/consolidator-funds/50?paginate=1`
    )
  })

  it('handles compartments error', async () => {
    const store = useConsolidatedInvestmentStoreV1()

    const mockGet = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listActionCompartments(3)

    expect(mockShowAlert).toHaveBeenCalledWith(
      'catch error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('showAction returns data on success', async () => {
    const store = useConsolidatedInvestmentStoreV1()

    const mockResponse = {
      data: { success: true, message: 'OK', data: { id: 1 } },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const res = await store._showAction(33)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/consolidator-funds/33`
    )
    expect(res).toEqual({ id: 1 })
  })

  it('showAction handles success=false', async () => {
    const store = useConsolidatedInvestmentStoreV1()

    const mockResponse = {
      data: { success: false, message: 'Error', data: null },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const res = await store._showAction(5)

    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
    expect(res).toBeUndefined()
  })

  it('showAction catches error', async () => {
    const store = useConsolidatedInvestmentStoreV1()

    const mockGet = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const res = await store._showAction(7)

    expect(res).toBeNull()
    expect(mockShowAlert).toHaveBeenCalled()
  })

  it('createAction succeeds', async () => {
    const store = useConsolidatedInvestmentStoreV1()

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Created' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction({
      code: 'X',
    } as IFiduciaryCommissionRequest)

    expect(result).toBe(true)
  })

  it('createAction fails (success=false)', async () => {
    const store = useConsolidatedInvestmentStoreV1()

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Error' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction({
      code: 'A',
    } as IFiduciaryCommissionRequest)

    expect(result).toBe(false)
  })

  it('createAction catches error', async () => {
    const store = useConsolidatedInvestmentStoreV1()

    const mockPost = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction({
      code: 'Z',
    } as IFiduciaryCommissionRequest)

    expect(result).toBe(false)
    expect(mockShowAlert).toHaveBeenCalled()
  })

  it('createActionAssign succeeds', async () => {
    const store = useConsolidatedInvestmentStoreV1()

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Assigned' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createActionAssign(
      {} as IConsolidatedInvestmentRequestAssign
    )
    expect(result).toBe(true)
  })

  it('createActionAssign fails', async () => {
    const store = useConsolidatedInvestmentStoreV1()

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: false, message: 'FAIL' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const res = await store._createActionAssign(
      {} as IConsolidatedInvestmentRequestAssign
    )
    expect(res).toBe(false)
  })

  it('createActionAssign catches error', async () => {
    const store = useConsolidatedInvestmentStoreV1()

    const mockPost = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const res = await store._createActionAssign(
      {} as IConsolidatedInvestmentRequestAssign
    )

    expect(res).toBe(false)
    expect(mockShowAlert).toHaveBeenCalled()
  })

  it('deleteAction succeeds', async () => {
    const store = useConsolidatedInvestmentStoreV1()

    const mockDelete = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Deleted' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const result = await store._deleteAction(44)

    expect(mockDelete).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/consolidating-fund-compartments/44`
    )
    expect(result).toBe(true)
  })

  it('deleteAction fails', async () => {
    const store = useConsolidatedInvestmentStoreV1()

    const mockDelete = jest.fn().mockResolvedValue({
      data: { success: false, message: 'FAIL' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const result = await store._deleteAction(10)
    expect(result).toBe(false)
  })

  it('deleteAction catches error', async () => {
    const store = useConsolidatedInvestmentStoreV1()

    const mockDelete = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const result = await store._deleteAction(1)

    expect(result).toBe(false)
    expect(mockShowAlert).toHaveBeenCalled()
  })

  it('clears data correctly', () => {
    const store = useConsolidatedInvestmentStoreV1()

    store.consolidator_funds_list = [{ id: 1 }] as IFiduciaryCommission[]
    store.consolidator_funds_pages = { currentPage: 5, lastPage: 7 }

    store._clearData()

    expect(store.consolidator_funds_list).toEqual([])
    expect(store.consolidator_funds_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
  })
})
