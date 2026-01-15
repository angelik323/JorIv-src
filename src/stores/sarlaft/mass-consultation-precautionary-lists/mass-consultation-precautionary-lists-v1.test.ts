import { setActivePinia, createPinia } from 'pinia'
import useMassConsultationPrecautionaryListsStoreV1 from './mass-consultation-precautionary-lists-v1'
import { executeApi } from '@/apis/index'
import { URL_PATH_SARLAFT } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}))

jest.mock('@/composables', () => {
  const showAlertMock = jest.fn()
  const showCatchErrorMock = jest.fn(() => 'Error!')

  const useAlert = jest.fn(() => ({ showAlert: showAlertMock }))
  const useShowError = jest.fn(() => ({ showCatchError: showCatchErrorMock }))

  return { useAlert, useShowError, showAlertMock, showCatchErrorMock }
})

jest.mock('@/composables/useUtils', () => ({
  useUtils: jest.fn(() => ({
    createAndDownloadBlobByArrayBuffer: jest.fn(),
    getNameBlob: jest.fn(),
  })),
}))

const { useUtils } = require('@/composables/useUtils')

const URL_PATH = `${URL_PATH_SARLAFT}/prevention-list`

const mockFileUploadStatus = {
  data: {
    info_file: {
      file_name: 'ejemplo_listas.xlsx',
      rows_count: 12,
      charging_status: 'Exitoso',
    },
    records_information: {
      number_records: 12,
      matches_count: 7,
    },
    register_match: [
      {
        authorization_number: 102,
        identification_number: '9876543210',
        name: 'Ana Gomez',
        level_match: 1,
        matching_system: 'Inspektor',
        inspektor_response: {
          message: 'Tercero con coincidencias, continuar con seguimiento.',
          priority: 3,
          name: 'Ana Gomez',
          document: '9876543210',
        },
        vigia_response: null,
      },
      {
        authorization_number: 103,
        identification_number: '2547896',
        name: 'Luis Martinez',
        level_match: 2,
        matching_system: 'Inspektor',
        inspektor_response: {
          message: 'Tercero con coincidencias, continuar con seguimiento.',
          priority: 3,
          name: 'Luis Martinez',
          document: '2547896',
        },
        vigia_response: null,
      },
    ],
    error_details: null,
  },
}
const mockBlob = new Blob(['contenido del archivo'], {
  type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
})

describe('useMassConsultationPrecautionaryListsStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  describe('_downloadTemplate', () => {
    it('should download template file successully', async () => {
      const store = useMassConsultationPrecautionaryListsStoreV1()

      const mockGet = jest.fn().mockResolvedValue({ data: mockBlob })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const createAndDownloadMock = jest.fn()
      const getNameBlobMock = jest
        .fn()
        .mockReturnValue('plantilla_listas_cautelares.xlsx')
      ;(useUtils as jest.Mock).mockReturnValue({
        createAndDownloadBlobByArrayBuffer: createAndDownloadMock,
        getNameBlob: getNameBlobMock,
      })

      const result = await store._downloadTemplate()

      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/download-template`, {
        responseType: 'blob',
      })
      expect(getNameBlobMock).toHaveBeenCalledWith({ data: mockBlob })
      expect(createAndDownloadMock).toHaveBeenCalledWith(
        mockBlob,
        'plantilla_listas_cautelares.xlsx'
      )
      expect(result).toBe(mockBlob)
    })

    it('should handle error when download fails', async () => {
      const store = useMassConsultationPrecautionaryListsStoreV1()

      const mockError = new Error('Network Error')
      const mockGet = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const { showAlertMock, showCatchErrorMock } = require('@/composables')

      const result = await store._downloadTemplate()

      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/download-template`, {
        responseType: 'blob',
      })
      expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Error!',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
      expect(result).toBeNull()
    })
  })

  describe('_uploadMassFile', () => {
    it('should upload file successfully', async () => {
      const store = useMassConsultationPrecautionaryListsStoreV1()

      const mockResponseData = {
        cache_key: 'fb86e5fc-6a40-47c5',
        hasErrors: false,
      }

      const mockResponse = {
        data: {
          data: mockResponseData,
          message: 'Se inició la carga de archivos',
        },
      }

      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const { showAlertMock } = require('@/composables')
      const payload = {
        file: new File(['contenido'], 'test.xlsx'),
        list_name: '',
      }

      const result = await store._uploadMassFile(payload)

      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}/consult-listings/mass-file`,
        payload,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )

      expect(showAlertMock).toHaveBeenCalledWith(
        'Se inició la carga de archivos',
        'success',
        undefined,
        TIMEOUT_ALERT
      )

      expect(result).toEqual(mockResponseData)
    })

    it('should handle error when upload fails', async () => {
      const store = useMassConsultationPrecautionaryListsStoreV1()

      const mockError = new Error('Upload Error')
      const mockPost = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const { showAlertMock, showCatchErrorMock } = require('@/composables')

      const payload = {
        file: new File(['contenido'], 'test.xlsx'),
        type: 'precautionary',
      }

      const result = await store._uploadMassFile(payload)

      expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Error!',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
      expect(result).toBeNull()
    })

    it('should return null when response data is undefined', async () => {
      const store = useMassConsultationPrecautionaryListsStoreV1()

      const mockResponse = {
        data: {
          data: undefined,
          message: 'Procesado',
        },
      }

      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const payload = { file: new File([''], 'test.xlsx'), type: 'test' }

      const result = await store._uploadMassFile(payload)

      expect(result).toBeNull()
    })
  })

  describe('_checkFileUploadStatus', () => {
    it('should check file status successfully', async () => {
      const store = useMassConsultationPrecautionaryListsStoreV1()

      const mockResponse = {
        data: {
          success: true,
          data: mockFileUploadStatus,
          message: 'Estado de carga',
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const { showAlertMock } = require('@/composables')
      const cacheKey = 'fb86e5fc-6a40-47c5'

      const result = await store._checkFileUploadStatus(cacheKey)

      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/upload-file/check-file-upload-status/${cacheKey}`
      )

      expect(showAlertMock).not.toHaveBeenCalled()

      expect(result).toEqual(mockFileUploadStatus)
    })

    it('should handle error when checking status fails', async () => {
      const store = useMassConsultationPrecautionaryListsStoreV1()

      const mockError = new Error('Status Check Error')
      const mockGet = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const cacheKey = 'fb86e5fc-6a40-47c5'

      const { showAlertMock, showCatchErrorMock } = require('@/composables')

      const result = await store._checkFileUploadStatus(cacheKey)

      expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Error!',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
      expect(result).toBeNull()
    })
  })

  describe('_downloadMatches', () => {
    it('should download matches file successully', async () => {
      const store = useMassConsultationPrecautionaryListsStoreV1()

      const mockGet = jest.fn().mockResolvedValue({ data: mockBlob })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const createAndDownloadMock = jest.fn()
      const getNameBlobMock = jest
        .fn()
        .mockReturnValue(
          'Listado_de_la_consulta_masiva_en_listas_cautelares.xlsx'
        )
      ;(useUtils as jest.Mock).mockReturnValue({
        createAndDownloadBlobByArrayBuffer: createAndDownloadMock,
        getNameBlob: getNameBlobMock,
      })

      const cacheKey = 'fb86e5fc-6a40-47c5'

      const result = await store._downloadMatches(cacheKey)

      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/upload-file/${cacheKey}/download-matches`,
        {
          responseType: 'blob',
        }
      )
      expect(getNameBlobMock).toHaveBeenCalledWith({ data: mockBlob })
      expect(createAndDownloadMock).toHaveBeenCalledWith(
        mockBlob,
        `Listado_de_la_consulta_masiva_en_listas_cautelares.xlsx`
      )
      expect(result).toBe(mockBlob)
    })

    it('should handle error when download matches fails', async () => {
      const store = useMassConsultationPrecautionaryListsStoreV1()

      const mockError = new Error('Network Error')
      const mockGet = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const { showAlertMock, showCatchErrorMock } = require('@/composables')
      const cacheKey = 'fb86e5fc-6a40-47c5'

      const result = await store._downloadMatches(cacheKey)

      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/upload-file/${cacheKey}/download-matches`,
        {
          responseType: 'blob',
        }
      )
      expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Error!',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
      expect(result).toBeNull()
    })
  })

  describe('_downloadErrors', () => {
    it('should download errors file successully', async () => {
      const store = useMassConsultationPrecautionaryListsStoreV1()

      const mockGet = jest.fn().mockResolvedValue({ data: mockBlob })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const createAndDownloadMock = jest.fn()
      const getNameBlobMock = jest
        .fn()
        .mockReturnValue(
          'Listado_de_errores_de_la_consulta_masiva_en_listas_cautelares.xlsx'
        )
      ;(useUtils as jest.Mock).mockReturnValue({
        createAndDownloadBlobByArrayBuffer: createAndDownloadMock,
        getNameBlob: getNameBlobMock,
      })

      const cacheKey = 'fb86e5fc-6a40-47c5'

      const result = await store._downloadErrors(cacheKey)

      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/download-errors/${cacheKey}`,
        {
          responseType: 'blob',
        }
      )
      expect(getNameBlobMock).toHaveBeenCalledWith({ data: mockBlob })
      expect(createAndDownloadMock).toHaveBeenCalledWith(
        mockBlob,
        'Listado_de_errores_de_la_consulta_masiva_en_listas_cautelares.xlsx'
      )
      expect(result).toBe(mockBlob)
    })

    it('should handle error when download matches fails', async () => {
      const store = useMassConsultationPrecautionaryListsStoreV1()

      const mockError = new Error('Network Error')
      const mockGet = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const { showAlertMock, showCatchErrorMock } = require('@/composables')
      const cacheKey = 'fb86e5fc-6a40-47c5'

      const result = await store._downloadErrors(cacheKey)

      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/download-errors/${cacheKey}`,
        {
          responseType: 'blob',
        }
      )
      expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
      expect(showAlertMock).toHaveBeenCalledWith(
        'Error!',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
      expect(result).toBeNull()
    })
  })
})
