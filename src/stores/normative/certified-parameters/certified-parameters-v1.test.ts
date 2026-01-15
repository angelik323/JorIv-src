import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'
import { useCertifiedParametersStoreV1 } from './certified-parameters-v1'
import { useAlert, useShowError } from '@/composables'
import { URL_PATH_NORMATIVE } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  })),
}))

jest.mock('@/composables', () => {
  const showAlertMock = jest.fn()
  const showCatchErrorMock = jest.fn(() => 'Mocked error message')
  const defaultIconsLucideMock = { plusCircleOutline: 'plus-circle-outline' }

  const useAlert = jest.fn(() => ({ showAlert: showAlertMock }))
  const useShowError = jest.fn(() => ({ showCatchError: showCatchErrorMock }))
  const useUtils = jest.fn(() => ({
    defaultIconsLucide: defaultIconsLucideMock,
  }))

  return {
    useAlert,
    useShowError,
    useUtils,
  }
})

const URL_PATH = `${URL_PATH_NORMATIVE}/certificate/parameter`

describe('useCertifiedParametersStoreV1', () => {
  let store: ReturnType<typeof useCertifiedParametersStoreV1>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useCertifiedParametersStoreV1()
    jest.clearAllMocks()
  })

  describe('_getListAction', () => {
    it('should return paginated list when API responds successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            data: [
              {
                code: 15,
                certificate_type: 'Retención en la fuente',
                name: 'Certificado retención en la fuente 6',
                person_type: 'Persona Jurídica',
                generation_date: '2025-12-10 15:53:28',
              },
              {
                code: 14,
                certificate_type: 'GMF',
                name: 'test 3 4dic gmf',
                person_type: 'Persona Natural',
                generation_date: '2025-12-04 12:54:23',
              },
            ],
            current_page: 1,
            last_page: 1,
          },
          message: 'Listado obtenido exitosamente.',
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const params = { page: 1, rows: 20 }
      const result = await store._getListAction(params)

      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
        params: { ...params, paginate: 1 },
      })
      expect(result).toEqual({
        list: mockResponse.data.data.data,
        pages: {
          currentPage: 1,
          lastPage: 1,
        },
      })
      expect(useAlert().showAlert).toHaveBeenCalledWith(
        'Listado obtenido exitosamente.',
        'success',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('should return null and show error alert when API responds with success false', async () => {
      const mockResponse = {
        data: {
          success: false,
          message: 'Error al obtener los datos',
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const params = { page: 1, rows: 10 }
      const result = await store._getListAction(params)

      expect(result).toBeNull()
      expect(useAlert().showAlert).toHaveBeenCalledWith(
        'Error al obtener los datos',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('should handle empty data array', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            data: [],
            current_page: 1,
            last_page: 1,
          },
          message: 'No hay datos disponibles',
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._getListAction({ page: 1, rows: 20 })

      expect(result).toEqual({
        list: [],
        pages: {
          currentPage: 1,
          lastPage: 1,
        },
      })
    })

    it('should handle API error and show error alert', async () => {
      const mockError = new Error('Network error')
      const mockGet = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._getListAction({ page: 1, rows: 20 })

      expect(result).toBeNull()
      expect(useShowError().showCatchError).toHaveBeenCalledWith(mockError)
      expect(useAlert().showAlert).toHaveBeenCalledWith(
        'Mocked error message',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('should handle missing pagination data', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            data: [{ id: 1, name: 'Test' }],
            current_page: 0,
            last_page: 0,
          },
          message: 'Datos obtenidos',
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._getListAction({ page: 1, rows: 20 })

      expect(result).toEqual({
        list: [{ id: 1, name: 'Test' }],
        pages: {
          currentPage: 1,
          lastPage: 1,
        },
      })
    })

    it('should handle response without data property', async () => {
      const mockResponse = {
        data: {
          success: false,
          message: 'No se encontraron registros.',
          data: [],
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._getListAction({ page: 1, rows: 20 })

      expect(result).toBeNull()
      expect(useAlert().showAlert).toHaveBeenCalledWith(
        'No se encontraron registros.',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })
  })

  describe('_getCertifiedParametersById', () => {
    it('should return certified parameter data when API responds successfully', async () => {
      const mockResponseData = {
        code: 12345,
        certificate_type_id: 1,
        certificate_type: 'Certificado GMF',
        name: 'Certificado Test',
        person_type_id: 1,
        person_type: {
          id: 1,
          name: 'Natural',
        },
        html_header: '<div>Test</div>',
        html_body: '<div>Content</div>',
        html_footer: '<div>Footer</div>',
        created_at: '2025-12-01 11:01:23',
        updated_at: '2025-12-01 11:01:23',
        generation_date: '2024-12-15',
      }

      const mockResponse = {
        data: {
          success: true,
          data: mockResponseData,
          message: 'Registro obtenido exitosamente.',
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const parameterId = 123
      const result = await store._getCertifiedParametersById(parameterId)

      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/${parameterId}`)
      expect(result).toEqual(mockResponseData)
      expect(useAlert().showAlert).toHaveBeenCalledWith(
        'Registro obtenido exitosamente.',
        'success',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('should return null when API responds with success false', async () => {
      const mockResponse = {
        data: {
          success: false,
          message: 'No se encontró el recurso solicitado.',
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._getCertifiedParametersById(123)

      expect(result).toBeNull()
      expect(useAlert().showAlert).toHaveBeenCalledWith(
        'No se encontró el recurso solicitado.',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('should return null when data is null', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: null,
          message: 'No se encontró el recurso solicitado.',
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._getCertifiedParametersById(123)

      expect(result).toBeNull()
    })

    it('should handle API error', async () => {
      const mockError = new Error('Server error')
      const mockGet = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._getCertifiedParametersById(123)

      expect(result).toBeNull()
      expect(useShowError().showCatchError).toHaveBeenCalledWith(mockError)
      expect(useAlert().showAlert).toHaveBeenCalledWith(
        'Mocked error message',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })
  })

  describe('_getCertifiedBlobPreview', () => {
    it('should return blob when API responds successfully', async () => {
      const mockBlobData = new ArrayBuffer(8)
      const mockResponse = {
        data: mockBlobData,
        headers: {
          'content-type': 'application/pdf',
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const parameterId = 123
      const result = await store._getCertifiedBlobPreview(parameterId)

      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/preview/${parameterId}`,
        {
          responseType: 'blob',
        }
      )
      expect(result).toBeInstanceOf(Blob)
      expect(result?.type).toBe('application/pdf')
    })

    it('should use default content-type when header is missing', async () => {
      const mockBlobData = new ArrayBuffer(8)
      const mockResponse = {
        data: mockBlobData,
        headers: {},
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._getCertifiedBlobPreview(123)

      expect(result).toBeInstanceOf(Blob)
      expect(result?.type).toBe('application/pdf')
    })

    it('should handle API error and return null', async () => {
      const mockError = new Error('File not found')
      const mockGet = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._getCertifiedBlobPreview(123)

      expect(result).toBeNull()
      expect(useShowError().showCatchError).toHaveBeenCalledWith(mockError)
      expect(useAlert().showAlert).toHaveBeenCalledWith(
        'Mocked error message',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })
  })

  describe('_createCertifiedParameters', () => {
    it('should return true when creation is successful', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Registro creado correctamente',
        },
      }

      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const formData = new FormData()
      formData.append('name', 'Test Certificate')

      const result = await store._createCertifiedParameters(formData)

      expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      expect(result).toBe(true)
      expect(useAlert().showAlert).toHaveBeenCalledWith(
        'Registro creado correctamente',
        'success',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('should return false when creation fails', async () => {
      const mockResponse = {
        data: {
          success: false,
          message: 'Error al crear registro',
        },
      }

      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const formData = new FormData()
      const result = await store._createCertifiedParameters(formData)

      expect(result).toBe(false)
      expect(useAlert().showAlert).toHaveBeenCalledWith(
        'Error al crear registro',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('should handle missing success property', async () => {
      const mockResponse = {
        data: {
          message: 'Respuesta sin success',
        },
      }

      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const formData = new FormData()
      const result = await store._createCertifiedParameters(formData)

      expect(result).toBe(false)
    })

    it('should handle API error', async () => {
      const mockError = new Error('Validation error')
      const mockPost = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const formData = new FormData()
      const result = await store._createCertifiedParameters(formData)

      expect(result).toBe(false)
      expect(useShowError().showCatchError).toHaveBeenCalledWith(mockError)
      expect(useAlert().showAlert).toHaveBeenCalledWith(
        'Mocked error message',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })
  })

  describe('_updateCertifiedParameters', () => {
    it('should return true when update is successful', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Registro actualizado exitosamente.',
        },
      }

      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const formData = new FormData()
      formData.append('name', 'Updated Certificate')
      const parameterId = 123

      const result = await store._updateCertifiedParameters(
        formData,
        parameterId
      )

      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}/update/${parameterId}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      )
      expect(result).toBe(true)
      expect(useAlert().showAlert).toHaveBeenCalledWith(
        'Registro actualizado exitosamente.',
        'success',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('should return false when update fails', async () => {
      const mockResponse = {
        data: {
          success: false,
          message: 'Error al actualizar registro',
        },
      }

      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const formData = new FormData()
      const result = await store._updateCertifiedParameters(formData, 123)

      expect(result).toBe(false)
      expect(useAlert().showAlert).toHaveBeenCalledWith(
        'Error al actualizar registro',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('should handle missing success property in update', async () => {
      const mockResponse = {
        data: {
          message: 'Respuesta sin success en update',
        },
      }

      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const formData = new FormData()
      const result = await store._updateCertifiedParameters(formData, 123)

      expect(result).toBe(false)
    })

    it('should handle API error', async () => {
      const mockError = new Error('Update error')
      const mockPost = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const formData = new FormData()
      const result = await store._updateCertifiedParameters(formData, 123)

      expect(result).toBe(false)
      expect(useShowError().showCatchError).toHaveBeenCalledWith(mockError)
    })
  })

  describe('_deleteCertifiedParameters', () => {
    it('should return true when deletion is successful', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Registro eliminado exitosamente.',
        },
      }

      const mockDelete = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      const parameterId = 123
      const result = await store._deleteCertifiedParameters(parameterId)

      expect(mockDelete).toHaveBeenCalledWith(`${URL_PATH}/${parameterId}`)
      expect(result).toBe(true)
      expect(useAlert().showAlert).toHaveBeenCalledWith(
        'Registro eliminado exitosamente.',
        'success',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('should return false when deletion fails', async () => {
      const mockResponse = {
        data: {
          success: false,
          message: 'Error al eliminar registro',
        },
      }

      const mockDelete = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      const result = await store._deleteCertifiedParameters(123)

      expect(result).toBe(false)
      expect(useAlert().showAlert).toHaveBeenCalledWith(
        'Error al eliminar registro',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('should handle missing success property', async () => {
      const mockResponse = {
        data: {
          message: 'Respuesta sin success',
        },
      }

      const mockDelete = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      const result = await store._deleteCertifiedParameters(123)

      expect(result).toBe(false)
    })

    it('should handle API error', async () => {
      const mockError = new Error('Delete error')
      const mockDelete = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      const result = await store._deleteCertifiedParameters(123)

      expect(result).toBe(false)
      expect(useShowError().showCatchError).toHaveBeenCalledWith(mockError)
      expect(useAlert().showAlert).toHaveBeenCalledWith(
        'Mocked error message',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })
  })

  describe('Store State', () => {
    it('should have correct initial headerPropsDefault state', () => {
      expect(store.headerPropsDefault).toEqual({
        title: 'Parámetros certificados',
        breadcrumbs: [
          {
            label: 'Inicio',
            route: 'HomeView',
          },
          {
            label: 'Normativo',
          },
          {
            label: 'Parámetros certificados',
            route: 'CertifiedParametersList',
          },
        ],
        btn: {
          label: 'Crear',
          icon: 'plus-circle-outline',
        },
      })
    })
  })
})
