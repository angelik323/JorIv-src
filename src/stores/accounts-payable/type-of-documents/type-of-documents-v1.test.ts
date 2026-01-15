// Pinia
import { setActivePinia, createPinia } from 'pinia'

// Store
import { useTypeOfDocumentsStoreV1 } from '@/stores/accounts-payable/type-of-documents/type-of-documents-v1'

// APIs
import { executeApi } from '@/apis'

// Constants
import { URL_PATH_ACCOUNTS_PAYABLE } from '@/constants/apis'

// Interfaces
import {
  ITypeOfDocumentForm,
  ITypeOfDocumentItem,
  ITypeOfDocumentCreatePayload,
} from '@/interfaces/customs/accounts-payable/TypeOfDocuments'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({ showCatchError: jest.fn(() => 'ERROR') })),
}))

describe('useTypeOfDocumentsStoreV1', () => {
  let store: ReturnType<typeof useTypeOfDocumentsStoreV1>
  const url = `${URL_PATH_ACCOUNTS_PAYABLE}/document-types`

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useTypeOfDocumentsStoreV1()
    jest.clearAllMocks()
  })

  it('lista OK (usa rows y paginate:true)', async () => {
    const apiItems: ITypeOfDocumentItem[] = [
      {
        id: 1,
        code: '001',
        name: 'Factura de compra',
        code_name: '001 - Factura de compra',
        numbering: 'Manual',
        document_type: 'Factura electrónica',
        operation_type: 'Nacional',
        has_internal_consecutive: true,
        has_client_consecutive: false,
        has_order: false,
        has_other_references: true,
        has_legalization_date: false,
        has_expiration_date: true,
        status: { id: 1, name: 'Activo' },
      },
    ]

    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Lista obtenida',
        data: { data: apiItems, current_page: 2, last_page: 5 },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getTypeOfDocumentsList({ rows: 25, search: 'fac' })

    expect(mockGet).toHaveBeenCalledWith(url, {
      params: { search: 'fac', rows: 25, paginate: true },
    })
    expect(store.type_of_documents_pages).toEqual({ currentPage: 2, lastPage: 5 })
    expect(store.type_of_documents_list).toEqual(apiItems)
  })

  it('lista error -> limpia estado', async () => {
    const mockGet = jest.fn().mockRejectedValue(new Error('net'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getTypeOfDocumentsList({})

    expect(store.type_of_documents_list).toEqual([])
    expect(store.type_of_documents_pages).toEqual({ currentPage: 1, lastPage: 1 })
  })

  it('crea OK', async () => {
    const payload: ITypeOfDocumentCreatePayload = {
      name: 'Factura de compra',
      numbering: 'Manual',
      document_type: 'Factura electrónica',
      operation_type: 'Nacional',
      has_internal_consecutive: true,
      has_client_consecutive: false,
      has_order: false,
      has_other_references: false,
      has_legalization_date: false,
      has_expiration_date: true,
    }

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Creado' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const ok = await store._createTypeOfDocument(payload)

    expect(mockPost).toHaveBeenCalledWith(url, payload)
    expect(ok).toBe(true)
  })

  it('crea error -> false', async () => {
    const payload: ITypeOfDocumentCreatePayload = {
      name: 'X',
      numbering: 'Manual',
      document_type: 'Factura electrónica',
      operation_type: 'Nacional',
      has_internal_consecutive: false,
      has_client_consecutive: false,
      has_order: false,
      has_other_references: false,
      has_legalization_date: false,
      has_expiration_date: false,
    }

    const mockPost = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const ok = await store._createTypeOfDocument(payload)

    expect(ok).toBe(false)
  })

  it('detalle por id OK (guarda respuesta cruda)', async () => {
    const apiData = {
      id: 10,
      code: '010',
      name: 'Nota crédito',
      numbering: 'Consolidado',
      document_type: 'Documentos físicos (No electrónicos)',
      operation_type: 'Extranjera',
      has_internal_consecutive: false,
      has_client_consecutive: true,
      has_order: false,
      has_other_references: true,
      has_legalization_date: false,
      has_expiration_date: false,
      status: { id: 2, name: 'Inactivo' },
    }

    const mockGet = jest.fn().mockResolvedValue({
      data: { success: true, message: 'OK', data: apiData },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getTypeOfDocumentById(10)

    expect(mockGet).toHaveBeenCalledWith(`${url}/10`)
    expect(store.type_of_document_response).toEqual(apiData)
  })

  it('detalle por id error -> null', async () => {
    const mockGet = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getTypeOfDocumentById(999)

    expect(store.type_of_document_response).toBeNull()
  })

  it('actualiza OK', async () => {
    const payload: ITypeOfDocumentCreatePayload = {
      name: 'Factura v2',
      numbering: 'Negocio',
      document_type: 'Factura electrónica',
      operation_type: 'Nacional',
      has_internal_consecutive: true,
      has_client_consecutive: true,
      has_order: true,
      has_other_references: false,
      has_legalization_date: false,
      has_expiration_date: true,
    }

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Actualizado' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const ok = await store._updateTypeOfDocument(payload, 7)

    expect(mockPut).toHaveBeenCalledWith(`${url}/7`, payload)
    expect(ok).toBe(true)
  })

  it('actualiza error -> false', async () => {
    const payload: ITypeOfDocumentCreatePayload = {
      name: 'X',
      numbering: 'Manual',
      document_type: 'Factura electrónica',
      operation_type: 'Nacional',
      has_internal_consecutive: false,
      has_client_consecutive: false,
      has_order: false,
      has_other_references: false,
      has_legalization_date: false,
      has_expiration_date: false,
    }

    const mockPut = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const ok = await store._updateTypeOfDocument(payload, 7)

    expect(ok).toBe(false)
  })

  it('toggle status OK', async () => {
    const mockPatch = jest.fn().mockResolvedValue({
      data: { success: true, message: 'OK' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

    const ok = await store._toggleStatusTypeOfDocument(55)

    expect(mockPatch).toHaveBeenCalledWith(`${url}/55/toggle-status`)
    expect(ok).toBe(true)
  })

  it('toggle status error -> false', async () => {
    const mockPatch = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

    const ok = await store._toggleStatusTypeOfDocument(55)

    expect(ok).toBe(false)
  })

  it('elimina OK', async () => {
    const mockDelete = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Eliminado' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const ok = await store._deleteTypeOfDocument(3)

    expect(mockDelete).toHaveBeenCalledWith(`${url}/3`)
    expect(ok).toBe(true)
  })

  it('elimina error -> false', async () => {
    const mockDelete = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const ok = await store._deleteTypeOfDocument(99)

    expect(ok).toBe(false)
  })

  it('setFormData guarda y limpia', () => {
    const form: ITypeOfDocumentForm = {
      name: 'Factura de compra',
      numbering: 'Manual',
      document_type: 'Factura electrónica',
      operation_type: 'Nacional',
      has_internal_consecutive: true,
      has_client_consecutive: false,
      has_order: false,
      has_other_references: false,
      has_legalization_date: false,
      has_expiration_date: true,
    }

    store._setFormData(form)
    expect(store.type_of_document_form).toEqual(form)

    store._setFormData(null)
    expect(store.type_of_document_form).toBeNull()
  })
})