// Vue - Pinia - Router - Quasar
import { setActivePinia, createPinia } from 'pinia'

// Interfaces
import type {
  ITypesContractingDocumentsBasicDataForm,
  ITypesContractingDocumentsList,
  ITypesContractingDocumentsRequest,
} from '@/interfaces/customs'

// Constantes
import { URL_PATH_DERIVATIVE_CONTRACTING } from '@/constants/apis'

// APIs
import { executeApi } from '@/apis'

// Stores
import { useTypesContractingDocumentsStoreV1 } from '@/stores/derivative-contracting/types-contracting-documents/types-contracting-documents-v1'

const URL_PATH = `${URL_PATH_DERIVATIVE_CONTRACTING}/type-contracts`

const mockTypesContractingDocumentsForm: ITypesContractingDocumentsBasicDataForm =
  {
    document_code: 'TCD',
    document_name: 'Tipo de Contrato de Prueba',
    category: 1,
    numbering_type: 1,
    business_numbering_type: 1,
    contract_type: 1,
    contract_value_in: 1,
    max_amount_allowed: 1,
    max_allowed_value: 1000000,
    modality: 1,
    has_work_plan: false,
    has_supervisor: false,
    has_stamp_tax: false,
    status_id: 1,
    budget_validity: 1,
    avail_document_id: null,
    avail_movement_id: null,
    comm_document_id: null,
    comm_movement_id: null,
    bud_document_id: 1,
    bud_movement_id: 1,
  }

const typesContractingDocumentsId = 1

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
}))

jest.mock('quasar', () => ({
  Notify: {
    create: jest.fn(),
  },
}))

