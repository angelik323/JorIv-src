// Mock API
const mockApiMethods = {
  get: jest.fn(),
  post: jest.fn(),
}

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => mockApiMethods),
}))

// Mock composables
jest.mock('@/composables', () => {
  const mockShowAlert = jest.fn()
  const mockShowCatchError = jest.fn()
  const mockGetNameBlob = jest.fn()
  const mockDownloadBlob = jest.fn()

  return {
    useAlert: jest.fn(() => ({ showAlert: mockShowAlert })),
    useShowError: jest.fn(() => ({ showCatchError: mockShowCatchError })),
    useUtils: jest.fn(() => ({
      getNameBlob: mockGetNameBlob,
      downloadBlob: mockDownloadBlob,
    })),
    mockShowAlert,
    mockShowCatchError,
    mockGetNameBlob,
    mockDownloadBlob,
  }
})

jest.mock('@/composables/useAlert', () => {
  const composablesMock = jest.requireMock('@/composables')
  return {
    useAlert: composablesMock.useAlert,
  }
})

jest.mock('@/composables/useShowError', () => {
  const composablesMock = jest.requireMock('@/composables')
  return {
    useShowError: composablesMock.useShowError,
  }
})

// Now safe to import
import { setActivePinia, createPinia } from 'pinia'
import { useBudgetRegistrationCertificateStoreV1 } from './budget-registration-certificate'
import { URL_PATH_BUDGET } from '@/constants/apis'
import { IBudgetRegistrationCertificateList } from '@/interfaces/customs/budget/BudgetRegistrationCertificate'

const URL_PATH = `${URL_PATH_BUDGET}/budget-registration-certificates`

// Test data factories
const createMockCertificate = (
  overrides: Partial<IBudgetRegistrationCertificateList> = {}
): IBudgetRegistrationCertificateList => ({
  id: 1,
  generated_at: '2025-01-01',
  user_signature: {
    id: 1,
    name: 'John',
    last_name: 'Doe',
    full_name: 'John Doe',
  },
  operation_log: {
    id: 42,
    validity: 2025,
    business_trust: {
      id: 618,
      business_code: '271151',
      name: 'Refugio Seguro',
    },
    user_created: {
      id: 1,
      name: 'John',
      last_name: 'Doe',
    },
    authorized_user: {
      id: 1,
      name: 'John',
      last_name: 'Doe',
    },
    status: {
      id: 1,
      name: 'Activo',
    },
    budget_document_type: {
      id: 29,
      code: 'RPP',
      description: 'REGISTRO PRESUPUESTAL',
      budget_level_id: 47,
      level: {
        id: 47,
        level: '002',
        description: 'REGISTRO PRESUPUESTAL',
        class: 'CRP',
      },
    },
  },
  ...overrides,
})

const createMockApiResponse = <T>(
  data: T,
  success = true,
  message = 'Success'
) => ({
  data: {
    success,
    data,
    message,
  },
})

const createMockPaginatedResponse = (
  data: IBudgetRegistrationCertificateList[],
  currentPage = 1,
  lastPage = 1,
  lastDescriptionSociety = 'COMPROMISO REGISTRO PRESUPUESTAL',
  lastFileExportableId: number | null = null
) => ({
  current_page: currentPage,
  data,
  last_page: lastPage,
  per_page: 20,
  last_description_society: lastDescriptionSociety,
  last_file_exportable_id: lastFileExportableId,
})

