import { setActivePinia, createPinia } from 'pinia'
import { useBankNetworkLoadStoreV1 } from './bank-network-load-v1'
import { executeApi } from '@/apis'
import {
  IBankNetworkLoadItem,
  IFileSignedRequest,
  IFileSignedResponse,
  IBankNetworkUploadRequest,
  IBankNetworkUploadResponse,
  IFileLoadedResponse,
  IValidationResult,
  IProcessBankNetworkUploadResponse,
} from '@/interfaces/customs/treasury/BankNetworkLoad'
import { IErrors } from '@/interfaces/global'
import { URL_PATH_TREASURIES } from '@/constants/apis'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}))

let mockShowAlert: jest.Mock
let mockShowCatchError: jest.Mock
let mockDownloadBlobXlxx: jest.Mock
let mockGetNameBlob: jest.Mock

jest.mock('@/composables', () => {
  mockShowAlert = jest.fn()
  mockShowCatchError = jest.fn().mockReturnValue('Error catch')
  mockDownloadBlobXlxx = jest.fn()
  mockGetNameBlob = jest.fn().mockReturnValue('default.xlsx')

  return {
    useAlert: () => ({ showAlert: mockShowAlert }),
    useShowError: () => ({ showCatchError: mockShowCatchError }),
    useUtils: () => ({
      downloadBlobXlxx: mockDownloadBlobXlxx,
      getNameBlob: mockGetNameBlob,
    }),
  }
})

