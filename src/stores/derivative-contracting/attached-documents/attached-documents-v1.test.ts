import { setActivePinia, createPinia } from 'pinia'
import { useAttachedDocumentsStoreV1 } from './attached-documents-v1'
import { executeApi } from '@/apis'
import { URL_PATH_DERIVATIVE_CONTRACTING_ATTACHED_DOCUMENT } from '@/constants/apis'
import {
  IAttachedDocumentForm,
  IAttachedDocumentsList,
} from '@/interfaces/customs'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({ showCatchError: jest.fn(() => 'Error!') })),
}))

/**
 * Object Mother Pattern: Centraliza la creación de datos de prueba
 */
class AttachedDocumentMother {
  static createFormData(
    overrides?: Partial<IAttachedDocumentForm>
  ): IAttachedDocumentForm {
    return {
      code: '101',
      name: 'test',
      stage: 'En ejecucion',
      ...overrides,
    }
  }

  static createDocument(
    overrides?: Partial<IAttachedDocumentsList>
  ): IAttachedDocumentsList {
    return {
      id: 1,
      code: '101',
      name: 'test',
      status: {
        id: 2,
        name: 'Inactivo',
      },
      stage: 'En ejecucion',
      ...overrides,
    }
  }

  static createDocumentWithMessage(
    overrides?: Partial<IAttachedDocumentsList & { message: string }>
  ) {
    return {
      ...this.createDocument(overrides),
      message: 'Listado obtenido exitosamente.',
      ...overrides,
    }
  }

  static createSuccessListResponse(
    documents: IAttachedDocumentsList[] = [this.createDocument()],
    currentPage = 1,
    lastPage = 1
  ) {
    return {
      data: {
        success: true,
        data: {
          data: documents,
          current_page: currentPage,
          last_page: lastPage,
        },
        message: 'Listado obtenido exitosamente.',
      },
      status: 200,
    }
  }

  static createSuccessDetailResponse(
    document = this.createDocumentWithMessage()
  ) {
    return {
      data: {
        success: true,
        data: document,
      },
      status: 200,
    }
  }

  static createSuccessResponse(message = 'Operation successful') {
    return {
      data: { success: true, message },
    }
  }

  static createErrorResponse(message = 'Error') {
    return {
      data: { success: false, message },
    }
  }
}

