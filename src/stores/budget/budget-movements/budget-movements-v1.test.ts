import { setActivePinia, createPinia } from 'pinia'
import { useBudgetMovementsStoreV1 } from './budget-movements-v1'
import { URL_PATH_BUDGET } from '@/constants/apis'
import {
  IBudgetLevelsList,
  IBudgetMovementFormItem,
  IBudgetMovementResource,
  IBudgetMovementsList,
} from '@/interfaces/customs/budget/BudgetLevels'

const URL_PATH = `${URL_PATH_BUDGET}/code-movement-levels`

// Type definitions for API responses
interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
}

interface PaginatedData<T> {
  current_page: number
  data: T[]
  last_page: number
  per_page: number
}

// Mock API
const mockApiMethods = {
  get: jest.fn(),
  put: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
}

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => mockApiMethods),
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

// Test data factories
const createMockBudgetLevel = (
  overrides: Partial<IBudgetLevelsList> = {}
): IBudgetLevelsList => ({
  id: 1,
  level: 1,
  description: 'Test Level',
  class: 'active',
  ...overrides,
})

const createMockCodeMovement = (
  overrides: Partial<IBudgetMovementResource> = {}
): IBudgetMovementResource => ({
  id: 10,
  movement_code: 'MV001',
  movement_description: 'Test Movement',
  ...overrides,
})

const createMockBudgetMovement = (
  overrides: Partial<IBudgetMovementsList> = {}
): IBudgetMovementsList => ({
  id: 1,
  class: 'A',
  increase_balance: 100,
  decrease_balance: 0,
  budget_level: createMockBudgetLevel(),
  code_movement: createMockCodeMovement(),
  ...overrides,
})

const createMockBudgetMovementForm = (
  overrides: Partial<IBudgetMovementFormItem> = {}
): IBudgetMovementFormItem => ({
  code_movement_id: 10,
  increase_balance: 100,
  decrease_balance: 0,
  ...overrides,
})

const createMockApiResponse = <T>(
  data: T,
  success = true,
  message = 'Success'
): { data: ApiResponse<T> } => ({
  data: {
    success,
    data,
    message,
  },
})

const createMockPaginatedResponse = (
  data: IBudgetMovementsList[],
  currentPage = 1,
  lastPage = 1
): PaginatedData<IBudgetMovementsList> => ({
  current_page: currentPage,
  data,
  last_page: lastPage,
  per_page: 20,
})

