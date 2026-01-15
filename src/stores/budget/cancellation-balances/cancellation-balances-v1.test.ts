import { setActivePinia, createPinia } from 'pinia'
import { useBudgetCancellationBalancesStoreV1 } from './cancellation-balances-v1'
import { executeApi } from '@/apis'
import { URL_PATH_BUDGET } from '@/constants/apis'
import {
  ICreateCancellationBalancePayload,
  IUpdateCancellationBalancePayload,
  IListBudgetDocuments,
} from '@/interfaces/customs/budget/CancellationBalances'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    put: jest.fn(),
  })),
}))

jest.mock('@/composables', () => {
  const useAlert = jest.fn(() => ({ showAlert: jest.fn() }))
  const useShowError = jest.fn(() => ({
    showCatchError: jest.fn(() => 'Error!'),
  }))
  return { useAlert, useShowError }
})

describe('useBudgetCancellationBalancesStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  // --- STORE INITIALIZATION ---
  it('should initialize with correct default state', () => {
    // Arrange & Act
    const store = useBudgetCancellationBalancesStoreV1()

    // Assert
    expect(store.headerPropsDefault).toEqual({
      title: 'Cancelación de saldos',
      breadcrumbs: [
        {
          label: 'Inicio',
          route: 'HomeView',
        },
        {
          label: 'Presupuesto',
        },
        {
          label: 'Cancelación de saldos',
          route: 'BudgetCancellationBalancesList',
        },
      ],
    })

    expect(store.data_list_documents_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })

  // --- GET LIST ACTION ---
  it('should fetch list of budget documents successfully', async () => {
    // Arrange
    const store = useBudgetCancellationBalancesStoreV1()
    const mockDocuments: IListBudgetDocuments[] = [
      {
        cancellation_id: 1,
        document_number: 10001,
        movement_code: 'MOV001',
        movement_description: 'Movimiento 1',
        balance: 1000000,
        balance_cancellation: 500000,
        is_from_operation_log: true,
      },
      {
        cancellation_id: 2,
        document_number: 10002,
        movement_code: 'MOV002',
        movement_description: 'Movimiento 2',
        balance: 2000000,
        balance_cancellation: 1000000,
        is_from_operation_log: false,
      },
    ]
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'List fetched successfully',
        data: {
          data: mockDocuments,
          current_page: 1,
          last_page: 3,
        },
      },
    })
    const filters = '&status=active'
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._getListAction(filters)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_BUDGET}/balance-cancelations/list?paginate=1${filters}`
    )
    expect(result).toEqual(mockDocuments)
    expect(store.data_list_documents_pages).toEqual({
      currentPage: 1,
      lastPage: 3,
    })
  })

  it('should handle failure when fetching budget documents list', async () => {
    // Arrange
    const store = useBudgetCancellationBalancesStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: false,
        message: 'Failed to fetch list',
        data: null,
      },
    })
    const filters = '&status=active'
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._getListAction(filters)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_BUDGET}/balance-cancelations/list?paginate=1${filters}`
    )
    expect(result).toEqual([])
    expect(store.data_list_documents_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })

  it('should fetch budget documents with empty filters', async () => {
    // Arrange
    const store = useBudgetCancellationBalancesStoreV1()
    const mockDocuments: IListBudgetDocuments[] = []
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'List fetched successfully',
        data: {
          data: mockDocuments,
          current_page: 1,
          last_page: 1,
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._getListAction('')

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_BUDGET}/balance-cancelations/list?paginate=1`
    )
    expect(result).toEqual([])
  })

  it('should handle missing pagination data when fetching list', async () => {
    // Arrange
    const store = useBudgetCancellationBalancesStoreV1()
    const mockDocuments: IListBudgetDocuments[] = [
      {
        cancellation_id: 1,
        balance: 500000,
      },
    ]
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'List fetched successfully',
        data: {
          data: mockDocuments,
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._getListAction('')

    // Assert
    expect(result).toEqual(mockDocuments)
    expect(store.data_list_documents_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
  })

  // --- CREATE CANCELLATION BALANCES ---
  it('should create cancellation balances from operation log successfully', async () => {
    // Arrange
    const store = useBudgetCancellationBalancesStoreV1()
    const payload: ICreateCancellationBalancePayload = {
      cancellation_value: '500000',
      operation_log_id: 10,
      is_from_operation_log: true,
    }
    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Cancellation balance created successfully',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createCancellationBalances(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_BUDGET}/balance-cancelations/new`,
      payload
    )
    expect(result).toBe(true)
  })

  it('should create cancellation balances from budget transfer successfully', async () => {
    // Arrange
    const store = useBudgetCancellationBalancesStoreV1()
    const payload: ICreateCancellationBalancePayload = {
      cancellation_value: '750000',
      budget_transfer_id: 25,
      is_from_operation_log: false,
    }
    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Cancellation balance created successfully',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createCancellationBalances(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_BUDGET}/balance-cancelations/new`,
      payload
    )
    expect(result).toBe(true)
  })

  it('should handle failure when creating cancellation balances', async () => {
    // Arrange
    const store = useBudgetCancellationBalancesStoreV1()
    const payload: ICreateCancellationBalancePayload = {
      cancellation_value: '500000',
      operation_log_id: 10,
      is_from_operation_log: true,
    }
    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: false,
        message: 'Failed to create cancellation balance',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createCancellationBalances(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_BUDGET}/balance-cancelations/new`,
      payload
    )
    expect(result).toBe(false)
  })

  // --- UPDATE CANCELLATION BALANCES ---
  it('should update cancellation balance value successfully', async () => {
    // Arrange
    const store = useBudgetCancellationBalancesStoreV1()
    const cancellationId = 5
    const payload: IUpdateCancellationBalancePayload = {
      cancellation_value: '850000',
    }
    const mockPatch = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Cancellation balance updated successfully',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

    // Act
    const result = await store._updateCancellationBalances(
      cancellationId,
      payload
    )

    // Assert
    expect(mockPatch).toHaveBeenCalledWith(
      `${URL_PATH_BUDGET}/balance-cancelations/${cancellationId}/cancellation-value`,
      payload
    )
    expect(result).toBe(true)
  })

  it('should handle failure when updating cancellation balances', async () => {
    // Arrange
    const store = useBudgetCancellationBalancesStoreV1()
    const cancellationId = 5
    const payload: IUpdateCancellationBalancePayload = {
      cancellation_value: '850000',
    }
    const mockPatch = jest.fn().mockResolvedValue({
      data: {
        success: false,
        message: 'Failed to update cancellation balance',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

    // Act
    const result = await store._updateCancellationBalances(
      cancellationId,
      payload
    )

    // Assert
    expect(mockPatch).toHaveBeenCalledWith(
      `${URL_PATH_BUDGET}/balance-cancelations/${cancellationId}/cancellation-value`,
      payload
    )
    expect(result).toBe(false)
  })

  // --- UPDATE BULK CANCEL ---
  it('should bulk cancel multiple balance cancelations successfully', async () => {
    // Arrange
    const store = useBudgetCancellationBalancesStoreV1()
    const payload = {
      balance_cancelation_ids: [1, 2, 3, 4, 5],
    }
    const mockPut = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Bulk cancel completed successfully',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const result = await store._updateBulkCancel(payload)

    // Assert
    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_BUDGET}/balance-cancelations/bulk-cancel`,
      payload
    )
    expect(result).toBe(true)
  })

  it('should handle single item in bulk cancel', async () => {
    // Arrange
    const store = useBudgetCancellationBalancesStoreV1()
    const payload = {
      balance_cancelation_ids: [10],
    }
    const mockPut = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Bulk cancel completed successfully',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const result = await store._updateBulkCancel(payload)

    // Assert
    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_BUDGET}/balance-cancelations/bulk-cancel`,
      payload
    )
    expect(result).toBe(true)
  })

  it('should handle failure when bulk canceling', async () => {
    // Arrange
    const store = useBudgetCancellationBalancesStoreV1()
    const payload = {
      balance_cancelation_ids: [1, 2, 3],
    }
    const mockPut = jest.fn().mockResolvedValue({
      data: {
        success: false,
        message: 'Failed to bulk cancel',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const result = await store._updateBulkCancel(payload)

    // Assert
    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_BUDGET}/balance-cancelations/bulk-cancel`,
      payload
    )
    expect(result).toBe(false)
  })

  // --- EDGE CASES ---
  it('should handle empty array in bulk cancel', async () => {
    // Arrange
    const store = useBudgetCancellationBalancesStoreV1()
    const payload = {
      balance_cancelation_ids: [],
    }
    const mockPut = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'No items to cancel',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const result = await store._updateBulkCancel(payload)

    // Assert
    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_BUDGET}/balance-cancelations/bulk-cancel`,
      payload
    )
    expect(result).toBe(true)
  })

  it('should handle concurrent operations correctly', async () => {
    // Arrange
    const store = useBudgetCancellationBalancesStoreV1()
    const createPayload: ICreateCancellationBalancePayload = {
      cancellation_value: '500000',
      operation_log_id: 10,
      is_from_operation_log: true,
    }
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Created' },
    })
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'List fetched',
        data: { data: [], current_page: 1, last_page: 1 },
      },
    })
    ;(executeApi as jest.Mock)
      .mockReturnValueOnce({ post: mockPost })
      .mockReturnValueOnce({ get: mockGet })

    // Act
    const [result1, result2] = await Promise.all([
      store._createCancellationBalances(createPayload),
      store._getListAction(''),
    ])

    // Assert
    expect(result1).toBe(true)
    expect(result2).toEqual([])
  })
})
