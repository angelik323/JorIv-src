// Vue - Pinia - Router - Quasar
import { setActivePinia, createPinia } from 'pinia'

// Interfaces
import type {
  IDocumentaryStructureContract,
  IDocumentaryStructureContractForm,
  IDocumentaryStructureContractList,
  IDocumentaryStructureContractAnnexedDocumentList,
  IDocumentaryStructureContractAnnexedDocument,
} from '@/interfaces/customs/derivative-contracting/DocumentaryStructureContract'

// Constantes
import { URL_PATH_DERIVATIVE_CONTRACTING } from '@/constants/apis'

// APIs
import { executeApi } from '@/apis'

// Stores
import { useDocumentaryStructureContractStoreV1 } from '@/stores/derivative-contracting/documentary-structure-contract/documentary-structure-contract-v1'

const URL_PATH = `${URL_PATH_DERIVATIVE_CONTRACTING}/contract-document`

const mockDocumentaryStructureContractList: IDocumentaryStructureContractList =
  [
    {
      id: 1,
      contract_document_code: 'TCD',
      contract_document_name: 'Tipo de Contrato de Prueba',
      handle_stamp_duty: true,
      taxable_base_unit: 'unit',
      tax_base: '1',
      requires_publication: true,
      minimum_amount: '1',
      policy_management: true,
      selected: true,
    },
  ]

const mockDocumentaryStructureContractAnnexedDocumentList: IDocumentaryStructureContractAnnexedDocumentList =
  [
    {
      id: 1,
      type_attached_document_id: 1,
      type_of_policy_id: 1,
      stage: 'stage',
      mandatory: 'mandatory',
      status_id: 1,
      is_new: true,
    },
  ]

const mockDocumentaryStructureContractForm: IDocumentaryStructureContractForm =
  {
    type_id: 1,
    handle_stamp_duty: true,
    taxable_base_unit: 'unit',
    tax_base: 1,
    requires_publication: true,
    minimum_amount_unit: 'unit',
    minimum_amount: 1,
    policy_management: true,
    attachments: mockDocumentaryStructureContractAnnexedDocumentList,
  }

const documentaryStructureContractId = 1

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