describe('useBudgetRegistrationCertificateStoreV1 Store', () => {
  let store: ReturnType<typeof useBudgetRegistrationCertificateStoreV1>
  let showAlertMock: jest.Mock
  let showCatchErrorMock: jest.Mock
  let getNameBlobMock: jest.Mock
  let downloadBlobMock: jest.Mock

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useBudgetRegistrationCertificateStoreV1()

    // Get mock references
    const composablesMock = jest.requireMock('@/composables')
    showAlertMock = composablesMock.mockShowAlert
    showCatchErrorMock = composablesMock.mockShowCatchError
    getNameBlobMock = composablesMock.mockGetNameBlob
    downloadBlobMock = composablesMock.mockDownloadBlob

    jest.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should initialize with correct default state', () => {
      expect(store.version).toBe('v1')
    })
  })

  describe('_listAction', () => {
    it('should fetch and update list with pagination', async () => {
      // Arrange
      const mockCertificates = [
        createMockCertificate({
          operation_log: {
            id: 42,
            validity: 2025,
            business_trust: {
              id: 618,
              business_code: '271151',
              name: 'Refugio Seguro',
            },
            user_created: {
              id: 1,
              name: 'John',
              last_name: 'Doe',
            },
            authorized_user: {
              id: 1,
              name: 'John',
              last_name: 'Doe',
            },
            status: {
              id: 1,
              name: 'Activo',
            },
            budget_document_type: {
              id: 29,
              code: 'RPP',
              description: 'REGISTRO PRESUPUESTAL',
              budget_level_id: 47,
              level: {
                id: 47,
                level: '002',
                description: 'REGISTRO PRESUPUESTAL',
                class: 'CRP',
              },
            },
          },
        }),
        createMockCertificate({
          operation_log: {
            id: 43,
            validity: 2025,
            business_trust: {
              id: 618,
              business_code: '271151',
              name: 'Refugio Seguro',
            },
            user_created: {
              id: 1,
              name: 'John',
              last_name: 'Doe',
            },
            authorized_user: {
              id: 1,
              name: 'John',
              last_name: 'Doe',
            },
            status: {
              id: 1,
              name: 'Activo',
            },
            budget_document_type: {
              id: 29,
              code: 'RPP',
              description: 'REGISTRO PRESUPUESTAL',
              budget_level_id: 47,
              level: {
                id: 47,
                level: '002',
                description: 'REGISTRO PRESUPUESTAL',
                class: 'CRP',
              },
            },
          },
        }),
      ]
      const paginatedData = createMockPaginatedResponse(mockCertificates, 2, 3)
      const mockResponse = createMockApiResponse(
        paginatedData,
        true,
        'Listado obtenido exitosamente'
      )
      mockApiMethods.get.mockResolvedValue(mockResponse)
      const params = { page: 2, rows: 20 }

      // Act
      const result = await store._listAction(params)

      // Assert
      expect(mockApiMethods.get).toHaveBeenCalledWith(`${URL_PATH}/list`, {
        params: { ...params, paginate: 1 },
      })
      expect(showAlertMock).toHaveBeenCalledWith(
        'Listado obtenido exitosamente',
        'success',
        undefined,
        3000
      )
      expect(result).toEqual({
        success: true,
        last_description_society: 'COMPROMISO REGISTRO PRESUPUESTAL',
        last_file_exportable_id: null,
        list: mockCertificates,
        pages: { currentPage: 2, lastPage: 3 },
      })
    })

    it('should handle search filters', async () => {
      // Arrange
      const paginatedData = createMockPaginatedResponse([])
      const mockResponse = createMockApiResponse(paginatedData, true, 'OK')
      mockApiMethods.get.mockResolvedValue(mockResponse)
      const params = { 'filter[document_number]': '42' }

      // Act
      await store._listAction(params)

      // Assert
      expect(mockApiMethods.get).toHaveBeenCalledWith(`${URL_PATH}/list`, {
        params: { ...params, paginate: 1 },
      })
      expect(showAlertMock).toHaveBeenCalledWith(
        'OK',
        'success',
        undefined,
        3000
      )
    })

    it('should handle network errors', async () => {
      // Arrange
      const networkError = new Error('Network Error')
      mockApiMethods.get.mockRejectedValue(networkError)
      showCatchErrorMock.mockReturnValue('Network connection failed')

      // Act
      const result = await store._listAction({})

      // Assert
      expect(showCatchErrorMock).toHaveBeenCalledWith(networkError)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Network connection failed',
        'error',
        undefined,
        3000
      )
      expect(result).toEqual({
        success: false,
        last_description_society: '',
        last_file_exportable_id: null,
        list: [],
        pages: { currentPage: 0, lastPage: 0 },
      })
    })

    it('should handle unsuccessful response', async () => {
      // Arrange
      const paginatedData = createMockPaginatedResponse([])
      const mockResponse = createMockApiResponse(
        paginatedData,
        false,
        'Error en la consulta'
      )
      mockApiMethods.get.mockResolvedValue(mockResponse)

      // Act
      const result = await store._listAction({})

      // Assert
      expect(showAlertMock).toHaveBeenCalledWith(
        'Error en la consulta',
        'error',
        undefined,
        3000
      )
      expect(result).toEqual({
        success: false,
        last_description_society: 'COMPROMISO REGISTRO PRESUPUESTAL',
        last_file_exportable_id: null,
        list: [],
        pages: { currentPage: 1, lastPage: 1 },
      })
    })

    it('should handle response with missing pagination data', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { data: [] },
          message: 'OK',
        },
      }
      mockApiMethods.get.mockResolvedValue(mockResponse)

      // Act
      const result = await store._listAction({})

      // Assert
      expect(result).toEqual({
        success: true,
        last_description_society: '',
        last_file_exportable_id: null,
        list: [],
        pages: { currentPage: 0, lastPage: 0 },
      })
    })

    it('should handle response with empty items array', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            data: undefined,
            current_page: undefined,
            last_page: undefined,
          },
          message: 'OK',
        },
      }
      mockApiMethods.get.mockResolvedValue(mockResponse)

      // Act
      const result = await store._listAction({})

      // Assert
      expect(result).toEqual({
        success: true,
        last_description_society: '',
        last_file_exportable_id: null,
        list: [],
        pages: { currentPage: 0, lastPage: 0 },
      })
    })
  })

  describe('_generateAction', () => {
    it('should generate certificates successfully', async () => {
      // Arrange
      const payload = {
        filter: {
          business_trust_id: 17,
          validity: 2025,
          budget_level_id: 1,
          document_from: 42,
          document_to: 45,
        },
        description_society: 'Test Society',
        user_signature_id: 1,
      }
      const mockCertificates = [
        createMockCertificate({
          operation_log: {
            id: 42,
            validity: 2025,
            business_trust: {
              id: 618,
              business_code: '271151',
              name: 'Refugio Seguro',
            },
            user_created: {
              id: 1,
              name: 'John',
              last_name: 'Doe',
            },
            authorized_user: {
              id: 1,
              name: 'John',
              last_name: 'Doe',
            },
            status: {
              id: 1,
              name: 'Activo',
            },
            budget_document_type: {
              id: 29,
              code: 'RPP',
              description: 'REGISTRO PRESUPUESTAL',
              budget_level_id: 47,
              level: {
                id: 47,
                level: '002',
                description: 'REGISTRO PRESUPUESTAL',
                class: 'CRP',
              },
            },
          },
        }),
        createMockCertificate({
          operation_log: {
            id: 43,
            validity: 2025,
            business_trust: {
              id: 618,
              business_code: '271151',
              name: 'Refugio Seguro',
            },
            user_created: {
              id: 1,
              name: 'John',
              last_name: 'Doe',
            },
            authorized_user: {
              id: 1,
              name: 'John',
              last_name: 'Doe',
            },
            status: {
              id: 1,
              name: 'Activo',
            },
            budget_document_type: {
              id: 29,
              code: 'RPP',
              description: 'REGISTRO PRESUPUESTAL',
              budget_level_id: 47,
              level: {
                id: 47,
                level: '002',
                description: 'REGISTRO PRESUPUESTAL',
                class: 'CRP',
              },
            },
          },
        }),
      ]
      const mockResponse = createMockApiResponse(
        { certificates: mockCertificates },
        true,
        'Certificados generados exitosamente'
      )
      mockApiMethods.post.mockResolvedValue(mockResponse)

      // Act
      const result = await store._generateAction(payload)

      // Assert
      expect(mockApiMethods.post).toHaveBeenCalledWith(
        `${URL_PATH}/generate`,
        payload
      )
      expect(result).toEqual({
        success: true,
        data: mockCertificates,
      })
      expect(showAlertMock).toHaveBeenCalledWith(
        'Certificados generados exitosamente',
        'success',
        undefined,
        3000
      )
    })

    it('should handle generation failure', async () => {
      // Arrange
      const payload = {
        filter: {
          business_trust_id: 17,
          validity: 2025,
          budget_level_id: 1,
          document_from: 42,
          document_to: 45,
        },
        description_society: 'Test',
        user_signature_id: 1,
      }
      const mockResponse = createMockApiResponse(
        null,
        false,
        'Error de validación'
      )
      mockApiMethods.post.mockResolvedValue(mockResponse)

      // Act
      const result = await store._generateAction(payload)

      // Assert
      expect(result).toEqual({
        success: false,
        data: [],
      })
      expect(showAlertMock).toHaveBeenCalledWith(
        'Error de validación',
        'error',
        undefined,
        3000
      )
    })

    it('should handle network errors during generation', async () => {
      // Arrange
      const payload = {}
      const networkError = new Error('Network failure')
      mockApiMethods.post.mockRejectedValue(networkError)
      showCatchErrorMock.mockReturnValue('Connection error')

      // Act
      const result = await store._generateAction(payload)

      // Assert
      expect(result).toEqual({
        success: false,
        data: undefined,
      })
      expect(showCatchErrorMock).toHaveBeenCalledWith(networkError)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Connection error',
        'error',
        undefined,
        3000
      )
    })

    it('should handle response without certificates data', async () => {
      // Arrange
      const payload = {}
      const mockResponse = createMockApiResponse({}, true, 'Sin certificados')
      mockApiMethods.post.mockResolvedValue(mockResponse)

      // Act
      const result = await store._generateAction(payload)

      // Assert
      expect(result).toEqual({
        success: true,
        data: [],
      })
    })
  })

  describe('_showAction', () => {
    it('should get certificate by document number successfully', async () => {
      // Arrange
      const documentNumber = '42'
      const mockCertificate = createMockCertificate({
        operation_log: {
          id: Number(documentNumber),
          validity: 2025,
          business_trust: {
            id: 618,
            business_code: '271151',
            name: 'Refugio Seguro',
          },
          user_created: {
            id: 1,
            name: 'John',
            last_name: 'Doe',
          },
          authorized_user: {
            id: 1,
            name: 'John',
            last_name: 'Doe',
          },
          status: {
            id: 1,
            name: 'Activo',
          },
          budget_document_type: {
            id: 29,
            code: 'RPP',
            description: 'REGISTRO PRESUPUESTAL',
            budget_level_id: 47,
            level: {
              id: 47,
              level: '002',
              description: 'REGISTRO PRESUPUESTAL',
              class: 'CRP',
            },
          },
        },
      })
      const mockResponse = createMockApiResponse(
        mockCertificate,
        true,
        'Certificado obtenido'
      )
      mockApiMethods.get.mockResolvedValue(mockResponse)

      // Act
      const result = await store._showAction(documentNumber)

      // Assert
      expect(mockApiMethods.get).toHaveBeenCalledWith(
        `${URL_PATH}/${documentNumber}`
      )
      expect(result).toEqual(mockCertificate)
    })

    it('should handle unsuccessful response when getting certificate', async () => {
      // Arrange
      const documentNumber = '999'
      const mockResponse = createMockApiResponse(
        null,
        false,
        'Certificado no encontrado'
      )
      mockApiMethods.get.mockResolvedValue(mockResponse)

      // Act
      const result = await store._showAction(documentNumber)

      // Assert
      expect(showAlertMock).toHaveBeenCalledWith(
        'Certificado no encontrado',
        'error',
        undefined,
        3000
      )
      expect(result).toBeNull()
    })

    it('should handle unsuccessful response without message', async () => {
      // Arrange - Testing the message || fallback branch
      const documentNumber = '999'
      const mockResponse = {
        data: {
          success: false,
          data: null,
          message: '',
        },
      }
      mockApiMethods.get.mockResolvedValue(mockResponse)

      // Act
      const result = await store._showAction(documentNumber)

      // Assert
      expect(showAlertMock).toHaveBeenCalledWith(
        'Error al obtener el certificado',
        'error',
        undefined,
        3000
      )
      expect(result).toBeNull()
    })

    it('should handle network errors when getting certificate', async () => {
      // Arrange
      const documentNumber = '42'
      const networkError = new Error('Network Error')
      mockApiMethods.get.mockRejectedValue(networkError)
      showCatchErrorMock.mockReturnValue('Error de red')

      // Act
      const result = await store._showAction(documentNumber)

      // Assert
      expect(showCatchErrorMock).toHaveBeenCalledWith(networkError)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Error de red',
        'error',
        undefined,
        3000
      )
      expect(result).toBeNull()
    })

    it('should handle numeric document numbers', async () => {
      // Arrange
      const documentNumber = 42
      const mockCertificate = createMockCertificate({
        operation_log: {
          id: 42,
          validity: 2025,
          business_trust: {
            id: 618,
            business_code: '271151',
            name: 'Refugio Seguro',
          },
          user_created: {
            id: 1,
            name: 'John',
            last_name: 'Doe',
          },
          authorized_user: {
            id: 1,
            name: 'John',
            last_name: 'Doe',
          },
          status: {
            id: 1,
            name: 'Activo',
          },
          budget_document_type: {
            id: 29,
            code: 'RPP',
            description: 'REGISTRO PRESUPUESTAL',
            budget_level_id: 47,
            level: {
              id: 47,
              level: '002',
              description: 'REGISTRO PRESUPUESTAL',
              class: 'CRP',
            },
          },
        },
      })
      const mockResponse = createMockApiResponse(mockCertificate, true, 'OK')
      mockApiMethods.get.mockResolvedValue(mockResponse)

      // Act
      const result = await store._showAction(documentNumber)

      // Assert
      expect(mockApiMethods.get).toHaveBeenCalledWith(
        `${URL_PATH}/${documentNumber}`
      )
      expect(result).toEqual(mockCertificate)
    })
  })

  describe('_exportPDFAction', () => {
    it('should download PDF with ID successfully', async () => {
      // Arrange
      const id = 42
      const mockBlobData = new Blob(['test pdf data'], {
        type: 'application/pdf',
      })
      const mockResponse = {
        data: mockBlobData,
        headers: {
          'content-type': 'application/pdf',
          'content-disposition': 'attachment; filename="certificate-42.pdf"',
        },
      }
      mockApiMethods.get.mockResolvedValue(mockResponse)
      getNameBlobMock.mockReturnValue('certificate-42.pdf')

      // Act
      await store._exportPDFAction(id)

      // Assert
      expect(mockApiMethods.get).toHaveBeenCalledWith(
        `${URL_PATH}/export-pdf`,
        {
          params: { id },
          responseType: 'blob',
        }
      )
      expect(getNameBlobMock).toHaveBeenCalledWith(mockResponse)
      expect(downloadBlobMock).toHaveBeenCalledTimes(1)
      const downloadCall = downloadBlobMock.mock.calls[0]
      expect(downloadCall[0]).toBeInstanceOf(Blob)
      expect(downloadCall[0].type).toBe('application/pdf')
      expect(downloadCall[1]).toBe('certificate-42.pdf')
      expect(showAlertMock).toHaveBeenCalledWith(
        'Descarga exitosa',
        'success',
        undefined,
        3000
      )
    })

    it('should download all certificates without ID', async () => {
      // Arrange
      const mockBlobData = new Blob(['all certificates'], {
        type: 'application/pdf',
      })
      const mockResponse = {
        data: mockBlobData,
        headers: {
          'content-type': 'application/pdf',
          'content-disposition': 'attachment; filename="certificates.pdf"',
        },
      }
      mockApiMethods.get.mockResolvedValue(mockResponse)
      getNameBlobMock.mockReturnValue('certificates.pdf')

      // Act
      await store._exportPDFAction()

      // Assert
      expect(mockApiMethods.get).toHaveBeenCalledWith(
        `${URL_PATH}/export-pdf`,
        {
          params: { id: undefined },
          responseType: 'blob',
        }
      )
      expect(downloadBlobMock).toHaveBeenCalledTimes(1)
    })

    it('should handle download errors', async () => {
      // Arrange
      const id = 42
      const downloadError = new Error('Download Error')
      mockApiMethods.get.mockRejectedValue(downloadError)
      showCatchErrorMock.mockReturnValue('Error de descarga')

      // Act
      await store._exportPDFAction(id)

      // Assert
      expect(showCatchErrorMock).toHaveBeenCalledWith(downloadError)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Error de descarga',
        'error',
        undefined,
        3000
      )
      expect(downloadBlobMock).not.toHaveBeenCalled()
    })

    it('should handle network errors during PDF download', async () => {
      // Arrange
      const networkError = {
        response: {
          status: 500,
          data: { message: 'Server error' },
        },
      }
      mockApiMethods.get.mockRejectedValue(networkError)
      showCatchErrorMock.mockReturnValue('Error del servidor')

      // Act
      await store._exportPDFAction(99)

      // Assert
      expect(showCatchErrorMock).toHaveBeenCalledWith(networkError)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Error del servidor',
        'error',
        undefined,
        3000
      )
      expect(downloadBlobMock).not.toHaveBeenCalled()
    })
  })

  describe('_bulkExportPDFAction', () => {
    it('should download PDF immediately for <= 25 certificates', async () => {
      // Arrange
      const mockBlobData = new Blob(['test pdf data'], {
        type: 'application/pdf',
      })
      const mockResponse = {
        data: mockBlobData,
        headers: {
          'content-type': 'application/pdf',
          'content-disposition': 'attachment; filename="certificates.pdf"',
        },
      }
      mockApiMethods.get.mockResolvedValue(mockResponse)
      getNameBlobMock.mockReturnValue('certificates.pdf')

      // Act
      const result = await store._bulkExportPDFAction()

      // Assert
      expect(mockApiMethods.get).toHaveBeenCalledWith(
        `${URL_PATH}/export-pdf`,
        { responseType: 'blob' }
      )
      expect(getNameBlobMock).toHaveBeenCalledWith(mockResponse)
      expect(downloadBlobMock).toHaveBeenCalledTimes(1)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Descarga exitosa',
        'success',
        undefined,
        3000
      )
      expect(result).toEqual({ success: true, data: null })
    })

    it('should return file exportable data for > 25 certificates', async () => {
      // Arrange
      const mockJsonData = {
        success: true,
        data: {
          file_exportable_id: 123,
          process_id: 456,
          status: 'pending',
          status_id: 25,
          check_status_endpoint: '/api/check/123',
        },
        message: 'Proceso de generación iniciado',
      }
      const mockBlob = new Blob([JSON.stringify(mockJsonData)], {
        type: 'application/json',
      })
      mockBlob.text = jest.fn().mockResolvedValue(JSON.stringify(mockJsonData))

      const mockResponse = {
        data: mockBlob,
        headers: {
          'content-type': 'application/json',
        },
      }
      mockApiMethods.get.mockResolvedValue(mockResponse)

      // Act
      const result = await store._bulkExportPDFAction()

      // Assert
      expect(showAlertMock).toHaveBeenCalledWith(
        'Proceso de generación iniciado',
        'success',
        undefined,
        3000
      )
      expect(result).toEqual({
        success: true,
        data: mockJsonData.data,
      })
    })

    it('should handle errors during bulk export', async () => {
      // Arrange
      const error = new Error('Export failed')
      mockApiMethods.get.mockRejectedValue(error)
      showCatchErrorMock.mockReturnValue('Error al exportar')

      // Act
      const result = await store._bulkExportPDFAction()

      // Assert
      expect(showCatchErrorMock).toHaveBeenCalledWith(error)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Error al exportar',
        'error',
        undefined,
        3000
      )
      expect(result).toEqual({ success: false, data: null })
    })

    it('should handle uppercase Content-Type header', async () => {
      // Arrange
      const mockBlobData = new Blob(['test pdf'], { type: 'application/pdf' })
      const mockResponse = {
        data: mockBlobData,
        headers: {
          'Content-Type': 'application/pdf',
        },
      }
      mockApiMethods.get.mockResolvedValue(mockResponse)
      getNameBlobMock.mockReturnValue('test.pdf')

      // Act
      const result = await store._bulkExportPDFAction()

      // Assert
      expect(result).toEqual({ success: true, data: null })
      expect(downloadBlobMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('_getCertificatesGenerationStatus', () => {
    it('should get generation status successfully', async () => {
      // Arrange
      const fileExportableId = 123
      const mockStatusData = {
        file_exportable_id: fileExportableId,
        process_id: 456,
        status: 'completed',
        status_id: 29,
        is_ready: true,
        file_url: 'https://example.com/file.pdf',
        downloaded_at: '2025-12-24',
      }
      const mockResponse = createMockApiResponse(
        mockStatusData,
        true,
        'Estado obtenido exitosamente'
      )
      mockApiMethods.get.mockResolvedValue(mockResponse)

      // Act
      const result = await store._getCertificatesGenerationStatus(
        fileExportableId
      )

      // Assert
      expect(mockApiMethods.get).toHaveBeenCalledWith(
        `${URL_PATH}/export-pdf/${fileExportableId}`
      )
      expect(showAlertMock).toHaveBeenCalledWith(
        'Estado obtenido exitosamente',
        'success',
        undefined,
        3000
      )
      expect(result).toEqual(mockStatusData)
    })

    it('should handle pending status', async () => {
      // Arrange
      const fileExportableId = 123
      const mockStatusData = {
        file_exportable_id: fileExportableId,
        process_id: 456,
        status: 'pending',
        status_id: 25,
        is_ready: false,
        downloaded_at: '',
      }
      const mockResponse = createMockApiResponse(
        mockStatusData,
        true,
        'Proceso pendiente'
      )
      mockApiMethods.get.mockResolvedValue(mockResponse)

      // Act
      const result = await store._getCertificatesGenerationStatus(
        fileExportableId
      )

      // Assert
      expect(result).toEqual(mockStatusData)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Proceso pendiente',
        'success',
        undefined,
        3000
      )
    })

    it('should handle error status', async () => {
      // Arrange
      const fileExportableId = 123
      const mockResponse = createMockApiResponse(
        null,
        false,
        'Error al obtener estado'
      )
      mockApiMethods.get.mockResolvedValue(mockResponse)

      // Act
      const result = await store._getCertificatesGenerationStatus(
        fileExportableId
      )

      // Assert
      expect(showAlertMock).toHaveBeenCalledWith(
        'Error al obtener estado',
        'error',
        undefined,
        3000
      )
      expect(result).toBeNull()
    })

    it('should handle network errors', async () => {
      // Arrange
      const fileExportableId = 123
      const error = new Error('Network Error')
      mockApiMethods.get.mockRejectedValue(error)
      showCatchErrorMock.mockReturnValue('Error de red')

      // Act
      const result = await store._getCertificatesGenerationStatus(
        fileExportableId
      )

      // Assert
      expect(showCatchErrorMock).toHaveBeenCalledWith(error)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Error de red',
        'error',
        undefined,
        3000
      )
      expect(result).toBeNull()
    })
  })

  describe('Edge Cases and Integration', () => {
    it('should handle multiple consecutive operations', async () => {
      // Arrange
      const generatePayload = {
        filter: {
          business_trust_id: 17,
          validity: 2025,
          budget_level_id: 1,
          document_from: 42,
          document_to: 45,
        },
        description_society: 'Test',
        user_signature_id: 1,
      }
      const mockCertificates = [createMockCertificate()]
      const generateResponse = createMockApiResponse(
        { certificates: mockCertificates },
        true,
        'Generated'
      )
      const listResponse = createMockApiResponse(
        createMockPaginatedResponse(mockCertificates)
      )

      mockApiMethods.post.mockResolvedValue(generateResponse)
      mockApiMethods.get.mockResolvedValue(listResponse)

      // Act
      const generateResult = await store._generateAction(generatePayload)
      const listResult = await store._listAction({})

      // Assert
      expect(generateResult.success).toBe(true)
      expect(listResult?.list).toEqual(mockCertificates)
    })

    it('should handle empty response data gracefully', async () => {
      // Arrange
      const mockResponse = createMockApiResponse(null, true, 'No data')
      mockApiMethods.get.mockResolvedValue(mockResponse)

      // Act
      const result = await store._showAction('42')

      // Assert
      expect(result).toBeNull()
    })

    it('should maintain consistency after failed operations', async () => {
      // Arrange
      const errorResponse = new Error('API Error')
      mockApiMethods.post.mockRejectedValue(errorResponse)
      showCatchErrorMock.mockReturnValue('Operation failed')

      // Act
      const result = await store._generateAction({})

      // Assert
      expect(result.success).toBe(false)
      expect(result.data).toBeUndefined()
    })
  })
})
