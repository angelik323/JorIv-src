// Pinia
import { setActivePinia, createPinia } from 'pinia'

//Api
import { executeApi } from '@/apis'
import { URL_PATH_ACCOUNTS_PAYABLE } from '@/constants/apis'

//Interfaces
import {
  ISettlementFormulasCreatePayload,
  ISettlementFormulasUpdatePayload,
} from '@/interfaces/customs/accounts-payable/SettlementFormulas'

// Store
import { useSettlementFormulasStoreV1 } from '@/stores/accounts-payable/settlement-formulas/settlement-formulas-v1'

const URL_PATH = `${URL_PATH_ACCOUNTS_PAYABLE}/settlement-formulas`

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
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

const mockSettlementFormulasPayload: ISettlementFormulasCreatePayload = {
  person_type: 'NATURAL',
  fiscal_responsibility: 'RESPONSABLE',
  name: 'FORMULA NATURAL RESPONSABLE',
  taxes: [
    {
      tax_type: 'RFT',
      is_applicable: '1',
      settlement_concept_id: 1,
    },
  ],
}

const mockSettlementFormulasUpdatePayload: ISettlementFormulasUpdatePayload = {
  name: 'FORMULA NATURAL RESPONSABLE',
  taxes: [
    {
      tax_type: 'RFT',
      is_applicable: '1',
      settlement_concept_id: 8,
    },
  ],
}

const SettlementFormulasId = 4

