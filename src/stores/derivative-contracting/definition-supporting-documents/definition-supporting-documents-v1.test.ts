import { setActivePinia, createPinia } from 'pinia'
import { useDefinitionSupportingDocumentsStoreV1 } from './definition-supporting-documents-v1'
import { executeApi } from '@/apis'
import { URL_PATH_DERIVATIVE_CONTRACTING } from '@/constants/apis'
import { IDefinitionSupportingDocumentsForm } from '@/interfaces/customs'

const URL_PATH_DEFINITION_DOCUMENTS = `${URL_PATH_DERIVATIVE_CONTRACTING}/definition-documentation`

const mockDefinitionSupportingDocument = [
  {
    id: 4,
    name: 'prueba',
    description: 'prueba',
    required: true,
    active: true,
    status: 'activo',
    created_at: 'prueba',
    updated_at: 'prueba',
  },
]

const mockDefinitionSupportingDocumentResponse = {
  id: 4,
  structure_id: 1,
  structure: '2',
  purpose: '2',
  document_code: '2',
  structure_documental_code: 1,
  type: '2',
  module: '2',
  name: '2',
  process: '2',
  support: '2',
  general_file_retention: '2',
  mandatory: '2',
  final_provision: '2',
}

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({ showCatchError: jest.fn(() => 'Error!') })),
}))

describe('useDefinitionSupportingDocumentsV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should fetch list of supporting documents', async () => {
    const store = useDefinitionSupportingDocumentsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          data: mockDefinitionSupportingDocument,
          current_page: 1,
          last_page: 2,
        },
        message: 'List fetched',
      },
      status: 200,
    })
    const params = { page: 1 }

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getDefinitionDocumentsList(params)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH_DEFINITION_DOCUMENTS}`, {
      params: { ...params, paginate: true },
    })
    expect(store.definition_documents_list).toEqual(
      mockDefinitionSupportingDocument
    )
    expect(store.definition_documents_pages.currentPage).toBe(1)
    expect(store.definition_documents_pages.lastPage).toBe(2)
  })

  it('should fetch supporting documents by ID', async () => {
    const store = useDefinitionSupportingDocumentsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: mockDefinitionSupportingDocumentResponse,
        message: 'Found',
      },
      status: 200,
    })

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdDefinitionDocuments(1)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH_DEFINITION_DOCUMENTS}/1`)
    expect(store.definition_documents_response).toEqual(
      mockDefinitionSupportingDocumentResponse
    )
  })

  it('should create a new supporting documents', async () => {
    const store = useDefinitionSupportingDocumentsStoreV1()
    const formData: IDefinitionSupportingDocumentsForm = {
      document_code: '2220002',
      name: 'Test Business',
      final_provision: '2000',
      general_file_retention: 'Test Class',
      mandatory: '1',
      module: 'Test Type',
      process: 'Mensual',
      purpose: 'Anticipado',
      structure: '1',
      structure_id: null,
      support: '1',
      type: '2',
    }

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Rejection reason created' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createDefinitionDocuments(formData)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_DEFINITION_DOCUMENTS}`,
      formData
    )
    expect(result).toBe(true)
  })

  it('should update a fiduciary business commission', async () => {
    const store = useDefinitionSupportingDocumentsStoreV1()
    const form: IDefinitionSupportingDocumentsForm = {
      document_code: '2220002',
      name: 'Test Business',
      final_provision: '2000',
      general_file_retention: 'Test Class',
      mandatory: '1',
      module: 'Test Type',
      process: 'Mensual',
      purpose: 'Anticipado',
      structure: '1',
      structure_id: null,
      support: '1',
      type: '2',
    }

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Updated' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateDefinitionDocuments(form, 1)

    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_DEFINITION_DOCUMENTS}/1`,
      form
    )
    expect(result).toBe(true)
  })

  it('should clear all data in the store', () => {
    const store = useDefinitionSupportingDocumentsStoreV1()

    store.definition_documents_list = mockDefinitionSupportingDocument

    store.definition_documents_response =
      mockDefinitionSupportingDocumentResponse

    store.definition_documents_pages = {
      currentPage: 2,
      lastPage: 3,
    }

    store._clearData()

    expect(store.definition_documents_list).toEqual([])
    expect(store.definition_documents_response).toBeNull()
    expect(store.definition_documents_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })
})
