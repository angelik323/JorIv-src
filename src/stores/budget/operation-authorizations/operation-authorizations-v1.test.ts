import { setActivePinia, createPinia } from 'pinia'
import { useOperationAuthorizationsStoreV1 } from '@/stores/budget/operation-authorizations/operation-authorizations-v1'
import { executeApi } from '@/apis'
import type {
  IOperationAuthorization,
  IOperationAuthorizationApprove,
  IOperationAuthorizationReject,
} from '@/interfaces/customs/budget/OperationAuthorizations'

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
    getNameBlob: jest.fn(() => 'operations.xlsx'),
    downloadBlobXlxx: jest.fn(),
  })),
}))

describe('useOperationAuthorizationsStoreV1 - Unit Tests (AAA Pattern)', () => {
  beforeEach(() => {
    // Arrange: Configurar Pinia antes de cada test
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  // Mock data para la respuesta de la API (estructura que espera IOperationAuthorization)
  const mockOperationApiResponse: IOperationAuthorization = {
    operation_type: 'operation',
    id: 1,
    budget_document_type: {
      id: 3,
      code: 'DOC01',
      description: 'Documento Presupuestal',
      requires_authorization: true,
    },
    addition: false,
    addition_number: null,
    date: '2024-01-15',
    rejection_reason: null,
    resolution_number: null,
    total_amount: null,
    third_party_beneficiary: [
      {
        id: 10,
        document: '1234567890',
        legal_person: {
          business_name: 'Tercero ABC',
        },
        natural_person: null,
      },
    ],
    total_value: 5000000,
    details: null,
  }

  // Mock data para tabla (estructura del frontend)
  const mockOperationTable: IOperationAuthorization = {
    operation_type: 'operation',
    id: 1,
    budget_document_type: {
      id: 3,
      code: 'DOC01',
      description: 'Documento Presupuestal',
      requires_authorization: true,
    },
    addition: false,
    addition_number: null,
    date: '2024-01-15',
    rejection_reason: null,
    resolution_number: null,
    total_amount: null,
    third_party_beneficiary: [
      {
        id: 10,
        document: '1234567890',
        legal_person: {
          business_name: 'Tercero ABC',
        },
        natural_person: null,
      },
    ],
    total_value: 5000000,
    details: null,
  }

  // Mock data para autorizar operaciones
  const mockApprovePayload: IOperationAuthorizationApprove = {
    action: 'authorize',
    operations: [
      { id: 1, type: 'operation' },
      { id: 2, type: 'operation' },
      { id: 3, type: 'transfer' },
    ],
  }

  // Mock data para rechazar operaciones
  const mockRejectPayload: IOperationAuthorizationReject = {
    action: 'reject',
    rejection_reason: 'Documentación incompleta',
    operations: [
      { id: 4, type: 'operation' },
      { id: 5, type: 'transfer' },
    ],
  }

  describe('_listAction', () => {
    it('should fetch operations list successfully', async () => {
      // Arrange
      const store = useOperationAuthorizationsStoreV1()
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Listado obtenido exitosamente',
          data: {
            items: {
              data: [mockOperationApiResponse],
              current_page: 1,
              last_page: 1,
            },
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._listAction({ page: 1, rows: 10 })

      // Assert
      expect(store.operations_list).toHaveLength(1)
      expect(store.operations_list[0].id).toBe(1)
      expect(store.operations_list[0].operation_type).toBe('operation')
      expect(store.operations_list[0].budget_document_type?.code).toBe('DOC01')
      expect(store.operations_pages.currentPage).toBe(1)
      expect(store.operations_pages.lastPage).toBe(1)
      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining('budget-business-authorization/list'),
        { params: { page: 1, rows: 10, paginate: 1 } }
      )
    })

    it('should clear previous data before fetching new list', async () => {
      // Arrange
      const store = useOperationAuthorizationsStoreV1()
      store.operations_list = [mockOperationTable]
      store.operations_pages = { currentPage: 2, lastPage: 5 }

      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Listado obtenido',
          data: {
            items: { data: [], current_page: 1, last_page: 1 },
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._listAction({ page: 1 })

      // Assert
      expect(store.operations_list).toHaveLength(0)
      expect(store.operations_pages.currentPage).toBe(1)
      expect(store.operations_pages.lastPage).toBe(1)
    })

    it('should handle errors during list fetch', async () => {
      // Arrange
      const store = useOperationAuthorizationsStoreV1()
      const mockGet = jest.fn().mockRejectedValue(new Error('Network error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._listAction({ page: 1 })

      // Assert
      expect(store.operations_list).toHaveLength(0)
    })

    it('should handle empty list response', async () => {
      // Arrange
      const store = useOperationAuthorizationsStoreV1()
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'No hay operaciones',
          data: {
            items: { data: [], current_page: 1, last_page: 1 },
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._listAction({ page: 1 })

      // Assert
      expect(store.operations_list).toHaveLength(0)
      expect(store.operations_pages.currentPage).toBe(1)
    })
  })

  describe('_processAction', () => {
    it('should approve operations successfully', async () => {
      // Arrange
      const store = useOperationAuthorizationsStoreV1()
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Operaciones autorizadas exitosamente',
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._processAction(mockApprovePayload)

      // Assert
      expect(result).toBe(true)
      expect(mockPost).toHaveBeenCalledWith(
        expect.stringContaining(
          'budget-business-authorization/authorize-reject'
        ),
        mockApprovePayload
      )
    })

    it('should reject operations successfully', async () => {
      // Arrange
      const store = useOperationAuthorizationsStoreV1()
      const mockPost = jest.fn().mockResolvedValue({
        data: { success: true, message: 'Operaciones rechazadas exitosamente' },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._processAction(mockRejectPayload)

      // Assert
      expect(result).toBe(true)
      expect(mockPost).toHaveBeenCalledWith(
        expect.stringContaining(
          'budget-business-authorization/authorize-reject'
        ),
        mockRejectPayload
      )
    })

    it('should return false when process fails', async () => {
      // Arrange
      const store = useOperationAuthorizationsStoreV1()
      const mockPost = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Error al procesar' },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._processAction(mockApprovePayload)

      // Assert
      expect(result).toBe(false)
    })

    it('should handle errors during process', async () => {
      // Arrange
      const store = useOperationAuthorizationsStoreV1()
      const mockPost = jest.fn().mockRejectedValue(new Error('Network error'))
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._processAction(mockApprovePayload)

      // Assert
      expect(result).toBe(false)
    })
  })

  describe('_getByOperationId', () => {
    it('should fetch an operation by id successfully', async () => {
      // Arrange
      const store = useOperationAuthorizationsStoreV1()
      const mockOperationResponse = {
        id: 1,
        operation_log_details: [
          {
            id: 1,
            year: 2024,
            month: 1,
            day: 15,
            areas_responsibility: {
              id: 1,
              code: 'AREA01',
              description: 'Área 1',
            },
            code_movement: {
              id: 1,
              movement_code: 'MOV01',
              movement_description: 'Movimiento 1',
            },
            budget_item: { id: 1, code: 'ITEM01', description: 'Item 1' },
            budget_resource: { id: 1, code: 'RES01', description: 'Recurso 1' },
            value: 5000000,
            adjusted_value: null,
          },
        ],
      }
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Operación obtenida exitosamente',
          data: mockOperationResponse,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const result = await store._getOperationByIdAndType('1', 'operation')

      // Assert
      expect(result).not.toBeNull()
      expect(result?.operation).toBeDefined()
      expect(result?.operation?.id).toBe(1)
      expect(result?.operation?.operation_log_details).toHaveLength(1)
      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining(
          'budget-business-authorization/show/1?type=operation'
        )
      )
    })

    it('should fetch a transfer by id successfully', async () => {
      // Arrange
      const store = useOperationAuthorizationsStoreV1()
      const mockTransferResponse = {
        transfer_id: 1,
        origin: [
          {
            id: 1,
            type: 'ORIGEN' as const,
            business_trust: { id: 1, code: 'BUS01', name: 'Negocio 1' },
            budget_item: { id: 1, code: 'ITEM01', description: 'Item 1' },
            budget_resource: { id: 1, code: 'RES01', description: 'Recurso 1' },
            responsibility_area: {
              id: 1,
              code: 'AREA01',
              description: 'Área 1',
            },
            third_party: { id: 1, name: 'Tercero 1' },
            month: 1,
            amount: '1000000',
          },
        ],
        destination: [
          {
            id: 2,
            type: 'DESTINO' as const,
            business_trust: { id: 2, code: 'BUS02', name: 'Negocio 2' },
            budget_item: { id: 2, code: 'ITEM02', description: 'Item 2' },
            budget_resource: { id: 2, code: 'RES02', description: 'Recurso 2' },
            responsibility_area: {
              id: 2,
              code: 'AREA02',
              description: 'Área 2',
            },
            third_party: null,
            month: 1,
            amount: '1000000',
          },
        ],
      }
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Traslado obtenido exitosamente',
          data: mockTransferResponse,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const result = await store._getOperationByIdAndType('1', 'transfer')

      // Assert
      expect(result).not.toBeNull()
      expect(result?.transfer).toBeDefined()
      expect(result?.transfer?.transfer_id).toBe(1)
      expect(result?.transfer?.origin).toHaveLength(1)
      expect(result?.transfer?.destination).toHaveLength(1)
      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining(
          'budget-business-authorization/show/1?type=transfer'
        )
      )
    })

    it('should return null when request fails', async () => {
      // Arrange
      const store = useOperationAuthorizationsStoreV1()
      const mockGet = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Operación no encontrada' },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const result = await store._getOperationByIdAndType('999', 'operation')

      // Assert
      expect(result).toBeNull()
    })

    it('should handle errors during show fetch', async () => {
      // Arrange
      const store = useOperationAuthorizationsStoreV1()
      const mockGet = jest.fn().mockRejectedValue(new Error('Network error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const result = await store._getOperationByIdAndType('1', 'operation')

      // Assert
      expect(result).toBeNull()
    })
  })

  describe('_downloadExcelAction', () => {
    it('should download excel successfully when API responds', async () => {
      // Arrange
      const store = useOperationAuthorizationsStoreV1()
      const mockBlob = new Blob(['test'], { type: 'application/vnd.ms-excel' })
      const mockPost = jest.fn().mockResolvedValue({
        data: mockBlob,
        headers: { 'content-type': 'application/vnd.ms-excel' },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      await store._downloadExcelAction('business_id=5&validity=2024')

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        expect.stringContaining(
          'budget-business-authorization/export?business_id=5'
        ),
        null,
        { responseType: 'blob' }
      )
    })

    it('should handle errors during excel download', async () => {
      // Arrange
      const store = useOperationAuthorizationsStoreV1()
      const mockPost = jest.fn().mockRejectedValue(new Error('Download error'))
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      await store._downloadExcelAction('business_id=5')

      // Assert
      expect(mockPost).toHaveBeenCalled()
    })

    it('should download excel with empty filters', async () => {
      // Arrange
      const store = useOperationAuthorizationsStoreV1()
      const mockBlob = new Blob(['test'], { type: 'application/vnd.ms-excel' })
      const mockPost = jest.fn().mockResolvedValue({
        data: mockBlob,
        headers: { 'content-type': 'application/vnd.ms-excel' },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      await store._downloadExcelAction('')

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        expect.stringContaining('budget-business-authorization/export?'),
        null,
        { responseType: 'blob' }
      )
    })
  })

  describe('_clearData', () => {
    it('should clear all list data and reset pagination', () => {
      // Arrange
      const store = useOperationAuthorizationsStoreV1()
      store.operations_list = [mockOperationTable]
      store.operations_pages = { currentPage: 3, lastPage: 10 }
      store.total_operations = 5
      store.total_transfers = 2

      // Act
      store._clearData()

      // Assert
      expect(store.operations_list).toHaveLength(0)
      expect(store.operations_pages.currentPage).toBe(1)
      expect(store.operations_pages.lastPage).toBe(1)
      expect(store.total_operations).toBe(0)
      expect(store.total_transfers).toBe(0)
    })

    it('should work correctly when data is already empty', () => {
      // Arrange
      const store = useOperationAuthorizationsStoreV1()

      // Act
      store._clearData()

      // Assert
      expect(store.operations_list).toHaveLength(0)
      expect(store.operations_pages.currentPage).toBe(1)
      expect(store.operations_pages.lastPage).toBe(1)
      expect(store.total_operations).toBe(0)
      expect(store.total_transfers).toBe(0)
    })
  })

  describe('State initialization', () => {
    it('should initialize with correct default state', () => {
      // Arrange & Act
      const store = useOperationAuthorizationsStoreV1()

      // Assert
      expect(store.version).toBe('v1')
      expect(store.operations_list).toEqual([])
      expect(store.operations_pages).toEqual({ currentPage: 1, lastPage: 1 })
      expect(store.total_operations).toBe(0)
      expect(store.total_transfers).toBe(0)
    })
  })

  describe('Integration scenarios', () => {
    it('should handle complete authorization workflow', async () => {
      // Arrange
      const store = useOperationAuthorizationsStoreV1()
      const mockGetList = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Listado obtenido',
          data: {
            items: {
              data: [mockOperationApiResponse],
              current_page: 1,
              last_page: 1,
            },
          },
        },
      })
      const mockPostApprove = jest.fn().mockResolvedValue({
        data: { success: true, message: 'Operaciones autorizadas' },
      })
      ;(executeApi as jest.Mock)
        .mockReturnValueOnce({ get: mockGetList })
        .mockReturnValueOnce({ post: mockPostApprove })

      // Act
      await store._listAction({ page: 1 })
      const operations = store.operations_list.map((op) => ({
        id: op.id,
        type: op.operation_type,
      }))
      const approvePayload: IOperationAuthorizationApprove = {
        action: 'authorize',
        operations,
      }
      const approveResult = await store._processAction(approvePayload)

      // Assert
      expect(store.operations_list).toHaveLength(1)
      expect(approveResult).toBe(true)
    })
  })

  describe('_updateAction', () => {
    it('should update an operation successfully', async () => {
      // Arrange
      const store = useOperationAuthorizationsStoreV1()
      const mockPut = jest.fn().mockResolvedValue({
        data: { success: true, message: 'Operación actualizada exitosamente' },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      const updatePayload = {
        type: 'operation' as const,
        id: 1,
        details: [
          {
            id: 1,
            year: 2024,
            month: 1,
            day: '15',
            areas_responsibility_id: 1,
            code_movements_source_destination_id: 1,
            budget_item_id: 1,
            budget_resource_id: 1,
            value: '5000000',
            adjusted_value: null,
          },
        ],
      }

      // Act
      const result = await store._updateAction(updatePayload)

      // Assert
      expect(result).toBe(true)
      expect(mockPut).toHaveBeenCalledWith(
        expect.stringContaining(
          'budget-business-authorization/update/1?type=operation'
        ),
        { details: updatePayload.details }
      )
    })

    it('should update a transfer successfully', async () => {
      // Arrange
      const store = useOperationAuthorizationsStoreV1()
      const mockPut = jest.fn().mockResolvedValue({
        data: { success: true, message: 'Traslado actualizado exitosamente' },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      const updatePayload = {
        type: 'transfer' as const,
        id: 1,
        details: [
          {
            type: 'ORIGEN' as const,
            month: 1,
            responsibility_area_id: 1,
            budget_item_id: 1,
            budget_resource_id: 1,
            third_party_id: 1,
            business_trust_id: 1,
            amount: '1000000',
          },
        ],
      }

      // Act
      const result = await store._updateAction(updatePayload)

      // Assert
      expect(result).toBe(true)
      expect(mockPut).toHaveBeenCalledWith(
        expect.stringContaining(
          'budget-business-authorization/update/1?type=transfer'
        ),
        { details: updatePayload.details }
      )
    })

    it('should return false when update fails', async () => {
      // Arrange
      const store = useOperationAuthorizationsStoreV1()
      const mockPut = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Error al actualizar' },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      const updatePayload = {
        type: 'operation' as const,
        id: 1,
        details: [],
      }

      // Act
      const result = await store._updateAction(updatePayload)

      // Assert
      expect(result).toBe(false)
    })

    it('should handle errors during update', async () => {
      // Arrange
      const store = useOperationAuthorizationsStoreV1()
      const mockPut = jest.fn().mockRejectedValue(new Error('Network error'))
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      const updatePayload = {
        type: 'operation' as const,
        id: 1,
        details: [],
      }

      // Act
      const result = await store._updateAction(updatePayload)

      // Assert
      expect(result).toBe(false)
    })
  })
})