describe('useAttachedDocumentsStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should fetch list of attached documents', async () => {
    //Arrange
    const store = useAttachedDocumentsStoreV1()
    const mockResponse = AttachedDocumentMother.createSuccessListResponse()
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    const params = { page: 1 }

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    //Act
    await store._getAttachedDocuments(params)

    //Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_DERIVATIVE_CONTRACTING_ATTACHED_DOCUMENT}/`,
      { params: { ...params, paginate: 1 } }
    )
    expect(store.attached_documents_list).toEqual([
      AttachedDocumentMother.createDocument(),
    ])
    expect(store.attached_documents_pages.currentPage).toBe(1)
    expect(store.attached_documents_pages.lastPage).toBe(1)
  })

  it('should handle error when fetching attached documents', async () => {
    const store = useAttachedDocumentsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))
    const params = { page: 1 }

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getAttachedDocuments(params)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_DERIVATIVE_CONTRACTING_ATTACHED_DOCUMENT}/`,
      { params: { ...params, paginate: 1 } }
    )
    expect(store.attached_documents_list).toEqual([])
  })

  it('should fetch attached documents by ID', async () => {
    const id = 1
    const store = useAttachedDocumentsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          code: '101',
          id: 1,
          name: 'test',
          status: {
            id: 2,
            name: 'Inactivo',
          },
          stage: 'En ejecucion',
          message: 'Listado obtenido exitosamente.',
        },
      },
      status: 200,
    })

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getAttachedDocumentById(1)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_DERIVATIVE_CONTRACTING_ATTACHED_DOCUMENT}/${id}`
    )
    expect(store.attached_documents_response).toEqual({
      code: '101',
      id: 1,
      name: 'test',
      status: {
        id: 2,
        name: 'Inactivo',
      },
      stage: 'En ejecucion',
      message: 'Listado obtenido exitosamente.',
    })
  })

  it('should handle error when fetching attached documents by ID', async () => {
    const id = 1
    const store = useAttachedDocumentsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getAttachedDocumentById(id)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_DERIVATIVE_CONTRACTING_ATTACHED_DOCUMENT}/${id}`
    )
    expect(store.attached_documents_response).toBeNull()
  })

  it('should create a new attached documents', async () => {
    const store = useAttachedDocumentsStoreV1()
    const formData: IAttachedDocumentForm = {
      code: '101',
      name: 'test',
      stage: 'En ejecucion',
    }

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Attached documents created' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAttachedDocument(formData)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_DERIVATIVE_CONTRACTING_ATTACHED_DOCUMENT}`,
      formData
    )
    expect(result).toBe(true)
  })

  it('should return false if creation fails', async () => {
    const store = useAttachedDocumentsStoreV1()
    const formData: IAttachedDocumentForm = {
      code: '101',
      name: 'test',
      stage: 'En ejecucion',
    }

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Error' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAttachedDocument(formData)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_DERIVATIVE_CONTRACTING_ATTACHED_DOCUMENT}`,
      formData
    )
    expect(result).toBe(false)
  })

  it('should return false when API throws an error', async () => {
    const store = useAttachedDocumentsStoreV1()
    const formData: IAttachedDocumentForm = {
      code: '101',
      name: 'test',
      stage: 'En ejecucion',
    }

    const mockPost = jest.fn().mockRejectedValue(new Error('Network error'))

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAttachedDocument(formData)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_DERIVATIVE_CONTRACTING_ATTACHED_DOCUMENT}`,
      formData
    )
    expect(result).toBe(false)
  })

  it('should update a attached documents', async () => {
    const id = 1
    const store = useAttachedDocumentsStoreV1()
    const formData: IAttachedDocumentForm = {
      code: '101',
      name: 'test',
      stage: 'En ejecucion',
    }

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Updated' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateAttachedDocument(id, formData)

    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_DERIVATIVE_CONTRACTING_ATTACHED_DOCUMENT}/${id}`,
      formData
    )
    expect(result).toBe(true)
  })

  it('should return false if update fails', async () => {
    const id = 1
    const store = useAttachedDocumentsStoreV1()
    const formData: IAttachedDocumentForm = {
      code: '101',
      name: 'test',
      stage: 'En ejecucion',
    }

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Error' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateAttachedDocument(id, formData)

    expect(result).toBe(false)
  })

  it('should change status of a attached documents', async () => {
    const id = 1
    const status = 'activate'
    const store = useAttachedDocumentsStoreV1()
    const mockResponse =
      AttachedDocumentMother.createSuccessResponse('Status changed')
    const mockPut = jest.fn().mockResolvedValue(mockResponse)

    ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPut })

    await store._changeStatus(id, status)

    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_DERIVATIVE_CONTRACTING_ATTACHED_DOCUMENT}/${id}/${status}`
    )
  })

  it('should return false if status change fails', async () => {
    const id = 1
    const status = 'activate'
    const store = useAttachedDocumentsStoreV1()
    const mockResponse = AttachedDocumentMother.createErrorResponse()
    const mockPut = jest.fn().mockResolvedValue(mockResponse)

    ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPut })

    await store._changeStatus(id, status)
  })

  it('should clear all data in the store', () => {
    const store = useAttachedDocumentsStoreV1()

    store.attached_documents_list = [AttachedDocumentMother.createDocument()]

    store._clearData()

    expect(store.attached_documents_list).toEqual([])
    expect(store.attached_documents_pages.currentPage).toEqual(0)
    expect(store.attached_documents_pages.lastPage).toEqual(0)
  })

  it('should delete a attached documents', async () => {
    const id = 1
    const store = useAttachedDocumentsStoreV1()

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'delete' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockPut })

    await store._deleteAttachedDocument(id)

    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_DERIVATIVE_CONTRACTING_ATTACHED_DOCUMENT}/${id}`
    )
  })

  it('should return false if delete fails', async () => {
    const id = 1
    const store = useAttachedDocumentsStoreV1()

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Error' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockPut })

    await store._deleteAttachedDocument(id)
  })
})
