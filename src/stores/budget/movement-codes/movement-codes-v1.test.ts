import { setActivePinia, createPinia } from 'pinia'
import { useBudgetMovementCodesStoreV1 } from './movement-codes-v1'
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
  useUtils: jest.fn(() => ({
    getNameBlob: jest.fn(() => 'archivo.xlsx'),
    downloadBlobXlxx: jest.fn(),
    defaultIconsLucide: {
      plusCircleOutline: 'plus-circle',
    },
  })),
}))

describe('useBudgetMovementCodesStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches list of movement codes', async () => {
    // Arrange
    const store = useBudgetMovementCodesStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Fetched',
        data: {
          data: [
            {
              id: 1,
              movement_code: 'P99',
              movement_description: 'descripcion ejemplo 99',
              validity: 'ACTUAL',
              is_derived_contract: false,
              cancellation_code_id: '1',
              balance_cancellation_code_id: '2',
            },
          ],
          current_page: 1,
          last_page: 1,
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getListAction('')

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      'budget/api/budget/code-movements?paginate=1'
    )
    expect(store.data_movement_codes_list).toHaveLength(1)
    expect(store.data_movement_codes_list[0].id).toBe(1)
  })

  it('handles error when fetching movement codes fails', async () => {
    // Arrange
    const store = useBudgetMovementCodesStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getListAction('')

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      'budget/api/budget/code-movements?paginate=1'
    )
    expect(store.data_movement_codes_list).toHaveLength(0)
  })

  it('fetches movement codes by ID', async () => {
    // Arrange
    const store = useBudgetMovementCodesStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        id: 3,
        movement_code: 'P01',
        movement_description: 'ejemplo 3',
        validity: 'PASADA',
        is_derived_contract: false,
        cancellation_code: 'LOK',
        cancellation_code_description: 'ODIT HIC AUTEM EARUM.',
        balance_cancellation_code: 'LOK',
        balance_cancellation_code_description: 'ODIT HIC AUTEM EARUM.',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getByIdMovementCodes(2)

    // Assert
    expect(mockGet).toHaveBeenCalledWith('budget/api/budget/code-movements/2')
    expect(store.data_movement_codes_request?.id).not.toBeNull()
  })

  it('handles error when fetching movement codes by ID fails', async () => {
    // Arrange
    const store = useBudgetMovementCodesStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    // Act
    await store._getByIdMovementCodes(2)
    // Assert
    expect(mockGet).toHaveBeenCalledWith('budget/api/budget/code-movements/2')
    expect(store.data_movement_codes_request).toBeNull()
  })

  it('creates a movement codes and returns true on success', async () => {
    const store = useBudgetMovementCodesStoreV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Created',
      },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createMovementCodes({
      id: 99,
      movement_code: 'P99',
      movement_description: 'Descripción Ejemplo 99',
      validity: 'ACTUAL',
      is_derived_contract: false,
      cancellation_code: '1',
      cancellation_code_description: 'Descripcion',
      balance_cancellation_code: '2',
      balance_cancellation_code_description: 'Descripcion 2',
    })

    expect(mockPost).toHaveBeenCalled()
    expect(result).toBe(true)
  })

  it('handles error when creating a movement codes fails', async () => {
    // Arrange
    const store = useBudgetMovementCodesStoreV1()
    const payload = {
      id: 98,
      movement_code: 'P10',
      movement_description: 'Descripcion ejemplo',
      validity: 'ACTUAL',
      is_derived_contract: true,
      cancellation_code: '001',
      cancellation_code_description: 'Descripcion 001',
      balance_cancellation_code: '002',
      balance_cancellation_code_description: 'Descripcion 002',
    }
    const mockPost = jest.fn().mockResolvedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createMovementCodes(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      'budget/api/budget/code-movements',
      payload
    )
    expect(result).toBe(false)
  })

  it('updates a movement codes and returns true on success', async () => {
    const store = useBudgetMovementCodesStoreV1()
    const mockPut = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Updated',
      },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateMovementCodes(3, {
      id: 3,
      movement_code: '005',
      movement_description: 'ejemplo 5',
      validity: 'PASADA',
      is_derived_contract: false,
      cancellation_code: '001',
      cancellation_code_description: 'Descripcion 001',
      balance_cancellation_code: '002',
      balance_cancellation_code_description: 'Descripcion 002',
    })

    expect(mockPut).toHaveBeenCalledWith('budget/api/budget/code-movements/3', {
      id: 3,
      movement_code: '005',
      movement_description: 'ejemplo 5',
      validity: 'PASADA',
      is_derived_contract: false,
      cancellation_code: '001',
      cancellation_code_description: 'Descripcion 001',
      balance_cancellation_code: '002',
      balance_cancellation_code_description: 'Descripcion 002',
    })

    expect(result).toBe(true)
  })

  it('handles error when updating a movement codes fails', async () => {
    // Arrange
    const store = useBudgetMovementCodesStoreV1()
    const payload = {
      id: 3,
      movement_code: '005',
      movement_description: 'ejemplo 5',
      validity: 'PASADA',
      is_derived_contract: false,
      cancellation_code: '001',
      cancellation_code_description: 'Descripcion 001',
      balance_cancellation_code: '002',
      balance_cancellation_code_description: 'Descripcion 002',
    }

    const mockPut = jest.fn().mockResolvedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const result = await store._updateMovementCodes(3, payload)

    // Assert
    expect(mockPut).toHaveBeenCalledWith(
      'budget/api/budget/code-movements/3',
      payload
    )
    expect(result).toBe(false)
  })

  it('deletes a movement codes and refetches the list', async () => {
    const store = useBudgetMovementCodesStoreV1()
    const mockDelete = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Deleted',
      },
    })

    ;(executeApi as jest.Mock).mockReturnValue({
      delete: mockDelete,
    })

    await store._deleteMovementCodes(5)

    expect(mockDelete).toHaveBeenCalledWith(
      'budget/api/budget/code-movements/5'
    )
  })

  it('handles error when deleting a movement codes fails', async () => {
    // Arrange
    const store = useBudgetMovementCodesStoreV1()
    const mockDelete = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    // Act
    await store._deleteMovementCodes(1)

    // Assert
    expect(mockDelete).toHaveBeenCalledWith(
      'budget/api/budget/code-movements/1'
    )
  })

  // Movement Codes Source Destination
  it('fetches list of movement codes Destination', async () => {
    // Arrange
    const store = useBudgetMovementCodesStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Fetched',
        data: {
          data: [
            {
              id: 1,
              module: 'TES',
              movement_source_code: 'IW3',
              movement_source_description: 'SIT CONSEQUATUR DIGNISSIMOS ERROR.',
              movement_destination_code: 'K9R',
              movement_destination_description: 'QUIA SIT SED MOLESTIAS.',
            },
          ],
          current_page: 1,
          last_page: 1,
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getListActionDestination('')

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      'budget/api/budget/code-movements-source-destination?paginate=1'
    )
    expect(store.data_movement_codes_destination_list).toHaveLength(1)
    expect(store.data_movement_codes_destination_list[0].id).toBe(1)
  })

  it('handles error when fetching movement codes destination fails', async () => {
    // Arrange
    const store = useBudgetMovementCodesStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getListActionDestination('')

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      'budget/api/budget/code-movements-source-destination?paginate=1'
    )
    expect(store.data_movement_codes_destination_list).toHaveLength(0)
  })

  it('fetches movement codes destination by ID', async () => {
    // Arrange
    const store = useBudgetMovementCodesStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        id: 1,
        module: 'TES',
        movement_source_code: 'IW3',
        movement_source_description: 'SIT CONSEQUATUR DIGNISSIMOS ERROR.',
        movement_destination_code: 'K9R',
        movement_destination_description: 'QUIA SIT SED MOLESTIAS.',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getByIdDestination(2)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      'budget/api/budget/code-movements-source-destination/2'
    )
    expect(store.data_destination_request?.id).not.toBeNull()
  })

  it('handles error when fetching movement codes destination by ID fails', async () => {
    // Arrange
    const store = useBudgetMovementCodesStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    // Act
    await store._getByIdDestination(2)
    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      'budget/api/budget/code-movements-source-destination/2'
    )
    expect(store.data_destination_request).toBeNull()
  })

  it('creates a movement codes destination and returns true on success', async () => {
    const store = useBudgetMovementCodesStoreV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Created',
      },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createDestination({
      id: 1,
      module: 'TES',
      movement_source_code: 'IW3',
      movement_source_description: 'SIT CONSEQUATUR DIGNISSIMOS ERROR.',
      movement_destination_code: 'K9R',
      movement_destination_description: 'QUIA SIT SED MOLESTIAS.',
    })

    expect(mockPost).toHaveBeenCalled()
    expect(result).toBe(true)
  })

  it('handles error when creating a movement codes destination fails', async () => {
    // Arrange
    const store = useBudgetMovementCodesStoreV1()
    const payload = {
      id: 1,
      module: 'TES',
      movement_source_code: 'IW3',
      movement_source_description: 'SIT CONSEQUATUR DIGNISSIMOS ERROR.',
      movement_destination_code: 'K9R',
      movement_destination_description: 'QUIA SIT SED MOLESTIAS.',
    }
    const mockPost = jest.fn().mockResolvedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createDestination(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      'budget/api/budget/code-movements-source-destination',
      payload
    )
    expect(result).toBe(false)
  })

  it('updates a movement codes destination and returns true on success', async () => {
    const store = useBudgetMovementCodesStoreV1()
    const mockPut = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Updated',
      },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateDestination(3, {
      id: 1,
      module: 'TES',
      movement_source_code: 'IW3',
      movement_source_description: 'SIT CONSEQUATUR DIGNISSIMOS ERROR.',
      movement_destination_code: 'K9R',
      movement_destination_description: 'QUIA SIT SED MOLESTIAS.',
    })

    expect(mockPut).toHaveBeenCalledWith(
      'budget/api/budget/code-movements-source-destination/3',
      {
        id: 1,
        module: 'TES',
        movement_source_code: 'IW3',
        movement_source_description: 'SIT CONSEQUATUR DIGNISSIMOS ERROR.',
        movement_destination_code: 'K9R',
        movement_destination_description: 'QUIA SIT SED MOLESTIAS.',
      }
    )

    expect(result).toBe(true)
  })

  it('handles error when updating a movement codes destination fails', async () => {
    // Arrange
    const store = useBudgetMovementCodesStoreV1()
    const payload = {
      id: 1,
      module: 'TES',
      movement_source_code: 'IW3',
      movement_source_description: 'SIT CONSEQUATUR DIGNISSIMOS ERROR.',
      movement_destination_code: 'K9R',
      movement_destination_description: 'QUIA SIT SED MOLESTIAS.',
    }

    const mockPut = jest.fn().mockResolvedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const result = await store._updateDestination(3, payload)

    // Assert
    expect(mockPut).toHaveBeenCalledWith(
      'budget/api/budget/code-movements-source-destination/3',
      payload
    )
    expect(result).toBe(false)
  })
})
