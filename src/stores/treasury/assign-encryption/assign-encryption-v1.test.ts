import { setActivePinia, createPinia } from 'pinia'
import { useAssignEncryptDocumentsStoreV1 } from './assign-encryption-v1'
import { executeApi } from '@/apis'
import {
  IAssignEncryptDocument,
  IAssignEncryptDocumentUpdatePayload,
  IGenerateFileSignPayload,
  IGenerateFileSignResponse,
} from '@/interfaces/customs'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  })),
}))

jest.mock('@/composables', () => {
  const showAlertMock = jest.fn()
  const showCatchErrorMock = jest.fn(
    (error: Error) => `Mensaje de error: ${error.message}`
  )

  const useAlert = jest.fn(() => ({ showAlert: showAlertMock }))
  const useShowError = jest.fn(() => ({ showCatchError: showCatchErrorMock }))

  return { useAlert, useShowError, showAlertMock, showCatchErrorMock }
})

describe('useAssignEncryptDocumentsStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetchAssignEncryptDocuments loads list and pagination correctly', async () => {
    const store = useAssignEncryptDocumentsStoreV1()

    const mockResponse = {
      data: {
        success: true,
        message: 'OK',
        data: {
          data: [
            { id: 1, description: 'doc test' },
          ] as IAssignEncryptDocument[],
          current_page: 1,
          last_page: 2,
          total: 5,
          per_page: 20,
        },
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store.fetchAssignEncryptDocuments('1')

    expect(store.documents_list).toEqual([{ id: 1, description: 'doc test' }])
    expect(store.documents_pages.currentPage).toBe(1)
    expect(store.documents_pages.lastPage).toBe(2)
    expect(store.documents_pages.total).toBe(5)
  })

  it('fetchAssignEncryptDocuments handles errors correctly', async () => {
    const store = useAssignEncryptDocumentsStoreV1()
    const mockError = new Error('api failed')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const { showCatchErrorMock, showAlertMock } = require('@/composables')

    await store.fetchAssignEncryptDocuments('1')

    expect(store.documents_list).toEqual([])
    expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
    expect(showAlertMock).toHaveBeenCalledWith(
      'Mensaje de error: api failed',
      'error',
      undefined,
      expect.any(Number)
    )
  })

  it('fetchAssignEncryptDocumentDetail returns a valid document', async () => {
    const store = useAssignEncryptDocumentsStoreV1()

    const mockDoc: IAssignEncryptDocument = {
      id: 10,
      description: 'detail test',
      type_format_id: 1,
      assign_encrypt_id: 2,
      bank: 'Test bank',
      type_format: 'format',
      apply_encrypt: true,
      path_key: '/path/to/key',
      type_encrypt: 'AES',
    }

    const mockResponse = {
      data: { success: true, message: 'OK', data: mockDoc },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store.fetchAssignEncryptDocumentDetail(10)

    expect(result).toEqual(mockDoc)
    expect(store.current_document).toEqual(mockDoc)
  })

  it('updateAssignEncryptDocument updates a document successfully', async () => {
    const store = useAssignEncryptDocumentsStoreV1()
    const payload: IAssignEncryptDocumentUpdatePayload = {
      apply_encrypt: false,
      type_encrypt: 'RSA',
      bank_id: 2,
      bank_structure_id: 3,
      assign_encrypt_id: 4,
      file: {
        id: 100,
        is_validated: false,
        path: '/path/to/other',
      },
    }

    const mockResponse = {
      data: { success: true, message: 'Updated', data: {} },
    }
    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store.updateAssignEncryptDocument(30, payload)

    expect(result).toEqual({ success: true })
  })

  it('updateAssignEncryptDocument handles error response', async () => {
    const store = useAssignEncryptDocumentsStoreV1()
    const payload: IAssignEncryptDocumentUpdatePayload = {
      apply_encrypt: false,
      type_encrypt: 'RSA',
      bank_id: 2,
      bank_structure_id: 3,
      assign_encrypt_id: 4,
      file: { id: 100, is_validated: false, path: '/other' },
    }

    const mockResponse = {
      data: { success: false, message: 'Update failed', data: null },
    }
    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const { showAlertMock } = require('@/composables')

    const result = await store.updateAssignEncryptDocument(30, payload)

    expect(result).toEqual({ success: false })
    expect(showAlertMock).toHaveBeenCalledWith(
      'Update failed',
      'error',
      undefined,
      expect.any(Number)
    )
  })

  it('generateFileSign generates a signed file successfully', async () => {
    const store = useAssignEncryptDocumentsStoreV1()
    const payload: IGenerateFileSignPayload = {
      name: 'file.pdf',
      document_type: 'PDF',
    }

    const mockResponseData: IGenerateFileSignResponse = {
      document_id: 1,
      upload_url: 'http://upload.test',
      file_path: '/remote/file.pdf',
    }

    const mockResponse = {
      data: { success: true, message: 'Signed', data: mockResponseData },
    }

    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store.generateFileSign(payload)
    expect(result).toEqual(mockResponseData)
  })
  it('createAssignEncryption handles error response', async () => {
    const store = useAssignEncryptDocumentsStoreV1()
    const payload: IAssignEncryptDocumentUpdatePayload = {
      apply_encrypt: true,
      type_encrypt: 'AES',
      bank_id: 1,
      bank_structure_id: 2,
      assign_encrypt_id: 3,
      file: { id: 99, is_validated: true, path: '/file' },
    }

    const mockResponse = {
      data: { success: false, message: 'Create failed', data: null },
    }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const { showAlertMock } = require('@/composables')

    const result = await store.createAssignEncryption(payload)

    expect(result).toBeNull()
    expect(showAlertMock).toHaveBeenCalledWith(
      'Create failed',
      'error',
      undefined,
      expect.any(Number)
    )
  })

  it('updateAssignEncryptDocument handles error response', async () => {
    const store = useAssignEncryptDocumentsStoreV1()
    const payload: IAssignEncryptDocumentUpdatePayload = {
      apply_encrypt: false,
      type_encrypt: 'RSA',
      bank_id: 2,
      bank_structure_id: 3,
      assign_encrypt_id: 4,
      file: { id: 100, is_validated: false, path: '/other' },
    }

    const mockResponse = {
      data: { success: false, message: 'Update failed', data: null },
    }
    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const { showAlertMock } = require('@/composables')

    const result = await store.updateAssignEncryptDocument(30, payload)

    expect(result).toEqual({ success: false })
    expect(showAlertMock).toHaveBeenCalledWith(
      'Update failed',
      'error',
      undefined,
      expect.any(Number)
    )
  })

  it('generateFileSign handles error response', async () => {
    const store = useAssignEncryptDocumentsStoreV1()
    const payload: IGenerateFileSignPayload = {
      name: 'file.pdf',
      document_type: 'PDF',
    }

    const mockResponse = {
      data: { success: false, message: 'Sign failed', data: null },
    }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const { showAlertMock } = require('@/composables')

    const result = await store.generateFileSign(payload)

    expect(result).toBeNull()
    expect(showAlertMock).toHaveBeenCalledWith(
      'Sign failed',
      'error',
      undefined,
      expect.any(Number)
    )
  })
})
