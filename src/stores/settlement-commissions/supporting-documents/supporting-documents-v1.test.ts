import { setActivePinia, createPinia } from 'pinia'
import { useSupportingDocumentsStoreV1 } from './supporting-documents-v1'
import { executeApi } from '@/apis'
import { URL_PATH_BILLING } from '@/constants/apis'
import { ISupportingDocumentForm } from '@/interfaces/customs'

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

const mockResponse = {
  id: 1,
  business_trust: {
    id: 5008,
    code: '2165161',
    name: '2165161 - Alias aliquid at maiores vero at.',
  },
  type_document: '-',
  document_number: '-',
  third_party_billing: {
    id: 3365,
    address: 'Por ahi en el parque',
    phone: '+573135504351',
    email: 'help@linktic.com',
    name: 'Juan Perez',
    document: '123456789',
    type_document: 'CC',
  },
  production_date: '2025-10-15',
  payment_methods: 'contado',
  description: 'test',
  support_document_number: null,
  movement_code: {
    id: 26,
    code: '00026',
    description: 'Test movement code',
    generate_iva: false,
    iva_percentage: '0.00',
    generate_source_rete: false,
    rete_source_percentage: '0.00',
    generate_source_ica: false,
    rete_ica_percentage: '0.00',
    generate_rete_iva: false,
    rete_iva_percentage: '0.00',
  },
  base_amount: '123124.00',
  base_iva: '0.00',
  rete_source: '0.00',
  rete_ica: '0.00',
  rete_iva: '0.00',
  total_amount: '123124.00',
  days_for_pays: 15,
  created_by: 14257,
  updated_by: null,
  created_at: '2025-10-15',
  updated_at: '2025-10-15',
  status: {
    id: 20,
    name: 'Pendiente de pago',
  },
}

const mockList = [
  {
    id: 1,
    business_trust_data: null,
    third_party_billing_data: {
      id: 3365,
      document_type: {
        id: 16,
        name: 'Imagen',
        abbreviation: 'IMG',
        model: 'document-management',
        status_id: 1,
      },
      natural_person: {
        id: 53,
        full_name: 'juanito Gonzales',
      },
    },
    business_trust: {
      id: 5008,
      code: '2165161',
      name: '2165161 - Alias aliquid at maiores vero at.',
    },
    type_document: '-',
    document_number: '-',
    third_party_billing: {
      id: 3365,
      address: 'Por ahi en el parque',
      phone: '+573135504351',
      email: 'help@linktic.com',
    },
    production_date: '2025-10-15',
    payment_methods: 'contado',
    description: 'test',
    support_document_number: null,
    total_amount: '123124.00',
    status: {
      id: 20,
      name: 'Pendiente de pago',
    },
  },
]

const mockCreate: ISupportingDocumentForm = {
  business_trust_id: 4982,
  business_code_snap: '6736328',
  business_name_snap:
    '6736328 - Non voluptates velit qui magnam voluptatem quo.',
  type_document: '-',
  document_number: '-',
  third_party_billing_id: 3359,
  third_party_address_snap: 'AP',
  third_party_phone_snap: '(+355)234 234 2422',
  third_party_email_snap: 'sadasdasdsa@ssad.com',
  third_party_type_document_snap: 'NIT',
  third_party_document_snap: '1234567',
  third_party_name_snap: 'Tercero de prueba',
  production_date: '2025-10-15',
  payment_methods: 'contado',
  description: 'test 2',
  movement_code_id: 25,
  movement_code_snap: '00025',
  generate_iva: false,
  iva_percentage: 0,
  generate_source_rete: false,
  rete_source_percentage: 0,
  generate_source_ica: false,
  rete_ica_percentage: 0,
  generate_rete_iva: false,
  rete_iva_percentage: 0,
  base_amount: 12345,
  base_iva: 0,
  rete_source: 0,
  rete_ica: 0,
  rete_iva: 0,
  total_amount: 12345,
  days_for_pays: 15,
}

describe('useSupportingDocumentsStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should fetch list of supporting documents', async () => {
    const store = useSupportingDocumentsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          data: mockList,
          current_page: 1,
          last_page: 2,
        },
        message: 'List fetched',
      },
      status: 200,
    })
    const params = { page: 1 }

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getSupportingDocumentsList(params)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_BILLING}/generation-support-document`,
      {
        params: { ...params, paginate: 1 },
      }
    )
    expect(store.supporting_documents_list).toEqual(mockList)
    expect(store.supporting_documents_pages.currentPage).toBe(1)
    expect(store.supporting_documents_pages.lastPage).toBe(2)
  })

  it('should handle error when fetching supporting documents', async () => {
    const store = useSupportingDocumentsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))
    const params = { page: 1 }

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getSupportingDocumentsList(params)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_BILLING}/generation-support-document`,
      {
        params: { ...params, paginate: 1 },
      }
    )
    expect(store.supporting_documents_list).toEqual([])
  })

  it('should fetch supporting document by ID', async () => {
    const store = useSupportingDocumentsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: mockResponse,
        message: 'Found',
      },
      status: 200,
    })

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdSupportingDocuments(1)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_BILLING}/generation-support-document/1`
    )
    expect(store.supporting_documents_response).toEqual(mockResponse)
  })

  it('should handle error when fetching supporting document by ID', async () => {
    const store = useSupportingDocumentsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdSupportingDocuments(1)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_BILLING}/generation-support-document/1`
    )
    expect(store.supporting_documents_response).toBeNull()
  })

  it('should create a new supporting document', async () => {
    const store = useSupportingDocumentsStoreV1()
    const formData: ISupportingDocumentForm = mockCreate

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'created' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createSupportingDocuments(formData)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_BILLING}/generation-support-document`,
      formData
    )
    expect(result).toBe(true)
  })

  it('should return false if creation fails', async () => {
    const store = useSupportingDocumentsStoreV1()
    const formData: ISupportingDocumentForm = mockCreate

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Error' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createSupportingDocuments(formData)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_BILLING}/generation-support-document`,
      formData
    )
    expect(result).toBe(false)
  })

  it('should return false when API throws an error', async () => {
    const store = useSupportingDocumentsStoreV1()
    const formData: ISupportingDocumentForm = mockCreate

    const mockPost = jest.fn().mockRejectedValue(new Error('Network error'))

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createSupportingDocuments(formData)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_BILLING}/generation-support-document`,
      formData
    )
    expect(result).toBe(false)
  })

  it('should clear all data in the store', () => {
    const store = useSupportingDocumentsStoreV1()

    store.supporting_documents_list = mockList

    store.supporting_documents_response = mockResponse

    store.supporting_documents_pages = {
      currentPage: 2,
      lastPage: 3,
    }

    store._clearData()

    expect(store.supporting_documents_list).toEqual([])
    expect(store.supporting_documents_response).toBeNull()
    expect(store.supporting_documents_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })
})
