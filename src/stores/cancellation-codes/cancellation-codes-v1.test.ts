import { setActivePinia, createPinia } from 'pinia'
import { useCancellationCodesStoreV1 } from './cancellation-codes-v1'
import { executeApi } from '@/apis'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    put: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({ showCatchError: jest.fn() })),
}))

describe('useCancellationCodesStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetch all cancellation codes', async () => {
    // Arrange
    const store = useCancellationCodesStoreV1()
    const mockGetAll = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Fetched successfully',
        data: {
          data: [
            {
              id: 1,
              cancellation_code: '001',
              description: 'Codigo prueba',
              type: 'Ingresos',
              reverse_conciliation: true,
              preserve_consecutive_check: false,
            },
          ],
          current_page: 1,
          last_page: 1,
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGetAll })

    // Act
    await store._getListAction('')

    // Assert
    expect(mockGetAll).toHaveBeenCalledWith(
      'treasuries/api/treasuries/treasury-cancellation-codes?paginate=1'
    )
    expect(store.cancellation_codes_list).toHaveLength(1)
    expect(store.cancellation_codes_list[0].id).toBe(1)
  })

  it('handles error when fetching all cancellation codes fails', async () => {
    // Arrange
    const store = useCancellationCodesStoreV1()
    const mockGetAll = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGetAll })

    // Act
    await store._getListAction('')

    // Assert
    expect(mockGetAll).toHaveBeenCalledWith(
      'treasuries/api/treasuries/treasury-cancellation-codes?paginate=1'
    )
    expect(store.cancellation_codes_list).toHaveLength(0)
  })

  it('gets cancellation code by ID successfully', async () => {
    // Arrange
    const store = useCancellationCodesStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Success',
        data: {
          id: 2,
          cancellation_code: '002',
          description: 'Codigo prueba',
          type: 'Egresos',
          reverse_conciliation: false,
          preserve_consecutive_check: true,
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getByIdCancellationCode(2)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      'treasuries/api/treasuries/treasury-cancellation-codes/2'
    )
    expect(store.cancellation_codes_request?.id).toBe(2)
  })

  it('handles error when getting cancellation code by ID fails', async () => {
    // Arrange
    const store = useCancellationCodesStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getByIdCancellationCode(2)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      'treasuries/api/treasuries/treasury-cancellation-codes/2'
    )
    expect(store.cancellation_codes_request).toBeNull()
  })

  it('creates a cancellation code successfully', async () => {
    // Arrange
    const store = useCancellationCodesStoreV1()
    const payload = {
      description: 'Codigo 3',
      type: 'Traslados',
      reverse_conciliation: false,
      preserve_consecutive_check: false,
    }
    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Created',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const success = await store._createCancellationCode(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      'treasuries/api/treasuries/treasury-cancellation-codes',
      payload
    )
    expect(success).toBe(true)
  })

  it('handles error when creating a cancellation code fails', async () => {
    // Arrange
    const store = useCancellationCodesStoreV1()
    const payload = {
      description: 'Codigo 3',
      type: 'Traslados',
      reverse_conciliation: false,
      preserve_consecutive_check: false,
    }
    const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const success = await store._createCancellationCode(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      'treasuries/api/treasuries/treasury-cancellation-codes',
      payload
    )
    expect(success).toBe(false)
  })

  it('updates a cancellation code successfully', async () => {
    // Arrange
    const store = useCancellationCodesStoreV1()
    const payload = {
      cancellation_code: '004',
      description: 'Codigo 4',
      type: 'Ingresos',
      reverse_conciliation: true,
      preserve_consecutive_check: false,
    }
    const mockPut = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Updated',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const success = await store._updateCancellationCode(payload, 4)

    // Assert
    expect(mockPut).toHaveBeenCalledWith(
      'treasuries/api/treasuries/treasury-cancellation-codes/4',
      payload
    )
    expect(success).toBe(true)
  })

  it('handles error when updating a cancellation code fails', async () => {
    // Arrange
    const store = useCancellationCodesStoreV1()
    const payload = {
      cancellation_code: '004',
      description: 'Codigo 4',
      type: 'Ingresos',
      reverse_conciliation: true,
      preserve_consecutive_check: false,
    }
    const mockPut = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const success = await store._updateCancellationCode(payload, 4)

    // Assert
    expect(mockPut).toHaveBeenCalledWith(
      'treasuries/api/treasuries/treasury-cancellation-codes/4',
      payload
    )
    expect(success).toBe(false)
  })

  it('delete a cancellation code', async () => {
    // Arrange
    const store = useCancellationCodesStoreV1()
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
    await store._changeStatusAction(5)

    // Assert
    expect(mockDelete).toHaveBeenCalledWith(
      'treasuries/api/treasuries/treasury-cancellation-codes/5'
    )
    expect(mockGet).toHaveBeenCalled()
  })

  it('handles error when deleting a cancellation code fails', async () => {
    // Arrange
    const store = useCancellationCodesStoreV1()
    const mockDelete = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    // Act
    await store._changeStatusAction(5)

    // Assert
    expect(mockDelete).toHaveBeenCalledWith(
      'treasuries/api/treasuries/treasury-cancellation-codes/5'
    )
  })

  it('set correctly', () => {
    // Arrange
    const store = useCancellationCodesStoreV1()
    const data = {
      description: 'Codigo 6',
      type: 'Traslados',
      reverses_conciliation: false,
      retains_consecutive_check: true,
    }

    // Act
    store._setDataCancellationCodes(data)

    // Assert
    expect(store.data_information_form).toEqual(data)

    // Act
    store._setDataCancellationCodes(null)
    // Assert
    expect(store.data_information_form).toBeNull()
  })
})
