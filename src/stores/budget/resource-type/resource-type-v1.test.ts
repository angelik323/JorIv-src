import { setActivePinia, createPinia } from 'pinia'
import { useBudgetResourceTypeStore } from './resource-type-v1'
import { executeApi } from '@/apis'
import { IBudgetResourceType } from '@/interfaces/customs/budget/ResourceBudget'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}))

const mockGetNameBlob = jest.fn().mockReturnValue('budget-resource-types.xlsx')
const mockDownloadBlobXlxx = jest.fn()

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({ showCatchError: jest.fn(() => 'Error!') })),
  useUtils: jest.fn(() => ({
    getNameBlob: mockGetNameBlob,
    downloadBlobXlxx: mockDownloadBlobXlxx,
  })),
}))

describe('useBudgetResourceStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  const mockTypeBudgetResource: IBudgetResourceType = {
    id: 1,
    code: 'FIN001',
    description: 'Recursos financieros',
  }

  it('should create type budget resource successfully', async () => {
    // Arrange
    const store = useBudgetResourceTypeStore()
    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Tipo de recurso creado correctamente',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createAction(mockTypeBudgetResource)

    // Assert
    expect(result).toBe(true)
    expect(mockPost).toHaveBeenCalledWith(
      expect.stringContaining('budget-resource-type-resource'),
      mockTypeBudgetResource
    )
  })

  it('should handle API error when creating type budget resource', async () => {
    // Arrange
    const store = useBudgetResourceTypeStore()
    const mockPost = jest.fn().mockRejectedValue(new Error('API Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createAction(mockTypeBudgetResource)

    // Assert
    expect(result).toBe(false)
  })

  it('should handle API response with success false', async () => {
    // Arrange
    const store = useBudgetResourceTypeStore()
    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: false,
        message: 'Error en la validación',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createAction(mockTypeBudgetResource)

    // Assert
    expect(result).toBe(false)
  })

  it('should list type resources successfully', async () => {
    // Arrange
    const store = useBudgetResourceTypeStore()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Listado exitoso',
        data: {
          data: [mockTypeBudgetResource],
          current_page: 1,
          last_page: 2,
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._listAction({ page: 1 })

    // Assert
    expect(store.resource_type_list).toEqual([mockTypeBudgetResource])
    expect(store.resource_type_pages.currentPage).toBe(1)
    expect(store.resource_type_pages.lastPage).toBe(2)
    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining('budget-resource-type-resource'),
      { params: { page: 1 } }
    )
  })

  it('should update type resource successfully', async () => {
    // Arrange
    const store = useBudgetResourceTypeStore()
    const mockPut = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Actualizado correctamente',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const result = await store._updateAction({
      ...mockTypeBudgetResource,
    })

    // Assert
    expect(result).toBe(true)
    expect(mockPut).toHaveBeenCalledWith(
      expect.stringContaining('budget-resource-type-resource/1'),
      { ...mockTypeBudgetResource }
    )
  })

  it('should delete type resource successfully', async () => {
    // Arrange
    const store = useBudgetResourceTypeStore()
    const mockDelete = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Eliminado correctamente',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    // Act
    const result = await store._deleteAction('1')

    // Assert
    expect(result).toBe(true)
    expect(mockDelete).toHaveBeenCalledWith(
      expect.stringContaining('budget-resource-type-resource/1')
    )
  })

  it('should show type resource successfully', async () => {
    // Arrange
    const store = useBudgetResourceTypeStore()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Encontrado',
        data: mockTypeBudgetResource,
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._showAction(1)

    // Assert
    expect(store.selected_type_resource).toEqual(mockTypeBudgetResource)
    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining('budget-resource-type-resource/1')
    )
  })

  it('should set selected type resource', () => {
    // Arrange
    const store = useBudgetResourceTypeStore()

    // Act
    store._setSelectTypeResource(mockTypeBudgetResource)

    // Assert
    expect(store.selected_type_resource).toEqual(mockTypeBudgetResource)
  })

  it('should clear data successfully', () => {
    // Arrange
    const store = useBudgetResourceTypeStore()
    store.resource_type_list = [mockTypeBudgetResource]
    store.resource_type_pages = { currentPage: 2, lastPage: 3 }

    // Act
    store._clearData()

    // Assert
    expect(store.resource_type_list).toEqual([])
    expect(store.resource_type_pages.currentPage).toBe(1)
    expect(store.resource_type_pages.lastPage).toBe(1)
  })

  it('should download excel successfully when API responds', async () => {
    // Arrange
    const store = useBudgetResourceTypeStore()
    mockGetNameBlob.mockClear()
    mockDownloadBlobXlxx.mockClear()

    const mockResponse = {
      data: 'fake-excel-content',
      headers: { 'content-type': 'application/vnd.ms-excel' },
    }

    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    await store._downloadExcelAction({ page: 1, status: 1 })

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      expect.stringContaining('budget-resource-type-resource/export'),
      null,
      {
        responseType: 'blob',
        params: { page: 1, status: 1 },
      }
    )
    expect(mockGetNameBlob).toHaveBeenCalledWith(mockResponse)
    expect(mockDownloadBlobXlxx).toHaveBeenCalled()
    const firstCall = mockDownloadBlobXlxx.mock.calls[0]
    expect(firstCall).toBeDefined()
    const [blobArg, nameArg] = firstCall
    expect(blobArg).toBeInstanceOf(Blob)
    expect(nameArg).toBe('budget-resource-types.xlsx')
  })

  it('should handle API error when showing type resource', async () => {
    // Arrange
    const store = useBudgetResourceTypeStore()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._showAction(1)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining('budget-resource-type-resource/1')
    )
    expect(store.selected_type_resource).toBeNull()
  })

  it('should handle API response with success false when showing', async () => {
    // Arrange
    const store = useBudgetResourceTypeStore()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: false,
        message: 'No encontrado',
        data: null,
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._showAction(999)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining('budget-resource-type-resource/999')
    )
    expect(store.selected_type_resource).toBeNull()
  })
})