describe('useDocumentaryStructureContractStoreV1', () => {
  let store: ReturnType<typeof useDocumentaryStructureContractStoreV1>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useDocumentaryStructureContractStoreV1()
    jest.clearAllMocks()
  })

  describe('_getListAction', () => {
    const filters = '&page=1&filter[search]=COD'
    const filtersEmpty = ''

    const emptyResponse = {
      data: [],
      current_page: 0,
      last_page: 0,
      total: 0,
      per_page: 10,
    }

    it('should fetch documentary structure contract successfully', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: {
            data: mockDocumentaryStructureContractList,
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
      expect(store.documentary_structure_contracts_list).toEqual(
        mockDocumentaryStructureContractList
      )
      expect(store.documentary_structure_contracts_pages).toEqual({
        currentPage: 1,
        lastPage: 1,
        total_items: 1,
        per_page: 10,
      })
    })

    it('should fetch documentary structure contract successfully without filters', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success without filters',
          data: {
            data: mockDocumentaryStructureContractList,
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
      expect(store.documentary_structure_contracts_list).toEqual(
        mockDocumentaryStructureContractList
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
      expect(store.documentary_structure_contracts_list).toEqual([])
    })

    it('handles error when fetching documentary structure contract fails', async () => {
      // Arrange
      const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListAction(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1${filters}`)
      expect(store.documentary_structure_contracts_list).toEqual([])
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
      expect(store.documentary_structure_contracts_list).toEqual([])
      expect(store.documentary_structure_contracts_pages).toEqual({
        currentPage: 0,
        lastPage: 0,
        total_items: 0,
        per_page: 10,
      })
    })
  })

  describe('_getListAnnexedDocumentsAction', () => {
    const filters = '&page=1&filter[search]=TCD'
    const filtersEmpty = ''

    const emptyResponse = {
      data: [],
      current_page: 0,
      last_page: 0,
      total: 0,
      per_page: 0,
    }

    it('should fetch documentary structure contract annexed document successfully', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: {
            data: mockDocumentaryStructureContractAnnexedDocumentList,
            current_page: 1,
            last_page: 1,
            total: 1,
            per_page: 0,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListAnnexedDocumentsAction(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/listAnnex?paginate=1${filters}`
      )
      expect(store.annexed_documents_list).toEqual(
        mockDocumentaryStructureContractAnnexedDocumentList
      )
      expect(store.annexed_documents_pages).toEqual({
        currentPage: 1,
        lastPage: 1,
        total_items: 1,
        per_page: 0,
      })
    })

    it('should fetch documentary structure contract annexed document successfully without filters', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success without filters',
          data: {
            data: mockDocumentaryStructureContractAnnexedDocumentList,
            current_page: 1,
            last_page: 1,
            total: 1,
            per_page: 0,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListAnnexedDocumentsAction(filtersEmpty)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/listAnnex?paginate=1${filtersEmpty}`
      )
      expect(store.annexed_documents_list).toEqual(
        mockDocumentaryStructureContractAnnexedDocumentList
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
            per_page: 0,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListAnnexedDocumentsAction(filters)

      // Assert
      expect(mockGet).toHaveBeenCalled()
      expect(store.annexed_documents_list).toEqual([])
    })

    it('handles error when fetching documentary structure contract fails', async () => {
      // Arrange
      const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListAnnexedDocumentsAction(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/listAnnex?paginate=1${filters}`
      )
      expect(store.annexed_documents_list).toEqual([])
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
      await store._getListAnnexedDocumentsAction('')

      // Assert
      expect(store.annexed_documents_list).toEqual([])
      expect(store.annexed_documents_pages).toEqual({
        currentPage: 0,
        lastPage: 0,
        total_items: 0,
        per_page: 0,
      })
    })
  })

  describe('_getByIdAction', () => {
    it('should fetch documentary structure contract by ID successfully', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        message: 'Success',
        data: mockDocumentaryStructureContractForm,
      }
      const mockGet = jest.fn().mockResolvedValue({ data: mockResponse })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const result = await store._getByIdAction(1)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/1`)
      expect(result).toEqual(mockDocumentaryStructureContractForm)
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

    it('handles error when fetching documentary structure contract by ID fails', async () => {
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
    it('should create a new documentary structure contract successfully', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        message: 'Created successfully',
      }
      const mockPost = jest.fn().mockResolvedValue({ data: mockResponse })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const requestData: IDocumentaryStructureContractForm = {
        ...mockDocumentaryStructureContractForm,
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

      const requestData: IDocumentaryStructureContractForm = {
        ...mockDocumentaryStructureContractForm,
      }

      // Act
      const result = await store._createAction(requestData)

      // Assert
      expect(result).toBe(false)
    })

    it('handles error when creating documentary structure contract fails', async () => {
      // Arrange
      const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const requestData: IDocumentaryStructureContractForm = {
        ...mockDocumentaryStructureContractForm,
      }

      // Act
      const result = await store._createAction(requestData)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(URL_PATH, requestData)
      expect(result).toBe(false)
    })
  })

  describe('_updateAction', () => {
    it('should update an existing documentary structure contract successfully', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        message: 'Updated successfully',
        data: mockDocumentaryStructureContractForm,
      }
      const mockPatch = jest.fn().mockResolvedValue({ data: mockResponse })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPatch })

      const requestData: IDocumentaryStructureContractForm = {
        ...mockDocumentaryStructureContractForm,
      }

      // Act
      const result = await store._updateAction(
        requestData,
        documentaryStructureContractId
      )

      // Assert
      expect(mockPatch).toHaveBeenCalledWith(
        `${URL_PATH}/${documentaryStructureContractId}`,
        requestData
      )
      expect(result).toBe(true)
    })

    it('should handle API success=false on update', async () => {
      // Arrange
      const mockPatch = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Error', data: null },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPatch })

      // Arrange
      const requestData: IDocumentaryStructureContractForm = {
        ...mockDocumentaryStructureContractForm,
      }

      // Act
      const result = await store._updateAction(
        requestData,
        documentaryStructureContractId
      )

      // Assert
      expect(mockPatch).toHaveBeenCalledWith(
        `${URL_PATH}/${documentaryStructureContractId}`,
        requestData
      )
      expect(result).toBe(false)
    })

    it('handles error when updating fails', async () => {
      // Arrange
      const mockPatch = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPatch })

      // Arrange
      const requestData: IDocumentaryStructureContractForm = {
        ...mockDocumentaryStructureContractForm,
      }

      // Act
      const result = await store._updateAction(
        requestData,
        documentaryStructureContractId
      )

      // Assert
      expect(mockPatch).toHaveBeenCalledWith(
        `${URL_PATH}/${documentaryStructureContractId}`,
        requestData
      )
      expect(result).toBe(false)
    })
  })

  describe('_updateStatusAnnexedDocumentAction', () => {
    it('should update status of annexed document successfully', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        message: 'Status updated successfully',
      }
      const mockPut = jest.fn().mockResolvedValue({ data: mockResponse })
      ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPut })

      // Act
      const result = await store._updateStatusAnnexedDocumentAction(
        documentaryStructureContractId
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_PATH}/${documentaryStructureContractId}`
      )
      expect(result).toBe(true)
    })

    it('should handle API success=false on status update', async () => {
      // Arrange
      const errorMessage = 'Status update failed'
      const mockPut = jest.fn().mockResolvedValue({
        data: { success: false, message: errorMessage, data: null },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPut })

      // Act
      const result = await store._updateStatusAnnexedDocumentAction(
        documentaryStructureContractId
      )

      // Assert
      expect(result).toBe(false)
    })

    it('handles error when updating status fails', async () => {
      // Arrange
      const mockPut = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPut })

      // Act
      const result = await store._updateStatusAnnexedDocumentAction(
        documentaryStructureContractId
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_PATH}/${documentaryStructureContractId}`
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
      ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPut })

      // Act
      const result = await store._updateStatusAnnexedDocumentAction(
        documentaryStructureContractId
      )

      // Assert
      expect(result).toBe(false)
    })
  })

  describe('_deleteAction', () => {
    it('should delete documentary structure contract successfully', async () => {
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
      const result = await store._deleteAction(documentaryStructureContractId)

      // Assert
      expect(mockDelete).toHaveBeenCalledWith(
        `${URL_PATH}/${documentaryStructureContractId}`
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
      const result = await store._deleteAction(documentaryStructureContractId)

      // Assert
      expect(result).toBe(false)
    })

    it('handles error when deleting documentary structure contract fails', async () => {
      // Arrange
      const mockDelete = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      const result = await store._deleteAction(documentaryStructureContractId)

      // Assert
      expect(mockDelete).toHaveBeenCalledWith(
        `${URL_PATH}/${documentaryStructureContractId}`
      )
      expect(result).toBe(false)
    })
  })

  describe('_clearData', () => {
    it('should clear all data from the store', () => {
      // Arrange
      store.documentary_structure_contracts_list = [
        {
          id: 1,
          contract_document_code: 'TEST',
          contract_document_name: 'Test Document',
          handle_stamp_duty: false,
          taxable_base_unit: null,
          tax_base: '1',
          requires_publication: false,
          minimum_amount: '1',
          policy_management: false,
        } as IDocumentaryStructureContract,
      ]
      store.annexed_documents_list = [
        {
          id: 1,
          type_attached_document_id: 1,
          type_of_policy_id: null,
          stage: null,
          mandatory: null,
          status_id: null,
        } as IDocumentaryStructureContractAnnexedDocument,
      ]
      store.documentary_structure_contracts_pages = {
        currentPage: 1,
        lastPage: 1,
        total_items: 10,
        per_page: 0,
      }
      store.annexed_documents_pages = {
        currentPage: 1,
        lastPage: 1,
        total_items: 10,
        per_page: 0,
      }

      // Act
      store._clearData()

      // Assert
      expect(store.documentary_structure_contracts_list).toEqual([])
      expect(store.documentary_structure_contracts_pages).toEqual({
        currentPage: 0,
        lastPage: 0,
        total_items: 0,
        per_page: 0,
      })
      expect(store.annexed_documents_list).toEqual([])
      expect(store.annexed_documents_pages).toEqual({
        currentPage: 0,
        lastPage: 0,
        total_items: 0,
        per_page: 0,
      })
    })
  })
})
