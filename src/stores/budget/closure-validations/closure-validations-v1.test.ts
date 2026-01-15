import { setActivePinia, createPinia } from 'pinia'
import { useClosureValidationsStoreV1 } from '@/stores/budget/closure-validations/closure-validations-v1'
import { executeApi } from '@/apis'
import { IClosureValidation, IClosureValidationForm } from '@/interfaces/customs/budget/ClosureValidations'

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
  useShowError: jest.fn(() => ({ showCatchError: jest.fn(() => 'Error!') })),
  useUtils: jest.fn(),
}))

describe('useClosureValidationsStoreV1 - Unit Tests (AAA Pattern)', () => {
  beforeEach(() => {
    // Arrange: Configurar Pinia antes de cada test
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  // Mock data para formularios
  const mockClosureValidationForm: IClosureValidationForm = {
    id: 1,
    level_id: 10,
    cancellation_code_id: 5,
    constitution_code_id: 8,
  }

  const mockClosureValidationFormUpdate: IClosureValidationForm = {
    id: 1,
    level_id: 10,
    cancellation_code_id: 12,
    constitution_code_id: 15,
  }

  // Mock data para la respuesta de la API (estructura anidada del backend)
  const mockClosureValidationApiResponse = {
    id: 1,
    level: {
      id: 10,
      name: '004',
      description: 'Nivel Departamental',
    },
    cancellation_code: {
      id: 5,
      code: 'S05',
      description: 'Cancelación de saldo',
    },
    constitution_code: {
      id: 8,
      code: 'S07',
      description: 'Constitución de reserva',
    },
  }

  // Mock data para tabla (estructura del frontend)
  const mockClosureValidationTable: IClosureValidation = {
    id: 1,
    level: {
      id: 10,
      name: '004',
      description: 'Nivel Departamental',
    },
    cancellation_code: {
      id: 5,
      code: 'S05',
      description: 'Cancelación de saldo',
    },
    constitution_code: {
      id: 8,
      code: 'S07',
      description: 'Constitución de reserva',
    },
  }

  describe('_createAction', () => {
    it('should create a closure validation successfully', async () => {
      // Arrange
      const store = useClosureValidationsStoreV1()
      const mockPost = jest.fn().mockResolvedValue({
        data: { success: true, message: 'Validación de cierre creada exitosamente' },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createAction(mockClosureValidationForm)

      // Assert
      expect(result).toBe(true)
      expect(mockPost).toHaveBeenCalledWith(
        expect.stringContaining('budget-closing-validations/new'),
        mockClosureValidationForm
      )
    })

    it('should return false when creation fails', async () => {
      // Arrange
      const store = useClosureValidationsStoreV1()
      const mockPost = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Error al crear' },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createAction(mockClosureValidationForm)

      // Assert
      expect(result).toBe(false)
    })

    it('should handle errors during creation', async () => {
      // Arrange
      const store = useClosureValidationsStoreV1()
      const mockPost = jest.fn().mockRejectedValue(new Error('Network error'))
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createAction(mockClosureValidationForm)

      // Assert
      expect(result).toBe(false)
    })
  })

  describe('_updateAction', () => {
    it('should update a closure validation successfully', async () => {
      // Arrange
      const store = useClosureValidationsStoreV1()
      const mockPut = jest.fn().mockResolvedValue({
        data: { success: true, message: 'Validación de cierre actualizada exitosamente' },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._updateAction(mockClosureValidationFormUpdate)

      // Assert
      expect(result).toBe(true)
      expect(mockPut).toHaveBeenCalledWith(
        expect.stringContaining('budget-closing-validations/update/1'),
        mockClosureValidationFormUpdate
      )
    })

    it('should return false when update fails', async () => {
      // Arrange
      const store = useClosureValidationsStoreV1()
      const mockPut = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Error al actualizar' },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._updateAction(mockClosureValidationFormUpdate)

      // Assert
      expect(result).toBe(false)
    })

    it('should handle errors during update', async () => {
      // Arrange
      const store = useClosureValidationsStoreV1()
      const mockPut = jest.fn().mockRejectedValue(new Error('Network error'))
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._updateAction(mockClosureValidationFormUpdate)

      // Assert
      expect(result).toBe(false)
    })
  })

  describe('_deleteAction', () => {
    it('should delete a closure validation successfully', async () => {
      // Arrange
      const store = useClosureValidationsStoreV1()
      const mockDelete = jest.fn().mockResolvedValue({
        data: { success: true, message: 'Validación de cierre eliminada exitosamente' },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      const result = await store._deleteAction('1')

      // Assert
      expect(result).toBe(true)
      expect(mockDelete).toHaveBeenCalledWith(
        expect.stringContaining('budget-closing-validations/destroy/1')
      )
    })

    it('should return false when deletion fails', async () => {
      // Arrange
      const store = useClosureValidationsStoreV1()
      const mockDelete = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Error al eliminar' },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      const result = await store._deleteAction('1')

      // Assert
      expect(result).toBe(false)
    })

    it('should handle errors during deletion', async () => {
      // Arrange
      const store = useClosureValidationsStoreV1()
      const mockDelete = jest.fn().mockRejectedValue(new Error('Network error'))
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      const result = await store._deleteAction('1')

      // Assert
      expect(result).toBe(false)
    })
  })

  describe('_listAction', () => {
    it('should fetch closure validations list successfully', async () => {
      // Arrange
      const store = useClosureValidationsStoreV1()
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Listado obtenido',
          data: {
            data: [mockClosureValidationTable],
            current_page: 1,
            last_page: 5,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._listAction('page=1&rows=10')

      // Assert
      expect(store.closure_validations_list).toHaveLength(1)
      expect(store.closure_validations_list[0]).toEqual(mockClosureValidationTable)
      expect(store.closure_validations_pages.currentPage).toBe(1)
      expect(store.closure_validations_pages.lastPage).toBe(5)
      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining('budget-closing-validations/list?page=1&rows=10')
      )
    })

    it('should clear previous data before fetching new list', async () => {
      // Arrange
      const store = useClosureValidationsStoreV1()
      store.closure_validations_list = [mockClosureValidationTable]
      store.closure_validations_pages = { currentPage: 2, lastPage: 3 }

      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Listado obtenido',
          data: {
            data: [],
            current_page: 1,
            last_page: 1,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._listAction('page=1')

      // Assert
      expect(store.closure_validations_list).toHaveLength(0)
      expect(store.closure_validations_pages.currentPage).toBe(1)
      expect(store.closure_validations_pages.lastPage).toBe(1)
    })

    it('should handle errors during list fetch', async () => {
      // Arrange
      const store = useClosureValidationsStoreV1()
      const mockGet = jest.fn().mockRejectedValue(new Error('Network error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._listAction('page=1')

      // Assert
      expect(store.closure_validations_list).toHaveLength(0)
    })

    it('should handle empty list response', async () => {
      // Arrange
      const store = useClosureValidationsStoreV1()
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Sin registros',
          data: {
            data: [],
            current_page: 1,
            last_page: 1,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._listAction('page=1')

      // Assert
      expect(store.closure_validations_list).toHaveLength(0)
      expect(store.closure_validations_pages.currentPage).toBe(1)
      expect(store.closure_validations_pages.lastPage).toBe(1)
    })
  })

  describe('_showAction', () => {
    it('should fetch a closure validation by id successfully', async () => {
      // Arrange
      const store = useClosureValidationsStoreV1()
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Validación encontrada',
          data: mockClosureValidationApiResponse,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getByClosureValidationId('1')

      // Assert
      expect(store.selected_closure_validation).toEqual(mockClosureValidationApiResponse)
      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining('budget-closing-validations/show/1')
      )
    })

    it('should not update selected_closure_validation when request fails', async () => {
      // Arrange
      const store = useClosureValidationsStoreV1()
      store.selected_closure_validation = mockClosureValidationTable
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'No encontrado',
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getByClosureValidationId('999')

      // Assert
      expect(store.selected_closure_validation).toEqual(mockClosureValidationTable)
    })

    it('should handle errors during show fetch', async () => {
      // Arrange
      const store = useClosureValidationsStoreV1()
      const previousValue = store.selected_closure_validation
      const mockGet = jest.fn().mockRejectedValue(new Error('Network error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getByClosureValidationId('1')

      // Assert
      expect(store.selected_closure_validation).toEqual(previousValue)
    })
  })

  describe('_downloadExcelAction', () => {
    it('should download excel successfully when API responds', async () => {
      // Arrange
      const store = useClosureValidationsStoreV1()

      const mockResponse = {
        data: 'fake-excel-content',
        headers: { 'content-type': 'application/vnd.ms-excel' },
      }

      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Mock de utilidades
      const mockGetNameBlob = jest.fn().mockReturnValue('validaciones-cierre-vigencia.xlsx')
      const mockDownloadBlobXlxx = jest.fn()

      // Mock useUtils para que retorne las funciones mockeadas
      const { useUtils } = require('@/composables')
      ;(useUtils as jest.Mock).mockReturnValue({
        getNameBlob: mockGetNameBlob,
        downloadBlobXlxx: mockDownloadBlobXlxx,
      })

      // Act
      await store._downloadExcelAction('filter[level_name]=004')

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        expect.stringContaining('budget-closing-validations/export?filter[level_name]=004'),
        null,
        { responseType: 'blob' }
      )
      expect(mockGetNameBlob).toHaveBeenCalledWith(mockResponse)
      const firstCall = mockDownloadBlobXlxx.mock.calls[0]
      expect(firstCall).toBeDefined()
      const [blobArg, nameArg] = firstCall
      expect(blobArg).toBeInstanceOf(Blob)
      expect(nameArg).toBe('validaciones-cierre-vigencia.xlsx')
    })

    it('should handle errors during excel download', async () => {
      // Arrange
      const store = useClosureValidationsStoreV1()
      const mockPost = jest.fn().mockRejectedValue(new Error('Download error'))
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act & Assert - no debería lanzar error
      await expect(store._downloadExcelAction('page=1')).resolves.not.toThrow()
    })

    it('should download excel with empty filters', async () => {
      // Arrange
      const store = useClosureValidationsStoreV1()

      const mockResponse = {
        data: 'fake-excel-content',
        headers: { 'content-type': 'application/vnd.ms-excel' },
      }

      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const mockGetNameBlob = jest.fn().mockReturnValue('validaciones-cierre-vigencia.xlsx')
      const mockDownloadBlobXlxx = jest.fn()

      const { useUtils } = require('@/composables')
      ;(useUtils as jest.Mock).mockReturnValue({
        getNameBlob: mockGetNameBlob,
        downloadBlobXlxx: mockDownloadBlobXlxx,
      })

      // Act
      await store._downloadExcelAction('')

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        expect.stringContaining('budget-closing-validations/export?'),
        null,
        { responseType: 'blob' }
      )
    })
  })

  describe('_clearData', () => {
    it('should clear all list data and reset pagination', () => {
      // Arrange
      const store = useClosureValidationsStoreV1()
      store.closure_validations_list = [mockClosureValidationTable]
      store.closure_validations_pages = { currentPage: 3, lastPage: 10 }

      // Act
      store._clearData()

      // Assert
      expect(store.closure_validations_list).toHaveLength(0)
      expect(store.closure_validations_pages.currentPage).toBe(1)
      expect(store.closure_validations_pages.lastPage).toBe(1)
    })

    it('should work correctly when data is already empty', () => {
      // Arrange
      const store = useClosureValidationsStoreV1()

      // Act
      store._clearData()

      // Assert
      expect(store.closure_validations_list).toHaveLength(0)
      expect(store.closure_validations_pages.currentPage).toBe(1)
      expect(store.closure_validations_pages.lastPage).toBe(1)
    })
  })

  describe('State initialization', () => {
    it('should initialize with correct default state', () => {
      // Arrange & Act
      const store = useClosureValidationsStoreV1()

      // Assert
      expect(store.version).toBe('v1')
      expect(store.closure_validations_list).toEqual([])
      expect(store.closure_validations_pages).toEqual({
        currentPage: 1,
        lastPage: 1,
      })
      expect(store.selected_closure_validation).toBeNull()
    })
  })

  describe('Integration scenarios', () => {
    it('should handle complete CRUD workflow', async () => {
      // Arrange
      const store = useClosureValidationsStoreV1()
      
      // Mock Create
      const mockPost = jest.fn().mockResolvedValue({
        data: { success: true, message: 'Creado' },
      })
      
      // Mock List
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Listado',
          data: {
            data: [mockClosureValidationTable],
            current_page: 1,
            last_page: 1,
          },
        },
      })
      
      // Mock Update
      const mockPut = jest.fn().mockResolvedValue({
        data: { success: true, message: 'Actualizado' },
      })
      
      // Mock Delete
      const mockDelete = jest.fn().mockResolvedValue({
        data: { success: true, message: 'Eliminado' },
      })

      ;(executeApi as jest.Mock).mockReturnValue({
        post: mockPost,
        get: mockGet,
        put: mockPut,
        delete: mockDelete,
      })

      // Act & Assert - Create
      const createResult = await store._createAction(mockClosureValidationForm)
      expect(createResult).toBe(true)

      // Act & Assert - List
      await store._listAction('page=1')
      expect(store.closure_validations_list).toHaveLength(1)

      // Act & Assert - Update
      const updateResult = await store._updateAction(mockClosureValidationFormUpdate)
      expect(updateResult).toBe(true)

      // Act & Assert - Delete
      const deleteResult = await store._deleteAction('1')
      expect(deleteResult).toBe(true)
    })
  })
})