describe('useBudgetMovementsStoreV1 Store', () => {
  let store: ReturnType<typeof useBudgetMovementsStoreV1>
  let showAlertMock: jest.Mock
  let showCatchErrorMock: jest.Mock
  let getNameBlobMock: jest.Mock
  let downloadBlobXlxxMock: jest.Mock

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useBudgetMovementsStoreV1()

    // Get mock references
    const composablesMock = jest.requireMock('@/composables')
    showAlertMock = composablesMock.mockShowAlert
    showCatchErrorMock = composablesMock.mockShowCatchError
    getNameBlobMock = composablesMock.mockGetNameBlob
    downloadBlobXlxxMock = composablesMock.mockDownloadBlobXlxx

    jest.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should initialize with correct default state', () => {
      expect(store.version).toBe('v1')
      expect(store.budget_movements_list).toEqual([])
      expect(store.budget_movements_pages).toEqual({
        currentPage: 0,
        lastPage: 0,
      })
      expect(store.budget_movements).toEqual({})
      expect(store.selected_budget_level_id).toBeNull()
      expect(store.selected_budget_level_item).toBeNull()
      expect(store.budget_movement_item).toBeNull()
    })
  })

  describe('_getBudgetMovementsList', () => {
    it('should fetch and update state with parameters including initial &', async () => {
      // Arrange
      const mockBudgetMovements = [
        createMockBudgetMovement({
          id: 1,
          budget_level: createMockBudgetLevel({
            id: 1,
            level: 1,
            description: 'Nivel 1',
          }),
          code_movement: createMockCodeMovement({
            id: 10,
            movement_code: 'MV1',
            movement_description: 'Movimiento 1',
          }),
        }),
      ]
      const paginatedData = createMockPaginatedResponse(
        mockBudgetMovements,
        2,
        3
      )
      const mockResponse = createMockApiResponse(
        paginatedData,
        true,
        'Listado obtenido exitosamente.'
      )
      mockApiMethods.get.mockResolvedValue(mockResponse)
      const params = '&filter[search]=test'

      // Act
      await store._getBudgetMovementsList(params)

      // Assert
      expect(mockApiMethods.get).toHaveBeenCalledWith(
        `${URL_PATH}/list?paginate=1${params}`
      )
      expect(store.budget_movements_list).toEqual(mockBudgetMovements)
      expect(store.budget_movements_pages.currentPage).toBe(2)
      expect(store.budget_movements_pages.lastPage).toBe(3)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Listado obtenido exitosamente.',
        'success',
        undefined,
        3000
      )
    })

    it('should normalize parameters when they do not include initial &', async () => {
      // Arrange
      const paginatedData = createMockPaginatedResponse([], 1, 1)
      const mockResponse = createMockApiResponse(paginatedData, true, 'OK')
      mockApiMethods.get.mockResolvedValue(mockResponse)

      // Act
      await store._getBudgetMovementsList('filter[search]=x')

      // Assert
      expect(mockApiMethods.get).toHaveBeenCalledWith(
        `${URL_PATH}/list?paginate=1&filter[search]=x`
      )
    })

    it('should handle empty parameters', async () => {
      // Arrange
      const paginatedData = createMockPaginatedResponse([])
      const mockResponse = createMockApiResponse(paginatedData, true, 'OK')
      mockApiMethods.get.mockResolvedValue(mockResponse)

      // Act
      await store._getBudgetMovementsList('')

      // Assert
      expect(mockApiMethods.get).toHaveBeenCalledWith(
        `${URL_PATH}/list?paginate=1`
      )
    })

    it('should handle network errors and clean state', async () => {
      // Arrange
      const networkError = new Error('Network Error')
      mockApiMethods.get.mockRejectedValue(networkError)
      showCatchErrorMock.mockReturnValue('Network connection failed')

      // Act
      await store._getBudgetMovementsList('&filter[search]=fail')

      // Assert
      expect(mockApiMethods.get).toHaveBeenCalledWith(
        `${URL_PATH}/list?paginate=1&filter[search]=fail`
      )
      expect(store.budget_movements_list).toEqual([])
      expect(store.budget_movements_pages).toEqual({
        currentPage: 0,
        lastPage: 0,
      })
      expect(showCatchErrorMock).toHaveBeenCalledWith(networkError)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Network connection failed',
        'error',
        undefined,
        3000
      )
    })

    it('should handle successful response with null data', async () => {
      // Arrange
      const mockResponse = createMockApiResponse(null, true, 'Sin datos')
      mockApiMethods.get.mockResolvedValue(mockResponse)

      // Act
      await store._getBudgetMovementsList('')

      // Assert
      expect(store.budget_movements_list).toEqual([])
      expect(store.budget_movements_pages.currentPage).toBe(0)
      expect(store.budget_movements_pages.lastPage).toBe(0)
    })

    it('should handle unsuccessful response', async () => {
      // Arrange
      const paginatedData = createMockPaginatedResponse([])
      const mockResponse = createMockApiResponse(
        paginatedData,
        false,
        'Error en la consulta'
      )
      mockApiMethods.get.mockResolvedValue(mockResponse)

      // Act
      await store._getBudgetMovementsList('')

      // Assert
      expect(showAlertMock).toHaveBeenCalledWith(
        'Error en la consulta',
        'error',
        undefined,
        3000
      )
    })
  })

  describe('_createBudgetMovements', () => {
    it('should create budget movements successfully', async () => {
      // Arrange
      const payload = [createMockBudgetMovementForm()]
      const mockResponse = createMockApiResponse(null, true, 'Creado OK')
      mockApiMethods.post.mockResolvedValue(mockResponse)

      // Act
      const result = await store._createBudgetMovements(payload)

      // Assert
      expect(mockApiMethods.post).toHaveBeenCalledWith(
        `${URL_PATH}/new`,
        payload
      )
      expect(result).toBe(true)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Creado OK',
        'success',
        undefined,
        3000
      )
    })

    it('should handle creation failure from API response', async () => {
      // Arrange
      const payload = [createMockBudgetMovementForm()]
      const mockResponse = createMockApiResponse(
        null,
        false,
        'Error de validación'
      )
      mockApiMethods.post.mockResolvedValue(mockResponse)

      // Act
      const result = await store._createBudgetMovements(payload)

      // Assert
      expect(mockApiMethods.post).toHaveBeenCalledWith(
        `${URL_PATH}/new`,
        payload
      )
      expect(result).toBe(false)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Error de validación',
        'error',
        undefined,
        3000
      )
    })

    it('should handle network errors during creation', async () => {
      // Arrange
      const payload = [createMockBudgetMovementForm()]
      const networkError = new Error('Network failure')
      mockApiMethods.post.mockRejectedValue(networkError)
      showCatchErrorMock.mockReturnValue('Connection error')

      // Act
      const result = await store._createBudgetMovements(payload)

      // Assert
      expect(mockApiMethods.post).toHaveBeenCalledWith(
        `${URL_PATH}/new`,
        payload
      )
      expect(result).toBe(false)
      expect(showCatchErrorMock).toHaveBeenCalledWith(networkError)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Connection error',
        'error',
        undefined,
        3000
      )
    })

    it('should return false for empty array', async () => {
      // Arrange
      const payload: IBudgetMovementFormItem[] = []

      // Act
      const result = await store._createBudgetMovements(payload)

      // Assert
      expect(mockApiMethods.post).not.toHaveBeenCalled()
      expect(result).toBe(false)
    })

    it('should return false for invalid array', async () => {
      // Arrange
      const payload = null as unknown as IBudgetMovementFormItem[]

      // Act
      const result = await store._createBudgetMovements(payload)

      // Assert
      expect(mockApiMethods.post).not.toHaveBeenCalled()
      expect(result).toBe(false)
    })
  })

  describe('_updateBudgetMovements', () => {
    it('should update budget movement successfully', async () => {
      // Arrange
      const id = 10
      const payload = createMockBudgetMovementForm({
        increase_balance: 0,
        decrease_balance: 75,
      })
      const mockResponse = createMockApiResponse(null, true, 'Actualizado OK')
      mockApiMethods.put.mockResolvedValue(mockResponse)

      // Act
      const result = await store._updateBudgetMovements(id, payload)

      // Assert
      expect(mockApiMethods.put).toHaveBeenCalledWith(
        `${URL_PATH}/update/${id}`,
        payload
      )
      expect(result).toBe(true)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Actualizado OK',
        'success',
        undefined,
        3000
      )
    })

    it('should handle update failure from API response', async () => {
      // Arrange
      const id = 10
      const payload = createMockBudgetMovementForm()
      const mockResponse = createMockApiResponse(
        null,
        false,
        'Error de validación'
      )
      mockApiMethods.put.mockResolvedValue(mockResponse)

      // Act
      const result = await store._updateBudgetMovements(id, payload)

      // Assert
      expect(mockApiMethods.put).toHaveBeenCalledWith(
        `${URL_PATH}/update/${id}`,
        payload
      )
      expect(result).toBe(false)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Error de validación',
        'error',
        undefined,
        3000
      )
    })

    it('should handle network errors during update', async () => {
      // Arrange
      const id = 10
      const payload = createMockBudgetMovementForm({
        code_movement_id: null,
        increase_balance: false,
        decrease_balance: false,
      })
      const networkError = new Error('Network Error')
      mockApiMethods.put.mockRejectedValue(networkError)
      showCatchErrorMock.mockReturnValue('Update failed')

      // Act
      const result = await store._updateBudgetMovements(id, payload)

      // Assert
      expect(mockApiMethods.put).toHaveBeenCalledWith(
        `${URL_PATH}/update/${id}`,
        payload
      )
      expect(result).toBe(false)
      expect(showCatchErrorMock).toHaveBeenCalledWith(networkError)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Update failed',
        'error',
        undefined,
        3000
      )
    })
  })

  describe('_deleteAction', () => {
    it('should delete budget movement successfully', async () => {
      // Arrange
      const id = 5
      const mockResponse = createMockApiResponse(null, true, 'Eliminado')
      mockApiMethods.delete.mockResolvedValue(mockResponse)

      // Act
      const result = await store._deleteAction(id)

      // Assert
      expect(mockApiMethods.delete).toHaveBeenCalledWith(
        `${URL_PATH}/destroy/${id}`
      )
      expect(result).toBe(true)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Eliminado',
        'success',
        undefined,
        3000
      )
    })

    it('should handle delete failure from API response', async () => {
      // Arrange
      const id = 5
      const mockResponse = createMockApiResponse(
        null,
        false,
        'No se puede eliminar'
      )
      mockApiMethods.delete.mockResolvedValue(mockResponse)

      // Act
      const result = await store._deleteAction(id)

      // Assert
      expect(mockApiMethods.delete).toHaveBeenCalledWith(
        `${URL_PATH}/destroy/${id}`
      )
      expect(result).toBe(false)
      expect(showAlertMock).toHaveBeenCalledWith(
        'No se puede eliminar',
        'error',
        undefined,
        3000
      )
    })

    it('should handle network errors during delete', async () => {
      // Arrange
      const id = 5
      const networkError = new Error('Network Error')
      mockApiMethods.delete.mockRejectedValue(networkError)
      showCatchErrorMock.mockReturnValue('Delete failed')

      // Act
      const result = await store._deleteAction(id)

      // Assert
      expect(mockApiMethods.delete).toHaveBeenCalledWith(
        `${URL_PATH}/destroy/${id}`
      )
      expect(result).toBe(false)
      expect(showCatchErrorMock).toHaveBeenCalledWith(networkError)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Delete failed',
        'error',
        undefined,
        3000
      )
    })
  })

  describe('_downloadBudgetMovements', () => {
    it('should download budget movements successfully', async () => {
      // Arrange
      const mockBlobData = new Blob(['test data'], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const mockResponse = {
        data: mockBlobData,
        headers: {
          'content-type':
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'content-disposition': 'attachment; filename="budget-movements.xlsx"',
        },
      }
      mockApiMethods.get.mockResolvedValue(mockResponse)
      getNameBlobMock.mockReturnValue('budget-movements.xlsx')

      // Act
      await store._downloadBudgetMovements('filter[id]=123')

      // Assert
      expect(mockApiMethods.get).toHaveBeenCalledWith(
        `${URL_PATH}/export?filter[id]=123`,
        {
          responseType: 'blob',
        }
      )
      expect(getNameBlobMock).toHaveBeenCalledWith(mockResponse)
      expect(downloadBlobXlxxMock).toHaveBeenCalledTimes(1)
      const downloadCall = downloadBlobXlxxMock.mock.calls[0]
      expect(downloadCall[0]).toBeInstanceOf(Blob)
      expect(downloadCall[0].type).toBe(
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      )
      expect(downloadCall[1]).toBe('budget-movements.xlsx')
    })

    it('should handle download with empty parameters', async () => {
      // Arrange
      const mockBlobData = new Blob(['export data'], {
        type: 'application/vnd.ms-excel',
      })
      const mockResponse = {
        data: mockBlobData,
        headers: {
          'content-type': 'application/vnd.ms-excel',
          'content-disposition': 'attachment; filename="export.xls"',
        },
      }
      mockApiMethods.get.mockResolvedValue(mockResponse)
      getNameBlobMock.mockReturnValue('export.xls')

      // Act
      await store._downloadBudgetMovements('')

      // Assert
      expect(mockApiMethods.get).toHaveBeenCalledWith(`${URL_PATH}/export`, {
        responseType: 'blob',
      })
      expect(getNameBlobMock).toHaveBeenCalledWith(mockResponse)
      expect(downloadBlobXlxxMock).toHaveBeenCalledTimes(1)
      const downloadCall = downloadBlobXlxxMock.mock.calls[0]
      expect(downloadCall[0]).toBeInstanceOf(Blob)
      expect(downloadCall[0].type).toBe('application/vnd.ms-excel')
      expect(downloadCall[1]).toBe('export.xls')
    })

    it('should handle download errors', async () => {
      // Arrange
      const downloadError = new Error('Download Error')
      mockApiMethods.get.mockRejectedValue(downloadError)
      showCatchErrorMock.mockReturnValue('Error de descarga')

      // Act
      await store._downloadBudgetMovements('')

      // Assert
      expect(mockApiMethods.get).toHaveBeenCalledWith(`${URL_PATH}/export`, {
        responseType: 'blob',
      })
      expect(showCatchErrorMock).toHaveBeenCalledWith(downloadError)
      expect(showAlertMock).toHaveBeenCalledWith('Error de descarga', 'error')
      expect(getNameBlobMock).not.toHaveBeenCalled()
      expect(downloadBlobXlxxMock).not.toHaveBeenCalled()
    })

    it('should handle network errors during download', async () => {
      // Arrange
      const networkError = {
        response: {
          status: 500,
          data: { message: 'Server error' },
        },
      }
      mockApiMethods.get.mockRejectedValue(networkError)
      showCatchErrorMock.mockReturnValue('Error del servidor')

      // Act
      await store._downloadBudgetMovements('filter[level]=2')

      // Assert
      expect(mockApiMethods.get).toHaveBeenCalledWith(
        `${URL_PATH}/export?filter[level]=2`,
        {
          responseType: 'blob',
        }
      )
      expect(showCatchErrorMock).toHaveBeenCalledWith(networkError)
      expect(showAlertMock).toHaveBeenCalledWith('Error del servidor', 'error')
      expect(downloadBlobXlxxMock).not.toHaveBeenCalled()
    })
  })

  describe('_cleanData', () => {
    it('should clean all state data correctly', () => {
      // Arrange - Set some data first
      store.budget_movements_list = [
        createMockBudgetMovement({ id: 2, class: 'C' }),
      ]
      store.budget_movements_pages = { currentPage: 3, lastPage: 5 }
      store.budget_movements = createMockBudgetMovement({
        id: 3,
        class: 'D',
      })
      store.budget_movement_item = createMockBudgetMovement({
        id: 4,
        class: 'E',
      })

      // Act
      store._cleanData()

      // Assert
      expect(store.budget_movements_list).toEqual([])
      expect(store.budget_movements_pages).toEqual({
        currentPage: 0,
        lastPage: 0,
      })
      expect(store.budget_movements).toEqual({})
      expect(store.budget_movement_item).toBeNull()
    })

    it('should work correctly when state is already clean', () => {
      // Arrange - State is already clean from beforeEach

      // Act
      store._cleanData()

      // Assert
      expect(store.budget_movements_list).toEqual([])
      expect(store.budget_movements_pages).toEqual({
        currentPage: 0,
        lastPage: 0,
      })
      expect(store.budget_movements).toEqual({})
      expect(store.budget_movement_item).toBeNull()
    })
  })

  describe('_getBudgetMovementById', () => {
    it('should get budget movement by ID successfully', async () => {
      // Arrange
      const id = 1
      const mockBudgetMovement = createMockBudgetMovement({
        id,
        code_movement: createMockCodeMovement({
          movement_description: 'Movimiento 1',
        }),
      })
      const mockResponse = createMockApiResponse(
        mockBudgetMovement,
        true,
        'Movimiento obtenido exitosamente'
      )
      mockApiMethods.get.mockResolvedValue(mockResponse)

      // Act
      const result = await store._getBudgetMovementById(id)

      // Assert
      expect(mockApiMethods.get).toHaveBeenCalledWith(`${URL_PATH}/show/${id}`)
      expect(result).toBe(true)
      expect(store.budget_movement_item).toEqual(mockBudgetMovement)
    })

    it('should handle network errors when getting budget movement by ID', async () => {
      // Arrange
      const id = 1
      const networkError = new Error('Network Error')
      mockApiMethods.get.mockRejectedValue(networkError)
      showCatchErrorMock.mockReturnValue('Error de red')

      // Act
      const result = await store._getBudgetMovementById(id)

      // Assert
      expect(mockApiMethods.get).toHaveBeenCalledWith(`${URL_PATH}/show/${id}`)
      expect(result).toBe(false)
      expect(showCatchErrorMock).toHaveBeenCalledWith(networkError)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Error de red',
        'error',
        undefined,
        3000
      )
    })

    it('should handle unsuccessful response when getting budget movement by ID', async () => {
      // Arrange
      const id = 999
      const mockResponse = createMockApiResponse(
        null,
        false,
        'Movimiento no encontrado'
      )
      mockApiMethods.get.mockResolvedValue(mockResponse)

      // Act
      const result = await store._getBudgetMovementById(id)

      // Assert
      expect(mockApiMethods.get).toHaveBeenCalledWith(`${URL_PATH}/show/${id}`)
      expect(result).toBe(false)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Error al cargar el movimiento presupuestal',
        'error',
        undefined,
        3000
      )
    })

    it('should handle successful response with null data', async () => {
      // Arrange
      const id = 1
      const mockResponse = createMockApiResponse(null, true, 'Sin datos')
      mockApiMethods.get.mockResolvedValue(mockResponse)

      // Act
      const result = await store._getBudgetMovementById(id)

      // Assert
      expect(result).toBe(true)
      expect(store.budget_movement_item).toBeNull()
    })
  })

  describe('State Management Actions', () => {
    it('should set and clear editing item', () => {
      // Arrange
      const item = createMockBudgetMovement()

      // Act & Assert - Set editing item
      store._setEditingItem(item)
      expect(store.budget_movement_item).toEqual(item)

      // Act & Assert - Clear editing item
      store._clearEditingItem()
      expect(store.budget_movement_item).toBeNull()
    })

    it('should set selected budget level ID', () => {
      // Act & Assert - Set ID
      store._setSelectedBudgetLevel(5)
      expect(store.selected_budget_level_id).toBe(5)

      // Act & Assert - Clear ID
      store._setSelectedBudgetLevel(null)
      expect(store.selected_budget_level_id).toBeNull()
    })

    it('should set selected budget level item', () => {
      // Arrange
      const budgetLevel = createMockBudgetLevel({
        id: 5,
        description: 'Test Level',
      })

      // Act
      store._setSelectedBudgetLevelItem(budgetLevel)

      // Assert
      expect(store.selected_budget_level_item).toEqual(budgetLevel)
    })
  })

  describe('Edge Cases and Integration', () => {
    it('should handle multiple consecutive operations', async () => {
      // Arrange
      const mockBudgetMovements = [createMockBudgetMovement()]
      const createResponse = createMockApiResponse(null, true, 'Created')
      const listResponse = createMockApiResponse(
        createMockPaginatedResponse(mockBudgetMovements)
      )

      mockApiMethods.post.mockResolvedValue(createResponse)
      mockApiMethods.get.mockResolvedValue(listResponse)

      // Act
      const createResult = await store._createBudgetMovements([
        createMockBudgetMovementForm(),
      ])
      await store._getBudgetMovementsList('')

      // Assert
      expect(createResult).toBe(true)
      expect(store.budget_movements_list).toEqual(mockBudgetMovements)
    })

    it('should maintain state consistency after failed operations', async () => {
      // Arrange
      const initialList = [createMockBudgetMovement()]
      store.budget_movements_list = initialList

      const errorResponse = new Error('API Error')
      mockApiMethods.post.mockRejectedValue(errorResponse)
      showCatchErrorMock.mockReturnValue('Operation failed')

      // Act
      const result = await store._createBudgetMovements([
        createMockBudgetMovementForm(),
      ])

      // Assert
      expect(result).toBe(false)
      expect(store.budget_movements_list).toEqual(initialList) // State should remain unchanged
    })
  })
})
