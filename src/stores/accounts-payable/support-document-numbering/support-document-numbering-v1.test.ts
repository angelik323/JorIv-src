// Pinia
import { setActivePinia, createPinia } from 'pinia'

//Api
import { executeApi } from '@/apis'
import {
  TRUST_BUSINESS_API_URL,
  URL_PATH_ACCOUNTS_PAYABLE,
  URL_PATH_THIRD_PARTIES_V1,
} from '@/constants/apis'

//Interfaces
import { ISupportDocumentNumberingUpdatePayload } from '@/interfaces/customs/accounts-payable/SupportDocumentNumbering'

// Store
import { useSupportDocumentNumberingStoreV1 } from '@/stores/accounts-payable/support-document-numbering/support-document-numbering-v1'

const URL_THIRD_PARTIES = `${URL_PATH_THIRD_PARTIES_V1}/support-document-numbering/third-parties`

const URL_ACCOUNTS_PAYABLE = `${URL_PATH_ACCOUNTS_PAYABLE}/support-document-numbering/resolutions`

const URL_BUSINESS_TRUST = `${TRUST_BUSINESS_API_URL}/support-document-numbering/business-trusts`

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  })),
}))

jest.mock('@/composables', () => {
  const showAlertMock = jest.fn()
  const showCatchErrorMock = jest.fn()

  const useAlert = jest.fn(() => ({ showAlert: showAlertMock }))
  const useShowError = jest.fn(() => ({ showCatchError: showCatchErrorMock }))

  return { useAlert, useShowError, showAlertMock, showCatchErrorMock }
})

const supportDocumentNumberingId = 4

describe('useSupportDocumentNumberingStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  // Servicios relacionados a los terceros
  describe('_getSupportDocumentNumberingList', () => {
    const filters = {
      paginate: 1,
      'filter[id]': 1,
      'filter[support_document_numbering_issuer_status_id]': 1,
    }

    const params = {
      ...filters,
    }
    it('should fetch third parties list and update state on success', async () => {
      // Arrange
      const store = useSupportDocumentNumberingStoreV1()

      const mockResponse = {
        data: {
          data: {
            data: [
              {
                id: 3379,
                document: '104715649',
                document_type_id: 9,
                status_id: 1,
                support_document_numbering_issuer_delegate_id: 3355,
                support_document_numbering_issuer_status_id: 1,
                document_type: {
                  id: 9,
                  name: 'Cedula de extranjeria',
                  abbreviation: 'CE',
                },
                support_document_numbering_issuer_status: {
                  id: 1,
                  status: 'Activo',
                },
                natural_person: {
                  id: 60,
                  third_party_id: 3379,
                  name: 'Nombre',
                  middle_name: 'Segundo',
                  last_name: 'Apellido',
                  second_last_name: 'Segundo',
                  full_name: 'Nombre Segundo Apellido Segundo',
                },
                legal_person: null,
              },
            ],
            current_page: 1,
            last_page: 1,
          },
          message: 'Listado obtenido exitosamente.',
          success: true,
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const response = await store._getSupportDocumentNumberingList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_THIRD_PARTIES}`, {
        params: params,
      })
      expect(response?.list).toEqual(mockResponse.data.data.data)
    })

    it('should handle error when fetching third parties list', async () => {
      // Arrange
      const store = useSupportDocumentNumberingStoreV1()
      const mockError = new Error('Network Error')
      const mockGet = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      const response = await store._getSupportDocumentNumberingList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_THIRD_PARTIES}`, {
        params: params,
      })
      expect(response).toEqual(null)
    })

    it('should handle response.data as undefined when fetching third parties list', async () => {
      // Arrange
      const store = useSupportDocumentNumberingStoreV1()
      const mockResponse = { data: undefined }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      const response = await store._getSupportDocumentNumberingList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_THIRD_PARTIES}`, {
        params: params,
      })
      expect(response).toEqual(null)
    })

    it('should handle response.data as null when fetching third parties list', async () => {
      // Arrange
      const store = useSupportDocumentNumberingStoreV1()
      const mockResponse = { data: null }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      const response = await store._getSupportDocumentNumberingList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_THIRD_PARTIES}`, {
        params: filters,
      })
      expect(response).toEqual(null)
    })
  })

  describe('_updateSupportDocumentNumberingStatus', () => {
    it('should update a new third parties successfully', async () => {
      // Arrange
      const store = useSupportDocumentNumberingStoreV1()
      const mockPut = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Registro actualizado exitosamente',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPut })

      // Act
      const result = await store._updateSupportDocumentNumberingStatus(
        supportDocumentNumberingId
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_THIRD_PARTIES}/${supportDocumentNumberingId}/toggle-status`
      )
      expect(mockPut).toHaveBeenCalledTimes(1)
      expect(result).toBe(true)
    })

    it('should handle api response success=false', async () => {
      // Arrange
      const store = useSupportDocumentNumberingStoreV1()

      const mockPut = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'El registro actualizado.',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPut })

      // Act
      const result = await store._updateSupportDocumentNumberingStatus(
        supportDocumentNumberingId
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_THIRD_PARTIES}/${supportDocumentNumberingId}/toggle-status`
      )
      expect(result).toBe(false)
    })

    it('should handle api peticion fails', async () => {
      // Arrange
      const store = useSupportDocumentNumberingStoreV1()

      const mockPut = jest.fn().mockRejectedValue(new Error('Network error'))
      ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPut })

      // Act
      const result = await store._updateSupportDocumentNumberingStatus(
        supportDocumentNumberingId
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_THIRD_PARTIES}/${supportDocumentNumberingId}/toggle-status`
      )
      expect(result).toBe(false)
    })
  })

  describe('_getSupportDocumentNumberingById', () => {
    it('should fetch third parties by id and return the data', async () => {
      // Arrange
      const store = useSupportDocumentNumberingStoreV1()

      const mockResponse = {
        data: {
          data: {
            id: 3379,
            document: '104715649',
            document_type_id: 9,
            status_id: 1,
            support_document_numbering_issuer_delegate_id: 3355,
            support_document_numbering_issuer_status_id: 1,
            document_type: {
              id: 9,
              name: 'Cedula de extranjeria',
              abbreviation: 'CE',
            },
            support_document_numbering_issuer_status: {
              id: 1,
              status: 'Activo',
            },
            natural_person: {
              id: 60,
              third_party_id: 3379,
              name: 'Nombre',
              middle_name: 'Segundo',
              last_name: 'Apellido',
              second_last_name: 'Segundo',
              full_name: 'Nombre Segundo Apellido Segundo',
            },
            legal_person: null,
          },
          message: 'Registro obtenido exitosamente.',
          success: true,
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const response = await store._getSupportDocumentNumberingById(
        supportDocumentNumberingId
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_THIRD_PARTIES}/${supportDocumentNumberingId}`
      )
      expect(response).toEqual(mockResponse.data.data)
    })

    it('should handle error when api response success=false', async () => {
      // Arrange
      const store = useSupportDocumentNumberingStoreV1()

      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'No se encontro el registro.',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      const response = await store._getSupportDocumentNumberingById(
        supportDocumentNumberingId
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_THIRD_PARTIES}/${supportDocumentNumberingId}`
      )
      expect(response).toEqual(null)
    })

    it('should handle error when api petition fails', async () => {
      // Arrange
      const store = useSupportDocumentNumberingStoreV1()

      const mockGet = jest.fn().mockRejectedValue(new Error('Network error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      const response = await store._getSupportDocumentNumberingById(
        supportDocumentNumberingId
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_THIRD_PARTIES}/${supportDocumentNumberingId}`
      )
      expect(response).toEqual(null)
    })
  })

  describe('_updateSupportDocumentNumbering', () => {
    const mockSupportDocumentNumberingUpdatePayload: ISupportDocumentNumberingUpdatePayload =
      {
        support_document_numbering_issuer_delegate_id: 4,
      }

    it('should update a new third parties successfully', async () => {
      // Arrange
      const store = useSupportDocumentNumberingStoreV1()
      const mockPut = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Registro actualizado exitosamente',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._updateSupportDocumentNumbering(
        mockSupportDocumentNumberingUpdatePayload,
        supportDocumentNumberingId
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_THIRD_PARTIES}/${supportDocumentNumberingId}`,
        mockSupportDocumentNumberingUpdatePayload
      )
      expect(mockPut).toHaveBeenCalledTimes(1)
      expect(result).toBe(true)
    })

    it('should handle api response success=false', async () => {
      // Arrange
      const store = useSupportDocumentNumberingStoreV1()

      const mockPut = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'El registro actualizado.',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._updateSupportDocumentNumbering(
        mockSupportDocumentNumberingUpdatePayload,
        supportDocumentNumberingId
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_THIRD_PARTIES}/${supportDocumentNumberingId}`,
        mockSupportDocumentNumberingUpdatePayload
      )
      expect(result).toBe(false)
    })

    it('should handle api peticion fails', async () => {
      // Arrange
      const store = useSupportDocumentNumberingStoreV1()

      const mockPut = jest.fn().mockRejectedValue(new Error('Network error'))
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._updateSupportDocumentNumbering(
        mockSupportDocumentNumberingUpdatePayload,
        supportDocumentNumberingId
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_THIRD_PARTIES}/${supportDocumentNumberingId}`,
        mockSupportDocumentNumberingUpdatePayload
      )
      expect(result).toBe(false)
    })
  })

  // Servicios relacionados a las resoluciones
  describe('_getSupportDocumentNumberingResolutionsList', () => {
    const filters = {
      paginate: 1,
      'filter[third_party_id]': 1,
    }

    const params = {
      ...filters,
    }
    it('should fetch resolutions list and update state on success', async () => {
      // Arrange
      const store = useSupportDocumentNumberingStoreV1()

      const mockResponse = {
        data: {
          data: {
            data: [
              {
                id: 5,
                resolution: 'prueba resolucion',
                resolution_date: '2025-11-12',
                prefix: 'DA',
                range_start: 1,
                range_end: 5000,
                next_available_number: 2,
                validity_start_date: '2025-11-12',
                validity_end_date: '2025-11-15',
                has_business_prefix: true,
                third_party_id: 3358,
                third_party: {
                  id: 3358,
                  document: '324234',
                  validator_digit: null,
                  document_type_id: 13,
                  support_document_numbering_issuer_status_id: 1,
                  support_document_numbering_issuer_delegate_id: null,
                  legal_person: null,
                  natural_person: {
                    third_party_id: 3358,
                    id: 44,
                    name: 'AP',
                    middle_name: 'AP',
                    last_name: 'AP',
                    second_last_name: 'AP',
                    full_name: 'AP AP AP AP',
                  },
                  document_type: {
                    id: 13,
                    name: 'Permiso especial de permanencia',
                    abbreviation: 'PEP',
                    model: 'third-party-natural',
                    status_id: 1,
                  },
                },
                status: {
                  id: 1,
                  name: 'Activo',
                  description: null,
                },
              },
            ],
            current_page: 1,
            last_page: 1,
          },
          message: 'Listado obtenido exitosamente.',
          success: true,
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const response = await store._getSupportDocumentNumberingResolutionsList(
        filters
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_ACCOUNTS_PAYABLE}`, {
        params: params,
      })
      expect(response?.list).toEqual(mockResponse.data.data.data)
    })

    it('should handle error when fetching resolutions list', async () => {
      // Arrange
      const store = useSupportDocumentNumberingStoreV1()
      const mockError = new Error('Network Error')
      const mockGet = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      const response = await store._getSupportDocumentNumberingResolutionsList(
        filters
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_ACCOUNTS_PAYABLE}`, {
        params: params,
      })
      expect(response).toEqual(null)
    })

    it('should handle response.data as undefined when fetching resolutions list', async () => {
      // Arrange
      const store = useSupportDocumentNumberingStoreV1()
      const mockResponse = { data: undefined }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      const response = await store._getSupportDocumentNumberingResolutionsList(
        filters
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_ACCOUNTS_PAYABLE}`, {
        params: params,
      })
      expect(response).toEqual(null)
    })

    it('should handle response.data as null when fetching resolutions list', async () => {
      // Arrange
      const store = useSupportDocumentNumberingStoreV1()
      const mockResponse = { data: null }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      const response = await store._getSupportDocumentNumberingResolutionsList(
        filters
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_ACCOUNTS_PAYABLE}`, {
        params: filters,
      })
      expect(response).toEqual(null)
    })
  })

  describe('_createSupportDocumentNumberingResolution', () => {
    const mockSupportDocumentNumberingCreatePayload = {
      resolution: 'DIAN123456789',
      resolution_date: '2024-01-15',
      prefix: 'DS',
      range_start: 1,
      range_end: 5000,
      validity_start_date: '2024-01-15',
      validity_end_date: '2026-01-15',
      has_business_prefix: true,
      third_party_id: 61,
      next_available_number: null,
      status_id: 1,
    }
    it('should create a new resolutions successfully', async () => {
      // Arrange
      const store = useSupportDocumentNumberingStoreV1()
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Created',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createSupportDocumentNumberingResolution(
        mockSupportDocumentNumberingCreatePayload
      )

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_ACCOUNTS_PAYABLE}`,
        mockSupportDocumentNumberingCreatePayload
      )
      expect(mockPost).toHaveBeenCalledTimes(1)
      expect(result).toBe(true)
    })

    it('should handle api response success=false', async () => {
      // Arrange
      const store = useSupportDocumentNumberingStoreV1()

      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'El registro no pudo ser creado.',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createSupportDocumentNumberingResolution(
        mockSupportDocumentNumberingCreatePayload
      )

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_ACCOUNTS_PAYABLE}`,
        mockSupportDocumentNumberingCreatePayload
      )
      expect(result).toBe(false)
    })

    it('should handle error when creating petition fails', async () => {
      // Arrange
      const store = useSupportDocumentNumberingStoreV1()

      const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createSupportDocumentNumberingResolution(
        mockSupportDocumentNumberingCreatePayload
      )

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_ACCOUNTS_PAYABLE}`,
        mockSupportDocumentNumberingCreatePayload
      )
      expect(result).toBe(false)
    })
  })

  describe('_getSupportDocumentNumberingResolutionById', () => {
    it('should fetch resolutions by id and return the data', async () => {
      // Arrange
      const store = useSupportDocumentNumberingStoreV1()

      const mockResponse = {
        data: {
          data: {
            id: 5,
            resolution: 'prueba resolucion',
            resolution_date: '2025-11-12',
            prefix: 'DA',
            range_start: 1,
            range_end: 5000,
            next_available_number: 2,
            validity_start_date: '2025-11-12',
            validity_end_date: '2025-11-15',
            has_business_prefix: true,
            third_party_id: 3358,
            third_party: {
              id: 3358,
              document: '324234',
              validator_digit: null,
              document_type_id: 13,
              support_document_numbering_issuer_status_id: 1,
              support_document_numbering_issuer_delegate_id: null,
              legal_person: null,
              natural_person: {
                third_party_id: 3358,
                id: 44,
                name: 'AP',
                middle_name: 'AP',
                last_name: 'AP',
                second_last_name: 'AP',
                full_name: 'AP AP AP AP',
              },
              document_type: {
                id: 13,
                name: 'Permiso especial de permanencia',
                abbreviation: 'PEP',
                model: 'third-party-natural',
                status_id: 1,
              },
            },
            status: {
              id: 1,
              name: 'Activo',
              description: null,
            },
          },
          message: 'Registro obtenido exitosamente.',
          success: true,
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const response = await store._getSupportDocumentNumberingResolutionById(
        supportDocumentNumberingId
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_ACCOUNTS_PAYABLE}/${supportDocumentNumberingId}`
      )
      expect(response).toEqual(mockResponse.data.data)
    })

    it('should handle error when api response success=false', async () => {
      // Arrange
      const store = useSupportDocumentNumberingStoreV1()

      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'No se encontro el registro.',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      const response = await store._getSupportDocumentNumberingResolutionById(
        supportDocumentNumberingId
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_ACCOUNTS_PAYABLE}/${supportDocumentNumberingId}`
      )
      expect(response).toEqual(null)
    })

    it('should handle error when api petition fails', async () => {
      // Arrange
      const store = useSupportDocumentNumberingStoreV1()

      const mockGet = jest.fn().mockRejectedValue(new Error('Network error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      const response = await store._getSupportDocumentNumberingResolutionById(
        supportDocumentNumberingId
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_ACCOUNTS_PAYABLE}/${supportDocumentNumberingId}`
      )
      expect(response).toEqual(null)
    })
  })

  describe('_updateSupportDocumentNumberingResolution', () => {
    const mockSupportDocumentNumberingResolutionUpdatePayload = {
      resolution: 'DIAN233232',
      resolution_date: '2024-01-15',
      prefix: 'DS',
      range_start: 1,
      range_end: 5000,
      validity_start_date: '2024-01-15',
      validity_end_date: '2026-01-15',
      has_business_prefix: false,
      status_id: 2,
      next_available_number: null,
    }
    it('should update a new resolutions successfully', async () => {
      // Arrange
      const store = useSupportDocumentNumberingStoreV1()
      const mockPut = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Registro actualizado exitosamente',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._updateSupportDocumentNumberingResolution(
        mockSupportDocumentNumberingResolutionUpdatePayload,
        supportDocumentNumberingId
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_ACCOUNTS_PAYABLE}/${supportDocumentNumberingId}`,
        mockSupportDocumentNumberingResolutionUpdatePayload
      )
      expect(mockPut).toHaveBeenCalledTimes(1)
      expect(result).toBe(true)
    })

    it('should handle api response success=false', async () => {
      // Arrange
      const store = useSupportDocumentNumberingStoreV1()

      const mockPut = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'El registro actualizado.',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._updateSupportDocumentNumberingResolution(
        mockSupportDocumentNumberingResolutionUpdatePayload,
        supportDocumentNumberingId
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_ACCOUNTS_PAYABLE}/${supportDocumentNumberingId}`,
        mockSupportDocumentNumberingResolutionUpdatePayload
      )
      expect(result).toBe(false)
    })

    it('should handle api peticion fails', async () => {
      // Arrange
      const store = useSupportDocumentNumberingStoreV1()

      const mockPut = jest.fn().mockRejectedValue(new Error('Network error'))
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._updateSupportDocumentNumberingResolution(
        mockSupportDocumentNumberingResolutionUpdatePayload,
        supportDocumentNumberingId
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_ACCOUNTS_PAYABLE}/${supportDocumentNumberingId}`,
        mockSupportDocumentNumberingResolutionUpdatePayload
      )
      expect(result).toBe(false)
    })
  })

  describe('_deleteSupportDocumentNumberingResolution', () => {
    it('should delete resolutions', async () => {
      // Arrange
      const store = useSupportDocumentNumberingStoreV1()
      const mockDelete = jest.fn().mockResolvedValue({
        data: {
          success: true,
          data: null,
          message: 'Registro eliminado exitosamente.',
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      const result = await store._deleteSupportDocumentNumberingResolution(
        supportDocumentNumberingId
      )

      // Assert
      expect(mockDelete).toHaveBeenCalledWith(
        `${URL_ACCOUNTS_PAYABLE}/${supportDocumentNumberingId}`
      )
      expect(mockDelete).toHaveBeenCalledTimes(1)
      expect(result).toBe(true)
    })

    it('should handle error deleting settlement formula', async () => {
      // Arrange
      const store = useSupportDocumentNumberingStoreV1()
      const mockDelete = jest.fn().mockResolvedValue({
        data: {
          success: false,
          data: null,
          message: 'Error al eliminar el registro.',
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      const result = await store._deleteSupportDocumentNumberingResolution(
        supportDocumentNumberingId
      )

      // Assert
      expect(mockDelete).toHaveBeenCalledWith(
        `${URL_ACCOUNTS_PAYABLE}/${supportDocumentNumberingId}`
      )
      expect(result).toBe(false)
    })
  })

  //Servicios relacionados a los negocios
  describe('_getSupportDocumentNumberingBusinessList', () => {
    const filters = {
      paginate: 1,
      'filter[third_party_id]': 1,
    }

    const params = {
      ...filters,
    }
    it('should fetch business trust list and update state on success', async () => {
      // Arrange
      const store = useSupportDocumentNumberingStoreV1()

      const mockResponse = {
        data: {
          data: {
            data: [
              {
                id: 10,
                business_code: '6842078',
                name: 'Voluptates ipsa consectetur neque ea.',
                business_mod: 'animi',
                status_id: 59,
                status: {
                  id: 59,
                  status: 'En liquidación',
                },
                account: {
                  id: 10,
                  business_trust_id: 10,
                  identification_tax: '9225497256',
                  status_id: 2,
                  status: {
                    id: 2,
                    status: 'Inactivo',
                  },
                },
                support_document_numberings: [
                  {
                    id: 1,
                    support_document_numbering_resolution_id: 2,
                    prefix: null,
                    status_id: 2,
                    handles_issuer_data: true,
                    status: {
                      id: 2,
                      status: 'Inactivo',
                    },
                  },
                ],
              },
            ],
            current_page: 1,
            last_page: 1,
          },
          message: 'Listado obtenido exitosamente.',
          success: true,
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const response = await store._getSupportDocumentNumberingBusinessList(
        filters
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_BUSINESS_TRUST}`, {
        params: params,
      })
      expect(response?.list).toEqual(mockResponse.data.data.data)
    })

    it('should handle error when fetching business trust list', async () => {
      // Arrange
      const store = useSupportDocumentNumberingStoreV1()
      const mockError = new Error('Network Error')
      const mockGet = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      const response = await store._getSupportDocumentNumberingBusinessList(
        filters
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_BUSINESS_TRUST}`, {
        params: params,
      })
      expect(response).toEqual(null)
    })

    it('should handle response.data as undefined when fetching business trust list', async () => {
      // Arrange
      const store = useSupportDocumentNumberingStoreV1()
      const mockResponse = { data: undefined }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      const response = await store._getSupportDocumentNumberingBusinessList(
        filters
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_BUSINESS_TRUST}`, {
        params: params,
      })
      expect(response).toEqual(null)
    })

    it('should handle response.data as null when fetching business trust list', async () => {
      // Arrange
      const store = useSupportDocumentNumberingStoreV1()
      const mockResponse = { data: null }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      const response = await store._getSupportDocumentNumberingBusinessList(
        filters
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_BUSINESS_TRUST}`, {
        params: filters,
      })
      expect(response).toEqual(null)
    })
  })

  describe('_getSupportDocumentNumberingBusinessById', () => {
    it('should fetch business trust by id and return the data', async () => {
      // Arrange
      const store = useSupportDocumentNumberingStoreV1()

      const mockResponse = {
        data: {
          data: {
            id: 10,
            business_code: '6842078',
            name: 'Voluptates ipsa consectetur neque ea.',
            business_mod: 'animi',
            status_id: 59,
            status: {
              id: 59,
              status: 'En liquidación',
            },
            account: {
              id: 10,
              business_trust_id: 10,
              identification_tax: '9225497256',
              status_id: 2,
              status: {
                id: 2,
                status: 'Inactivo',
              },
            },
            support_document_numberings: [
              {
                id: 1,
                support_document_numbering_resolution_id: 2,
                prefix: null,
                status_id: 2,
                handles_issuer_data: true,
                status: {
                  id: 2,
                  status: 'Inactivo',
                },
              },
            ],
          },
          message: 'Registro obtenido exitosamente.',
          success: true,
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const response = await store._getSupportDocumentNumberingBusinessById(
        supportDocumentNumberingId
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_BUSINESS_TRUST}/${supportDocumentNumberingId}`
      )
      expect(response).toEqual(mockResponse.data.data)
    })

    it('should handle error when api response success=false', async () => {
      // Arrange
      const store = useSupportDocumentNumberingStoreV1()

      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'No se encontro el registro.',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      const response = await store._getSupportDocumentNumberingBusinessById(
        supportDocumentNumberingId
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_BUSINESS_TRUST}/${supportDocumentNumberingId}`
      )
      expect(response).toEqual(null)
    })

    it('should handle error when api petition fails', async () => {
      // Arrange
      const store = useSupportDocumentNumberingStoreV1()

      const mockGet = jest.fn().mockRejectedValue(new Error('Network error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      const response = await store._getSupportDocumentNumberingBusinessById(
        supportDocumentNumberingId
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_BUSINESS_TRUST}/${supportDocumentNumberingId}`
      )
      expect(response).toEqual(null)
    })
  })

  describe('_updateSupportDocumentNumberingBusiness', () => {
    const mockSupportDocumentNumberingBusinessUpdatePayload = {
      business_trust_id: 10,
      support_document_numbering_resolution_id: 2,
      prefix: null,
      handles_issuer_data: true,
      status_id: 2,
    }
    it('should update a new business trust successfully', async () => {
      // Arrange
      const store = useSupportDocumentNumberingStoreV1()
      const mockPut = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Registro actualizado exitosamente',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._updateSupportDocumentNumberingBusiness(
        mockSupportDocumentNumberingBusinessUpdatePayload
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_BUSINESS_TRUST}`,
        mockSupportDocumentNumberingBusinessUpdatePayload
      )
      expect(mockPut).toHaveBeenCalledTimes(1)
      expect(result).toBe(true)
    })

    it('should handle api response success=false', async () => {
      // Arrange
      const store = useSupportDocumentNumberingStoreV1()

      const mockPut = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'El registro actualizado.',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._updateSupportDocumentNumberingBusiness(
        mockSupportDocumentNumberingBusinessUpdatePayload
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_BUSINESS_TRUST}`,
        mockSupportDocumentNumberingBusinessUpdatePayload
      )
      expect(result).toBe(false)
    })

    it('should handle api peticion fails', async () => {
      // Arrange
      const store = useSupportDocumentNumberingStoreV1()

      const mockPut = jest.fn().mockRejectedValue(new Error('Network error'))
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._updateSupportDocumentNumberingBusiness(
        mockSupportDocumentNumberingBusinessUpdatePayload
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_BUSINESS_TRUST}`,
        mockSupportDocumentNumberingBusinessUpdatePayload
      )
      expect(result).toBe(false)
    })
  })
})
