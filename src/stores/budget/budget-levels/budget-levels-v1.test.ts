import { setActivePinia, createPinia } from 'pinia'
import { useBudgetLevelsStoreV1 } from './budget-levels-v1'
import { URL_PATH_BUDGET } from '@/constants/apis'
import { IBudgetLevelsList } from '@/interfaces/customs/budget/BudgetLevels'

const URL_PATH = `${URL_PATH_BUDGET}/budget-levels`

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
  data: IBudgetLevelsList[],
  currentPage = 1,
  lastPage = 1
): PaginatedData<IBudgetLevelsList> => ({
  current_page: currentPage,
  data,
  last_page: lastPage,
  per_page: 20,
})

describe('useBudgetLevelsStoreV1 Store', () => {
  let store: ReturnType<typeof useBudgetLevelsStoreV1>
  let showAlertMock: jest.Mock
  let showCatchErrorMock: jest.Mock
  let getNameBlobMock: jest.Mock
  let downloadBlobXlxxMock: jest.Mock

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useBudgetLevelsStoreV1()

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
      expect(store.budget_level_list).toEqual([])
      expect(store.budget_level_pages).toEqual({
        currentPage: 0,
        lastPage: 0,
      })
      expect(store.budget_level).toEqual({})
    })
  })

  describe('_getBudgetLevelsList', () => {
    it('should fetch and update state with parameters including initial &', async () => {
      // Arrange
      const mockBudgetLevels = [
        createMockBudgetLevel({ id: 1, description: 'Nivel 1' }),
        createMockBudgetLevel({
          id: 2,
          level: 2,
          description: 'Nivel 2',
          class: 'inactive',
        }),
      ]
      const paginatedData = createMockPaginatedResponse(mockBudgetLevels, 2, 3)
      const mockResponse = createMockApiResponse(
        paginatedData,
        true,
        'Listado obtenido exitosamente.'
      )
      mockApiMethods.get.mockResolvedValue(mockResponse)
      const params = '&filter[search]=test'

      // Act
      await store._getBudgetLevelsList(params)

      // Assert
      expect(mockApiMethods.get).toHaveBeenCalledWith(
        `${URL_PATH}/list?paginate=true${params}`
      )
      expect(store.budget_level_list).toEqual(mockBudgetLevels)
      expect(store.budget_level_pages.currentPage).toBe(2)
      expect(store.budget_level_pages.lastPage).toBe(3)
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
      await store._getBudgetLevelsList('filter[search]=x')

      // Assert
      expect(mockApiMethods.get).toHaveBeenCalledWith(
        `${URL_PATH}/list?paginate=true&filter[search]=x`
      )
    })

    it('should handle empty parameters', async () => {
      // Arrange
      const paginatedData = createMockPaginatedResponse([])
      const mockResponse = createMockApiResponse(paginatedData, true, 'OK')
      mockApiMethods.get.mockResolvedValue(mockResponse)

      // Act
      await store._getBudgetLevelsList('')

      // Assert
      expect(mockApiMethods.get).toHaveBeenCalledWith(
        `${URL_PATH}/list?paginate=true`
      )
    })

    it('should handle null/undefined parameters', async () => {
      // Arrange
      const paginatedData = createMockPaginatedResponse([])
      const mockResponse = createMockApiResponse(paginatedData, true, 'OK')
      mockApiMethods.get.mockResolvedValue(mockResponse)

      // Act
      await store._getBudgetLevelsList(undefined as unknown as string)

      // Assert
      expect(mockApiMethods.get).toHaveBeenCalledWith(
        `${URL_PATH}/list?paginate=true`
      )
    })

    it('should handle network errors and clean state', async () => {
      // Arrange
      const networkError = new Error('Network Error')
      mockApiMethods.get.mockRejectedValue(networkError)
      showCatchErrorMock.mockReturnValue('Network connection failed')

      // Act
      await store._getBudgetLevelsList('&filter[search]=fail')

      // Assert
      expect(mockApiMethods.get).toHaveBeenCalledWith(
        `${URL_PATH}/list?paginate=true&filter[search]=fail`
      )
      expect(store.budget_level_list).toEqual([])
      expect(store.budget_level_pages).toEqual({ currentPage: 0, lastPage: 0 })
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
      await store._getBudgetLevelsList('')

      // Assert
      expect(store.budget_level_list).toEqual([])
      expect(store.budget_level_pages.currentPage).toBe(0)
      expect(store.budget_level_pages.lastPage).toBe(0)
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
      await store._getBudgetLevelsList('')

      // Assert
      expect(showAlertMock).toHaveBeenCalledWith(
        'Error en la consulta',
        'error',
        undefined,
        3000
      )
    })
  })

  describe('_createBudgetLevels', () => {
    it('should create budget level successfully', async () => {
      // Arrange
      const payload = createMockBudgetLevel({
        id: 0,
        description: 'Nivel demo',
      })
      const mockResponse = createMockApiResponse(null, true, 'Creado OK')
      mockApiMethods.post.mockResolvedValue(mockResponse)

      // Act
      const result = await store._createBudgetLevels(payload)

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
      const payload = createMockBudgetLevel({ id: 0 })
      const mockResponse = createMockApiResponse(
        null,
        false,
        'Error de validación'
      )
      mockApiMethods.post.mockResolvedValue(mockResponse)

      // Act
      const result = await store._createBudgetLevels(payload)

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
      const payload = createMockBudgetLevel({ id: 0 })
      const networkError = new Error('Network failure')
      mockApiMethods.post.mockRejectedValue(networkError)
      showCatchErrorMock.mockReturnValue('Connection error')

      // Act
      const result = await store._createBudgetLevels(payload)

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
  })

  describe('_updateBudgetLevels', () => {
    it('should update budget level successfully', async () => {
      // Arrange
      const id = 1
      const payload = createMockBudgetLevel({ id, description: 'Nuevo' })
      const mockResponse = createMockApiResponse(null, true, 'Actualizado OK')
      mockApiMethods.put.mockResolvedValue(mockResponse)

      // Act
      const result = await store._updateBudgetLevels(id, payload)

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
      const id = 1
      const payload = createMockBudgetLevel({ id })
      const mockResponse = createMockApiResponse(
        null,
        false,
        'Error de validación'
      )
      mockApiMethods.put.mockResolvedValue(mockResponse)

      // Act
      const result = await store._updateBudgetLevels(id, payload)

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
      const id = 1
      const payload = createMockBudgetLevel({
        id,
        level: 2,
        description: 'Sin cambios',
        class: 'inactive',
      })
      const networkError = new Error('Network Error')
      mockApiMethods.put.mockRejectedValue(networkError)
      showCatchErrorMock.mockReturnValue('Update failed')

      // Act
      const result = await store._updateBudgetLevels(id, payload)

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
    it('should delete budget level successfully', async () => {
      // Arrange
      const id = 10
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
      const id = 10
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
      const id = 10
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

  describe('_downloadBudgetLevelsReceipt', () => {
    it('should download budget levels receipt successfully', async () => {
      // Arrange
      const mockBlobData = new Blob(['test data'], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const mockResponse = {
        data: mockBlobData,
        headers: {
          'content-type':
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'content-disposition': 'attachment; filename="budget-levels.xlsx"',
        },
      }
      mockApiMethods.get.mockResolvedValue(mockResponse)
      getNameBlobMock.mockReturnValue('budget-levels.xlsx')

      // Act
      await store._downloadBudgetLevelsReceipt('ids[0]=123')

      // Assert
      expect(mockApiMethods.get).toHaveBeenCalledWith(
        `${URL_PATH}/export?ids[0]=123`,
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
      expect(downloadCall[1]).toBe('budget-levels.xlsx')
    })

    it('should handle download with different file name', async () => {
      // Arrange
      const mockBlobData = new Blob(['export data'], {
        type: 'application/vnd.ms-excel',
      })
      const mockResponse = {
        data: mockBlobData,
        headers: {
          'content-type': 'application/vnd.ms-excel',
          'content-disposition': 'attachment; filename="export-2023.xls"',
        },
      }
      mockApiMethods.get.mockResolvedValue(mockResponse)
      getNameBlobMock.mockReturnValue('export-2023.xls')

      // Act
      await store._downloadBudgetLevelsReceipt('filter[year]=2023')

      // Assert
      expect(mockApiMethods.get).toHaveBeenCalledWith(
        `${URL_PATH}/export?filter[year]=2023`,
        {
          responseType: 'blob',
        }
      )
      expect(getNameBlobMock).toHaveBeenCalledWith(mockResponse)
      expect(downloadBlobXlxxMock).toHaveBeenCalledTimes(1)
      const downloadCall = downloadBlobXlxxMock.mock.calls[0]
      expect(downloadCall[0]).toBeInstanceOf(Blob)
      expect(downloadCall[0].type).toBe('application/vnd.ms-excel')
      expect(downloadCall[1]).toBe('export-2023.xls')
    })

    it('should handle download errors', async () => {
      // Arrange
      const downloadError = new Error('Download failed')
      mockApiMethods.get.mockRejectedValue(downloadError)
      showCatchErrorMock.mockReturnValue('Download error occurred')

      // Act
      await store._downloadBudgetLevelsReceipt('ids[0]=123')

      // Assert
      expect(mockApiMethods.get).toHaveBeenCalledWith(
        `${URL_PATH}/export?ids[0]=123`,
        {
          responseType: 'blob',
        }
      )
      expect(showCatchErrorMock).toHaveBeenCalledWith(downloadError)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Download error occurred',
        'error'
      )
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
      await store._downloadBudgetLevelsReceipt('ids[0]=1&ids[1]=2')

      // Assert
      expect(showCatchErrorMock).toHaveBeenCalledWith(networkError)
      expect(showAlertMock).toHaveBeenCalledWith('Error del servidor', 'error')
      expect(downloadBlobXlxxMock).not.toHaveBeenCalled()
    })
  })

  describe('_cleanData', () => {
    it('should clean all state data correctly', () => {
      // Arrange - Set some data first
      store.budget_level_list = [createMockBudgetLevel({ description: 'x' })]
      store.budget_level_pages = { currentPage: 5, lastPage: 9 }
      store.budget_level = createMockBudgetLevel({
        id: 9,
        level: 0,
        description: 'y',
        class: 'inactive',
      })

      // Act
      store._cleanData()

      // Assert
      expect(store.budget_level_list).toEqual([])
      expect(store.budget_level_pages).toEqual({ currentPage: 0, lastPage: 0 })
      expect(store.budget_level).toEqual({})
    })

    it('should work correctly when state is already clean', () => {
      // Arrange - State is already clean from beforeEach

      // Act
      store._cleanData()

      // Assert
      expect(store.budget_level_list).toEqual([])
      expect(store.budget_level_pages).toEqual({ currentPage: 0, lastPage: 0 })
      expect(store.budget_level).toEqual({})
    })
  })

  describe('_getBudgetLevelById', () => {
    it('should get budget level by ID successfully', async () => {
      // Arrange
      const id = 1
      const mockBudgetLevel = createMockBudgetLevel({
        id,
        description: 'Nivel 1',
      })
      const mockResponse = createMockApiResponse(
        mockBudgetLevel,
        true,
        'Nivel obtenido exitosamente'
      )
      mockApiMethods.get.mockResolvedValue(mockResponse)

      // Act
      const result = await store._getBudgetLevelById(id)

      // Assert
      expect(mockApiMethods.get).toHaveBeenCalledWith(`${URL_PATH}/show/${id}`)
      expect(result).toBe(true)
      expect(store.budget_level).toEqual(mockBudgetLevel)
    })

    it('should handle network errors when getting budget level by ID', async () => {
      // Arrange
      const id = 1
      const networkError = new Error('Network Error')
      mockApiMethods.get.mockRejectedValue(networkError)
      showCatchErrorMock.mockReturnValue('Error de red')

      // Act
      const result = await store._getBudgetLevelById(id)

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

    it('should handle unsuccessful response when getting budget level by ID', async () => {
      // Arrange
      const id = 999
      const mockResponse = createMockApiResponse(
        null,
        false,
        'Nivel no encontrado'
      )
      mockApiMethods.get.mockResolvedValue(mockResponse)

      // Act
      const result = await store._getBudgetLevelById(id)

      // Assert
      expect(mockApiMethods.get).toHaveBeenCalledWith(`${URL_PATH}/show/${id}`)
      expect(result).toBe(false)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Error al cargar el nivel presupuestal',
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
      const result = await store._getBudgetLevelById(id)

      // Assert
      expect(result).toBe(true)
      expect(store.budget_level).toEqual({})
    })
  })

  describe('Edge Cases and Integration', () => {
    it('should handle multiple consecutive operations', async () => {
      // Arrange
      const mockBudgetLevel = createMockBudgetLevel()
      const createResponse = createMockApiResponse(null, true, 'Created')
      const listResponse = createMockApiResponse(
        createMockPaginatedResponse([mockBudgetLevel])
      )

      mockApiMethods.post.mockResolvedValue(createResponse)
      mockApiMethods.get.mockResolvedValue(listResponse)

      // Act
      const createResult = await store._createBudgetLevels(mockBudgetLevel)
      await store._getBudgetLevelsList('')

      // Assert
      expect(createResult).toBe(true)
      expect(store.budget_level_list).toEqual([mockBudgetLevel])
    })

    it('should maintain state consistency after failed operations', async () => {
      // Arrange
      const initialList = [createMockBudgetLevel()]
      store.budget_level_list = initialList

      const errorResponse = new Error('API Error')
      mockApiMethods.post.mockRejectedValue(errorResponse)
      showCatchErrorMock.mockReturnValue('Operation failed')

      // Act
      const result = await store._createBudgetLevels(
        createMockBudgetLevel({ id: 0 })
      )

      // Assert
      expect(result).toBe(false)
      expect(store.budget_level_list).toEqual(initialList) // State should remain unchanged
    })
  })
})
