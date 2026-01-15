import { setActivePinia, createPinia } from 'pinia'
import { useBudgetTransferStoreV1 } from './budget-transfer-parameters'
import { executeApi } from '@/apis'
import {
  IBudgetTransferAPIResponse,
  IBudgetTransferListItem,
  IBudgetTransferBusiness,
} from '@/interfaces/customs/budget/BudgetTransferParameter'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}))

// Mock composables
jest.mock('@/composables', () => {
  const mockShowAlert = jest.fn()
  const mockShowCatchError = jest.fn()
  const mockGetNameBlob = jest.fn()
  const mockDownloadBlobXlxx = jest.fn()

  return {
    useAlert: jest.fn(() => ({ showAlert: mockShowAlert })),
    useShowError: jest.fn(() => ({ showCatchError: mockShowCatchError })),
    useUtils: jest.fn(() => ({
      getNameBlob: mockGetNameBlob,
      downloadBlobXlxx: mockDownloadBlobXlxx,
    })),
    mockShowAlert,
    mockShowCatchError,
    mockGetNameBlob,
    mockDownloadBlobXlxx,
  }
})

describe('useBudgetTransferStoreV1', () => {
  let showAlertMock: jest.Mock
  let showCatchErrorMock: jest.Mock
  let getNameBlobMock: jest.Mock
  let downloadBlobXlxxMock: jest.Mock

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()

    // Get mock references
    const composablesMock = jest.requireMock('@/composables')
    showAlertMock = composablesMock.mockShowAlert
    showCatchErrorMock = composablesMock.mockShowCatchError
    getNameBlobMock = composablesMock.mockGetNameBlob
    downloadBlobXlxxMock = composablesMock.mockDownloadBlobXlxx

    showCatchErrorMock.mockReturnValue('Error!')
  })

  const mockBudgetTransferBusiness: IBudgetTransferBusiness = {
    id: 1,
    budget_document_type_id: 1,
    code: 'BT-2024-001',
    document_type: 'Transferencia',
    from_business_source: {
      id: 1,
      business_code: 'BS001',
      name: 'Negocio Fuente',
      business: 'Negocio A',
      current_period: '2024-Q1',
    },
    to_business_source: null,
    from_business_target: null,
    to_business_target: null,
    one_to_one: true,
  }

  const mockBudgetTransferListItem: IBudgetTransferListItem = {
    business: mockBudgetTransferBusiness,
    area_transfer: {
      id: 1,
      from_area_source: 'Área Fuente',
      to_area_source: 'Área Destino',
      from_area_target: null,
      to_area_target: null,
    },
    budget_item_transfer: {
      id: 1,
      from_budget_item_source: 'Item Fuente',
      to_budget_item_source: 'Item Destino',
      from_budget_item_target: null,
      to_budget_item_target: null,
    },
  }

  const mockBudgetTransferAPIResponse: IBudgetTransferAPIResponse = {
    business: mockBudgetTransferBusiness,
    area_transfer_parameters: [
      {
        id: 1,
        from_area_source_id: 1,
        to_area_source_id: 2,
        from_area_target_id: 3,
        to_area_target_id: 4,
        business_transfer_parameter_id: 1,
      },
    ],
    budget_item_transfer_parameters: [
      {
        id: 1,
        from_budget_item_source_id: 1,
        to_budget_item_source_id: 2,
        from_budget_item_target_id: 3,
        to_budget_item_target_id: 4,
        business_transfer_parameter_id: 1,
      },
    ],
  }

  const mockPayload = {
    business: {
      code: 'BT-2024-001',
      document_type: 'Transferencia',
      one_to_one: true,
    },
    area_transfer_parameters: [],
    budget_item_transfer_parameters: [],
  }

  it('should fetch budget transfer list successfully', async () => {
    // Arrange
    const store = useBudgetTransferStoreV1()
    const mockDataObject = {
      data: [mockBudgetTransferListItem],
      current_page: 1,
      last_page: 3,
    }

    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Listado obtenido',
        data: mockDataObject,
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getBudgetTransferList('page=1')

    // Assert
    expect(store.budget_transfer_list).toHaveLength(1)
    expect(store.budget_transfer_list[0]).toEqual(mockBudgetTransferListItem)
    expect(store.budget_transfer_pages.currentPage).toBe(1)
    expect(store.budget_transfer_pages.lastPage).toBe(3)
    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining(
        'business-transfer-parameters/list?paginate=1&page=1'
      )
    )
  })

  it('should create a budget transfer successfully', async () => {
    // Arrange
    const store = useBudgetTransferStoreV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Transferencia creada exitosamente' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createBudgetTransfer(mockPayload)

    // Assert
    expect(result).toBe(true)
    expect(mockPost).toHaveBeenCalledWith(
      expect.stringContaining('business-transfer-parameters/new'),
      mockPayload
    )
  })

  it('should return false when create budget transfer fails', async () => {
    // Arrange
    const store = useBudgetTransferStoreV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Error al crear' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createBudgetTransfer(mockPayload)

    // Assert
    expect(result).toBe(false)
  })

  it('should get a budget transfer by id successfully', async () => {
    // Arrange
    const store = useBudgetTransferStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Transferencia encontrada',
        data: mockBudgetTransferAPIResponse,
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._getBudgetTransferById(1)

    // Assert
    expect(result).toBe(true)
    expect(store.budget_transfer).toEqual(mockBudgetTransferAPIResponse)
    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining('business-transfer-parameters/show/1')
    )
  })

  it('should return false when get budget transfer by id fails', async () => {
    // Arrange
    const store = useBudgetTransferStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: { success: false, message: 'No encontrado' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._getBudgetTransferById(1)

    // Assert
    expect(result).toBe(false)
    expect(store.budget_transfer).toBeNull()
  })

  it('should update a budget transfer successfully', async () => {
    // Arrange
    const store = useBudgetTransferStoreV1()
    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Transferencia actualizada' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const result = await store._updateBudgetTransfer(1, mockPayload)

    // Assert
    expect(result).toBe(true)
    expect(mockPut).toHaveBeenCalledWith(
      expect.stringContaining('business-transfer-parameters/update/1'),
      mockPayload
    )
  })

  it('should return false when update budget transfer fails', async () => {
    // Arrange
    const store = useBudgetTransferStoreV1()
    const mockPut = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Error al actualizar' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const result = await store._updateBudgetTransfer(1, mockPayload)

    // Assert
    expect(result).toBe(false)
  })

  it('should delete a budget transfer successfully', async () => {
    // Arrange
    const store = useBudgetTransferStoreV1()
    const mockDelete = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Transferencia eliminada' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    // Act
    const result = await store._deleteBudgetTransfer(1)

    // Assert
    expect(result).toBe(true)
    expect(mockDelete).toHaveBeenCalledWith(
      expect.stringContaining('business-transfer-parameters/destroy/1')
    )
  })

  it('should return false when delete budget transfer fails', async () => {
    // Arrange
    const store = useBudgetTransferStoreV1()
    const mockDelete = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Error al eliminar' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    // Act
    const result = await store._deleteBudgetTransfer(1)

    // Assert
    expect(result).toBe(false)
  })

  it('should download budget transfer list successfully', async () => {
    // Arrange
    const store = useBudgetTransferStoreV1()
    const mockBlobData = new Blob(['export data'], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    const mockResponse = {
      data: mockBlobData,
      headers: {
        'content-type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'content-disposition':
          'attachment; filename="budget-transfer-parameters.xlsx"',
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    getNameBlobMock.mockReturnValue('budget-transfer-parameters.xlsx')

    // Act
    await store._downloadBudgetTransferList('')

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining('business-transfer-parameters/export'),
      { responseType: 'blob' }
    )
    expect(getNameBlobMock).toHaveBeenCalledWith(mockResponse)
    expect(downloadBlobXlxxMock).toHaveBeenCalledTimes(1)
    const downloadCall = downloadBlobXlxxMock.mock.calls[0]
    expect(downloadCall[0]).toBeInstanceOf(Blob)
    expect(downloadCall[0].type).toBe(
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    expect(downloadCall[1]).toBe('budget-transfer-parameters.xlsx')
    expect(showAlertMock).toHaveBeenCalledWith(
      'Descarga exitosa',
      'success',
      undefined,
      3000
    )
  })

  it('should download budget transfer list with query parameters', async () => {
    // Arrange
    const store = useBudgetTransferStoreV1()
    const mockBlobData = new Blob(['export data'], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    const mockResponse = {
      data: mockBlobData,
      headers: {
        'content-type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'content-disposition': 'attachment; filename="export-filtered.xlsx"',
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    getNameBlobMock.mockReturnValue('export-filtered.xlsx')

    // Act
    await store._downloadBudgetTransferList('filter[id]=123')

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining(
        'business-transfer-parameters/export?filter[id]=123'
      ),
      { responseType: 'blob' }
    )
    expect(getNameBlobMock).toHaveBeenCalledWith(mockResponse)
    expect(downloadBlobXlxxMock).toHaveBeenCalledTimes(1)
    const downloadCall = downloadBlobXlxxMock.mock.calls[0]
    expect(downloadCall[1]).toBe('export-filtered.xlsx')
  })

  it('should handle error when fetching budget transfer list', async () => {
    // Arrange
    const store = useBudgetTransferStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getBudgetTransferList('page=1')

    // Assert
    expect(store.budget_transfer_list).toEqual([])
    expect(mockGet).toHaveBeenCalled()
  })

  it('should handle error when creating budget transfer', async () => {
    // Arrange
    const store = useBudgetTransferStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('Server error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createBudgetTransfer(mockPayload)

    // Assert
    expect(result).toBe(false)
    expect(mockPost).toHaveBeenCalled()
  })

  it('should handle error when getting budget transfer by id', async () => {
    // Arrange
    const store = useBudgetTransferStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._getBudgetTransferById(1)

    // Assert
    expect(result).toBe(false)
    expect(mockGet).toHaveBeenCalled()
  })

  it('should handle error when updating budget transfer', async () => {
    // Arrange
    const store = useBudgetTransferStoreV1()
    const mockPut = jest.fn().mockRejectedValue(new Error('Update error'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const result = await store._updateBudgetTransfer(1, mockPayload)

    // Assert
    expect(result).toBe(false)
    expect(mockPut).toHaveBeenCalled()
  })

  it('should handle error when deleting budget transfer', async () => {
    // Arrange
    const store = useBudgetTransferStoreV1()
    const mockDelete = jest.fn().mockRejectedValue(new Error('Delete error'))
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    // Act
    const result = await store._deleteBudgetTransfer(1)

    // Assert
    expect(result).toBe(false)
    expect(mockDelete).toHaveBeenCalled()
  })

  it('should handle error when downloading budget transfer list', async () => {
    // Arrange
    const store = useBudgetTransferStoreV1()
    const downloadError = new Error('Download error')
    const mockGet = jest.fn().mockRejectedValue(downloadError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    showCatchErrorMock.mockReturnValue('Error de descarga')

    // Act
    await store._downloadBudgetTransferList('')

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining('business-transfer-parameters/export'),
      { responseType: 'blob' }
    )
    expect(showCatchErrorMock).toHaveBeenCalledWith(downloadError)
    expect(showAlertMock).toHaveBeenCalledWith(
      'Error de descarga',
      'error',
      undefined,
      3000
    )
    expect(getNameBlobMock).not.toHaveBeenCalled()
    expect(downloadBlobXlxxMock).not.toHaveBeenCalled()
  })

  it('should handle network errors during download', async () => {
    // Arrange
    const store = useBudgetTransferStoreV1()
    const networkError = {
      response: {
        status: 500,
        data: { message: 'Server error' },
      },
    }
    const mockGet = jest.fn().mockRejectedValue(networkError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    showCatchErrorMock.mockReturnValue('Error del servidor')

    // Act
    await store._downloadBudgetTransferList('filter[status]=active')

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining(
        'business-transfer-parameters/export?filter[status]=active'
      ),
      { responseType: 'blob' }
    )
    expect(showCatchErrorMock).toHaveBeenCalledWith(networkError)
    expect(showAlertMock).toHaveBeenCalledWith(
      'Error del servidor',
      'error',
      undefined,
      3000
    )
    expect(downloadBlobXlxxMock).not.toHaveBeenCalled()
  })

  it('should clean data correctly', () => {
    // Arrange
    const store = useBudgetTransferStoreV1()
    store.budget_transfer_list = [mockBudgetTransferListItem]
    store.budget_transfer_pages = { currentPage: 1, lastPage: 3 }
    store.budget_transfer = mockBudgetTransferAPIResponse

    // Act
    store._cleanData()

    // Assert
    expect(store.budget_transfer_list).toEqual([])
    expect(store.budget_transfer_pages.currentPage).toBe(0)
    expect(store.budget_transfer_pages.lastPage).toBe(0)
    expect(store.budget_transfer).toBeNull()
  })
})