describe('useSettlementFormulasStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  describe('_getSettlementFormulasList', () => {
    const filters = {
      paginate: 1,
      order_by: 'id,desc',
      'filter[fiscal_responsibility]': 'responsable',
      'filter[person_type]': 'natural',
    }

    const params = {
      ...filters,
    }
    it('should fetch settlement formulas list and update state on success', async () => {
      // Arrange
      const store = useSettlementFormulasStoreV1()

      const mockResponse = {
        data: {
          data: {
            data: [
              {
                id: 3,
                code: 1,
                person_type: 'NATURAL',
                person_type_label: 'Persona Natural',
                fiscal_responsibility: 'RESPONSABLE',
                fiscal_responsibility_label: 'Responsable',
                name: 'TESTTING EL NO',
                status_id: 1,
                status: {
                  id: 1,
                  name: 'Activo',
                  description: null,
                },
                created_by_id: 14434,
                updated_by_id: null,
                created_at: '2025-10-17T20:06:01.000000Z',
                updated_at: '2025-10-17T20:06:01.000000Z',
                taxes: [],
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
      await store._getSettlementFormulasList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
        params: params,
      })
      expect(store.settlement_formulas_list).toEqual(
        mockResponse.data.data.data
      )
    })

    it('should handle error when fetching settlement formulas list', async () => {
      // Arrange
      const store = useSettlementFormulasStoreV1()
      const mockError = new Error('Network Error')
      const mockGet = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      await store._getSettlementFormulasList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
        params: params,
      })
      expect(store.settlement_formulas_list).toEqual([])
    })

    it('should handle response.data as undefined when fetching settlement formulas list', async () => {
      // Arrange
      const store = useSettlementFormulasStoreV1()
      const mockResponse = { data: undefined }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      await store._getSettlementFormulasList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
        params: params,
      })
      expect(store.settlement_formulas_list).toEqual([])
    })

    it('should handle response.data as null when fetching settlement formulas list', async () => {
      // Arrange
      const store = useSettlementFormulasStoreV1()
      const mockResponse = { data: null }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      await store._getSettlementFormulasList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
        params: filters,
      })
      expect(store.settlement_formulas_list).toEqual([])
    })
  })

  describe('_createSettlementFormulas', () => {
    it('should create a new settlement formulas successfully', async () => {
      // Arrange
      const store = useSettlementFormulasStoreV1()
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Created',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createSettlementFormulas(
        mockSettlementFormulasPayload
      )

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}`,
        mockSettlementFormulasPayload
      )
      expect(mockPost).toHaveBeenCalledTimes(1)
      expect(result).toBe(true)
    })

    it('should handle api response success=false', async () => {
      // Arrange
      const store = useSettlementFormulasStoreV1()

      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'El registro no pudo ser creado.',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createSettlementFormulas(
        mockSettlementFormulasPayload
      )

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}`,
        mockSettlementFormulasPayload
      )
      expect(result).toBe(false)
    })

    it('should handle error when creating petition fails', async () => {
      // Arrange
      const store = useSettlementFormulasStoreV1()

      const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createSettlementFormulas(
        mockSettlementFormulasPayload
      )

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}`,
        mockSettlementFormulasPayload
      )
      expect(result).toBe(false)
    })
  })

  describe('_getSettlementFormulasById', () => {
    it('should fetch settlement formulas by id and return the data', async () => {
      // Arrange
      const store = useSettlementFormulasStoreV1()

      const mockResponse = {
        data: {
          data: {
            id: 3,
            code: 1,
            person_type: 'NATURAL',
            person_type_label: 'Persona Natural',
            fiscal_responsibility: 'RESPONSABLE',
            fiscal_responsibility_label: 'Responsable',
            name: 'TESTTING EL NO',
            status_id: 1,
            status: {
              id: 1,
              name: 'Activo',
              description: null,
            },
            created_by_id: 14434,
            updated_by_id: null,
            created_at: '2025-10-17T20:06:01.000000Z',
            updated_at: '2025-10-17T20:06:01.000000Z',
            taxes: [],
          },
          message: 'Registro obtenido exitosamente.',
          success: true,
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const response = await store._getSettlementFormulasById(
        SettlementFormulasId
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/${SettlementFormulasId}`
      )
      expect(response).toEqual(mockResponse.data.data)
    })

    it('should handle error when api response success=false', async () => {
      // Arrange
      const store = useSettlementFormulasStoreV1()

      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'No se encontro el registro.',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      const response = await store._getSettlementFormulasById(
        SettlementFormulasId
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/${SettlementFormulasId}`
      )
      expect(response).toEqual(null)
    })

    it('should handle error when api petition fails', async () => {
      // Arrange
      const store = useSettlementFormulasStoreV1()

      const mockGet = jest.fn().mockRejectedValue(new Error('Network error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      const response = await store._getSettlementFormulasById(
        SettlementFormulasId
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/${SettlementFormulasId}`
      )
      expect(response).toEqual(null)
    })
  })

  describe('_updateSettlementFormulas', () => {
    it('should update a new settlement formulas successfully', async () => {
      // Arrange
      const store = useSettlementFormulasStoreV1()
      const mockPut = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Registro actualizado exitosamente',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._updateSettlementFormulas(
        mockSettlementFormulasUpdatePayload,
        SettlementFormulasId
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_PATH}/${SettlementFormulasId}`,
        mockSettlementFormulasUpdatePayload
      )
      expect(mockPut).toHaveBeenCalledTimes(1)
      expect(result).toBe(true)
    })

    it('should handle api response success=false', async () => {
      // Arrange
      const store = useSettlementFormulasStoreV1()

      const mockPut = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'El registro actualizado.',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._updateSettlementFormulas(
        mockSettlementFormulasUpdatePayload,
        SettlementFormulasId
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_PATH}/${SettlementFormulasId}`,
        mockSettlementFormulasUpdatePayload
      )
      expect(result).toBe(false)
    })

    it('should handle api peticion fails', async () => {
      // Arrange
      const store = useSettlementFormulasStoreV1()

      const mockPut = jest.fn().mockRejectedValue(new Error('Network error'))
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._updateSettlementFormulas(
        mockSettlementFormulasUpdatePayload,
        SettlementFormulasId
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_PATH}/${SettlementFormulasId}`,
        mockSettlementFormulasUpdatePayload
      )
      expect(result).toBe(false)
    })
  })

  describe('_deleteSettlementFormulas', () => {
    it('should delete settlement formulas', async () => {
      // Arrange
      const store = useSettlementFormulasStoreV1()
      const mockDelete = jest.fn().mockResolvedValue({
        data: {
          success: true,
          data: null,
          message: 'Registro eliminado exitosamente.',
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      const result = await store._deleteSettlementFormulas(SettlementFormulasId)

      // Assert
      expect(mockDelete).toHaveBeenCalledWith(
        `${URL_PATH}/${SettlementFormulasId}`
      )
      expect(mockDelete).toHaveBeenCalledTimes(1)
      expect(result).toBe(true)
    })

    it('should handle error deleting settlement formula', async () => {
      // Arrange
      const store = useSettlementFormulasStoreV1()
      const mockDelete = jest.fn().mockResolvedValue({
        data: {
          success: false,
          data: null,
          message: 'Error al eliminar el registro.',
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      const result = await store._deleteSettlementFormulas(SettlementFormulasId)

      // Assert
      expect(mockDelete).toHaveBeenCalledWith(
        `${URL_PATH}/${SettlementFormulasId}`
      )
      expect(result).toBe(false)
    })
  })
})
