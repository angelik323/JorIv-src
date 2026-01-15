import { setActivePinia, createPinia } from 'pinia'
import { useTrustBusinessDocumentStructureStoreV1 } from './trust-business-document-structure-v1'
import { executeApi } from '@/apis'
import { TRUST_BUSINESS_API_URL } from '@/constants/apis'
import {
  ITrustBusinessDocumentStructureForm,
  ITrustBusinessDocumentStructureList,
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
    showCatchError: jest.fn(() => 'Error!'),
  }))
  return { useAlert, useShowError }
})

describe('useTrustBusinessDocumentStructureStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  // --- LIST TRUST BUSINESS DOCUMENT STRUCTURE ---
  it('should fetch list of trust business document structures', async () => {
    // Arrange
    const store = useTrustBusinessDocumentStructureStoreV1()
    const mockListData: ITrustBusinessDocumentStructureList[] = [
      {
        id: 1,
        description: 'Documento Test',
        characteristic_code: 'TEST001',
        type: 'Obligatorio',
        is_obligatory: true,
        alert: false,
        business_trust_id: 1,
        business_trust: {
          id: 1,
          business_code: 'BT001',
        },
      },
    ]
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          data: mockListData,
          current_page: 1,
          last_page: 2,
        },
        message: 'List fetched successfully',
      },
      status: 200,
    })
    const params = '&filter[id]=test'
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getListTrustBusinessDocumentStructure(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/document-structure/list?paginate=1${params}`
    )
    expect(store.data_trust_business_document_structure_list).toEqual(
      mockListData
    )
    expect(store.pages.currentPage).toBe(1)
    expect(store.pages.lastPage).toBe(2)
  })

  it('should handle error when fetching trust business document structures', async () => {
    // Arrange
    const store = useTrustBusinessDocumentStructureStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))
    const params = '&filter[id]=test'
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getListTrustBusinessDocumentStructure(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/document-structure/list?paginate=1${params}`
    )
    expect(store.data_trust_business_document_structure_list).toEqual([])
  })

  it('should handle response with empty data array', async () => {
    // Arrange
    const store = useTrustBusinessDocumentStructureStoreV1()
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
      status: 200,
    })
    const params = '&filter[id]=test'
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getListTrustBusinessDocumentStructure(params)

    // Assert
    expect(store.data_trust_business_document_structure_list).toEqual([])
    expect(store.pages.currentPage).toBe(1)
    expect(store.pages.lastPage).toBe(1)
  })

  // --- SET DATA FORM ---
  it('should set data trust business document structure form with valid data', () => {
    // Arrange
    const store = useTrustBusinessDocumentStructureStoreV1()
    const formData: ITrustBusinessDocumentStructureForm = {
      description: 'Test Document',
      characteristic_code: 'TEST001',
      type: 'Obligatorio',
      is_obligatory: true,
      alert: false,
    }

    // Act
    store._setDataTrustBusinessDocumentStructureForm(formData)

    // Assert
    expect(store.data_trust_business_document_structure_form).toEqual(formData)
  })

  it('should set empty object when data is null', () => {
    // Arrange
    const store = useTrustBusinessDocumentStructureStoreV1()

    // Act
    store._setDataTrustBusinessDocumentStructureForm(null)

    // Assert
    expect(store.data_trust_business_document_structure_form).toEqual({})
  })

  // --- CREATE ACTION ---
  it('should create a new trust business document structure successfully', async () => {
    // Arrange
    const store = useTrustBusinessDocumentStructureStoreV1()
    const idTrustBusiness = 1
    const payload: ITrustBusinessDocumentStructureForm = {
      description: 'New Document',
      characteristic_code: 'NEW001',
      type: 'Obligatorio',
      is_obligatory: true,
      alert: false,
    }
    store.data_trust_business_document_structure_form = payload
    store.data_business_trust_on_create = { id: 1, name: 'Test Business' }
    store.data_trust_business_document_structure_list = [
      {
        id: 1,
        description: 'Existing',
        characteristic_code: 'EX001',
        type: 'Obligatorio',
        is_obligatory: true,
        alert: false,
        business_trust_id: 1,
        business_trust: { id: 1, business_code: 'BT001' },
      },
    ]

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Created successfully' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createAction(idTrustBusiness, payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/document-structure/new/${idTrustBusiness}`,
      payload
    )
    expect(result).toBe(true)
    expect(store.data_trust_business_document_structure_form).toBeNull()
    expect(store.data_business_trust_on_create).toBeNull()
    expect(store.data_trust_business_document_structure_list).toEqual([])
  })

  it('should not clear data when creation fails', async () => {
    // Arrange
    const store = useTrustBusinessDocumentStructureStoreV1()
    const idTrustBusiness = 1
    const payload: ITrustBusinessDocumentStructureForm = {
      description: 'New Document',
      characteristic_code: 'NEW001',
      type: 'Obligatorio',
      is_obligatory: true,
      alert: false,
    }
    store.data_trust_business_document_structure_form = payload
    store.data_business_trust_on_create = { id: 1, name: 'Test Business' }

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Creation failed' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createAction(idTrustBusiness, payload)

    // Assert
    expect(result).toBe(false)
    expect(store.data_trust_business_document_structure_form).toEqual(payload)
    expect(store.data_business_trust_on_create).toEqual({
      id: 1,
      name: 'Test Business',
    })
  })

  it('should handle error during creation', async () => {
    // Arrange
    const store = useTrustBusinessDocumentStructureStoreV1()
    const idTrustBusiness = 1
    const payload: ITrustBusinessDocumentStructureForm = {
      description: 'New Document',
      characteristic_code: 'NEW001',
      type: 'Obligatorio',
      is_obligatory: true,
      alert: false,
    }

    const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createAction(idTrustBusiness, payload)

    // Assert
    expect(result).toBe(false)
  })

  // --- SEARCH BUSINESS TRUST ---
  it('should search business trust successfully', async () => {
    // Arrange
    const store = useTrustBusinessDocumentStructureStoreV1()
    const textSearch = 'Test Business'
    const mockBusinessData = {
      id: 1,
      business_code: 'BT001',
      name: 'Test Business Trust',
    }
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          data: [mockBusinessData],
        },
        message: 'Business found',
      },
      status: 200,
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._searchBusinessTrust(textSearch)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/manage/list?filter[id]=${textSearch}`
    )
    expect(store.data_business_trust_on_create).toEqual(mockBusinessData)
  })

  it('should handle empty search results', async () => {
    // Arrange
    const store = useTrustBusinessDocumentStructureStoreV1()
    const textSearch = 'NonExistent'
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          data: [],
        },
        message: 'No business found',
      },
      status: 200,
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._searchBusinessTrust(textSearch)

    // Assert
    expect(store.data_business_trust_on_create).toEqual([])
  })

  it('should handle error during business trust search', async () => {
    // Arrange
    const store = useTrustBusinessDocumentStructureStoreV1()
    const textSearch = 'Test'
    const mockGet = jest.fn().mockRejectedValue(new Error('Search Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._searchBusinessTrust(textSearch)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/manage/list?filter[id]=${textSearch}`
    )
  })

  // --- GET BY ID ---
  it('should fetch trust business document structure by id successfully', async () => {
    // Arrange
    const store = useTrustBusinessDocumentStructureStoreV1()
    const id = 1
    const mockResponseData = {
      id: 1,
      description: 'Test Document',
      characteristic_code: 'TEST001',
      type: 'Obligatorio',
      is_obligatory: true,
      alert: false,
      business_trust_code: 123,
      business_trust_name: 'Test Business Trust',
    }
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: mockResponseData,
        message: 'Document structure found',
      },
      status: 200,
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getTrustBusinessDocumentStructureById(id)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/document-structure/show/${id}`
    )
    expect(store.data_trust_business_document_structure_form).toEqual(
      mockResponseData
    )
    expect(store.data_business_trust_on_create).toEqual({
      id: 123,
      name: 'Test Business Trust',
    })
  })

  it('should handle empty response when getting by id', async () => {
    // Arrange
    const store = useTrustBusinessDocumentStructureStoreV1()
    const id = 1
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: null,
        message: 'Document structure not found',
      },
      status: 200,
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getTrustBusinessDocumentStructureById(id)

    // Assert
    expect(store.data_trust_business_document_structure_form).toEqual({})
    expect(store.data_business_trust_on_create).toEqual({
      id: 0,
      name: '',
    })
  })

  it('should handle error when getting by id', async () => {
    // Arrange
    const store = useTrustBusinessDocumentStructureStoreV1()
    const id = 1
    const mockGet = jest.fn().mockRejectedValue(new Error('Get Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getTrustBusinessDocumentStructureById(id)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/document-structure/show/${id}`
    )
  })

  // --- UPDATE ACTION ---
  it('should update trust business document structure successfully', async () => {
    // Arrange
    const store = useTrustBusinessDocumentStructureStoreV1()
    const id = 1
    const formData: ITrustBusinessDocumentStructureForm = {
      description: 'Updated Document',
      characteristic_code: 'UPD001',
      type: 'Opcional',
      is_obligatory: false,
      alert: true,
    }
    store.data_trust_business_document_structure_form = formData
    store.data_business_trust_on_create = { id: 1, name: 'Test Business' }
    store.data_trust_business_document_structure_list = [
      {
        id: 1,
        description: 'Existing',
        characteristic_code: 'EX001',
        type: 'Obligatorio',
        is_obligatory: true,
        alert: false,
        business_trust_id: 1,
        business_trust: { id: 1, business_code: 'BT001' },
      },
    ]

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Updated successfully' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const result = await store._updateAction(id)

    // Assert
    expect(mockPut).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/document-structure/update/${id}`,
      formData
    )
    expect(result).toBe(true)
    expect(store.data_trust_business_document_structure_form).toBeNull()
    expect(store.data_business_trust_on_create).toBeNull()
    expect(store.data_trust_business_document_structure_list).toEqual([])
  })

  it('should not clear data when update fails', async () => {
    // Arrange
    const store = useTrustBusinessDocumentStructureStoreV1()
    const id = 1
    const formData: ITrustBusinessDocumentStructureForm = {
      description: 'Updated Document',
      characteristic_code: 'UPD001',
      type: 'Opcional',
      is_obligatory: false,
      alert: true,
    }
    store.data_trust_business_document_structure_form = formData
    store.data_business_trust_on_create = { id: 1, name: 'Test Business' }

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Update failed' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const result = await store._updateAction(id)

    // Assert
    expect(result).toBe(false)
    expect(store.data_trust_business_document_structure_form).toEqual(formData)
    expect(store.data_business_trust_on_create).toEqual({
      id: 1,
      name: 'Test Business',
    })
  })

  it('should handle error during update', async () => {
    // Arrange
    const store = useTrustBusinessDocumentStructureStoreV1()
    const id = 1
    const mockPut = jest.fn().mockRejectedValue(new Error('Update Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const result = await store._updateAction(id)

    // Assert
    expect(result).toBe(false)
  })

  // --- DELETE ACTION ---
  it('should delete trust business document structure successfully', async () => {
    // Arrange
    const store = useTrustBusinessDocumentStructureStoreV1()
    const id = 1
    store.data_trust_business_document_structure_form = {
      description: 'Test',
      characteristic_code: 'TEST001',
      type: 'Obligatorio',
      is_obligatory: true,
      alert: false,
    }
    store.data_business_trust_on_create = { id: 1, name: 'Test Business' }
    store.data_trust_business_document_structure_list = [
      {
        id: 1,
        description: 'Existing',
        characteristic_code: 'EX001',
        type: 'Obligatorio',
        is_obligatory: true,
        alert: false,
        business_trust_id: 1,
        business_trust: { id: 1, business_code: 'BT001' },
      },
    ]

    const mockDelete = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Deleted successfully' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    // Act
    const result = await store._deleteAction(id)

    // Assert
    expect(mockDelete).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/document-structure/delete/${id}`
    )
    expect(result).toBe(true)
    expect(store.data_trust_business_document_structure_form).toBeNull()
    expect(store.data_business_trust_on_create).toBeNull()
    expect(store.data_trust_business_document_structure_list).toEqual([])
  })

  it('should not clear data when delete fails', async () => {
    // Arrange
    const store = useTrustBusinessDocumentStructureStoreV1()
    const id = 1
    const originalForm = {
      description: 'Test',
      characteristic_code: 'TEST001',
      type: 'Obligatorio',
      is_obligatory: true,
      alert: false,
    }
    const originalBusiness = { id: 1, name: 'Test Business' }
    store.data_trust_business_document_structure_form = originalForm
    store.data_business_trust_on_create = originalBusiness

    const mockDelete = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Delete failed' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    // Act
    const result = await store._deleteAction(id)

    // Assert
    expect(result).toBe(false)
    expect(store.data_trust_business_document_structure_form).toEqual(
      originalForm
    )
    expect(store.data_business_trust_on_create).toEqual(originalBusiness)
  })

  it('should handle error during delete', async () => {
    // Arrange
    const store = useTrustBusinessDocumentStructureStoreV1()
    const id = 1
    const mockDelete = jest.fn().mockRejectedValue(new Error('Delete Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    // Act
    const result = await store._deleteAction(id)

    // Assert
    expect(result).toBe(false)
  })

  // --- EDGE CASES ---
  it('should handle string id parameters correctly for get by id', async () => {
    // Arrange
    const store = useTrustBusinessDocumentStructureStoreV1()
    const stringId = '123'
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          id: 123,
          description: 'Test Document',
          business_trust_code: 456,
          business_trust_name: 'Test Trust',
        },
        message: 'Found',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getTrustBusinessDocumentStructureById(stringId)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/document-structure/show/${stringId}`
    )
  })

  it('should handle string id parameters correctly for update', async () => {
    // Arrange
    const store = useTrustBusinessDocumentStructureStoreV1()
    const stringId = '123'
    const formData: ITrustBusinessDocumentStructureForm = {
      description: 'Updated',
      characteristic_code: 'UPD001',
      type: 'Opcional',
      is_obligatory: false,
      alert: true,
    }
    store.data_trust_business_document_structure_form = formData
    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Updated' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const result = await store._updateAction(stringId)

    // Assert
    expect(mockPut).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/document-structure/update/${stringId}`,
      formData
    )
    expect(result).toBe(true)
  })

  it('should handle string id parameters correctly for delete', async () => {
    // Arrange
    const store = useTrustBusinessDocumentStructureStoreV1()
    const stringId = '123'
    const mockDelete = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Deleted' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    // Act
    const result = await store._deleteAction(stringId)

    // Assert
    expect(mockDelete).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/document-structure/delete/${stringId}`
    )
    expect(result).toBe(true)
  })

  it('should handle unsuccessful API responses with success false', async () => {
    // Arrange
    const store = useTrustBusinessDocumentStructureStoreV1()
    const params = '&filter[id]=test'
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: false,
        data: null,
        message: 'Unauthorized access',
      },
      status: 200,
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getListTrustBusinessDocumentStructure(params)

    // Assert
    expect(store.data_trust_business_document_structure_list).toEqual([])
  })

  it('should handle search business trust with unsuccessful response', async () => {
    // Arrange
    const store = useTrustBusinessDocumentStructureStoreV1()
    const textSearch = 'test'
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: false,
        data: null,
        message: 'Search failed',
      },
      status: 200,
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._searchBusinessTrust(textSearch)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/manage/list?filter[id]=${textSearch}`
    )
  })

  it('should handle get by id with unsuccessful response', async () => {
    // Arrange
    const store = useTrustBusinessDocumentStructureStoreV1()
    const id = 1
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: false,
        data: null,
        message: 'Not found',
      },
      status: 200,
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getTrustBusinessDocumentStructureById(id)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${TRUST_BUSINESS_API_URL}/document-structure/show/${id}`
    )
  })

  // --- INITIAL STATE TESTS ---
  it('should have correct initial state', () => {
    // Arrange & Act
    const store = useTrustBusinessDocumentStructureStoreV1()

    // Assert
    expect(store.data_trust_business_document_structure_list).toEqual([])
    expect(store.data_trust_business_document_structure_form).toEqual({})
    expect(store.data_business_trust_on_create).toBeNull()
    expect(store.pages.currentPage).toBe(1)
    expect(store.pages.lastPage).toBe(1)
    expect(store.headerPropsDefault.title).toBe(
      'Estructura documento negocios fiduciarios'
    )
    expect(store.headerPropsDefault.breadcrumbs).toHaveLength(3)
    expect(store.headerPropsDefault.btn.label).toBe('Crear')
  })
})