describe('useTypesContractingDocumentsStoreV1', () => {
  let store: ReturnType<typeof useTypesContractingDocumentsStoreV1>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useTypesContractingDocumentsStoreV1()
    jest.clearAllMocks()
  })

  describe('_getListAction', () => {
    const filters = '&page=1&filter[search]=TCD'
    const filtersEmpty = ''

    const mockTypesContractingDocumentsList: ITypesContractingDocumentsList[] =
      [
        {
          id: 1,
          document_code: 'TCD',
          document_name: 'Tipo de Contrato de Prueba',
          category: {
            id: 1,
            label: 'Categoría de prueba',
          },
          budget_validity: {
            id: 1,
            label: 'Valididad de presupuesto',
          },
          status_id: 1,
        },
      ]

    const emptyResponse = {
      data: [],
      current_page: 0,
      last_page: 0,
      total: 0,
      per_page: 10,
    }

    it('should fetch types contracting documents successfully', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: {
            data: mockTypesContractingDocumentsList,
            current_page: 1,
            last_page: 1,
            total: 1,
            per_page: 10,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListAction(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1${filters}`)
      expect(store.types_contracting_documents_list).toEqual(
        mockTypesContractingDocumentsList
      )
      expect(store.types_contracting_documents_pages).toEqual({
        currentPage: 1,
        lastPage: 1,
        total_items: 1,
        per_page: 10,
      })
    })

    it('should fetch types contracting documents successfully without filters', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success without filters',
          data: {
            data: mockTypesContractingDocumentsList,
            current_page: 1,
            last_page: 1,
            total: 1,
            per_page: 10,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListAction(filtersEmpty)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}?paginate=1${filtersEmpty}`
      )
      expect(store.types_contracting_documents_list).toEqual(
        mockTypesContractingDocumentsList
      )
    })

    it('should handle API success=false response', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'Failed',
          data: {
            data: [],
            current_page: 0,
            last_page: 0,
            total: 0,
            per_page: 10,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListAction(filters)

      // Assert
      expect(mockGet).toHaveBeenCalled()
      expect(store.types_contracting_documents_list).toEqual([])
    })

    it('handles error when fetching definition accounting parameters fails', async () => {
      // Arrange
      const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListAction(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1${filters}`)
      expect(store.types_contracting_documents_list).toEqual([])
    })

    it('should handle empty response data', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: emptyResponse,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListAction('')

      // Assert
      expect(store.types_contracting_documents_list).toEqual([])
      expect(store.types_contracting_documents_pages).toEqual({
        currentPage: 0,
        lastPage: 0,
        total_items: 0,
        per_page: 10,
      })
    })
  })

  describe('_getByIdAction', () => {
    it('should fetch types contracting document by ID successfully', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        message: 'Success',
        data: mockTypesContractingDocumentsForm,
      }
      const mockGet = jest.fn().mockResolvedValue({ data: mockResponse })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const result = await store._getByIdAction(1)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/1`)
      expect(result).toEqual(mockTypesContractingDocumentsForm)
    })

    it('should return null when success is false', async () => {
      // Arrange
      const mockResponse = {
        success: false,
        message: 'Not found',
        data: null,
      }
      const mockGet = jest.fn().mockResolvedValue({ data: mockResponse })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const result = await store._getByIdAction(999)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/999`)
      expect(result).toBeNull()
    })

    it('should return null when response data is null', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        message: 'No data',
        data: null,
      }
      const mockGet = jest.fn().mockResolvedValue({ data: mockResponse })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const result = await store._getByIdAction(999)

      // Assert
      expect(result).toBeNull()
    })

    it('should handle API success=false or no data', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Not found', data: null },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getByIdAction(1)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/1`)
    })

    it('returns null when response data is invalid', async () => {
      // Arrange
      const mockResponse = {
        data: { success: true, data: null },
      }
      const mockGet = jest.fn().mockResolvedValue({ data: mockResponse })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const result = await store._getByIdAction(1)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/1`)
      expect(result).toBeNull()
    })

    it('handles error when fetching definition accounting parameters by ID fails', async () => {
      // Arrange
      const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const result = await store._getByIdAction(1)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/1`)
      expect(result).toBeNull()
    })
  })

  describe('_createAction', () => {
    it('should create a new types contracting document successfully', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        message: 'Created successfully',
      }
      const mockPost = jest.fn().mockResolvedValue({ data: mockResponse })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const requestData: ITypesContractingDocumentsRequest = {
        document_type: mockTypesContractingDocumentsForm,
        status_flow: null,
      }

      // Act
      const result = await store._createAction(requestData)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(URL_PATH, requestData)
      expect(result).toBe(true)
    })

    it('should handle API success=false on create', async () => {
      // Arrange
      const mockPost = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Creation failed', data: null },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const requestData: ITypesContractingDocumentsRequest = {
        document_type: mockTypesContractingDocumentsForm,
        status_flow: null,
      }

      // Act
      const result = await store._createAction(requestData)

      // Assert
      expect(result).toBe(false)
    })

    it('handles error when creating definition accounting parameters fails', async () => {
      // Arrange
      const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const requestData: ITypesContractingDocumentsRequest = {
        document_type: mockTypesContractingDocumentsForm,
        status_flow: null,
      }

      // Act
      const result = await store._createAction(requestData)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(URL_PATH, requestData)
      expect(result).toBe(false)
    })
  })

  describe('_deleteAction', () => {
    it('should delete types contracting document successfully', async () => {
      // Arrange
      const successMessage = 'Deleted successfully'
      const mockResponse = {
        success: true,
        message: successMessage,
        data: null,
      }
      const mockDelete = jest.fn().mockResolvedValue({ data: mockResponse })
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      const result = await store._deleteAction(typesContractingDocumentsId)

      // Assert
      expect(mockDelete).toHaveBeenCalledWith(
        `${URL_PATH}/${typesContractingDocumentsId}`
      )
      expect(result).toBe(true)
    })

    it('should handle API success=false on delete', async () => {
      // Arrange
      const mockDelete = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Error', data: null },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      const result = await store._deleteAction(typesContractingDocumentsId)

      // Assert
      expect(result).toBe(false)
    })

    it('handles error when deleting fails', async () => {
      // Arrange
      const mockDelete = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      const result = await store._deleteAction(typesContractingDocumentsId)

      // Assert
      expect(mockDelete).toHaveBeenCalledWith(
        `${URL_PATH}/${typesContractingDocumentsId}`
      )
      expect(result).toBe(false)
    })
  })

  describe('_updateAction', () => {
    it('should update an existing types contracting document successfully', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        message: 'Updated successfully',
        data: mockTypesContractingDocumentsForm,
      }
      const mockPatch = jest.fn().mockResolvedValue({ data: mockResponse })
      ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

      const requestData: ITypesContractingDocumentsRequest = {
        document_type: mockTypesContractingDocumentsForm,
        status_flow: null,
      }

      // Act
      const result = await store._updateAction(
        requestData,
        typesContractingDocumentsId
      )

      // Assert
      expect(mockPatch).toHaveBeenCalledWith(
        `${URL_PATH}/${typesContractingDocumentsId}`,
        requestData
      )
      expect(result).toBe(true)
    })

    it('should handle API success=false on update', async () => {
      // Arrange
      const mockPatch = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Error', data: null },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

      // Arrange
      const requestData: ITypesContractingDocumentsRequest = {
        document_type: mockTypesContractingDocumentsForm,
        status_flow: null,
      }

      // Act
      const result = await store._updateAction(
        requestData,
        typesContractingDocumentsId
      )

      // Assert
      expect(mockPatch).toHaveBeenCalledWith(
        `${URL_PATH}/${typesContractingDocumentsId}`,
        requestData
      )
      expect(result).toBe(false)
    })

    it('handles error when updating fails', async () => {
      // Arrange
      const mockPatch = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

      // Arrange
      const requestData: ITypesContractingDocumentsRequest = {
        document_type: mockTypesContractingDocumentsForm,
        status_flow: null,
      }

      // Act
      const result = await store._updateAction(
        requestData,
        typesContractingDocumentsId
      )

      // Assert
      expect(mockPatch).toHaveBeenCalledWith(
        `${URL_PATH}/${typesContractingDocumentsId}`,
        requestData
      )
      expect(result).toBe(false)
    })
  })

  describe('_updateStatusAction', () => {
    it('should update status of types contracting document successfully', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        message: 'Status updated successfully',
        data: { ...mockTypesContractingDocumentsForm, status: 2 },
      }
      const mockPut = jest.fn().mockResolvedValue({ data: mockResponse })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._updateStatusAction(
        typesContractingDocumentsId,
        2
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_PATH}/change-status/${typesContractingDocumentsId}/?status_id=2`
      )
      expect(result).toBe(true)
    })

    it('should handle API success=false on status update', async () => {
      // Arrange
      const errorMessage = 'Status update failed'
      const mockPut = jest.fn().mockResolvedValue({
        data: { success: false, message: errorMessage, data: null },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._updateStatusAction(
        typesContractingDocumentsId,
        2
      )

      // Assert
      expect(result).toBe(false)
    })

    it('handles error when updating status fails', async () => {
      // Arrange
      const mockPut = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._updateStatusAction(
        typesContractingDocumentsId,
        2
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_PATH}/change-status/${typesContractingDocumentsId}/?status_id=2`
      )
      expect(result).toBe(false)
    })

    it('should handle success=false when updating status', async () => {
      // Arrange
      const mockResponse = {
        success: false,
        message: 'Update failed',
        data: null,
      }
      const mockPut = jest.fn().mockResolvedValue({ data: mockResponse })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._updateStatusAction(
        typesContractingDocumentsId,
        2
      )

      // Assert
      expect(result).toBe(false)
    })
  })

  describe('_deleteAction', () => {
    const typesContractingDocumentsId = 1

    it('should handle API success=false on delete', async () => {
      // Arrange
      const mockDelete = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Error', data: null },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      const result = await store._deleteAction(typesContractingDocumentsId)

      // Assert
      expect(result).toBe(false)
    })

    it('handles error when deleting types contracting document fails', async () => {
      // Arrange
      const mockDelete = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      const result = await store._deleteAction(typesContractingDocumentsId)

      // Assert
      expect(mockDelete).toHaveBeenCalledWith(
        `${URL_PATH}/${typesContractingDocumentsId}`
      )
      expect(result).toBe(false)
    })
  })

  describe('_clearData', () => {
    it('should clear all data from the store', () => {
      // Arrange
      store.types_contracting_documents_list = [
        {
          id: 1,
          document_code: 'TCD',
          document_name: 'Test',
          category: {
            id: 1,
            label: 'Test',
          },
          budget_validity: {
            id: 1,
            label: 'Test',
          },
          status_id: 1,
        },
      ]

      store.types_contracting_documents_pages = {
        currentPage: 2,
        lastPage: 5,
        total_items: 50,
        per_page: 10,
      }

      // Act
      store._clearData()

      // Assert
      expect(store.types_contracting_documents_list).toEqual([])
      expect(store.types_contracting_documents_pages).toEqual({
        currentPage: 0,
        lastPage: 0,
        total_items: 0,
        per_page: 0,
      })
    })
  })
})
