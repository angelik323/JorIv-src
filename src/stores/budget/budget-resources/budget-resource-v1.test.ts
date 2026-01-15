import { setActivePinia, createPinia } from 'pinia'
import { useBudgetResourceStore } from './budget-resource-v1'
import { executeApi } from '@/apis'
import {
  IResourceBudget,
  IResourceBudgetPayload,
} from '@/interfaces/customs/budget/ResourceBudget'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}))

const mockGetNameBlob = jest.fn().mockReturnValue('budget-resources.xlsx')
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

  const mockBudgetResource: IResourceBudget = {
    id: 1,
    code: 'REC001',
    description: 'Recurso presupuestal de ejemplo',
    type: 'operativo',
    resource_type: { id: 1, description: 'Tipo A' },
    structure: {
      code: 'EST001',
      purpose: 'Propósito A',
    },
    manage_bank_account: 'No',
    status_id: 1,
    bank_account: null,
  }

  const mockBudgetResourcePayload: IResourceBudgetPayload = {
    id: 1,
    code: 'REC001',
    description: 'Recurso presupuestal de ejemplo',
    type: 'operativo',
    code_type_id: 1,
    budget_structure_id: 1,
    manage_bank_account: 0,
    status_id: 1,
  }

  it('should create budget resource successfully', async () => {
    // Arrange
    const store = useBudgetResourceStore()
    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Recurso presupuestal creado correctamente',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createAction(mockBudgetResourcePayload)

    // Assert
    expect(result).toBe(true)
    expect(mockPost).toHaveBeenCalledWith(
      expect.stringContaining('budget-resources'),
      mockBudgetResourcePayload
    )
  })

  it('should handle API error when creating budget resource', async () => {
    // Arrange
    const store = useBudgetResourceStore()
    const mockPost = jest.fn().mockRejectedValue(new Error('API Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createAction(mockBudgetResourcePayload)

    // Assert
    expect(result).toBe(false)
  })

  it('should handle API response with success false', async () => {
    // Arrange
    const store = useBudgetResourceStore()
    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: false,
        message: 'Error en la validación',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createAction(mockBudgetResourcePayload)

    // Assert
    expect(result).toBe(false)
  })

  it('should list budget resources successfully', async () => {
    // Arrange
    const store = useBudgetResourceStore()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Listado exitoso',
        data: {
          data: [mockBudgetResource],
          current_page: 1,
          last_page: 2,
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._listAction({ page: 1 })

    // Assert
    expect(store.resources_list).toEqual([mockBudgetResource])
    expect(store.resources_pages.currentPage).toBe(1)
    expect(store.resources_pages.lastPage).toBe(2)
    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining('budget-resources'),
      { params: { page: 1, paginate: 1 } }
    )
  })

  it('should update budget resource successfully', async () => {
    // Arrange
    const store = useBudgetResourceStore()
    const mockPut = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Actualizado correctamente',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const result = await store._updateAction(mockBudgetResourcePayload)

    // Assert
    expect(result).toBe(true)
    expect(mockPut).toHaveBeenCalledWith(
      expect.stringContaining('budget-resources/1'),
      mockBudgetResourcePayload
    )
  })

  it('should delete budget resource successfully', async () => {
    // Arrange
    const store = useBudgetResourceStore()
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
      expect.stringContaining('budget-resources/1')
    )
  })

  it('should show budget resource successfully', async () => {
    // Arrange
    const store = useBudgetResourceStore()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Encontrado',
        data: mockBudgetResource,
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._showAction(1)

    // Assert
    expect(result).toEqual(mockBudgetResource)
    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining('budget-resources/1')
    )
  })

  it('should return null when show action fails', async () => {
    // Arrange
    const store = useBudgetResourceStore()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: false,
        message: 'No encontrado',
        data: null,
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._showAction(999)

    // Assert
    expect(result).toBeNull()
    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining('budget-resources/999')
    )
  })

  it('should download excel successfully when API responds', async () => {
    // Arrange
    const store = useBudgetResourceStore()
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
      expect.stringContaining('budget-resources/export'),
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
    expect(nameArg).toBe('budget-resources.xlsx')
  })

  it('should clear data successfully', () => {
    // Arrange
    const store = useBudgetResourceStore()
    store.resources_list = [mockBudgetResource]
    store.resources_pages = { currentPage: 2, lastPage: 3 }

    // Act
    store._clearData()

    // Assert
    expect(store.resources_list).toEqual([])
    expect(store.resources_pages.currentPage).toBe(1)
    expect(store.resources_pages.lastPage).toBe(1)
  })
})
