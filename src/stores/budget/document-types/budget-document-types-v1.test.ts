import { setActivePinia, createPinia } from 'pinia'
import { useBudgetDocumentTypesStoreV1 } from './budget-document-types-v1'
import { executeApi } from '@/apis'

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
  useUtils: jest.fn(),
}))

describe('useBudgetDocumentTypesStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should fetch document types list and update state on success', async () => {
    const store = useBudgetDocumentTypesStoreV1()
    const mockItem = { id: 1, code: 'DT1', description: 'DocType 1' }
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Listado',
        data: { data: [mockItem], current_page: 2, last_page: 5 },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getDocumentTypes({ page: 2 })

    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining('budget-document-type'),
      {
        params: { page: 2, paginate: 1 },
      }
    )
    expect(store.budget_document_types_list).toEqual([mockItem])
    expect(store.budget_document_types_pages.currentPage).toBe(2)
    expect(store.budget_document_types_pages.lastPage).toBe(5)
  })

  it('should fetch document types balance validations and update state on success', async () => {
    const store = useBudgetDocumentTypesStoreV1()
    const mockValidation = { id: 10, some: 'value' }
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Validations',
        data: { data: [mockValidation], current_page: 1, last_page: 1 },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getDocumentTypesBalanceValidations(5, { page: 1 })

    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining('budget-document-type/balance-validation/5'),
      { params: { page: 1, paginate: 1 } }
    )
    expect(store.balance_validations_list).toEqual([mockValidation])
    expect(store.balance_validations_pages.currentPage).toBe(1)
    expect(store.balance_validations_pages.lastPage).toBe(1)
  })

  it('should create a document type successfully', async () => {
    const store = useBudgetDocumentTypesStoreV1()
    const payload = {
      budget_level_id: 1,
      code: '1',
      description: '1',
      validity: '1',
      requires_authorization: true,
      allows_adjustments: true,
      validity_closure: true,
      creates_new_document: true,
      allows_additions: true,
      allows_deductions: true,
      validates_area: true,
      requires_city: true,
      requires_balance_validation_by_document_type: true,
      has_expiration_date: true,
      expiration_periodicity: '1',
      numbering_type: '1',
    }
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Creado' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction(payload)

    expect(mockPost).toHaveBeenCalledWith(
      expect.stringContaining('budget-document-type'),
      payload
    )
    expect(result).toBe(true)
  })

  it('should update a document type successfully', async () => {
    const store = useBudgetDocumentTypesStoreV1()
    const payload = {
      id: 1,
      budget_level_id: 1,
      code: '1',
      description: '1',
      validity: '1',
      requires_authorization: true,
      allows_adjustments: true,
      validity_closure: true,
      creates_new_document: true,
      allows_additions: true,
      allows_deductions: true,
      validates_area: true,
      requires_city: true,
      requires_balance_validation_by_document_type: true,
      has_expiration_date: true,
      expiration_periodicity: '1',
      numbering_type: '1',
    }

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Actualizado' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateAction(payload)

    expect(mockPut).toHaveBeenCalledWith(
      expect.stringContaining('budget-document-type/1'),
      payload
    )
    expect(result).toBe(true)
  })

  it('should delete a document type successfully', async () => {
    const store = useBudgetDocumentTypesStoreV1()
    const mockDelete = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Eliminado' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const result = await store._deleteAction(7)

    expect(mockDelete).toHaveBeenCalledWith(
      expect.stringContaining('budget-document-type/7')
    )
    expect(result).toBe(true)
  })

  it('should delete a balance validation successfully', async () => {
    const store = useBudgetDocumentTypesStoreV1()
    const mockDelete = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Eliminado' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const result = await store._deleteBalanceValidation(99)

    expect(mockDelete).toHaveBeenCalledWith(
      expect.stringContaining('budget-document-type/balance-validation/99')
    )
    expect(result).toBe(true)
  })

  it('should download document types and call utils to save file', async () => {
    const store = useBudgetDocumentTypesStoreV1()
    const mockResponse = {
      data: 'fake-blob',
      headers: { 'content-type': 'application/vnd.ms-excel' },
    }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    await store._downloadDocumentTypes({ status: 1 })

    expect(mockPost).toHaveBeenCalledWith(
      expect.stringContaining('budget-document-type/export'),
      { status: 1 },
      { responseType: 'blob' }
    )
  })

  it('should get document type by id and map response correctly', async () => {
    const store = useBudgetDocumentTypesStoreV1()
    const apiData = {
      level: { id: 2 },
      code: 'DT-01',
      description: 'Document type 1',
      validity: 12,
      requires_authorization: true,
      allows_adjustments: false,
      validity_closure: true,
      creates_new_document: false,
      allows_additions: true,
      allows_deductions: false,
      validates_area: true,
      requires_city: false,
      requires_balance_validation_by_document_type: true,
      has_expiration_date: false,
      expiration_periodicity: 'monthly',
      numbering_type: 'sequential',
      budget_document_type_balance_validations: [
        {
          budget_structure_id: 5,
          budget_item_structure: { code: 'BI-1', description: 'Item 1' },
          resource_structure: { code: 'RS-1', description: 'Resource 1' },
          movement_code: { id: 20, description: 'Move' },
          balance_validation_level: { id: 3, description: 'Level 3' },
          validates_document_type: {
            validates_document_type: true,
            id: 9,
            description: 'DT-9',
          },
        },
      ],
    }
    const mockGet = jest.fn().mockResolvedValue({
      data: { success: true, message: 'OK', data: apiData },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getDocumentTypeById(33)

    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining('budget-document-type/33')
    )
    expect(result).toBeDefined()
  })

  it('should return null when getDocumentTypeById fails', async () => {
    const store = useBudgetDocumentTypesStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getDocumentTypeById(55)

    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining('budget-document-type/55')
    )
    expect(result).toBeNull()
  })
  it('should handle error when fetching document types list', async () => {
    const store = useBudgetDocumentTypesStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getDocumentTypes({ page: 1 })

    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining('budget-document-type'),
      {
        params: { page: 1, paginate: 1 },
      }
    )
    expect(store.budget_document_types_list).toEqual([])
    expect(store.budget_document_types_pages.currentPage).toBe(1)
    expect(store.budget_document_types_pages.lastPage).toBe(1)
  })

  it('should handle error when fetching document types balance validations', async () => {
    const store = useBudgetDocumentTypesStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getDocumentTypesBalanceValidations(5, { page: 1 })

    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining('budget-document-type/balance-validation/5'),
      { params: { page: 1, paginate: 1 } }
    )
    expect(store.balance_validations_list).toEqual([])
    expect(store.balance_validations_pages.currentPage).toBe(1)
    expect(store.balance_validations_pages.lastPage).toBe(1)
  })

  it('should return false when create action fails', async () => {
    const store = useBudgetDocumentTypesStoreV1()
    const payload = {
      budget_level_id: 1,
      code: '1',
      description: '1',
      validity: '1',
      requires_authorization: true,
      allows_adjustments: true,
      validity_closure: true,
      creates_new_document: true,
      allows_additions: true,
      allows_deductions: true,
      validates_area: true,
      requires_city: true,
      requires_balance_validation_by_document_type: true,
      has_expiration_date: true,
      expiration_periodicity: '1',
      numbering_type: '1',
    }
    const mockPost = jest.fn().mockRejectedValue(new Error('Network'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction(payload)

    expect(mockPost).toHaveBeenCalledWith(
      expect.stringContaining('budget-document-type'),
      payload
    )
    expect(result).toBe(false)
  })

  it('should return false when update action fails', async () => {
    const store = useBudgetDocumentTypesStoreV1()
    const payload = {
      id: 1,
      budget_level_id: 1,
      code: '1',
      description: '1',
      validity: '1',
      requires_authorization: true,
      allows_adjustments: true,
      validity_closure: true,
      creates_new_document: true,
      allows_additions: true,
      allows_deductions: true,
      validates_area: true,
      requires_city: true,
      requires_balance_validation_by_document_type: true,
      has_expiration_date: true,
      expiration_periodicity: '1',
      numbering_type: '1',
    }
    const mockPut = jest.fn().mockRejectedValue(new Error('Network'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateAction(payload)

    expect(mockPut).toHaveBeenCalledWith(
      expect.stringContaining('budget-document-type/1'),
      payload
    )
    expect(result).toBe(false)
  })

  it('should return false when delete action fails', async () => {
    const store = useBudgetDocumentTypesStoreV1()
    const mockDelete = jest.fn().mockRejectedValue(new Error('Network'))
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const result = await store._deleteAction(7)

    expect(mockDelete).toHaveBeenCalledWith(
      expect.stringContaining('budget-document-type/7')
    )
    expect(result).toBe(false)
  })

  it('should return false when delete balance validation fails', async () => {
    const store = useBudgetDocumentTypesStoreV1()
    const mockDelete = jest.fn().mockRejectedValue(new Error('Network'))
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const result = await store._deleteBalanceValidation(99)

    expect(mockDelete).toHaveBeenCalledWith(
      expect.stringContaining('budget-document-type/balance-validation/99')
    )
    expect(result).toBe(false)
  })

  it('should handle error when downloading document types (utils not called)', async () => {
    const store = useBudgetDocumentTypesStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('Network'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const { useUtils } = require('@/composables')
    ;(useUtils as jest.Mock).mockClear()

    await store._downloadDocumentTypes({ status: 1 })

    expect(mockPost).toHaveBeenCalledWith(
      expect.stringContaining('budget-document-type/export'),
      { status: 1 },
      { responseType: 'blob' }
    )
    expect(useUtils).not.toHaveBeenCalled()
  })
})
