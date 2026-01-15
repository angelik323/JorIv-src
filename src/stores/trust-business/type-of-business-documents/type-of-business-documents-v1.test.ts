import { setActivePinia, createPinia } from 'pinia'
import { useTypeOfBusinessDocumentsStoreV1 } from './type-of-business-documents-v1'
import { executeApi } from '@/apis'
import { TRUST_BUSINESS_API_URL } from '@/constants/apis'
import {
  IBusinessTrustOnCreate,
  ITypeOfBusinessDocumentForm,
  ITypeOfBusinessDocumentList,
} from '@/interfaces/customs'

// Helper function to create mock form data
const createMockFormData = (
  overrides: Partial<ITypeOfBusinessDocumentForm> = {}
): ITypeOfBusinessDocumentForm => ({
  document_description: 'Test Document',
  document_code: 'TEST001',
  apply_for: 'General',
  current_business_requirements: true,
  ...overrides,
})

// Helper function to create mock list data
const createMockListData = (
  overrides: Partial<ITypeOfBusinessDocumentList> = {}
): ITypeOfBusinessDocumentList => ({
  id: 1,
  document_description: 'Document Type 1',
  document_code: 'DOC001',
  apply_for: 'General',
  current_business_requirements: true,
  business_trust_id: 1,
  business_trust: { id: 1, business_code: 'BT001' },
  ...overrides,
})

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
    showCatchError: jest.fn(() => 'Error!'),
  }))
  return { useAlert, useShowError }
})

jest.mock('@/utils', () => ({
  defaultIconsLucide: {
    plusCircleOutline: 'plus-circle-outline',
  },
}))

describe('useTypeOfBusinessDocumentsStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  // --- INITIAL STATE ---
  it('should initialize with correct default state', () => {
    // Arrange & Act
    const store = useTypeOfBusinessDocumentsStoreV1()

    // Assert
    expect(store.data_type_of_business_documents_list).toEqual([])
    expect(store.data_type_of_business_documents_form).toEqual({})
    expect(store.data_business_trust_on_create).toBeNull()
    expect(store.headerPropsDefault.title).toBe('Tipo de documentos negocio')
    expect(store.headerPropsDefault.breadcrumbs).toHaveLength(3)
    expect(store.pages.currentPage).toBe(1)
    expect(store.pages.lastPage).toBe(1)
  })

  // --- GET LIST TYPE OF BUSINESS DOCUMENTS ---
  it('should fetch list of type of business documents successfully', async () => {
    // Arrange
    const store = useTypeOfBusinessDocumentsStoreV1()
    const mockData: ITypeOfBusinessDocumentList[] = [
      createMockListData({ id: 1 }),
      createMockListData({
        id: 2,
        document_description: 'Document Type 2',
        document_code: 'DOC002',
        apply_for: 'Specific',
        current_business_requirements: false,
        business_trust_id: 2,
        business_trust: { id: 2, business_code: 'BT002' },
      }),
    ]
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          data: mockData,
          current_page: 1,
          last_page: 3,
        },
        message: 'List fetched successfully',
      },
    })
    const params = '&filter[id]=test'
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getListTypeOfBusinessDocuments(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/document-type/list?paginate=1${params}`
    )
    expect(store.data_type_of_business_documents_list).toEqual(mockData)
    expect(store.pages.currentPage).toBe(1)
    expect(store.pages.lastPage).toBe(3)
  })

  it('should handle empty data when fetching list of type of business documents', async () => {
    // Arrange
    const store = useTypeOfBusinessDocumentsStoreV1()
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
    const params = '&filter[id]=empty'
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getListTypeOfBusinessDocuments(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/document-type/list?paginate=1${params}`
    )
    expect(store.data_type_of_business_documents_list).toEqual([])
    expect(store.pages.currentPage).toBe(1)
    expect(store.pages.lastPage).toBe(1)
  })

  it('should handle error response when fetching list of type of business documents', async () => {
    // Arrange
    const store = useTypeOfBusinessDocumentsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: false,
        message: 'Failed to fetch data',
      },
    })
    const params = '&filter[id]=error'
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getListTypeOfBusinessDocuments(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/document-type/list?paginate=1${params}`
    )
    expect(store.data_type_of_business_documents_list).toEqual([])
  })

  it('should handle API error when fetching list of type of business documents', async () => {
    // Arrange
    const store = useTypeOfBusinessDocumentsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))
    const params = '&filter[id]=exception'
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getListTypeOfBusinessDocuments(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/document-type/list?paginate=1${params}`
    )
    expect(store.data_type_of_business_documents_list).toEqual([])
  })

  // --- SET DATA TYPE OF BUSINESS DOCUMENTS FORM ---
  it('should set data type of business documents form with valid data', () => {
    // Arrange
    const store = useTypeOfBusinessDocumentsStoreV1()
    const formData: ITypeOfBusinessDocumentForm = {
      document_description: 'Test Document',
      document_code: 'TEST001',
      apply_for: 'General',
      current_business_requirements: true,
    }

    // Act
    store._setDataTypeOfBusinessDocumentsForm(formData)

    // Assert
    expect(store.data_type_of_business_documents_form).toEqual(formData)
  })

  it('should set data type of business documents form to empty object when null is passed', () => {
    // Arrange
    const store = useTypeOfBusinessDocumentsStoreV1()

    // Act
    store._setDataTypeOfBusinessDocumentsForm(null)

    // Assert
    expect(store.data_type_of_business_documents_form).toEqual({})
  })

  // --- CREATE ACTION ---
  it('should create type of business document successfully', async () => {
    // Arrange
    const store = useTypeOfBusinessDocumentsStoreV1()
    const idTrustBusiness = 123
    const payload = createMockFormData({
      document_description: 'New Document Type',
      document_code: 'NEW001',
    })
    store.data_type_of_business_documents_form = payload
    store.data_business_trust_on_create = {
      id: 1,
      name: 'Test Trust',
    } as IBusinessTrustOnCreate

    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Document type created successfully',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createAction(idTrustBusiness, payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/document-type/new/${idTrustBusiness}`,
      payload
    )
    expect(result).toBe(true)
    expect(store.data_type_of_business_documents_form).toBeNull()
    expect(store.data_business_trust_on_create).toBeNull()
  })

  it('should not clear form data when create action fails', async () => {
    // Arrange
    const store = useTypeOfBusinessDocumentsStoreV1()
    const idTrustBusiness = 123
    const payload = createMockFormData({
      document_description: 'Failed Document Type',
      document_code: 'FAIL001',
    })
    store.data_type_of_business_documents_form = payload
    store.data_business_trust_on_create = {
      id: 1,
      name: 'Test Trust',
    } as IBusinessTrustOnCreate

    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: false,
        message: 'Failed to create document type',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createAction(idTrustBusiness, payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/document-type/new/${idTrustBusiness}`,
      payload
    )
    expect(result).toBe(false)
    expect(store.data_type_of_business_documents_form).toEqual(payload)
    expect(store.data_business_trust_on_create).toEqual({
      id: 1,
      name: 'Test Trust',
    })
  })

  it('should handle API error when creating type of business document', async () => {
    // Arrange
    const store = useTypeOfBusinessDocumentsStoreV1()
    const idTrustBusiness = 123
    const payload = createMockFormData({
      document_description: 'Error Document Type',
      document_code: 'ERR001',
    })

    const mockPost = jest.fn().mockRejectedValue(new Error('API Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createAction(idTrustBusiness, payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/document-type/new/${idTrustBusiness}`,
      payload
    )
    expect(result).toBe(false)
  })

  // --- SEARCH BUSINESS TRUST ---
  it('should search business trust successfully', async () => {
    // Arrange
    const store = useTypeOfBusinessDocumentsStoreV1()
    const textSearch = 'trust name'
    const mockBusinessTrust: IBusinessTrustOnCreate = {
      id: 1,
      name: 'Found Trust',
    } as IBusinessTrustOnCreate

    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          data: [mockBusinessTrust],
        },
        message: 'Business trust found',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._searchBusinessTrust(textSearch)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/manage/list?filter[id]=${textSearch}`
    )
    expect(store.data_business_trust_on_create).toEqual(mockBusinessTrust)
  })

  it('should handle empty search results for business trust', async () => {
    // Arrange
    const store = useTypeOfBusinessDocumentsStoreV1()
    const textSearch = 'nonexistent'

    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          data: [],
        },
        message: 'No business trust found',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._searchBusinessTrust(textSearch)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/manage/list?filter[id]=${textSearch}`
    )
    expect(store.data_business_trust_on_create).toEqual([])
  })

  it('should handle error response when searching business trust', async () => {
    // Arrange
    const store = useTypeOfBusinessDocumentsStoreV1()
    const textSearch = 'error search'

    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: false,
        message: 'Search failed',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._searchBusinessTrust(textSearch)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/manage/list?filter[id]=${textSearch}`
    )
  })

  it('should handle API error when searching business trust', async () => {
    // Arrange
    const store = useTypeOfBusinessDocumentsStoreV1()
    const textSearch = 'exception search'

    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._searchBusinessTrust(textSearch)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/manage/list?filter[id]=${textSearch}`
    )
  })

  // --- GET TYPE OF BUSINESS DOCUMENTS BY ID ---
  it('should fetch type of business document by id successfully', async () => {
    // Arrange
    const store = useTypeOfBusinessDocumentsStoreV1()
    const id = 123
    const mockFormData = createMockFormData({
      document_description: 'Document Type 123',
      document_code: 'DOC123',
    })
    const mockBusinessTrust: IBusinessTrustOnCreate = {
      id: 1,
      name: 'Associated Trust',
    }

    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          ...mockFormData,
          business_trust: mockBusinessTrust,
        },
        message: 'Document type found',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getTypeOfBusinessDocumentsById(id)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/document-type/show/${id}`
    )
    expect(store.data_type_of_business_documents_form).toEqual({
      ...mockFormData,
      business_trust: mockBusinessTrust,
    })
    expect(store.data_business_trust_on_create).toEqual(mockBusinessTrust)
  })

  it('should handle missing business trust when fetching by id', async () => {
    // Arrange
    const store = useTypeOfBusinessDocumentsStoreV1()
    const id = 456
    const mockFormData = createMockFormData({
      document_description: 'Document Type 456',
      document_code: 'DOC456',
    })

    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: mockFormData,
        message: 'Document type found',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getTypeOfBusinessDocumentsById(id)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/document-type/show/${id}`
    )
    expect(store.data_type_of_business_documents_form).toEqual(mockFormData)
    expect(store.data_business_trust_on_create).toBeNull()
  })

  it('should handle error response when fetching by id', async () => {
    // Arrange
    const store = useTypeOfBusinessDocumentsStoreV1()
    const id = 789

    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: false,
        message: 'Document type not found',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getTypeOfBusinessDocumentsById(id)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/document-type/show/${id}`
    )
    expect(store.data_type_of_business_documents_form).toEqual({})
  })

  it('should handle API error when fetching by id', async () => {
    // Arrange
    const store = useTypeOfBusinessDocumentsStoreV1()
    const id = 'error'

    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getTypeOfBusinessDocumentsById(id)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/document-type/show/${id}`
    )
  })

  // --- UPDATE ACTION ---
  it('should update type of business document successfully', async () => {
    // Arrange
    const store = useTypeOfBusinessDocumentsStoreV1()
    const id = 123
    const formData = createMockFormData({
      document_description: 'Updated Document Type',
      document_code: 'UPD001',
    })
    store.data_type_of_business_documents_form = formData
    store.data_business_trust_on_create = {
      id: 1,
      name: 'Test Trust',
    } as IBusinessTrustOnCreate

    const mockPut = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Document type updated successfully',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const result = await store._updateAction(id)

    // Assert
    expect(mockPut).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/document-type/update/${id}`,
      formData
    )
    expect(result).toBe(true)
    expect(store.data_type_of_business_documents_form).toBeNull()
    expect(store.data_business_trust_on_create).toBeNull()
  })

  it('should not clear form data when update action fails', async () => {
    // Arrange
    const store = useTypeOfBusinessDocumentsStoreV1()
    const id = 456
    const formData = createMockFormData({
      document_description: 'Failed Update Document Type',
      document_code: 'FAIL001',
    })
    store.data_type_of_business_documents_form = formData
    store.data_business_trust_on_create = {
      id: 1,
      name: 'Test Trust',
    } as IBusinessTrustOnCreate

    const mockPut = jest.fn().mockResolvedValue({
      data: {
        success: false,
        message: 'Failed to update document type',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const result = await store._updateAction(id)

    // Assert
    expect(mockPut).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/document-type/update/${id}`,
      formData
    )
    expect(result).toBe(false)
    expect(store.data_type_of_business_documents_form).toEqual(formData)
    expect(store.data_business_trust_on_create).toEqual({
      id: 1,
      name: 'Test Trust',
    })
  })

  it('should handle API error when updating type of business document', async () => {
    // Arrange
    const store = useTypeOfBusinessDocumentsStoreV1()
    const id = 'error'
    const formData = createMockFormData({
      document_description: 'Error Update Document Type',
      document_code: 'ERR001',
    })
    store.data_type_of_business_documents_form = formData

    const mockPut = jest.fn().mockRejectedValue(new Error('API Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const result = await store._updateAction(id)

    // Assert
    expect(mockPut).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/document-type/update/${id}`,
      formData
    )
    expect(result).toBe(false)
  })

  // --- DELETE ACTION ---
  it('should delete type of business document successfully', async () => {
    // Arrange
    const store = useTypeOfBusinessDocumentsStoreV1()
    const id = 123

    const mockDelete = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Document type deleted successfully',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    // Act
    const result = await store._deleteAction(id)

    // Assert
    expect(mockDelete).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/document-type/delete/${id}`
    )
    expect(result).toBe(true)
  })

  it('should handle error response when deleting type of business document', async () => {
    // Arrange
    const store = useTypeOfBusinessDocumentsStoreV1()
    const id = 456

    const mockDelete = jest.fn().mockResolvedValue({
      data: {
        success: false,
        message: 'Failed to delete document type',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    // Act
    const result = await store._deleteAction(id)

    // Assert
    expect(mockDelete).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/document-type/delete/${id}`
    )
    expect(result).toBe(false)
  })

  it('should handle API error when deleting type of business document', async () => {
    // Arrange
    const store = useTypeOfBusinessDocumentsStoreV1()
    const id = 'error'

    const mockDelete = jest.fn().mockRejectedValue(new Error('API Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    // Act
    const result = await store._deleteAction(id)

    // Assert
    expect(mockDelete).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/document-type/delete/${id}`
    )
    expect(result).toBe(false)
  })

  // --- ADDITIONAL EDGE CASES AND COVERAGE ---
  it('should handle API response with partial pagination data', async () => {
    // Arrange
    const store = useTypeOfBusinessDocumentsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          data: [createMockListData()],
          current_page: 2,
          // Missing last_page
        },
        message: 'Partial data',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getListTypeOfBusinessDocuments('&test=partial')

    // Assert
    expect(store.pages.currentPage).toBe(2)
    expect(store.pages.lastPage).toBe(1) // Should default to 1
  })

  it('should handle business trust search with empty text', async () => {
    // Arrange
    const store = useTypeOfBusinessDocumentsStoreV1()
    const textSearch = ''
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: { data: [] },
        message: 'Empty search',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._searchBusinessTrust(textSearch)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/manage/list?filter[id]=${textSearch}`
    )
    expect(store.data_business_trust_on_create).toEqual([])
  })

  it('should handle string ID in get by id action', async () => {
    // Arrange
    const store = useTypeOfBusinessDocumentsStoreV1()
    const id = 'string-id'
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: createMockFormData(),
        message: 'Found with string ID',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getTypeOfBusinessDocumentsById(id)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/document-type/show/${id}`
    )
    expect(store.data_type_of_business_documents_form).toEqual(
      createMockFormData()
    )
  })

  it('should handle string ID in update action', async () => {
    // Arrange
    const store = useTypeOfBusinessDocumentsStoreV1()
    const id = 'string-update-id'
    const formData = createMockFormData()
    store.data_type_of_business_documents_form = formData

    const mockPut = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Updated with string ID',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const result = await store._updateAction(id)

    // Assert
    expect(mockPut).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/document-type/update/${id}`,
      formData
    )
    expect(result).toBe(true)
  })

  it('should handle string ID in delete action', async () => {
    // Arrange
    const store = useTypeOfBusinessDocumentsStoreV1()
    const id = 'string-delete-id'

    const mockDelete = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Deleted with string ID',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    // Act
    const result = await store._deleteAction(id)

    // Assert
    expect(mockDelete).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/document-type/delete/${id}`
    )
    expect(result).toBe(true)
  })

  it('should handle form data with null values', async () => {
    // Arrange
    const store = useTypeOfBusinessDocumentsStoreV1()
    const formData = createMockFormData({
      current_business_requirements: null,
    })

    // Act
    store._setDataTypeOfBusinessDocumentsForm(formData)

    // Assert
    expect(store.data_type_of_business_documents_form).toEqual(formData)
    expect(
      store.data_type_of_business_documents_form?.current_business_requirements
    ).toBeNull()
  })

  it('should verify header props have correct structure', () => {
    // Arrange & Act
    const store = useTypeOfBusinessDocumentsStoreV1()

    // Assert
    expect(store.headerPropsDefault.title).toBe('Tipo de documentos negocio')
    expect(store.headerPropsDefault.breadcrumbs).toHaveLength(3)
    expect(store.headerPropsDefault.breadcrumbs[0]).toEqual({
      label: 'Inicio',
      route: 'HomeView',
    })
    expect(store.headerPropsDefault.breadcrumbs[1]).toEqual({
      label: 'Negocios Fiduciarios',
    })
    expect(store.headerPropsDefault.breadcrumbs[2]).toEqual({
      label: 'Tipo de documentos negocio',
      route: 'TypeOfBusinessDocumentsList',
    })
    expect(store.headerPropsDefault.btn.label).toBe('Crear')
    expect(store.headerPropsDefault.btn.icon).toBe('plus-circle-outline')
  })

  it('should handle create action with zero idTrustBusiness', async () => {
    // Arrange
    const store = useTypeOfBusinessDocumentsStoreV1()
    const idTrustBusiness = 0
    const payload = createMockFormData()

    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Created with zero ID',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createAction(idTrustBusiness, payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/document-type/new/${idTrustBusiness}`,
      payload
    )
    expect(result).toBe(true)
  })

  it('should handle business trust search with special characters', async () => {
    // Arrange
    const store = useTypeOfBusinessDocumentsStoreV1()
    const textSearch = 'trust@#$%'
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: { data: [] },
        message: 'Search with special chars',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._searchBusinessTrust(textSearch)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/manage/list?filter[id]=${textSearch}`
    )
  })
})
