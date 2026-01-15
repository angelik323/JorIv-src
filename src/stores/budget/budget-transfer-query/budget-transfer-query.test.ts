import { setActivePinia, createPinia } from 'pinia'
import { useBudgetTransferQueryStoreV1 } from './budget-transfer-query'
import { executeApi } from '@/apis'
import { IBudgetTransferQueryDocument } from '@/interfaces/customs/budget/BudgetTransferQuery'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}))

// Mock composables
jest.mock('@/composables', () => {
  const mockShowAlert = jest.fn()
  const mockShowCatchError = jest.fn()
  const mockGetNameBlob = jest.fn()
  const mockDownloadBlobXlxx = jest.fn()

  return {
    useUtils: jest.fn(() => ({
      getNameBlob: mockGetNameBlob,
      downloadBlobXlxx: mockDownloadBlobXlxx,
    })),
    mockShowAlert,
    mockShowCatchError,
    mockGetNameBlob,
    mockDownloadBlobXlxx,
  }
})

jest.mock('@/composables/useAlert', () => {
  const composablesMock = jest.requireMock('@/composables')
  return {
    useAlert: jest.fn(() => ({ showAlert: composablesMock.mockShowAlert })),
  }
})

jest.mock('@/composables/useShowError', () => {
  const composablesMock = jest.requireMock('@/composables')
  return {
    useShowError: jest.fn(() => ({
      showCatchError: composablesMock.mockShowCatchError,
    })),
  }
})

