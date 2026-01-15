import { setActivePinia, createPinia } from 'pinia'
import { useDocumentCharacteristicsStoreV1 } from './document-characteristics-v1'
import { executeApi } from '@/apis'
import { TRUST_BUSINESS_API_URL } from '@/constants/apis'
import {
  IDocumentCharacteristicsForm,
  IDocumentCharacteristicsList,
  IDocumentCharacteristicsPayload,
} from '@/interfaces/customs'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}))

jest.mock('@/composables', () => {
  const useAlert = jest.fn(() => ({ showAlert: jest.fn() }))
  const useShowError = jest.fn(() => ({
    showCatchError: jest.fn(() => 'Error message'),
  }))
  return { useAlert, useShowError }
})

jest.mock('@/utils', () => ({
  defaultIconsLucide: {
    plusCircleOutline: 'plus-circle-outline',
  },
}))

describe('useDocumentCharacteristicsStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should initialize with correct default state', () => {
      // Arrange & Act
      const store = useDocumentCharacteristicsStoreV1()

      // Assert
      expect(store.data_document_characteristics_list).toEqual([])
      expect(store.data_document_characteristics_form).toEqual({})
      expect(store.headerPropsDefault.title).toBe(
        'Características de documento'
      )
      expect(store.headerPropsDefault.breadcrumbs).toHaveLength(3)
      expect(store.headerPropsDefault.btn.label).toBe('Crear')
      expect(store.pages.currentPage).toBe(1)
      expect(store.pages.lastPage).toBe(1)
    })
  })

  describe('_getListDocumentCharacteristics', () => {
    it('should fetch list of document characteristics successfully', async () => {
      // Arrange
      const store = useDocumentCharacteristicsStoreV1()
      const mockData: IDocumentCharacteristicsList[] = [
        {
          id: 1,
          business_trust_id: 1,
          document_type_id: 1,
          created_at: new Date('2024-01-01'),
          business_trust: {
            id: 1,
            name: 'Trust Business 1',
            business_code: 'TB001',
          },
          business_trust_document_type: {
            id: 1,
            document_code: 'DOC001',
            document_description: 'Document Type 1',
          },
        },
      ]
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          data: {
            data: mockData,
            current_page: 2,
            last_page: 5,
          },
          message: 'Document characteristics list fetched successfully',
        },
      })
      const params = '&filter=active'
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListDocumentCharacteristics(params)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${TRUST_BUSINESS_API_URL}/characteristic-document/list?paginate=1${params}`
      )
      expect(store.data_document_characteristics_list).toEqual(mockData)
      expect(store.pages.currentPage).toBe(2)
      expect(store.pages.lastPage).toBe(5)
    })

    it('should handle empty data response', async () => {
      // Arrange
      const store = useDocumentCharacteristicsStoreV1()
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          data: {
            data: null,
            current_page: null,
            last_page: null,
          },
          message: 'No data found',
        },
      })
      const params = '&filter=inactive'
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListDocumentCharacteristics(params)

      // Assert
      expect(store.data_document_characteristics_list).toEqual([])
      expect(store.pages.currentPage).toBe(1)
      expect(store.pages.lastPage).toBe(1)
    })

    it('should handle unsuccessful response', async () => {
      // Arrange
      const store = useDocumentCharacteristicsStoreV1()
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'Failed to fetch data',
        },
      })
      const params = '&search=test'
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListDocumentCharacteristics(params)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${TRUST_BUSINESS_API_URL}/characteristic-document/list?paginate=1${params}`
      )
      expect(store.data_document_characteristics_list).toEqual([])
    })

    it('should handle API error when fetching document characteristics', async () => {
      // Arrange
      const store = useDocumentCharacteristicsStoreV1()
      const mockGet = jest.fn().mockRejectedValue(new Error('Network error'))
      const params = '&page=1'
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListDocumentCharacteristics(params)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${TRUST_BUSINESS_API_URL}/characteristic-document/list?paginate=1${params}`
      )
      expect(store.data_document_characteristics_list).toEqual([])
    })
  })

  describe('_createAction', () => {
    const mockPayload: IDocumentCharacteristicsPayload = {
      document_type_id: 1,
      characteristics_document: [
        {
          document_structure_id: 1,
          order: 1,
        },
        {
          document_structure_id: 2,
          order: 2,
        },
      ],
      action: 'create',
    }

    it('should create document characteristics successfully', async () => {
      // Arrange
      const store = useDocumentCharacteristicsStoreV1()
      const idTrustBusiness = 123
      store.data_document_characteristics_form = {
        business_trust_id: 1,
        document_type_id: 1,
        created_at: '2024-01-01',
        characteristics_document: [],
      }
      store.data_document_characteristics_list = [
        {
          id: 1,
          business_trust_id: 1,
          document_type_id: 1,
          created_at: new Date(),
          business_trust: { id: 1, name: 'Test', business_code: 'TEST' },
          business_trust_document_type: {
            id: 1,
            document_code: 'DOC',
            document_description: 'Test Doc',
          },
        },
      ]
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Document characteristics created successfully',
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createAction(idTrustBusiness, mockPayload)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${TRUST_BUSINESS_API_URL}/characteristic-document/new/${idTrustBusiness}`,
        mockPayload
      )
      expect(result).toBe(true)
      expect(store.data_document_characteristics_form).toBeNull()
      expect(store.data_document_characteristics_list).toEqual([])
    })

    it('should handle creation failure without clearing data', async () => {
      // Arrange
      const store = useDocumentCharacteristicsStoreV1()
      const idTrustBusiness = 456
      const originalForm = {
        business_trust_id: 1,
        document_type_id: 1,
        created_at: '2024-01-01',
        characteristics_document: [],
      }
      const originalList = [
        {
          id: 1,
          business_trust_id: 1,
          document_type_id: 1,
          created_at: new Date(),
          business_trust: { id: 1, name: 'Test', business_code: 'TEST' },
          business_trust_document_type: {
            id: 1,
            document_code: 'DOC',
            document_description: 'Test Doc',
          },
        },
      ]
      store.data_document_characteristics_form = originalForm
      store.data_document_characteristics_list = originalList
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'Creation failed',
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createAction(idTrustBusiness, mockPayload)

      // Assert
      expect(result).toBe(false)
      expect(store.data_document_characteristics_form).toEqual(originalForm)
      expect(store.data_document_characteristics_list).toEqual(originalList)
    })

    it('should handle API error during creation', async () => {
      // Arrange
      const store = useDocumentCharacteristicsStoreV1()
      const idTrustBusiness = 789
      const mockPost = jest.fn().mockRejectedValue(new Error('Server error'))
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createAction(idTrustBusiness, mockPayload)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${TRUST_BUSINESS_API_URL}/characteristic-document/new/${idTrustBusiness}`,
        mockPayload
      )
      expect(result).toBe(false)
    })

    it('should work with string id for trust business', async () => {
      // Arrange
      const store = useDocumentCharacteristicsStoreV1()
      const idTrustBusiness = '999'
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Created successfully',
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createAction(idTrustBusiness, mockPayload)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${TRUST_BUSINESS_API_URL}/characteristic-document/new/${idTrustBusiness}`,
        mockPayload
      )
      expect(result).toBe(true)
    })
  })

  describe('_getDocumentCharacteristicsById', () => {
    const mockFormData: IDocumentCharacteristicsForm = {
      business_trust_id: 1,
      document_type_id: 1,
      created_at: '2024-01-01',
      characteristics_document: [
        {
          id: 1,
          description: 'Test characteristic',
          characteristic_code: 'CHAR001',
          type: 'text',
          obligatory: true,
          alert: false,
          business_trust_id: 1,
          order: 1,
        },
      ],
      business_trust: {
        id: 1,
        name: 'Test Trust',
        business_code: 'TT001',
      },
    }

    it('should fetch document characteristics by id successfully', async () => {
      // Arrange
      const store = useDocumentCharacteristicsStoreV1()
      const id = 123
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: true,
          data: mockFormData,
          message: 'Document characteristics found',
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      await store._getDocumentCharacteristicsById(id)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${TRUST_BUSINESS_API_URL}/characteristic-document/show/${id}`
      )
      expect(store.data_document_characteristics_form).toEqual(mockFormData)
    })

    it('should handle empty data response', async () => {
      // Arrange
      const store = useDocumentCharacteristicsStoreV1()
      const id = 456
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: true,
          data: null,
          message: 'Document characteristics found',
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      await store._getDocumentCharacteristicsById(id)

      // Assert
      expect(store.data_document_characteristics_form).toEqual({})
    })

    it('should handle unsuccessful response', async () => {
      // Arrange
      const store = useDocumentCharacteristicsStoreV1()
      const id = 789
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'Document characteristics not found',
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      await store._getDocumentCharacteristicsById(id)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${TRUST_BUSINESS_API_URL}/characteristic-document/show/${id}`
      )
      expect(store.data_document_characteristics_form).toEqual({})
    })

    it('should handle API error when fetching by id', async () => {
      // Arrange
      const store = useDocumentCharacteristicsStoreV1()
      const id = 999
      const mockPost = jest.fn().mockRejectedValue(new Error('Database error'))
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      await store._getDocumentCharacteristicsById(id)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${TRUST_BUSINESS_API_URL}/characteristic-document/show/${id}`
      )
      expect(store.data_document_characteristics_form).toEqual({})
    })

    it('should work with string id', async () => {
      // Arrange
      const store = useDocumentCharacteristicsStoreV1()
      const id = '555'
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: true,
          data: mockFormData,
          message: 'Found',
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      await store._getDocumentCharacteristicsById(id)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${TRUST_BUSINESS_API_URL}/characteristic-document/show/${id}`
      )
      expect(store.data_document_characteristics_form).toEqual(mockFormData)
    })
  })

  describe('_deleteAction', () => {
    it('should delete document characteristics successfully', async () => {
      // Arrange
      const store = useDocumentCharacteristicsStoreV1()
      const id = 123
      store.data_document_characteristics_form = {
        business_trust_id: 1,
        document_type_id: 1,
        created_at: '2024-01-01',
        characteristics_document: [],
      }
      store.data_document_characteristics_list = [
        {
          id: 1,
          business_trust_id: 1,
          document_type_id: 1,
          created_at: new Date(),
          business_trust: { id: 1, name: 'Test', business_code: 'TEST' },
          business_trust_document_type: {
            id: 1,
            document_code: 'DOC',
            document_description: 'Test Doc',
          },
        },
      ]
      const mockDelete = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Document characteristics deleted successfully',
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      const result = await store._deleteAction(id)

      // Assert
      expect(mockDelete).toHaveBeenCalledWith(
        `${TRUST_BUSINESS_API_URL}/characteristic-document/delete/${id}`
      )
      expect(result).toBe(true)
      expect(store.data_document_characteristics_form).toBeNull()
      expect(store.data_document_characteristics_list).toEqual([])
    })

    it('should handle deletion failure without clearing data', async () => {
      // Arrange
      const store = useDocumentCharacteristicsStoreV1()
      const id = 456
      const originalForm = {
        business_trust_id: 1,
        document_type_id: 1,
        created_at: '2024-01-01',
        characteristics_document: [],
      }
      const originalList = [
        {
          id: 1,
          business_trust_id: 1,
          document_type_id: 1,
          created_at: new Date(),
          business_trust: { id: 1, name: 'Test', business_code: 'TEST' },
          business_trust_document_type: {
            id: 1,
            document_code: 'DOC',
            document_description: 'Test Doc',
          },
        },
      ]
      store.data_document_characteristics_form = originalForm
      store.data_document_characteristics_list = originalList
      const mockDelete = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'Deletion failed',
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      const result = await store._deleteAction(id)

      // Assert
      expect(result).toBe(false)
      expect(store.data_document_characteristics_form).toEqual(originalForm)
      expect(store.data_document_characteristics_list).toEqual(originalList)
    })

    it('should handle API error during deletion', async () => {
      // Arrange
      const store = useDocumentCharacteristicsStoreV1()
      const id = 789
      const mockDelete = jest
        .fn()
        .mockRejectedValue(new Error('Permission denied'))
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      const result = await store._deleteAction(id)

      // Assert
      expect(mockDelete).toHaveBeenCalledWith(
        `${TRUST_BUSINESS_API_URL}/characteristic-document/delete/${id}`
      )
      expect(result).toBe(false)
    })

    it('should work with string id', async () => {
      // Arrange
      const store = useDocumentCharacteristicsStoreV1()
      const id = '999'
      const mockDelete = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Deleted successfully',
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      const result = await store._deleteAction(id)

      // Assert
      expect(mockDelete).toHaveBeenCalledWith(
        `${TRUST_BUSINESS_API_URL}/characteristic-document/delete/${id}`
      )
      expect(result).toBe(true)
    })
  })
})
