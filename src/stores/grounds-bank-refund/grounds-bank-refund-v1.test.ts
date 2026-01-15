import { setActivePinia, createPinia } from 'pinia'
import { useGroundsBankRefundV1 } from '@/stores/grounds-bank-refund/grounds-bank-refund-v1'
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
  useShowError: jest.fn(() => ({ showCatchError: jest.fn() })),
}))

jest.mock('quasar', () => ({
  Notify: {
    create: jest.fn(),
  },
}))

describe('useGroundsBankRefundV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches list of grounds for bank refund', async () => {
    // Arrange
    const store = useGroundsBankRefundV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        data: {
          success: true,
          message: 'Fetched',
          data: [
            {
              id: 1,
              causal_code: '001',
              name: 'descripcion ejemplo 3',
              apply: 'Cheque de gerencia',
              status: 'Activo',
            },
          ],
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getApiGroundsBankRefund('')

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      'treasuries/api/treasuries/reasons-for-bank-returns?paginate=1'
    )
  })

  it('handles error when fetching grounds for bank refund fails', async () => {
    // Arrange
    const store = useGroundsBankRefundV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getApiGroundsBankRefund('')

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      'treasuries/api/treasuries/reasons-for-bank-returns?paginate=1'
    )
    expect(store.data_grounds_bank_list).toHaveLength(0)
  })

  it('fetches grounds for bank refund by ID', async () => {
    // Arrange
    const store = useGroundsBankRefundV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Fetched',
        data: {
          id: 1,
          causal_code: '001',
          name: 'descripcion ejemplo 3',
          apply: 'Cheque de gerencia',
          status: 'Activo',
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getByIdGroundsBankRefund(1)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      'treasuries/api/treasuries/reasons-for-bank-returns/1'
    )
    expect(store.data_grounds_bank_request?.id).toBe(1)
  })

  it('handles error when fetching grounds for bank refund by ID fails', async () => {
    // Arrange
    const store = useGroundsBankRefundV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getByIdGroundsBankRefund(1)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      'treasuries/api/treasuries/reasons-for-bank-returns/1'
    )
    expect(store.data_grounds_bank_request).toBeNull()
  })

  it('creates a grounds for bank refund', async () => {
    // Arrange
    const store = useGroundsBankRefundV1()
    const payload = {
      name: 'descripcion ejemplo 3',
      apply: 'Cheque de gerencia',
    }

    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Created',
        data: {
          id: 1,
          causal_code: '001',
          name: 'descripcion ejemplo 3',
          apply: 'Cheque de gerencia',
          status: 'Activo',
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const success = await store._createGroundsBankRefund(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      'treasuries/api/treasuries/reasons-for-bank-returns',
      payload
    )
    expect(success).toBe(true)
  })

  it('handles error when creating grounds for bank refund fails', async () => {
    // Arrange
    const store = useGroundsBankRefundV1()
    const payload = {
      name: 'descripcion ejemplo 3',
      apply: 'Cheque de gerencia',
    }

    const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const success = await store._createGroundsBankRefund(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      'treasuries/api/treasuries/reasons-for-bank-returns',
      payload
    )
    expect(success).toBe(false)
  })

  it('updates a grounds for bank refund', async () => {
    // Arrange
    const store = useGroundsBankRefundV1()
    const payload = {
      name: 'descripcion ejemplo 3',
      apply: 'Cheque de gerencia',
      statu: 1,
    }

    const mockPut = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Updated',
        data: {
          id: 1,
          causal_code: '001',
          name: 'descripcion ejemplo 3',
          apply: 'Cheque de gerencia',
          status: 'Activo',
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const success = await store._updateGroundsBankRefund(payload, 1)

    // Assert
    expect(mockPut).toHaveBeenCalledWith(
      'treasuries/api/treasuries/reasons-for-bank-returns/1',
      payload
    )
    expect(success).toBe(true)
  })

  it('handles error when updating grounds for bank refund fails', async () => {
    // Arrange
    const store = useGroundsBankRefundV1()
    const payload = {
      name: 'descripcion ejemplo 3',
      apply: 'Cheque de gerencia',
      statu: 1,
    }

    const mockPut = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const success = await store._updateGroundsBankRefund(payload, 1)

    // Assert
    expect(mockPut).toHaveBeenCalledWith(
      'treasuries/api/treasuries/reasons-for-bank-returns/1',
      payload
    )
    expect(success).toBe(false)
  })

  it('deletes a grounds for bank refund', async () => {
    // Arrange
    const store = useGroundsBankRefundV1()
    const mockDelete = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Deleted',
      },
    })
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Fetched',
        data: { data: [] },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({
      delete: mockDelete,
      get: mockGet,
    })

    // Act
    await store._deleteGroundsBankRefund(1)

    // Assert
    expect(mockDelete).toHaveBeenCalledWith(
      'treasuries/api/treasuries/reasons-for-bank-returns/1'
    )
    expect(mockGet).toHaveBeenCalled()
  })

  it('handles error when deleting grounds for bank refund fails', async () => {
    // Arrange
    const store = useGroundsBankRefundV1()
    const mockDelete = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    // Act
    await store._deleteGroundsBankRefund(1)

    // Assert
    expect(mockDelete).toHaveBeenCalledWith(
      'treasuries/api/treasuries/reasons-for-bank-returns/1'
    )
  })
})