describe('useBudgetTransferQueryStoreV1', () => {
  let mockShowAlert: jest.Mock
  let mockShowCatchError: jest.Mock
  let mockGetNameBlob: jest.Mock
  let mockDownloadBlobXlxx: jest.Mock

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()

    // Get mock references
    const composablesMock = jest.requireMock('@/composables')
    mockShowAlert = composablesMock.mockShowAlert
    mockShowCatchError = composablesMock.mockShowCatchError
    mockGetNameBlob = composablesMock.mockGetNameBlob
    mockDownloadBlobXlxx = composablesMock.mockDownloadBlobXlxx

    mockShowCatchError.mockReturnValue('Error!')
  })

  const mockBudgetTransferQueryList = {
    id: 1,
    transfer_number: 'BTQ-2024-001',
    fiscal_year: 2024,
    date: '2024-01-01',
  }

  const mockBudgetTransferQueryDocument: IBudgetTransferQueryDocument = {
    id: 1,
    vigency: 2024,
    document_type: 'PDF',
    document_number: 123456,
    value: '1000000',
    has_documents_associated: true,
  }

  it('should fetch budget transfer query list successfully', async () => {
    // Arrange
    const store = useBudgetTransferQueryStoreV1()
    const params = { page: 1, rows: 10 }
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Listado obtenido',
        data: {
          data: [mockBudgetTransferQueryList],
          current_page: 1,
          last_page: 1,
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._listAction(params)

    // Assert
    expect(result.list).toHaveLength(1)
    expect(result.list[0]).toEqual(mockBudgetTransferQueryList)
    expect(result.pages.currentPage).toBe(1)
    expect(result.pages.lastPage).toBe(1)
    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining('budget-transfers-management/list'),
      { params: { ...params, paginate: true } }
    )
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Listado obtenido',
      'success',
      undefined,
      3000
    )
  })

  it('should return empty array when fetch budget transfer query list fails', async () => {
    // Arrange
    const store = useBudgetTransferQueryStoreV1()
    const params = { page: 1, rows: 20 }
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: false,
        message: 'Error al obtener listado',
        data: {
          data: [],
          current_page: 0,
          last_page: 0,
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._listAction(params)

    // Assert
    expect(result.list).toEqual([])
    expect(result.pages.currentPage).toBe(0)
    expect(result.pages.lastPage).toBe(0)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error al obtener listado',
      'error',
      undefined,
      3000
    )
  })

  it('should handle error when fetching budget transfer query list', async () => {
    // Arrange
    const store = useBudgetTransferQueryStoreV1()
    const params = { page: 1, rows: 20 }
    const mockError = new Error('Network error')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._listAction(params)

    // Assert
    expect(result.list).toEqual([])
    expect(result.pages.currentPage).toBe(0)
    expect(result.pages.lastPage).toBe(0)
    expect(mockShowCatchError).toHaveBeenCalledWith(mockError)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error!',
      'error',
      undefined,
      3000
    )
  })

  it('should fetch document list successfully', async () => {
    // Arrange
    const store = useBudgetTransferQueryStoreV1()
    const transferId = 1
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Documentos obtenidos',
        data: [mockBudgetTransferQueryDocument],
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._listDocumentAction(transferId)

    // Assert
    expect(result.success).toBe(true)
    expect(result.data).toHaveLength(1)
    expect(result.data[0]).toEqual(mockBudgetTransferQueryDocument)
    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining(
        `budget-transfers-management/show-document-associated/${transferId}`
      )
    )
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Documentos obtenidos',
      'success',
      undefined,
      3000
    )
  })

  it('should return empty array when fetch document list fails', async () => {
    // Arrange
    const store = useBudgetTransferQueryStoreV1()
    const transferId = 1
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: false,
        message: 'No se encontraron documentos',
        data: null,
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._listDocumentAction(transferId)

    // Assert
    expect(result.success).toBe(false)
    expect(result.data).toEqual([])
    expect(mockShowAlert).toHaveBeenCalledWith(
      'No se encontraron documentos',
      'error',
      undefined,
      3000
    )
  })

  it('should handle error when fetching document list', async () => {
    // Arrange
    const store = useBudgetTransferQueryStoreV1()
    const transferId = 1
    const mockError = new Error('Database error')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._listDocumentAction(transferId)

    // Assert
    expect(result.success).toBe(false)
    expect(result.data).toEqual([])
    expect(mockShowCatchError).toHaveBeenCalledWith(mockError)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error!',
      'error',
      undefined,
      3000
    )
  })

  it('should download excel successfully', async () => {
    // Arrange
    const store = useBudgetTransferQueryStoreV1()
    const params = { filter_status: 'active', page: 1, rows: 20 }
    const mockBlobData = new Blob(['export data'], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    const mockResponse = {
      data: mockBlobData,
      headers: {
        'content-type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'content-disposition':
          'attachment; filename="budget-transfer-query.xlsx"',
      },
    }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })
    mockGetNameBlob.mockReturnValue('budget-transfer-query.xlsx')

    // Act
    await store._downloadExcelAction(params)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      expect.stringContaining('budget-transfers-management/export'),
      null,
      {
        responseType: 'blob',
        params: params,
      }
    )
    expect(mockGetNameBlob).toHaveBeenCalledWith(mockResponse)
    expect(mockDownloadBlobXlxx).toHaveBeenCalledTimes(1)
    const downloadCall = mockDownloadBlobXlxx.mock.calls[0]
    expect(downloadCall[0]).toBeInstanceOf(Blob)
    expect(downloadCall[0].type).toBe(
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    expect(downloadCall[1]).toBe('budget-transfer-query.xlsx')
    expect(mockShowAlert).toHaveBeenCalledWith(
      'La descarga comenzará pronto',
      'success',
      undefined,
      3000
    )
  })

  it('should download excel with empty params', async () => {
    // Arrange
    const store = useBudgetTransferQueryStoreV1()
    const params = { page: 1, rows: 20 }
    const mockBlobData = new Blob(['export data'], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    const mockResponse = {
      data: mockBlobData,
      headers: {
        'content-type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'content-disposition': 'attachment; filename="export.xlsx"',
      },
    }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })
    mockGetNameBlob.mockReturnValue('export.xlsx')

    // Act
    await store._downloadExcelAction(params)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      expect.stringContaining('budget-transfers-management/export'),
      null,
      {
        responseType: 'blob',
        params: params,
      }
    )
    expect(mockDownloadBlobXlxx).toHaveBeenCalled()
  })

  it('should handle error when downloading excel', async () => {
    // Arrange
    const store = useBudgetTransferQueryStoreV1()
    const params = { filter_status: 'active', page: 1, rows: 20 }
    const downloadError = new Error('Download error')
    const mockPost = jest.fn().mockRejectedValue(downloadError)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })
    mockShowCatchError.mockReturnValue('Error de descarga')

    // Act
    await store._downloadExcelAction(params)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      expect.stringContaining('budget-transfers-management/export'),
      null,
      {
        responseType: 'blob',
        params: params,
      }
    )
    expect(mockShowCatchError).toHaveBeenCalledWith(downloadError)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error de descarga',
      'error',
      undefined,
      3000
    )
    expect(mockGetNameBlob).not.toHaveBeenCalled()
    expect(mockDownloadBlobXlxx).not.toHaveBeenCalled()
  })

  it('should handle network errors during download', async () => {
    // Arrange
    const store = useBudgetTransferQueryStoreV1()
    const params = { page: 1, rows: 20 }
    const networkError = {
      response: {
        status: 500,
        data: { message: 'Server error' },
      },
    }
    const mockPost = jest.fn().mockRejectedValue(networkError)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })
    mockShowCatchError.mockReturnValue('Error del servidor')

    // Act
    await store._downloadExcelAction(params)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      expect.stringContaining('budget-transfers-management/export'),
      null,
      {
        responseType: 'blob',
        params: params,
      }
    )
    expect(mockShowCatchError).toHaveBeenCalledWith(networkError)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error del servidor',
      'error',
      undefined,
      3000
    )
    expect(mockDownloadBlobXlxx).not.toHaveBeenCalled()
  })
})
