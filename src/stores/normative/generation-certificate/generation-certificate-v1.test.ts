import { setActivePinia, createPinia } from 'pinia'
import { useGenerationCertificateStoreV1 } from './generation-certificate-v1'
import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { URL_PATH_NORMATIVE } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
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

const URL_PATH = `${URL_PATH_NORMATIVE}/certificate`

describe('useGenerationCertificateStoreV1', () => {
  let store: ReturnType<typeof useGenerationCertificateStoreV1>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useGenerationCertificateStoreV1()
    jest.clearAllMocks()
  })

  describe('_getListActionGroup', () => {
    it('should return paginated list when API responds successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            data: [
              {
                id: 1,
                progress: '75%',
                period: '2024-12',
                zip: 'https://example.com/file.zip',
              },
              {
                id: 2,
                progress: '100%',
                period: '2024-11',
                zip: 'https://example.com/file2.zip',
              },
            ],
            current_page: 1,
            last_page: 2,
          },
          message: 'Listado obtenido exitosamente.',
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const params = { page: 1, rows: 20 }
      const result = await store._getListActionGroup(params)

      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/group`, {
        params: { ...params, paginate: 1 },
      })
      expect(result).toEqual({
        list: mockResponse.data.data.data,
        pages: {
          currentPage: 1,
          lastPage: 2,
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
      const result = await store._getListActionGroup(params)

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

      const result = await store._getListActionGroup({ page: 1, rows: 20 })

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

      const result = await store._getListActionGroup({ page: 1, rows: 20 })

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
            data: [{ id: 1, progress: '50%', period: '2024-12', zip: '' }],
            current_page: 0,
            last_page: 0,
          },
          message: 'Datos obtenidos',
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._getListActionGroup({ page: 1, rows: 20 })

      expect(result).toEqual({
        list: [{ id: 1, progress: '50%', period: '2024-12', zip: '' }],
        pages: {
          currentPage: 1,
          lastPage: 1,
        },
      })
    })
  })

  describe('_getListActionDetail', () => {
    it('should return paginated list when API responds successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            data: [
              {
                id: 1,
                person_type: 'Persona Natural',
                client: 12345,
                period: '2024-12',
                url: 'https://example.com/certificate.pdf',
              },
              {
                id: 2,
                person_type: 'Persona Jurídica',
                client: 67890,
                period: '2024-11',
                url: 'https://example.com/certificate2.pdf',
              },
            ],
            current_page: 1,
            last_page: 3,
          },
          message: 'Listado detallado obtenido exitosamente.',
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const params = { page: 1, rows: 20 }
      const result = await store._getListActionDetail(params)

      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/generate`, {
        params: { ...params, paginate: 1 },
      })
      expect(result).toEqual({
        list: mockResponse.data.data.data,
        pages: {
          currentPage: 1,
          lastPage: 3,
        },
      })
      expect(useAlert().showAlert).toHaveBeenCalledWith(
        'Listado detallado obtenido exitosamente.',
        'success',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('should return null and show error alert when API responds with success false', async () => {
      const mockResponse = {
        data: {
          success: false,
          message: 'Error al obtener el listado detallado',
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const params = { page: 1, rows: 10 }
      const result = await store._getListActionDetail(params)

      expect(result).toBeNull()
      expect(useAlert().showAlert).toHaveBeenCalledWith(
        'Error al obtener el listado detallado',
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
          message: 'No hay detalles disponibles',
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._getListActionDetail({ page: 1, rows: 20 })

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

      const result = await store._getListActionDetail({ page: 1, rows: 20 })

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
            data: [
              {
                id: 1,
                person_type: 'Natural',
                client: 111,
                period: '2024-12',
                url: '',
              },
            ],
            current_page: 0,
            last_page: 0,
          },
          message: 'Datos obtenidos',
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._getListActionDetail({ page: 1, rows: 20 })

      expect(result).toEqual({
        list: [
          {
            id: 1,
            person_type: 'Natural',
            client: 111,
            period: '2024-12',
            url: '',
          },
        ],
        pages: {
          currentPage: 1,
          lastPage: 1,
        },
      })
    })
  })

  describe('_createGenerationCertificate', () => {
    it('should return true when creation is successful', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Certificado generado exitosamente.',
        },
      }

      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const type = 'gmf'
      const data = {
        person_types: 'Natural',
        start_client_id: 1,
        end_client_id: 100,
        validity: '2024-12-31',
        start_period: '2024-01',
        end_period: '2024-12',
      }

      const result = await store._createGenerationCertificate(type, data)

      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}/generate/${type}`,
        data
      )
      expect(result).toBe(true)
      expect(useAlert().showAlert).toHaveBeenCalledWith(
        'Certificado generado exitosamente.',
        'success',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('should return false when creation fails', async () => {
      const mockResponse = {
        data: {
          success: false,
          message: 'Error al generar el certificado',
        },
      }

      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._createGenerationCertificate('gmf', {
        person_types: 'Natural',
        start_client_id: 1,
        end_client_id: 100,
      })

      expect(result).toBe(false)
      expect(useAlert().showAlert).toHaveBeenCalledWith(
        'Error al generar el certificado',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('should handle missing success property', async () => {
      const mockResponse = {
        data: {
          message: 'Respuesta inesperada',
        },
      }

      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._createGenerationCertificate('gmf', {
        person_types: 'Jurídica',
        start_client_id: 1,
        end_client_id: 50,
      })

      expect(result).toBe(false)
    })

    it('should handle API error', async () => {
      const mockError = new Error('Server error')
      const mockPost = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._createGenerationCertificate('gmf', {
        person_types: 'Natural',
        start_client_id: 1,
        end_client_id: 100,
      })

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

  describe('_sendGroupCertificateEmail', () => {
    it('should return true when email is sent successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Correos enviados exitosamente.',
        },
      }

      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const groupId = 456
      const result = await store._sendGroupCertificateEmail(groupId)

      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}/group/sendMassive/${groupId}`
      )
      expect(result).toBe(true)
      expect(useAlert().showAlert).toHaveBeenCalledWith(
        'Correos enviados exitosamente.',
        'success',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('should return false when email sending fails', async () => {
      const mockResponse = {
        data: {
          success: false,
          message: 'Error al enviar correos',
        },
      }

      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._sendGroupCertificateEmail(456)

      expect(result).toBe(false)
      expect(useAlert().showAlert).toHaveBeenCalledWith(
        'Error al enviar correos',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('should handle missing success property', async () => {
      const mockResponse = {
        data: {
          message: 'Respuesta inesperada',
        },
      }

      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._sendGroupCertificateEmail(456)

      expect(result).toBe(false)
    })

    it('should handle API error', async () => {
      const mockError = new Error('Network error')
      const mockPost = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._sendGroupCertificateEmail(456)

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

  describe('_sendDetailCertificateEmail', () => {
    it('should return true when email is sent successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Correo enviado exitosamente.',
        },
      }

      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const detailId = 789
      const result = await store._sendDetailCertificateEmail(detailId)

      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}/generate/send/${detailId}`
      )
      expect(result).toBe(true)
      expect(useAlert().showAlert).toHaveBeenCalledWith(
        'Correo enviado exitosamente.',
        'success',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('should return false when email sending fails', async () => {
      const mockResponse = {
        data: {
          success: false,
          message: 'Error al enviar el correo',
        },
      }

      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._sendDetailCertificateEmail(789)

      expect(result).toBe(false)
      expect(useAlert().showAlert).toHaveBeenCalledWith(
        'Error al enviar el correo',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('should handle missing success property', async () => {
      const mockResponse = {
        data: {
          message: 'Respuesta inesperada',
        },
      }

      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._sendDetailCertificateEmail(789)

      expect(result).toBe(false)
    })

    it('should handle API error', async () => {
      const mockError = new Error('Email service error')
      const mockPost = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._sendDetailCertificateEmail(789)

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

  describe('_setUrl', () => {
    it('should set the url in the state', () => {
      const testUrl = 'https://example.com/certificate.pdf'

      expect(store.url).toBe('')

      store._setUrl(testUrl)

      expect(store.url).toBe(testUrl)
    })

    it('should update url when called multiple times', () => {
      store._setUrl('https://example.com/first.pdf')
      expect(store.url).toBe('https://example.com/first.pdf')

      store._setUrl('https://example.com/second.pdf')
      expect(store.url).toBe('https://example.com/second.pdf')
    })
  })

  describe('_setRouterList', () => {
    it('should set the routerGroupList in the state', () => {
      const testRoute = 'GenerationCertificateGroupList'

      expect(store.routerGroupList).toBe('')

      store._setRouterList(testRoute)

      expect(store.routerGroupList).toBe(testRoute)
    })

    it('should update routerGroupList when called multiple times', () => {
      store._setRouterList('RouteOne')
      expect(store.routerGroupList).toBe('RouteOne')

      store._setRouterList('RouteTwo')
      expect(store.routerGroupList).toBe('RouteTwo')
    })
  })

  describe('Store State', () => {
    it('should have correct initial headerPropsDefault state', () => {
      expect(store.headerPropsDefault).toEqual({
        title: 'Generación certificados',
        breadcrumbs: [
          {
            label: 'Inicio',
            route: 'HomeView',
          },
          {
            label: 'Normativo',
          },
          {
            label: 'Reportes',
          },
          {
            label: 'FICs Fondos de inversión colectiva',
          },
        ],
        btn: {
          label: 'Generar PDF',
          icon: 'plus-circle-outline',
        },
      })
    })

    it('should have correct initial url state', () => {
      expect(store.url).toBe('')
    })

    it('should have correct initial routerGroupList state', () => {
      expect(store.routerGroupList).toBe('')
    })
  })
})
