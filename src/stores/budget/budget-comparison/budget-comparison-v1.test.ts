import { setActivePinia, createPinia } from 'pinia'
import { useBudgetComparisonStoreV1 } from '@/stores/budget/budget-comparison/budget-comparison-v1'
import { executeApi } from '@/apis'
import { IBudgetComparisonList } from '@/interfaces/customs/budget/BudgetComparison'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({ showCatchError: jest.fn(() => 'Error!') })),
  useUtils: jest.fn(),
}))

describe('useBudgetComparisonStoreV1 - Unit Tests (AAA Pattern)', () => {
  beforeEach(() => {
    // Arrange: Configurar Pinia antes de cada test
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  // Mock data para la respuesta de la API
  const mockBudgetComparisonApiResponse: IBudgetComparisonList = {
    rubro_recurso_area_id: '17|12|73',
    operation_log_ids: [21, 22, 23, 24, 25],
    rubro_presupuestal: '111',
    descripcion_rubro_presupuestal: 'pruebas',
    recurso: 'BR-8780',
    descripcion_recurso: 'AT EARUM DOLORIBUS DOLORIBUS IN EARUM.',
    area: 'SA-2532',
    descripcion_area: 'VOLUPTATIBUS ISTE.',
    vigencia_anterior_2015: {
      saldos_presupuestados: '0.00',
      saldos_ejecutados: '0.00',
    },
    vigencia_actual_2025: {
      saldos_presupuestados: '1000.00',
      saldos_ejecutados: '500.00',
    },
  }

  // Mock data para tabla (con _row_number)
  const mockBudgetComparisonTable: IBudgetComparisonList = {
    _row_number: 1,
    rubro_recurso_area_id: '17|12|73',
    operation_log_ids: [21, 22, 23, 24, 25],
    rubro_presupuestal: '111',
    descripcion_rubro_presupuestal: 'pruebas',
    recurso: 'BR-8780',
    descripcion_recurso: 'AT EARUM DOLORIBUS DOLORIBUS IN EARUM.',
    area: 'SA-2532',
    descripcion_area: 'VOLUPTATIBUS ISTE.',
    vigencia_anterior_2015: {
      saldos_presupuestados: '0.00',
      saldos_ejecutados: '0.00',
    },
    vigencia_actual_2025: {
      saldos_presupuestados: '1000.00',
      saldos_ejecutados: '500.00',
    },
  }

  describe('_listAction', () => {
    it('should fetch budget comparison list successfully', async () => {
      // Arrange
      const store = useBudgetComparisonStoreV1()
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Listado obtenido',
          data: [mockBudgetComparisonApiResponse],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._listAction('page=1&rows=10')

      // Assert
      expect(store.budget_comparison_list).toHaveLength(1)
      expect(store.budget_comparison_list[0]._row_number).toBe(1)
      expect(store.budget_comparison_list[0].rubro_presupuestal).toBe('111')
      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining('budget-comparison/list?page=1&rows=10')
      )
    })

    it('should add _row_number to each item starting from 1', async () => {
      // Arrange
      const store = useBudgetComparisonStoreV1()
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Listado obtenido',
          data: [
            mockBudgetComparisonApiResponse,
            { ...mockBudgetComparisonApiResponse, rubro_presupuestal: '222' },
            { ...mockBudgetComparisonApiResponse, rubro_presupuestal: '333' },
          ],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._listAction('page=1')

      // Assert
      expect(store.budget_comparison_list[0]._row_number).toBe(1)
      expect(store.budget_comparison_list[1]._row_number).toBe(2)
      expect(store.budget_comparison_list[2]._row_number).toBe(3)
    })

    it('should clear previous data before fetching new list', async () => {
      // Arrange
      const store = useBudgetComparisonStoreV1()
      store.budget_comparison_list = [mockBudgetComparisonTable]
      store.budget_comparison_pages = { currentPage: 2, lastPage: 3 }

      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Listado obtenido',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._listAction('page=1')

      // Assert
      expect(store.budget_comparison_list).toHaveLength(0)
      expect(store.budget_comparison_pages.currentPage).toBe(1)
      expect(store.budget_comparison_pages.lastPage).toBe(1)
    })

    it('should handle errors during list fetch', async () => {
      // Arrange
      const store = useBudgetComparisonStoreV1()
      const mockGet = jest.fn().mockRejectedValue(new Error('Network error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._listAction('page=1')

      // Assert
      expect(store.budget_comparison_list).toHaveLength(0)
    })

    it('should handle empty list response', async () => {
      // Arrange
      const store = useBudgetComparisonStoreV1()
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Sin registros',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._listAction('page=1')

      // Assert
      expect(store.budget_comparison_list).toHaveLength(0)
    })

    it('should handle response with dynamic vigencia keys', async () => {
      // Arrange
      const store = useBudgetComparisonStoreV1()
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Listado obtenido',
          data: [mockBudgetComparisonApiResponse],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._listAction('page=1')

      // Assert
      const item = store.budget_comparison_list[0] as Record<string, unknown>
      expect(item['vigencia_anterior_2015']).toEqual({
        saldos_presupuestados: '0.00',
        saldos_ejecutados: '0.00',
      })
      expect(item['vigencia_actual_2025']).toEqual({
        saldos_presupuestados: '1000.00',
        saldos_ejecutados: '500.00',
      })
    })
  })

  describe('_downloadExcelAction', () => {
    it('should download excel successfully when API responds', async () => {
      // Arrange
      const store = useBudgetComparisonStoreV1()

      const mockResponse = {
        data: 'fake-excel-content',
        headers: { 'content-type': 'application/vnd.ms-excel' },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Mock de utilidades
      const mockGetNameBlob = jest
        .fn()
        .mockReturnValue('comparativo-presupuestal.xlsx')
      const mockDownloadBlobXlxx = jest.fn()

      // Mock useUtils para que retorne las funciones mockeadas
      const { useUtils } = require('@/composables')
      ;(useUtils as jest.Mock).mockReturnValue({
        getNameBlob: mockGetNameBlob,
        downloadBlobXlxx: mockDownloadBlobXlxx,
      })

      // Act
      await store._downloadExcelAction(
        'filter[validity_range][validity_previous]=2015'
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining(
          'budget-comparison/export-excel?filter[validity_range][validity_previous]=2015'
        ),
        { responseType: 'blob' }
      )
      expect(mockGetNameBlob).toHaveBeenCalledWith(mockResponse)
      const firstCall = mockDownloadBlobXlxx.mock.calls[0]
      expect(firstCall).toBeDefined()
      const [blobArg, nameArg] = firstCall
      expect(blobArg).toBeInstanceOf(Blob)
      expect(nameArg).toBe('comparativo-presupuestal.xlsx')
    })

    it('should handle errors during excel download', async () => {
      // Arrange
      const store = useBudgetComparisonStoreV1()
      const mockGet = jest.fn().mockRejectedValue(new Error('Download error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act & Assert - no debería lanzar error
      await expect(store._downloadExcelAction('page=1')).resolves.not.toThrow()
    })

    it('should download excel with empty filters', async () => {
      // Arrange
      const store = useBudgetComparisonStoreV1()

      const mockResponse = {
        data: 'fake-excel-content',
        headers: { 'content-type': 'application/vnd.ms-excel' },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const mockGetNameBlob = jest
        .fn()
        .mockReturnValue('comparativo-presupuestal.xlsx')
      const mockDownloadBlobXlxx = jest.fn()

      const { useUtils } = require('@/composables')
      ;(useUtils as jest.Mock).mockReturnValue({
        getNameBlob: mockGetNameBlob,
        downloadBlobXlxx: mockDownloadBlobXlxx,
      })

      // Act
      await store._downloadExcelAction('')

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining('budget-comparison/export-excel?'),
        { responseType: 'blob' }
      )
    })
  })

  describe('_downloadPdfAction', () => {
    it('should download pdf successfully when API responds', async () => {
      // Arrange
      const store = useBudgetComparisonStoreV1()

      const mockResponse = {
        data: 'fake-pdf-content',
        headers: { 'content-type': 'application/pdf' },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Mock de utilidades
      const mockGetNameBlob = jest
        .fn()
        .mockReturnValue('comparativo-presupuestal.pdf')
      const mockDownloadBlobXlxx = jest.fn()

      // Mock useUtils para que retorne las funciones mockeadas
      const { useUtils } = require('@/composables')
      ;(useUtils as jest.Mock).mockReturnValue({
        getNameBlob: mockGetNameBlob,
        downloadBlobXlxx: mockDownloadBlobXlxx,
      })

      // Act
      await store._downloadPdfAction(
        'filter[validity_range][validity_current]=2025'
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining(
          'budget-comparison/export-pdf?filter[validity_range][validity_current]=2025'
        ),
        { responseType: 'blob' }
      )
      expect(mockGetNameBlob).toHaveBeenCalledWith(mockResponse)
      const firstCall = mockDownloadBlobXlxx.mock.calls[0]
      expect(firstCall).toBeDefined()
      const [blobArg, nameArg] = firstCall
      expect(blobArg).toBeInstanceOf(Blob)
      expect(nameArg).toBe('comparativo-presupuestal.pdf')
    })

    it('should handle errors during pdf download', async () => {
      // Arrange
      const store = useBudgetComparisonStoreV1()
      const mockGet = jest.fn().mockRejectedValue(new Error('Download error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act & Assert - no debería lanzar error
      await expect(store._downloadPdfAction('page=1')).resolves.not.toThrow()
    })

    it('should download pdf with empty filters', async () => {
      // Arrange
      const store = useBudgetComparisonStoreV1()

      const mockResponse = {
        data: 'fake-pdf-content',
        headers: { 'content-type': 'application/pdf' },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const mockGetNameBlob = jest
        .fn()
        .mockReturnValue('comparativo-presupuestal.pdf')
      const mockDownloadBlobXlxx = jest.fn()

      const { useUtils } = require('@/composables')
      ;(useUtils as jest.Mock).mockReturnValue({
        getNameBlob: mockGetNameBlob,
        downloadBlobXlxx: mockDownloadBlobXlxx,
      })

      // Act
      await store._downloadPdfAction('')

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining('budget-comparison/export-pdf?'),
        { responseType: 'blob' }
      )
    })
  })

  describe('_clearData', () => {
    it('should clear all list data and reset pagination', () => {
      // Arrange
      const store = useBudgetComparisonStoreV1()
      store.budget_comparison_list = [mockBudgetComparisonTable]
      store.budget_comparison_pages = { currentPage: 3, lastPage: 10 }

      // Act
      store._clearData()

      // Assert
      expect(store.budget_comparison_list).toHaveLength(0)
      expect(store.budget_comparison_pages.currentPage).toBe(1)
      expect(store.budget_comparison_pages.lastPage).toBe(1)
    })

    it('should work correctly when data is already empty', () => {
      // Arrange
      const store = useBudgetComparisonStoreV1()

      // Act
      store._clearData()

      // Assert
      expect(store.budget_comparison_list).toHaveLength(0)
      expect(store.budget_comparison_pages.currentPage).toBe(1)
      expect(store.budget_comparison_pages.lastPage).toBe(1)
    })
  })

  describe('State initialization', () => {
    it('should initialize with correct default state', () => {
      // Arrange & Act
      const store = useBudgetComparisonStoreV1()

      // Assert
      expect(store.version).toBe('v1')
      expect(store.budget_comparison_list).toEqual([])
      expect(store.budget_comparison_pages).toEqual({
        currentPage: 1,
        lastPage: 1,
      })
    })
  })

  describe('Integration scenarios', () => {
    it('should handle complete list and download workflow', async () => {
      // Arrange
      const store = useBudgetComparisonStoreV1()

      const mockGet = jest
        .fn()
        .mockResolvedValueOnce({
          data: {
            success: true,
            message: 'Listado obtenido',
            data: [mockBudgetComparisonApiResponse],
          },
        })
        .mockResolvedValueOnce({
          data: 'fake-excel-content',
          headers: { 'content-type': 'application/vnd.ms-excel' },
        })
        .mockResolvedValueOnce({
          data: 'fake-pdf-content',
          headers: { 'content-type': 'application/pdf' },
        })

      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const mockGetNameBlob = jest.fn().mockReturnValue('archivo.xlsx')
      const mockDownloadBlobXlxx = jest.fn()

      const { useUtils } = require('@/composables')
      ;(useUtils as jest.Mock).mockReturnValue({
        getNameBlob: mockGetNameBlob,
        downloadBlobXlxx: mockDownloadBlobXlxx,
      })

      // Act & Assert - List
      await store._listAction('page=1')
      expect(store.budget_comparison_list).toHaveLength(1)
      expect(store.budget_comparison_list[0]._row_number).toBe(1)

      // Act & Assert - Download Excel
      await store._downloadExcelAction('filter[business]=1')
      expect(mockDownloadBlobXlxx).toHaveBeenCalled()

      // Act & Assert - Download PDF
      await store._downloadPdfAction('filter[business]=1')
      expect(mockDownloadBlobXlxx).toHaveBeenCalledTimes(2)
    })

    it('should clear data before each new list request', async () => {
      // Arrange
      const store = useBudgetComparisonStoreV1()
      store.budget_comparison_list = [
        mockBudgetComparisonTable,
        mockBudgetComparisonTable,
      ]

      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Listado obtenido',
          data: [mockBudgetComparisonApiResponse],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._listAction('page=1')

      // Assert - Solo debe tener 1 elemento (el nuevo), no 3
      expect(store.budget_comparison_list).toHaveLength(1)
    })
  })
})
