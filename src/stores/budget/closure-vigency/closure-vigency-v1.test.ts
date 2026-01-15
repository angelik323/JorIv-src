import { setActivePinia, createPinia } from 'pinia'
import { useClosureVigencyStoreV1 } from '@/stores/budget/closure-vigency/closure-vigency-v1'
import { executeApi } from '@/apis'
import type {
  IClosureVigencyRow,
  IBusinessForClosure,
  IClosureVigencyCreatePayload,
  IClosureVigencyExecutionResult,
  IClosureVigencyConfirmPayload,
  IClosureVigency,
  IClosureVigencyDetail,
  IProcessedBusiness,
  IBusinessDocument,
} from '@/interfaces/customs/budget/ClosureVigency'

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
  useUtils: jest.fn(() => ({
    getNameBlob: jest.fn(() => 'reporte.xlsx'),
    downloadBlobXlxx: jest.fn(),
  })),
}))

describe('useClosureVigencyStoreV1 - Unit Tests (AAA Pattern)', () => {
  beforeEach(() => {
    // Arrange: Configurar Pinia antes de cada test
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  // Mock data para listado
  const mockClosureVigencyRow: IClosureVigencyRow = {
    id: 1,
    process_number: 'EXE-2026-001',
    vigency: 2026,
    action_type: 'close',
    status: 'Exitoso',
    process_date: '2026/01/14',
    process_time: '10:00 am',
    user_name: 'Usuario Test',
    _row_number: 1,
  }

  // Mock data para negocios de cierre
  const mockBusinessForClosure: IBusinessForClosure = {
    id: 1,
    code: '25123',
    name: 'Zona Ocho Sports',
    closure_type: 'Diario',
    document_type_code: 'CDP',
    document_type_name: 'Certificado de Disponibilidad',
    document_number: '65',
    last_closed_vigency: 2025,
    selected: false,
  }

  // Mock data para payload de creación
  const mockClosureVigencyCreatePayload: IClosureVigencyCreatePayload = {
    action_type: 'close',
    close_by: 'business',
    vigency: 2026,
    business_trusts: [1, 2, 3],
  }

  // Mock data para resultado de ejecución
  const mockExecutionResult: IClosureVigencyExecutionResult = {
    execution_id: 'EXE-2026-001',
    action_type: 'close',
    close_by: 'business',
    vigency: 2026,
    business_from_id: 1,
    business_from_code: '25123',
    business_from_name: 'Zona Ocho Sports',
    business_to_id: 100,
    business_to_code: '25223',
    business_to_name: 'Zona Final Sports',
    has_errors: false,
    details: [],
  }

  // Mock data para confirmación
  const mockConfirmPayload: IClosureVigencyConfirmPayload = {
    execution_id: 'EXE-2026-001',
    process_partial: false,
  }

  // Mock data para detalle de proceso
  const mockProcessDetail: IClosureVigencyDetail = {
    id: 1,
    process_number: 'EXE-2026-001',
    vigency: 2026,
    action_type: 'close',
    status: 'Exitoso',
    user_name: 'Usuario Test',
    process_date: '2026-01-14 10:00:00 AM',
    has_errors: false,
  }

  // Mock data para negocio procesado
  const mockProcessedBusiness: IProcessedBusiness = {
    id: 1,
    code: '25123',
    name: 'Zona Ocho Sports',
    closure_type: 'Diario',
    last_closed_vigency: 2025,
    status: 'Exitoso',
    _row_number: 1,
    selected: false,
  }

  // Mock data para documento de negocio
  const mockBusinessDocument: IBusinessDocument = {
    id: 1,
    document_type_code: 'CDP',
    document_type_name: 'Certificado de Disponibilidad',
    document_number: '65',
    last_closed_vigency: 2025,
    balance: 1000000,
    value: 500000,
    status: 'Exitoso',
    _row_number: 1,
  }

  describe('_listAction', () => {
    it('should fetch closure vigency list successfully', async () => {
      // Arrange
      const store = useClosureVigencyStoreV1()
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Listado obtenido',
          data: {
            data: [mockClosureVigencyRow],
            current_page: 1,
            last_page: 5,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._listAction({ page: 1, rows: 10 })

      // Assert
      expect(store.closure_vigency_list).toHaveLength(1)
      expect(store.closure_vigency_list[0]).toMatchObject(mockClosureVigencyRow)
      expect(store.closure_vigency_pages.currentPage).toBe(1)
      expect(store.closure_vigency_pages.lastPage).toBe(5)
    })

    it('should clear previous data before fetching new list', async () => {
      // Arrange
      const store = useClosureVigencyStoreV1()
      store.closure_vigency_list = [mockClosureVigencyRow]
      store.closure_vigency_pages = { currentPage: 2, lastPage: 3 }

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
      await store._listAction({ page: 1 })

      // Assert
      expect(store.closure_vigency_list).toHaveLength(0)
      expect(store.closure_vigency_pages.currentPage).toBe(1)
      expect(store.closure_vigency_pages.lastPage).toBe(1)
    })

    it('should handle errors during list fetch', async () => {
      // Arrange
      const store = useClosureVigencyStoreV1()
      const mockGet = jest.fn().mockRejectedValue(new Error('Network error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._listAction({ page: 1 })

      // Assert
      expect(store.closure_vigency_list).toHaveLength(0)
    })
  })

  describe('_showAction', () => {
    it('should fetch closure vigency by id successfully', async () => {
      // Arrange
      const store = useClosureVigencyStoreV1()
      const mockData: IClosureVigency = {
        id: 1,
        action_type: 'close',
        vigency: 2026,
        status: 'Exitoso',
      }
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Proceso encontrado',
          data: mockData,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const result = await store._showAction('1')

      // Assert
      expect(result).toEqual(mockData)
      expect(store.selected_closure_vigency).toEqual(mockData)
    })

    it('should return null when process not found', async () => {
      // Arrange
      const store = useClosureVigencyStoreV1()
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'No encontrado',
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const result = await store._showAction('999')

      // Assert
      expect(result).toBeNull()
    })

    it('should handle errors during show fetch', async () => {
      // Arrange
      const store = useClosureVigencyStoreV1()
      const mockGet = jest.fn().mockRejectedValue(new Error('Network error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const result = await store._showAction('1')

      // Assert
      expect(result).toBeNull()
    })
  })

  describe('_listBusinessTrustInRangeAction', () => {
    it('should fetch businesses for closure successfully', async () => {
      // Arrange
      const store = useClosureVigencyStoreV1()
      const mockApiResponse = {
        '#': 1,
        business_trust: '25123 - Zona Ocho Sports',
        closing_type: 'daily',
        document_type: 'CDP',
        document_number: 65,
        last_closing_date: '2025-12-31',
      }
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Negocios encontrados',
          data: {
            data: [mockApiResponse],
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const result = await store._listBusinessTrustInRangeAction({
        vigency: 2026,
        business_trust_from_id: 1,
        business_trust_to_id: 100,
      })

      // Assert
      expect(result).toBe(true)
      expect(store.businesses_for_closure).toHaveLength(1)
      expect(store.businesses_for_closure[0]).toMatchObject({
        id: 1,
        code: '25123',
        name: 'Zona Ocho Sports',
        selected: false,
      })
    })

    it('should clear previous businesses before fetching', async () => {
      // Arrange
      const store = useClosureVigencyStoreV1()
      store.businesses_for_closure = [mockBusinessForClosure]

      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Sin negocios',
          data: { data: [] },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const result = await store._listBusinessTrustInRangeAction({
        vigency: 2026,
      })

      // Assert
      expect(store.businesses_for_closure).toHaveLength(0)
      expect(result).toBe(true)
    })

    it('should return false when fetch fails', async () => {
      // Arrange
      const store = useClosureVigencyStoreV1()
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'Error al buscar',
          data: { data: [] },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const result = await store._listBusinessTrustInRangeAction({
        vigency: 2026,
      })

      // Assert
      expect(result).toBe(false)
    })

    it('should handle errors during fetch', async () => {
      // Arrange
      const store = useClosureVigencyStoreV1()
      const mockGet = jest.fn().mockRejectedValue(new Error('Network error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const result = await store._listBusinessTrustInRangeAction({
        vigency: 2026,
      })

      // Assert
      expect(result).toBe(false)
    })
  })

  describe('_executeClosureAction', () => {
    it('should execute closure process successfully', async () => {
      // Arrange
      const store = useClosureVigencyStoreV1()
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Proceso iniciado',
          data: mockExecutionResult,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._executeClosureAction(
        mockClosureVigencyCreatePayload
      )

      // Assert
      expect(result).toEqual(mockExecutionResult)
      expect(store.execution_result).toEqual(mockExecutionResult)
      expect(mockPost).toHaveBeenCalledWith(
        expect.stringContaining('budget-year-closing'),
        mockClosureVigencyCreatePayload
      )
    })

    it('should return null when execution fails', async () => {
      // Arrange
      const store = useClosureVigencyStoreV1()
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'Error al ejecutar',
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._executeClosureAction(
        mockClosureVigencyCreatePayload
      )

      // Assert
      expect(result).toBeNull()
    })

    it('should handle errors during execution', async () => {
      // Arrange
      const store = useClosureVigencyStoreV1()
      const mockPost = jest.fn().mockRejectedValue(new Error('Network error'))
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._executeClosureAction(
        mockClosureVigencyCreatePayload
      )

      // Assert
      expect(result).toBeNull()
    })
  })

  describe('_confirmClosureAction', () => {
    it('should confirm closure process successfully', async () => {
      // Arrange
      const store = useClosureVigencyStoreV1()
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Proceso confirmado',
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._confirmClosureAction(mockConfirmPayload)

      // Assert
      expect(result).toBe(true)
      expect(mockPost).toHaveBeenCalledWith(
        expect.stringContaining('confirm'),
        mockConfirmPayload
      )
    })

    it('should return false when confirmation fails', async () => {
      // Arrange
      const store = useClosureVigencyStoreV1()
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'Error al confirmar',
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._confirmClosureAction(mockConfirmPayload)

      // Assert
      expect(result).toBe(false)
    })

    it('should handle errors during confirmation', async () => {
      // Arrange
      const store = useClosureVigencyStoreV1()
      const mockPost = jest.fn().mockRejectedValue(new Error('Network error'))
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._confirmClosureAction(mockConfirmPayload)

      // Assert
      expect(result).toBe(false)
    })
  })

  describe('_downloadErrorReportAction', () => {
    it('should download error report successfully', async () => {
      // Arrange
      const store = useClosureVigencyStoreV1()
      const mockResponse = {
        data: 'fake-excel-content',
        headers: { 'content-type': 'application/vnd.ms-excel' },
      }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const mockGetNameBlob = jest.fn().mockReturnValue('reporte-errores.xlsx')
      const mockDownloadBlobXlxx = jest.fn()

      const { useUtils } = require('@/composables')
      ;(useUtils as jest.Mock).mockReturnValue({
        getNameBlob: mockGetNameBlob,
        downloadBlobXlxx: mockDownloadBlobXlxx,
      })

      // Act
      await store._downloadErrorReportAction('1')

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining('error-report'),
        { responseType: 'blob' }
      )
      expect(mockDownloadBlobXlxx).toHaveBeenCalled()
    })

    it('should handle errors during download', async () => {
      // Arrange
      const store = useClosureVigencyStoreV1()
      const mockGet = jest.fn().mockRejectedValue(new Error('Download error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act & Assert
      await expect(store._downloadErrorReportAction('1')).resolves.not.toThrow()
    })
  })

  describe('_getProcessDetailAction', () => {
    it('should fetch process detail successfully', async () => {
      // Arrange
      const store = useClosureVigencyStoreV1()
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Detalle obtenido',
          data: mockProcessDetail,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const result = await store._getProcessDetailAction('1')

      // Assert
      expect(result).toEqual(mockProcessDetail)
      expect(store.process_detail).toEqual(mockProcessDetail)
    })

    it('should return null when detail not found', async () => {
      // Arrange
      const store = useClosureVigencyStoreV1()
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'No encontrado',
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const result = await store._getProcessDetailAction('999')

      // Assert
      expect(result).toBeNull()
    })
  })

  describe('_listProcessedBusinessesAction', () => {
    it('should fetch processed businesses successfully', async () => {
      // Arrange
      const store = useClosureVigencyStoreV1()
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Negocios procesados',
          data: {
            data: [mockProcessedBusiness],
            current_page: 1,
            last_page: 2,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._listProcessedBusinessesAction('1', { page: 1 })

      // Assert
      expect(store.processed_businesses).toHaveLength(1)
      expect(store.processed_businesses[0]).toMatchObject(mockProcessedBusiness)
      expect(store.processed_businesses_pages.currentPage).toBe(1)
      expect(store.processed_businesses_pages.lastPage).toBe(2)
    })
  })

  describe('_listBusinessDocumentsAction', () => {
    it('should fetch business documents successfully', async () => {
      // Arrange
      const store = useClosureVigencyStoreV1()
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Documentos obtenidos',
          data: {
            data: [mockBusinessDocument],
            current_page: 1,
            last_page: 3,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._listBusinessDocumentsAction('1', '1', { page: 1 })

      // Assert
      expect(store.business_documents).toHaveLength(1)
      expect(store.business_documents[0]).toMatchObject(mockBusinessDocument)
      expect(store.business_documents_pages.currentPage).toBe(1)
      expect(store.business_documents_pages.lastPage).toBe(3)
    })
  })

  describe('_clearData', () => {
    it('should clear all list data and reset pagination', () => {
      // Arrange
      const store = useClosureVigencyStoreV1()
      store.closure_vigency_list = [mockClosureVigencyRow]
      store.closure_vigency_pages = { currentPage: 3, lastPage: 10 }
      store.selected_closure_vigency = { id: 1 } as IClosureVigency

      // Act
      store._clearData()

      // Assert
      expect(store.closure_vigency_list).toHaveLength(0)
      expect(store.closure_vigency_pages.currentPage).toBe(1)
      expect(store.closure_vigency_pages.lastPage).toBe(1)
      expect(store.selected_closure_vigency).toBeNull()
    })
  })

  describe('_clearBusinessesForClosure', () => {
    it('should clear businesses for closure', () => {
      // Arrange
      const store = useClosureVigencyStoreV1()
      store.businesses_for_closure = [mockBusinessForClosure]

      // Act
      store._clearBusinessesForClosure()

      // Assert
      expect(store.businesses_for_closure).toHaveLength(0)
    })
  })

  describe('_clearExecutionResult', () => {
    it('should clear execution result', () => {
      // Arrange
      const store = useClosureVigencyStoreV1()
      store.execution_result = mockExecutionResult

      // Act
      store._clearExecutionResult()

      // Assert
      expect(store.execution_result).toBeNull()
    })
  })

  describe('_clearViewData', () => {
    it('should clear all view-related data', () => {
      // Arrange
      const store = useClosureVigencyStoreV1()
      store.process_detail = mockProcessDetail
      store.processed_businesses = [mockProcessedBusiness]
      store.business_documents = [mockBusinessDocument]
      store.processed_businesses_pages = { currentPage: 2, lastPage: 5 }
      store.business_documents_pages = { currentPage: 3, lastPage: 8 }

      // Act
      store._clearViewData()

      // Assert
      expect(store.process_detail).toBeNull()
      expect(store.processed_businesses).toHaveLength(0)
      expect(store.business_documents).toHaveLength(0)
      expect(store.processed_businesses_pages).toEqual({
        currentPage: 1,
        lastPage: 1,
      })
      expect(store.business_documents_pages).toEqual({
        currentPage: 1,
        lastPage: 1,
      })
    })
  })

  describe('State initialization', () => {
    it('should initialize with correct default state', () => {
      // Arrange & Act
      const store = useClosureVigencyStoreV1()

      // Assert
      expect(store.version).toBe('v1')
      expect(store.closure_vigency_list).toEqual([])
      expect(store.closure_vigency_pages).toEqual({
        currentPage: 1,
        lastPage: 1,
      })
      expect(store.selected_closure_vigency).toBeNull()
      expect(store.businesses_for_closure).toEqual([])
      expect(store.execution_result).toBeNull()
      expect(store.process_detail).toBeNull()
      expect(store.processed_businesses).toEqual([])
      expect(store.business_documents).toEqual([])
    })
  })

  describe('Integration scenarios', () => {
    it('should handle complete closure workflow', async () => {
      // Arrange
      const store = useClosureVigencyStoreV1()

      // Mock List Businesses
      const mockGetBusinesses = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Negocios encontrados',
          data: {
            data: [
              {
                '#': 1,
                business_trust: '25123 - Zona Ocho Sports',
                closing_type: 'daily',
                document_type: 'CDP',
                document_number: 65,
                last_closing_date: '2025-12-31',
              },
            ],
          },
        },
      })

      // Mock Execute
      const mockPostExecute = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Proceso iniciado',
          data: mockExecutionResult,
        },
      })

      // Mock Confirm
      const mockPostConfirm = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Proceso confirmado',
        },
      })

      // Mock List
      const mockGetList = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Listado',
          data: {
            data: [mockClosureVigencyRow],
            current_page: 1,
            last_page: 1,
          },
        },
      })

      ;(executeApi as jest.Mock).mockReturnValue({
        get: jest
          .fn()
          .mockImplementationOnce(() => mockGetBusinesses())
          .mockImplementationOnce(() => mockGetList()),
        post: jest
          .fn()
          .mockImplementationOnce(() => mockPostExecute())
          .mockImplementationOnce(() => mockPostConfirm()),
      })

      // Act & Assert - List Businesses
      const businessesResult = await store._listBusinessTrustInRangeAction({
        vigency: 2026,
      })
      expect(businessesResult).toBe(true)
      expect(store.businesses_for_closure).toHaveLength(1)

      // Act & Assert - Execute
      const executeResult = await store._executeClosureAction(
        mockClosureVigencyCreatePayload
      )
      expect(executeResult).toEqual(mockExecutionResult)

      // Act & Assert - Confirm
      const confirmResult = await store._confirmClosureAction(
        mockConfirmPayload
      )
      expect(confirmResult).toBe(true)

      // Act & Assert - List
      await store._listAction({ page: 1 })
      expect(store.closure_vigency_list).toHaveLength(1)
    })
  })

  // Branch coverage tests
  describe('Branch coverage improvements', () => {
    describe('_downloadExecutionErrorReport', () => {
      it('should download execution error report successfully', async () => {
        // Arrange
        const store = useClosureVigencyStoreV1()
        const executionId = 'exec-123'
        const mockBlob = new Blob(['test content'], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })

        const mockResponse = {
          data: mockBlob,
          headers: {
            'content-type':
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          },
        }
        const mockGet = jest.fn().mockResolvedValue(mockResponse)
        ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

        const mockGetNameBlob = jest
          .fn()
          .mockReturnValue(`reporte-errores-${executionId}.xlsx`)
        const mockDownloadBlobXlxx = jest.fn()
        const { useUtils } = require('@/composables')
        ;(useUtils as jest.Mock).mockReturnValue({
          getNameBlob: mockGetNameBlob,
          downloadBlobXlxx: mockDownloadBlobXlxx,
        })

        // Act
        await store._downloadExecutionErrorReport(executionId)

        // Assert
        expect(mockGet).toHaveBeenCalledWith(
          expect.stringContaining(`execution/${executionId}/error-report`),
          { responseType: 'blob' }
        )
        expect(mockGetNameBlob).toHaveBeenCalledWith(mockResponse)
        expect(mockDownloadBlobXlxx).toHaveBeenCalledWith(
          expect.any(Blob),
          expect.any(String)
        )
      })

      it('should handle errors during execution error report download', async () => {
        // Arrange
        const store = useClosureVigencyStoreV1()
        const executionId = 'exec-123'
        const mockGet = jest
          .fn()
          .mockRejectedValue(new Error('Download failed'))
        ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

        // Act & Assert
        await expect(
          store._downloadExecutionErrorReport(executionId)
        ).resolves.not.toThrow()
      })
    })

    describe('_getProcessDetailAction', () => {
      it('should handle response when success is false', async () => {
        // Arrange
        const store = useClosureVigencyStoreV1()
        const executionId = 'exec-123'
        const mockGet = jest.fn().mockResolvedValue({
          data: { success: false, data: null },
        })
        ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

        // Act
        await store._getProcessDetailAction(executionId)

        // Assert
        expect(store.process_detail).toBeNull()
      })

      it('should handle response when success is true', async () => {
        // Arrange
        const store = useClosureVigencyStoreV1()
        const executionId = 'exec-123'
        const mockDetail: IClosureVigencyDetail = {
          id: 1,
          process_number: 'EXE-2026-001',
          vigency: 2026,
          action_type: 'close',
          status: 'Exitoso',
          process_date: '2026/01/14',
          user_name: 'Usuario Test',
          has_errors: false,
        }
        const mockGet = jest.fn().mockResolvedValue({
          data: { success: true, data: mockDetail },
        })
        ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

        // Act
        await store._getProcessDetailAction(executionId)

        // Assert
        expect(store.process_detail).toEqual(mockDetail)
      })

      it('should handle errors when fetching process detail', async () => {
        // Arrange
        const store = useClosureVigencyStoreV1()
        const executionId = 'exec-123'
        const mockGet = jest.fn().mockRejectedValue(new Error('Network error'))
        ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

        // Act
        const result = await store._getProcessDetailAction(executionId)

        // Assert
        expect(result).toBeNull()
        expect(store.process_detail).toBeNull()
      })
    })

    describe('_listProcessedBusinessesAction', () => {
      it('should handle empty data array', async () => {
        // Arrange
        const store = useClosureVigencyStoreV1()
        const executionId = 'exec-123'
        const mockGet = jest.fn().mockResolvedValue({
          data: {
            success: true,
            message: 'Negocios procesados',
            data: {
              data: [],
              current_page: 1,
              last_page: 1,
            },
          },
        })
        ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

        // Act
        await store._listProcessedBusinessesAction(executionId, {})

        // Assert
        expect(store.processed_businesses).toEqual([])
        expect(store.processed_businesses_pages.currentPage).toBe(1)
        expect(store.processed_businesses_pages.lastPage).toBe(1)
      })

      it('should handle paginated data', async () => {
        // Arrange
        const store = useClosureVigencyStoreV1()
        const executionId = 'exec-123'
        const mockBusiness1: IProcessedBusiness = {
          id: 1,
          code: '25123',
          name: 'Negocio 1',
          closure_type: 'Diario',
          last_closed_vigency: 2025,
          status: 'Exitoso',
        }
        const mockBusiness2: IProcessedBusiness = {
          id: 2,
          code: '25124',
          name: 'Negocio 2',
          closure_type: 'Mensual',
          last_closed_vigency: null,
          status: 'Con error',
        }
        const mockGet = jest.fn().mockResolvedValue({
          data: {
            success: true,
            message: 'Negocios procesados',
            data: {
              data: [mockBusiness1, mockBusiness2],
              current_page: 2,
              last_page: 5,
            },
          },
        })
        ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

        // Act
        await store._listProcessedBusinessesAction(executionId, { page: 2 })

        // Assert
        expect(store.processed_businesses).toHaveLength(2)
        expect(store.processed_businesses[0]._row_number).toBe(1)
        expect(store.processed_businesses[1]._row_number).toBe(2)
        expect(store.processed_businesses_pages.currentPage).toBe(2)
        expect(store.processed_businesses_pages.lastPage).toBe(5)
      })

      it('should handle errors when fetching processed businesses', async () => {
        // Arrange
        const store = useClosureVigencyStoreV1()
        const executionId = 'exec-123'
        const mockGet = jest.fn().mockRejectedValue(new Error('Network error'))
        ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

        // Act
        await store._listProcessedBusinessesAction(executionId, {})

        // Assert
        expect(store.processed_businesses).toEqual([])
      })
    })

    describe('_listBusinessDocumentsAction', () => {
      it('should handle empty data array', async () => {
        // Arrange
        const store = useClosureVigencyStoreV1()
        const executionId = 'exec-123'
        const businessId = 1
        const mockGet = jest.fn().mockResolvedValue({
          data: {
            success: true,
            message: 'Documentos obtenidos',
            data: {
              data: [],
              current_page: 1,
              last_page: 1,
            },
          },
        })
        ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

        // Act
        await store._listBusinessDocumentsAction(executionId, businessId, {})

        // Assert
        expect(store.business_documents).toEqual([])
        expect(store.business_documents_pages.currentPage).toBe(1)
        expect(store.business_documents_pages.lastPage).toBe(1)
      })

      it('should handle paginated data', async () => {
        // Arrange
        const store = useClosureVigencyStoreV1()
        const executionId = 'exec-123'
        const businessId = 1
        const mockDoc1: IBusinessDocument = {
          id: 1,
          document_type_code: 'CDP',
          document_type_name: 'Certificado de Disponibilidad',
          document_number: 'INV-001',
          last_closed_vigency: 2025,
          balance: 1000,
          value: 1000,
          status: 'Exitoso',
        }
        const mockDoc2: IBusinessDocument = {
          id: 2,
          document_type_code: 'CRP',
          document_type_name: 'Certificado de Registro Presupuestal',
          document_number: 'REC-001',
          last_closed_vigency: null,
          balance: 500,
          value: 500,
          status: 'Con error',
        }
        const mockGet = jest.fn().mockResolvedValue({
          data: {
            success: true,
            message: 'Documentos obtenidos',
            data: {
              data: [mockDoc1, mockDoc2],
              current_page: 3,
              last_page: 10,
            },
          },
        })
        ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

        // Act
        await store._listBusinessDocumentsAction(executionId, businessId, {
          page: 3,
        })

        // Assert
        expect(store.business_documents).toHaveLength(2)
        expect(store.business_documents[0]._row_number).toBe(1)
        expect(store.business_documents[1]._row_number).toBe(2)
        expect(store.business_documents_pages.currentPage).toBe(3)
        expect(store.business_documents_pages.lastPage).toBe(10)
      })

      it('should handle errors when fetching business documents', async () => {
        // Arrange
        const store = useClosureVigencyStoreV1()
        const executionId = 'exec-123'
        const businessId = 1
        const mockGet = jest.fn().mockRejectedValue(new Error('Network error'))
        ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

        // Act
        await store._listBusinessDocumentsAction(executionId, businessId, {})

        // Assert
        expect(store.business_documents).toEqual([])
      })
    })
  })
})