describe('useBankNetworkLoadStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  const mockBankNetworkLoadItem: IBankNetworkLoadItem = {
    id: 1,
    upload_number: 'UPL001',
    file_name: 'test-file.txt',
    upload: '2025-10-01',
    bussiness: 'Test Business',
    request_type: 'ACH',
    bank: 'Test Bank',
    account_bank: 'Test Account',
    records: '100',
    state: 'Active',
  }

  const mockFileSignedRequest: IFileSignedRequest = {
    name: 'test-file.txt',
    document_type: 'txt',
  }

  const mockFileSignedResponse: IFileSignedResponse = {
    success: true,
    message: 'URL firmada generada',
    data: {
      upload_url: 'https://test-bucket.s3.amazonaws.com/test-file.txt',
      document_id: 123,
    },
  }

  const mockBankNetworkUploadRequest: IBankNetworkUploadRequest = {
    request_type: 'ACH',
    business_trust_id: 1,
    bank_id: null,
    format_type_id: 1,
    bank_account_id: 1,
    document_id: 123,
    office_id: null,
    treasury_movement_code_id: 1,
  }

  const mockBankNetworkUploadResponse: IBankNetworkUploadResponse = {
    success: true,
    message: 'Cargue creado exitosamente',
    data: {
      banking_network_upload: {
        id: 1,
        uploaded_at: '2025-10-01T10:00:00Z',
        request_type: 'ACH',
        total_count: 100,
      },
      structure_validation: {
        summary: {
          total_records: 100,
          processed_records: 100,
          valid_records: 95,
          failed_records: 5,
          no_apply_records: 0,
          has_errors: true,
          status: 'completed',
        },
      },
    },
  }

  const mockFileLoadedResponse: IFileLoadedResponse = {
    success: true,
    message: 'Archivo cargado exitosamente',
    data: {
      file_name: 'test-file.txt',
      total_count: 100,
      document_id: '123',
      file_extension: 'txt',
    },
  }

  const mockValidationResult: IValidationResult = {
    success: true,
    message: 'Validación completada',
    data: {
      success: true,
      message: 'Validación exitosa',
      status: 'completed',
      validation_summary: {
        total_records: 100,
        valid_count: 95,
        invalid_count: 5,
        control_count: 1,
        detail_valid_count: 94,
        warning_count: 0,
      },
      validation_details: {
        records: [
          {
            line_number: 1,
            record_type: 'control',
            is_control: true,
            data: { field1: 'value1' },
            validation_status: 'valid',
            business_validation: [],
          },
        ],
        invalid_records: [],
        warnings: [],
      },
    },
  }

  const mockProcessResponse: IProcessBankNetworkUploadResponse = {
    success: true,
    message: 'Procesamiento completado',
    data: {
      success: true,
      message: 'Archivo procesado exitosamente',
      processed_count: 95,
      error_count: 5,
      errors: [],
      status: 'completed',
    },
  }

  describe('_getBankNetworkLoadList', () => {
    it('should fetch bank network load list successfully', async () => {
      const store = useBankNetworkLoadStoreV1()
      const params = 'paginate=1'

      const mockResponse = {
        data: {
          success: true,
          message: 'Lista obtenida exitosamente',
          data: {
            data: [mockBankNetworkLoadItem],
            current_page: 1,
            last_page: 5,
          },
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._getBankNetworkLoadList(params)

      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH_TREASURIES}/banking-network-uploads?paginate=1${params}`
      )
      expect(store.bank_network_load_list).toEqual([mockBankNetworkLoadItem])
      expect(store.bank_network_load.currentPage).toBe(1)
      expect(store.bank_network_load.lastPage).toBe(5)
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Lista obtenida exitosamente',
        'success',
        undefined,
        3000
      )
    })

    it('should handle error when fetching bank network load list fails', async () => {
      const store = useBankNetworkLoadStoreV1()
      const params = 'paginate=1'

      const mockError: IErrors = {
        response: {
          status: 500,
          data: { message: 'Error del servidor' },
        },
      } as IErrors

      const mockGet = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._getBankNetworkLoadList(params)

      expect(mockShowCatchError).toHaveBeenCalledWith(mockError)
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Error catch',
        'error',
        undefined,
        3000
      )
    })
  })

  describe('_deleteBankNetworkLoad', () => {
    it('should delete bank network load successfully', async () => {
      const store = useBankNetworkLoadStoreV1()
      const id = 1

      const mockResponse = {
        data: {
          success: true,
          message: 'Cargue eliminado exitosamente',
        },
      }

      const mockDelete = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      await store._deleteBankNetworkLoad(id)

      expect(mockDelete).toHaveBeenCalledWith(
        `${URL_PATH_TREASURIES}/banking-network-uploads/${id}`
      )
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Cargue eliminado exitosamente',
        'success'
      )
    })

    it('should handle error when deleting bank network load fails', async () => {
      const store = useBankNetworkLoadStoreV1()
      const id = 1

      const mockError: IErrors = {
        response: {
          status: 404,
          data: { message: 'Cargue no encontrado' },
        },
      } as IErrors

      const mockDelete = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      await store._deleteBankNetworkLoad(id)

      expect(mockShowCatchError).toHaveBeenCalledWith(mockError)
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Error catch',
        'error',
        undefined,
        3000
      )
    })
  })

  describe('_deleteBankNetworkLoadFile', () => {
    it('should delete bank network load file successfully', async () => {
      const store = useBankNetworkLoadStoreV1()
      const documentId = 123

      const mockResponse = {
        data: {
          success: true,
          message: 'Archivo eliminado exitosamente',
        },
      }

      const mockDelete = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      await store._deleteBankNetworkLoadFile(documentId)

      expect(mockDelete).toHaveBeenCalledWith(
        `${URL_PATH_TREASURIES}/banking-network-uploads/file/${documentId}`
      )
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Archivo eliminado exitosamente',
        'success'
      )
    })

    it('should handle error when deleting file fails', async () => {
      const store = useBankNetworkLoadStoreV1()
      const documentId = 123

      const mockError: IErrors = {
        response: {
          status: 404,
          data: { message: 'Archivo no encontrado' },
        },
      } as IErrors

      const mockDelete = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      await store._deleteBankNetworkLoadFile(documentId)

      expect(mockShowCatchError).toHaveBeenCalledWith(mockError)
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Error catch',
        'error',
        undefined,
        3000
      )
    })
  })

  describe('_downloadTemplate', () => {
    it('should download template successfully', async () => {
      const store = useBankNetworkLoadStoreV1()
      const bankStructureId = 1

      const mockResponse = {
        data: new Blob(['template data'], { type: 'application/vnd.ms-excel' }),
        headers: {
          'content-disposition': 'attachment; filename="template.xlsx"',
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._downloadTemplate(bankStructureId)

      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH_TREASURIES}/banking-network-uploads/download-template`,
        {
          params: { bank_structure_id: bankStructureId },
          responseType: 'blob',
        }
      )
      expect(mockGetNameBlob).toHaveBeenCalledTimes(1)
      expect(mockDownloadBlobXlxx).toHaveBeenCalledTimes(1)
    })

    it('should handle error when downloading template fails', async () => {
      const store = useBankNetworkLoadStoreV1()
      const bankStructureId = 1

      const mockError: IErrors = {
        response: {
          status: 400,
          data: { message: 'Plantilla no disponible' },
        },
      } as IErrors

      const mockGet = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._downloadTemplate(bankStructureId)

      expect(mockShowCatchError).toHaveBeenCalledWith(mockError)
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Error catch',
        'error',
        undefined,
        3000
      )
    })
  })

  describe('_exportFailures', () => {
    it('should export failures successfully', async () => {
      const store = useBankNetworkLoadStoreV1()
      const uploadId = 1

      const mockResponse = {
        status: 200,
        data: new Blob(['failure data'], { type: 'application/vnd.ms-excel' }),
        headers: {
          'content-disposition': 'attachment; filename="failures.xlsx"',
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._exportFailures(uploadId)

      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH_TREASURIES}/banking-network-uploads/${uploadId}/export-failures`,
        { responseType: 'blob' }
      )
      expect(mockGetNameBlob).toHaveBeenCalledWith(mockResponse)
      expect(mockDownloadBlobXlxx).toHaveBeenCalledTimes(1)
    })

    it('should handle blob error response when exporting failures', async () => {
      const store = useBankNetworkLoadStoreV1()
      const uploadId = 1

      // Crear un blob real con método text() mockeado
      const mockBlob = new Blob(
        [JSON.stringify({ message: 'No hay errores para exportar' })],
        { type: 'application/json' }
      )

      // Mock del método text() del blob
      const mockText = jest
        .fn()
        .mockResolvedValue(
          JSON.stringify({ message: 'No hay errores para exportar' })
        )
      Object.defineProperty(mockBlob, 'text', { value: mockText })

      const mockGet = jest.fn().mockRejectedValue({
        response: {
          status: 400,
          data: mockBlob,
        },
        message: 'Request failed',
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._exportFailures(uploadId)

      // Esperamos que se maneje el error de blob
      await new Promise((resolve) => setTimeout(resolve, 100))

      expect(mockShowAlert).toHaveBeenCalledWith(
        'No hay errores para exportar',
        'error',
        undefined,
        3000
      )
    })
  })

  describe('_validateBankNetworkUpload', () => {
    it('should validate bank network upload successfully', async () => {
      const store = useBankNetworkLoadStoreV1()
      const uploadId = 1

      const mockResponse = {
        data: mockValidationResult,
      }

      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._validateBankNetworkUpload(uploadId)

      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH_TREASURIES}/banking-network-uploads/${uploadId}/validate`
      )
      expect(store.validation_result).toEqual(mockValidationResult)
      expect(result).toEqual(mockValidationResult)
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Validación completada',
        'success',
        undefined,
        3000
      )
    })

    it('should handle unsuccessful validation', async () => {
      const store = useBankNetworkLoadStoreV1()
      const uploadId = 1

      const mockResponse = {
        data: {
          success: false,
          message: 'Error en la validación',
        },
      }

      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._validateBankNetworkUpload(uploadId)

      expect(store.validation_result).toBeNull()
      expect(result).toBeNull()
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Error en la validación',
        'error',
        undefined,
        3000
      )
    })

    it('should handle error when validation fails', async () => {
      const store = useBankNetworkLoadStoreV1()
      const uploadId = 1

      const mockError: IErrors = {
        response: {
          status: 500,
          data: { message: 'Error del servidor' },
        },
      } as IErrors

      const mockPost = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._validateBankNetworkUpload(uploadId)

      expect(store.validation_result).toBeNull()
      expect(result).toBeNull()
      expect(mockShowCatchError).toHaveBeenCalledWith(mockError)
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Error catch',
        'error',
        undefined,
        3000
      )
    })
  })

  describe('_getFileSignedUrl', () => {
    it('should get file signed URL successfully', async () => {
      const store = useBankNetworkLoadStoreV1()

      const mockResponse = {
        data: mockFileSignedResponse,
      }

      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._getFileSignedUrl(mockFileSignedRequest)

      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH_TREASURIES}/banking-network-uploads/file/signed`,
        mockFileSignedRequest
      )
      expect(store.signed_url_response).toEqual(mockFileSignedResponse)
      expect(result).toEqual(mockFileSignedResponse)
    })

    it('should handle unsuccessful signed URL request', async () => {
      const store = useBankNetworkLoadStoreV1()

      const mockResponse = {
        data: {
          success: false,
          message: 'Error al generar URL firmada',
        },
      }

      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._getFileSignedUrl(mockFileSignedRequest)

      expect(store.signed_url_response).toBeNull()
      expect(result).toBeNull()
    })

    it('should handle error when getting signed URL fails', async () => {
      const store = useBankNetworkLoadStoreV1()

      const mockError: IErrors = {
        response: {
          status: 400,
          data: { message: 'Archivo inválido' },
        },
      } as IErrors

      const mockPost = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._getFileSignedUrl(mockFileSignedRequest)

      expect(store.signed_url_response).toBeNull()
      expect(result).toBeNull()
      expect(mockShowCatchError).toHaveBeenCalledWith(mockError)
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Error catch',
        'error',
        undefined,
        3000
      )
    })
  })

  describe('_createBankNetworkUpload', () => {
    it('should create bank network upload successfully', async () => {
      const store = useBankNetworkLoadStoreV1()

      const mockResponse = {
        data: mockBankNetworkUploadResponse,
      }

      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._createBankNetworkUpload(
        mockBankNetworkUploadRequest
      )

      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH_TREASURIES}/banking-network-uploads`,
        mockBankNetworkUploadRequest
      )
      expect(store.upload_response).toEqual(mockBankNetworkUploadResponse)
      expect(result).toEqual(mockBankNetworkUploadResponse)
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Cargue creado exitosamente',
        'success',
        undefined,
        3000
      )
    })

    it('should handle unsuccessful upload creation', async () => {
      const store = useBankNetworkLoadStoreV1()

      const mockResponse = {
        data: {
          success: false,
          message: 'Error al crear el cargue',
        },
      }

      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._createBankNetworkUpload(
        mockBankNetworkUploadRequest
      )

      expect(store.upload_response).toBeNull()
      expect(result).toBeNull()
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Error al crear el cargue',
        'error',
        undefined,
        3000
      )
    })

    it('should handle error when creating upload fails', async () => {
      const store = useBankNetworkLoadStoreV1()

      const mockError: IErrors = {
        response: {
          status: 422,
          data: { message: 'Datos inválidos' },
        },
      } as IErrors

      const mockPost = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._createBankNetworkUpload(
        mockBankNetworkUploadRequest
      )

      expect(store.upload_response).toBeNull()
      expect(result).toBeNull()
      expect(mockShowCatchError).toHaveBeenCalledWith(mockError)
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Error catch',
        'error',
        undefined,
        3000
      )
    })
  })
  describe('_updateBankNetworkUpload', () => {
    it('should update bank network upload successfully', async () => {
      const store = useBankNetworkLoadStoreV1()

      const mockResponse = {
        data: mockBankNetworkUploadResponse,
      }

      const mockPut = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      const result = await store._updateBankNetworkUpload(
        mockBankNetworkUploadRequest,
        1
      )

      expect(mockPut).toHaveBeenCalledWith(
        `${URL_PATH_TREASURIES}/banking-network-uploads/1`,
        mockBankNetworkUploadRequest
      )
      expect(store.upload_response).toEqual(mockBankNetworkUploadResponse)
      expect(result).toEqual(mockBankNetworkUploadResponse)
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Cargue creado exitosamente',
        'success',
        undefined,
        3000
      )
    })

    it('should handle unsuccessful upload update', async () => {
      const store = useBankNetworkLoadStoreV1()

      const mockResponse = {
        data: {
          success: false,
          message: 'Error al editar el cargue',
        },
      }

      const mockPut = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      const result = await store._updateBankNetworkUpload(
        mockBankNetworkUploadRequest,
        1
      )

      expect(store.upload_response).toBeNull()
      expect(result).toBeNull()
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Error al editar el cargue',
        'error',
        undefined,
        3000
      )
    })

    it('should handle error when updating upload fails', async () => {
      const store = useBankNetworkLoadStoreV1()

      const mockError: IErrors = {
        response: {
          status: 422,
          data: { message: 'Datos inválidos' },
        },
      } as IErrors

      const mockPut = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      const result = await store._updateBankNetworkUpload(
        mockBankNetworkUploadRequest,
        1
      )

      expect(store.upload_response).toBeNull()
      expect(result).toBeNull()
      expect(mockShowCatchError).toHaveBeenCalledWith(mockError)
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Error catch',
        'error',
        undefined,
        3000
      )
    })
  })

  describe('_getFileLoaded', () => {
    it('should get file loaded successfully', async () => {
      const store = useBankNetworkLoadStoreV1()
      const documentId = 123

      const mockResponse = {
        data: mockFileLoadedResponse,
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._getFileLoaded(documentId)

      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH_TREASURIES}/banking-network-uploads/file/pre-loaded?document_id=${documentId}`
      )
      expect(store.file_loaded_response).toEqual(mockFileLoadedResponse)
      expect(result).toEqual(mockFileLoadedResponse)
    })

    it('should handle unsuccessful file loaded request', async () => {
      const store = useBankNetworkLoadStoreV1()
      const documentId = 123

      const mockResponse = {
        data: {
          success: false,
          message: 'Archivo no encontrado',
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._getFileLoaded(documentId)

      expect(store.file_loaded_response).toBeNull()
      expect(result).toBeNull()
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Archivo no encontrado',
        'error',
        undefined,
        3000
      )
    })

    it('should handle error when getting file loaded fails', async () => {
      const store = useBankNetworkLoadStoreV1()
      const documentId = 123

      const mockError: IErrors = {
        response: {
          status: 404,
          data: { message: 'Documento no encontrado' },
        },
      } as IErrors

      const mockGet = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._getFileLoaded(documentId)

      expect(store.file_loaded_response).toBeNull()
      expect(result).toBeNull()
      expect(mockShowCatchError).toHaveBeenCalledWith(mockError)
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Error catch',
        'error',
        undefined,
        3000
      )
    })
  })

  describe('_processBankNetworkUpload', () => {
    it('should process bank network upload successfully', async () => {
      const store = useBankNetworkLoadStoreV1()
      const uploadId = 1

      const mockResponse = {
        data: mockProcessResponse,
      }

      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._processBankNetworkUpload(uploadId)

      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH_TREASURIES}/banking-network-uploads/${uploadId}/process`
      )
      expect(store.process_response).toEqual(mockProcessResponse)
      expect(result).toEqual(mockProcessResponse)
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Procesamiento completado',
        'success',
        undefined,
        3000
      )
    })

    it('should handle processing error in response data', async () => {
      const store = useBankNetworkLoadStoreV1()
      const uploadId = 1

      const mockResponse = {
        data: {
          success: true,
          message: 'Procesamiento completado con errores',
          data: {
            success: false,
            error: 'Error en el procesamiento de algunos registros',
          },
        },
      }

      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._processBankNetworkUpload(uploadId)

      expect(store.process_response).toEqual(mockResponse.data)
      expect(result).toEqual(mockResponse.data)
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Error en el procesamiento de algunos registros',
        'error',
        undefined,
        3000
      )
    })

    it('should handle unsuccessful processing', async () => {
      const store = useBankNetworkLoadStoreV1()
      const uploadId = 1

      const mockResponse = {
        data: {
          success: false,
          message: 'Error en el procesamiento',
        },
      }

      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._processBankNetworkUpload(uploadId)

      expect(store.process_response).toBeNull()
      expect(result).toBeNull()
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Error en el procesamiento',
        'error',
        undefined,
        3000
      )
    })

    it('should handle error when processing fails', async () => {
      const store = useBankNetworkLoadStoreV1()
      const uploadId = 1

      const mockError: IErrors = {
        response: {
          status: 500,
          data: { message: 'Error del servidor' },
        },
      } as IErrors

      const mockPost = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._processBankNetworkUpload(uploadId)

      expect(store.process_response).toBeNull()
      expect(result).toBeNull()
      expect(mockShowCatchError).toHaveBeenCalledWith(mockError)
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Error catch',
        'error',
        undefined,
        3000
      )
    })
  })

  describe('_getBankNetworkLoadById', () => {
    it('should get bank network load by ID successfully', async () => {
      const store = useBankNetworkLoadStoreV1()
      const id = 1

      const mockResponse = {
        data: {
          success: true,
          message: 'Cargue obtenido exitosamente',
          data: mockBankNetworkLoadItem,
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._getBankNetworkLoadById(id)

      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH_TREASURIES}/banking-network-uploads/${id}`
      )
      expect(result).toEqual(mockBankNetworkLoadItem)
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Cargue obtenido exitosamente',
        'success',
        undefined,
        3000
      )
    })

    it('should handle error when getting by ID fails', async () => {
      const store = useBankNetworkLoadStoreV1()
      const id = 1

      const mockError: IErrors = {
        response: {
          status: 404,
          data: { message: 'Cargue no encontrado' },
        },
      } as IErrors

      const mockGet = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._getBankNetworkLoadById(id)

      expect(result).toBeNull()
      expect(mockShowCatchError).toHaveBeenCalledWith(mockError)
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Error catch',
        'error',
        undefined,
        3000
      )
    })
  })

  describe('_getBankNetworkLoadDetailById', () => {
    it('should get bank network load detail by ID successfully', async () => {
      const store = useBankNetworkLoadStoreV1()
      const id = 1

      const mockDetailData = [
        {
          id: 1,
          record_number: 1,
          record_type: 'detail',
          amount: 1000,
          status: 'valid',
        },
        {
          id: 2,
          record_number: 2,
          record_type: 'detail',
          amount: 2000,
          status: 'valid',
        },
      ]

      const mockResponse = {
        data: {
          success: true,
          data: mockDetailData,
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._getBankNetworkLoadDetailById(id)

      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH_TREASURIES}/banking-network-uploads/${id}/records`
      )
      expect(result).toEqual(mockDetailData)
    })

    it('should handle unsuccessful detail request', async () => {
      const store = useBankNetworkLoadStoreV1()
      const id = 1

      const mockResponse = {
        data: {
          success: false,
          data: null,
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._getBankNetworkLoadDetailById(id)

      expect(result).toBeNull()
    })

    it('should handle error when getting detail by ID fails', async () => {
      const store = useBankNetworkLoadStoreV1()
      const id = 1

      const mockError: IErrors = {
        response: {
          status: 404,
          data: { message: 'Detalle no encontrado' },
        },
      } as IErrors

      const mockGet = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._getBankNetworkLoadDetailById(id)

      expect(result).toBeNull()
      expect(mockShowCatchError).toHaveBeenCalledWith(mockError)
    })
  })

  describe('_clearData', () => {
    it('should clear all store data', async () => {
      const store = useBankNetworkLoadStoreV1()

      // Set some initial data
      store.bank_network_load_list = [mockBankNetworkLoadItem]
      store.validation_result = mockValidationResult
      store.signed_url_response = mockFileSignedResponse
      store.upload_response = mockBankNetworkUploadResponse
      store.file_loaded_response = mockFileLoadedResponse
      store.process_response = mockProcessResponse
      store.bank_network_load.currentPage = 5
      store.bank_network_load.lastPage = 10

      await store._clearData()

      expect(store.bank_network_load_list).toEqual([])
      expect(store.validation_result).toBeNull()
      expect(store.signed_url_response).toBeNull()
      expect(store.upload_response).toBeNull()
      expect(store.file_loaded_response).toBeNull()
      expect(store.process_response).toBeNull()
      expect(store.bank_network_load.currentPage).toBe(0)
      expect(store.bank_network_load.lastPage).toBe(0)
    })
  })

  describe('Store initialization', () => {
    it('should initialize with correct default state', () => {
      const store = useBankNetworkLoadStoreV1()

      expect(store.bank_network_load).toEqual({
        currentPage: 0,
        lastPage: 0,
      })
      expect(store.bank_network_load_list).toEqual([])
      expect(store.validation_result).toBeNull()
      expect(store.signed_url_response).toBeNull()
      expect(store.upload_response).toBeNull()
      expect(store.file_loaded_response).toBeNull()
      expect(store.process_response).toBeNull()
    })
  })
})
