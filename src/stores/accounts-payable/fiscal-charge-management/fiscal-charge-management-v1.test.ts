// Pinia - Apis
import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import { IFiscalChargeManagementForm } from '@/interfaces/customs/accounts-payable/FiscalChargeManagement'

// Constants
import { URL_PATH_ACCOUNTS_PAYABLE } from '@/constants/apis'

// Store
import { useFiscalChargeManagementStoreV1 } from '@/stores/accounts-payable/fiscal-charge-management/fiscal-charge-management-v1'

const URL_PATH = `${URL_PATH_ACCOUNTS_PAYABLE}/fiscal-charges`

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

const mockFiscalChargeManagementPayload: IFiscalChargeManagementForm = {
  code: '',
  name: 'Ingreso gravado con IVA',
  tax_type_id: 1,
  tax_nature_id: 2,
  revenue_beneficiary_entity_id: 1,
}

const fiscalChargeManagementId = 4

describe('useFiscalChargeManagementStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  describe('_getFiscalChargeManagementList', () => {
    const filters = {
      paginate: 1,
      'filter[id]': 1,
      'filter[tax_type_id]': 1,
      'filter[tax_nature_id]': 4,
      'filter[status_id]': 1,
    }

    const params = {
      ...filters,
    }
    it('should fetch fiscal charge managament list and update state on success', async () => {
      // Arrange
      const store = useFiscalChargeManagementStoreV1()

      const mockResponse = {
        data: {
          data: {
            data: [
              {
                id: 4,
                name: 'Ingreso gravado con IVA',
                code: '01',
                tax_type: {
                  id: 9,
                  abbreviation: 'CNT',
                  description: 'Contribución especial',
                },
                tax_nature: {
                  id: 3,
                  name: 'Municipal',
                },
                revenue_beneficiary_entity: {
                  id: 3,
                  name: 'Tesorería municipal',
                },
                status: {
                  id: 1,
                  name: 'Activo',
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
      await store._getFiscalChargeManagementList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
        params: params,
      })
      expect(store.fiscal_charge_management_list).toEqual(
        mockResponse.data.data.data
      )
    })

    it('should handle error when fetching fiscal charge managament list', async () => {
      // Arrange
      const store = useFiscalChargeManagementStoreV1()
      const mockError = new Error('Network Error')
      const mockGet = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      await store._getFiscalChargeManagementList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
        params: params,
      })
      expect(store.fiscal_charge_management_list).toEqual([])
    })

    it('should handle response.data as undefined when fetching fiscal charge managament list', async () => {
      // Arrange
      const store = useFiscalChargeManagementStoreV1()
      const mockResponse = { data: undefined }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      await store._getFiscalChargeManagementList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
        params: params,
      })
      expect(store.fiscal_charge_management_list).toEqual([])
    })

    it('should handle response.data as null when fetching fiscal charge managament list', async () => {
      // Arrange
      const store = useFiscalChargeManagementStoreV1()
      const mockResponse = { data: null }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      await store._getFiscalChargeManagementList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
        params: filters,
      })
      expect(store.fiscal_charge_management_list).toEqual([])
    })
  })

  describe('_createFiscalChargeManagement', () => {
    it('should create a new fiscal charge management income successfully', async () => {
      // Arrange
      const store = useFiscalChargeManagementStoreV1()
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Created',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      await store._createFiscalChargeManagement(
        mockFiscalChargeManagementPayload
      )

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}`,
        mockFiscalChargeManagementPayload
      )
      expect(mockPost).toHaveBeenCalledTimes(1)
    })

    it('should handle error creating a new fiscal charge management income successfully', async () => {
      // Arrange
      const store = useFiscalChargeManagementStoreV1()

      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'El registro no pudo ser creado.',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createFiscalChargeManagement(
        mockFiscalChargeManagementPayload
      )

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}`,
        mockFiscalChargeManagementPayload
      )
      expect(result).toBe(false)
    })
  })

  describe('_getFiscalChargeManagementById', () => {
    it('should fetch fiscal charge managament by id and update state on success', async () => {
      // Arrange
      const store = useFiscalChargeManagementStoreV1()

      const mockResponse = {
        data: {
          data: {
            id: 4,
            name: 'Ingreso gravado con IVA',
            code: '01',
            tax_type: {
              id: 9,
              abbreviation: 'CNT',
              description: 'Contribución especial',
            },
            tax_nature: {
              id: 3,
              name: 'Municipal',
            },
            revenue_beneficiary_entity: {
              id: 3,
              name: 'Tesorería municipal',
            },
            status: {
              id: 1,
              name: 'Activo',
            },
          },
          message: 'Registro obtenido exitosamente.',
          success: true,
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const result = await store._getFiscalChargeManagementById(
        fiscalChargeManagementId
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/${fiscalChargeManagementId}`
      )
      expect(result).toEqual(mockResponse.data.data)
    })

    it('should handle error when fetching fiscal charge managament by id', async () => {
      // Arrange
      const store = useFiscalChargeManagementStoreV1()

      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'No se encontro el registro.',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      const result = await store._getFiscalChargeManagementById(
        fiscalChargeManagementId
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/${fiscalChargeManagementId}`
      )
      expect(result).toEqual(null)
    })
  })

  describe('_updateFiscalChargeManagement', () => {
    it('should update a new fiscal charge management income successfully', async () => {
      // Arrange
      const store = useFiscalChargeManagementStoreV1()
      const mockPut = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Registro actualizado exitosamente',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      await store._updateFiscalChargeManagement(
        mockFiscalChargeManagementPayload,
        fiscalChargeManagementId
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_PATH}/${fiscalChargeManagementId}`,
        mockFiscalChargeManagementPayload
      )
      expect(mockPut).toHaveBeenCalledTimes(1)
    })

    it('should handle error updating a fiscal charge management successfully', async () => {
      // Arrange
      const store = useFiscalChargeManagementStoreV1()

      const mockPut = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'El registro actualizado.',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._updateFiscalChargeManagement(
        mockFiscalChargeManagementPayload,
        fiscalChargeManagementId
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_PATH}/${fiscalChargeManagementId}`,
        mockFiscalChargeManagementPayload
      )
      expect(result).toBe(false)
    })
  })

  describe('_updateFiscalChargeManagementStatus', () => {
    it('should update a new fiscal charge management status income successfully', async () => {
      // Arrange
      const store = useFiscalChargeManagementStoreV1()
      const mockPatch = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'El registro ha sido actualizado exitosamente',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

      // Act
      const result = await store._updateFiscalChargeManagementStatus(
        fiscalChargeManagementId
      )

      // Assert
      expect(mockPatch).toHaveBeenCalledWith(
        `${URL_PATH}/${fiscalChargeManagementId}/toggle-status`
      )
      expect(mockPatch).toHaveBeenCalledTimes(1)
      expect(result).toBe(true)
    })

    it('should handle error updating a fiscal charge management status successfully', async () => {
      // Arrange
      const store = useFiscalChargeManagementStoreV1()

      const mockPatch = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'El registro actualizado.',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

      // Act
      const result = await store._updateFiscalChargeManagementStatus(
        fiscalChargeManagementId
      )

      // Assert
      expect(mockPatch).toHaveBeenCalledWith(
        `${URL_PATH}/${fiscalChargeManagementId}/toggle-status`
      )
      expect(result).toBe(false)
    })
  })

  describe('_deleteFiscalChargeManagement', () => {
    it('should delete fiscal charge managament', async () => {
      // Arrange
      const store = useFiscalChargeManagementStoreV1()
      const mockDelete = jest.fn().mockResolvedValue({
        success: true,
        data: null,
        message: 'Registro eliminado exitosamente.',
      })
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      await store._deleteFiscalChargeManagement(fiscalChargeManagementId)

      // Assert
      expect(mockDelete).toHaveBeenCalledWith(
        `${URL_PATH}/${fiscalChargeManagementId}`
      )
      expect(mockDelete).toHaveBeenCalledTimes(1)
    })

    it('should handle error deleting fiscal charge management', async () => {
      // Arrange
      const store = useFiscalChargeManagementStoreV1()
      const mockDelete = jest.fn().mockResolvedValue({
        success: true,
        data: null,
        message: 'Error al eliminar el registro.',
      })
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      const result = await store._deleteFiscalChargeManagement(
        fiscalChargeManagementId
      )

      // Assert
      expect(mockDelete).toHaveBeenCalledWith(
        `${URL_PATH}/${fiscalChargeManagementId}`
      )
      expect(result).toBe(false)
    })
  })
})
