// Pinia - Apis
import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  IPaymentConceptsCreateBulkPayload,
  IPaymentConceptsErrorsFileValidationPayload,
  IPaymentConceptsForm,
} from '@/interfaces/customs/accounts-payable/PaymentConcepts'

// Constants
import { URL_PATH_ACCOUNTS_PAYABLE } from '@/constants/apis'

// Stores
import { usePaymentConceptsStoreV1 } from '@/stores/accounts-payable/payment-concepts/payment-concepts-v1'

const URL_PATH = `${URL_PATH_ACCOUNTS_PAYABLE}/payment-concepts`

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

const mockPaymentConceptsPayload: IPaymentConceptsForm = {
  structure_id: 1,
  concept_code: '1',
  concept_name: 'Honorarios profesionales',
  concept_type: 'totalizador',
  nature_type: 'egreso',
  activity_type: 'servicios',
  obligation_type: 'no_aplica',
  pension_type: null,
  liquidates_taxes: true,
  is_advance: true,
}
const PaymentConceptsId = 4

describe('usePaymentConceptsStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  describe('_getPaymentConceptsList', () => {
    const filters = {
      paginate: 1,
      order_by: 'concept_code,asc',
      'filter[structure_id]': 7,
      'filter[concept_code]': null,
      'filter[concept_type]': null,
    }

    const params = {
      ...filters,
    }
    it('should fetch payment concepts list and update state on success', async () => {
      // Arrange
      const store = usePaymentConceptsStoreV1()

      const mockResponse = {
        data: {
          data: {
            data: [
              {
                id: 3,
                structure_id: 7,
                structure_code: '007',
                concept_code: '1',
                concept_name: 'test',
                concept_type: {
                  value: 'totalizador',
                  label: 'Totalizador',
                },
                nature_type: {
                  value: 'egreso',
                  label: 'Egreso',
                },
                activity_type: {
                  value: 'industrial',
                  label: 'Industrial',
                },
                obligation_type: {
                  value: 'pensional',
                  label: 'Pensional',
                },
                pension_type: {
                  value: 'bono',
                  label: 'Bono',
                },
                liquidates_taxes: false,
                is_advance: true,
                created_at: '2025-10-10T15:06:08.000000Z',
                updated_at: '2025-10-10T17:50:50.000000Z',
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
      await store._getPaymentConceptsList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
        params: params,
      })
      expect(store.payment_concepts_list).toEqual(mockResponse.data.data.data)
    })

    it('should handle error when fetching payment concepts list', async () => {
      // Arrange
      const store = usePaymentConceptsStoreV1()
      const mockError = new Error('Network Error')
      const mockGet = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      await store._getPaymentConceptsList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
        params: params,
      })
      expect(store.payment_concepts_list).toEqual([])
    })

    it('should handle response.data as undefined when fetching payment concepts list', async () => {
      // Arrange
      const store = usePaymentConceptsStoreV1()
      const mockResponse = { data: undefined }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      await store._getPaymentConceptsList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
        params: params,
      })
      expect(store.payment_concepts_list).toEqual([])
    })

    it('should handle response.data as null when fetching payment concepts list', async () => {
      // Arrange
      const store = usePaymentConceptsStoreV1()
      const mockResponse = { data: null }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      await store._getPaymentConceptsList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
        params: filters,
      })
      expect(store.payment_concepts_list).toEqual([])
    })
  })

  describe('_createPaymentConcepts', () => {
    it('should create a new payment concept income successfully', async () => {
      // Arrange
      const store = usePaymentConceptsStoreV1()
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Created',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      await store._createPaymentConcepts(mockPaymentConceptsPayload)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}`,
        mockPaymentConceptsPayload
      )
      expect(mockPost).toHaveBeenCalledTimes(1)
    })

    it('should handle error creating a new payment concept income successfully', async () => {
      // Arrange
      const store = usePaymentConceptsStoreV1()

      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'El registro no pudo ser creado.',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createPaymentConcepts(
        mockPaymentConceptsPayload
      )

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}`,
        mockPaymentConceptsPayload
      )
      expect(result).toBe(false)
    })
  })

  describe('_getPaymentConceptsById', () => {
    it('should fetch payment concepts by id and update state on success', async () => {
      // Arrange
      const store = usePaymentConceptsStoreV1()

      const mockResponse = {
        data: {
          data: {
            id: 1,
            structure_id: 1,
            structure_code: '01',
            concept_code: '1',
            concept_name: 'Honorarios profesionales',
            concept_type: {
              value: 'totalizador',
              label: 'Totalizador',
            },
            nature_type: {
              value: 'egreso',
              label: 'Egreso',
            },
            activity_type: {
              value: 'servicios',
              label: 'Servicios',
            },
            obligation_type: {
              value: 'no_aplica',
              label: 'No aplica',
            },
            pension_type: null,
            liquidates_taxes: true,
            is_advance: true,
            created_at: '2025-10-02T16:13:30.000000Z',
            updated_at: '2025-10-02T16:13:30.000000Z',
          },
          message: 'Registro obtenido exitosamente.',
          success: true,
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const response = await store._getPaymentConceptsById(PaymentConceptsId)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/${PaymentConceptsId}`)
      expect(response).toEqual(mockResponse.data.data)
    })

    it('should handle error when fetching payment concepts by id', async () => {
      // Arrange
      const store = usePaymentConceptsStoreV1()

      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'No se encontro el registro.',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      const response = await store._getPaymentConceptsById(PaymentConceptsId)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/${PaymentConceptsId}`)
      expect(response).toEqual(null)
    })
  })

  describe('_updatePaymentConcepts', () => {
    it('should update a new payment concept income successfully', async () => {
      // Arrange
      const store = usePaymentConceptsStoreV1()
      const mockPut = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Registro actualizado exitosamente',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._updatePaymentConcepts(
        mockPaymentConceptsPayload,
        PaymentConceptsId
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_PATH}/${PaymentConceptsId}`,
        mockPaymentConceptsPayload
      )
      expect(mockPut).toHaveBeenCalledTimes(1)
      expect(result).toBe(true)
    })

    it('should handle error updating a payment concept successfully', async () => {
      // Arrange
      const store = usePaymentConceptsStoreV1()

      const mockPut = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'El registro actualizado.',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._updatePaymentConcepts(
        mockPaymentConceptsPayload,
        PaymentConceptsId
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_PATH}/${PaymentConceptsId}`,
        mockPaymentConceptsPayload
      )
      expect(result).toBe(false)
    })
  })

  describe('_deletePaymentConcepts', () => {
    it('should delete payment concepts', async () => {
      // Arrange
      const store = usePaymentConceptsStoreV1()
      const mockDelete = jest.fn().mockResolvedValue({
        success: true,
        data: null,
        message: 'Registro eliminado exitosamente.',
      })
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      await store._deletePaymentConcepts(PaymentConceptsId)

      // Assert
      expect(mockDelete).toHaveBeenCalledWith(
        `${URL_PATH}/${PaymentConceptsId}`
      )
      expect(mockDelete).toHaveBeenCalledTimes(1)
    })

    it('should handle error deleting payment concept', async () => {
      // Arrange
      const store = usePaymentConceptsStoreV1()
      const mockDelete = jest.fn().mockResolvedValue({
        success: true,
        data: null,
        message: 'Error al eliminar el registro.',
      })
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      const result = await store._deletePaymentConcepts(PaymentConceptsId)

      // Assert
      expect(mockDelete).toHaveBeenCalledWith(
        `${URL_PATH}/${PaymentConceptsId}`
      )
      expect(result).toBe(false)
    })
  })

  describe('_downloadExcelPaymentConceptsTemplate', () => {
    it('fetches Excel data and triggers download', async () => {
      // Arrange
      const store = usePaymentConceptsStoreV1()

      const mockData = new ArrayBuffer(8)
      const mockGet = jest.fn().mockResolvedValue({
        data: mockData,
        headers: {
          'content-type':
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'content-disposition': 'attachment; filename="export_data.xlsx"',
        },
      })

      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._downloadExcelPaymentConceptsTemplate()

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/import/template`, {
        responseType: 'blob',
      })
    })

    it('handles error when fetching Excel data fails', async () => {
      // Arrange
      const store = usePaymentConceptsStoreV1()

      const mockGet = jest.fn().mockRejectedValue(new Error('Network error'))

      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._downloadExcelPaymentConceptsTemplate()

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/import/template`, {
        responseType: 'blob',
      })
    })
  })

  describe('_validatePaymentConceptsFile', () => {
    it('should validate payment concepts file successfully', async () => {
      // Arrange
      const store = usePaymentConceptsStoreV1()
      const payload = new File(['dummy content'], 'test.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })

      const mockResponse = {
        data: {
          data: {
            error_rows: [],
            summary: {
              errors: 0,
              has_errors: false,
              success: true,
              total: 1,
            },
            validated_rows: [
              {
                id: 3,
                structure_id: 7,
                structure_code: '007',
                concept_code: '1',
                concept_name: 'test',
                concept_type: {
                  value: 'totalizador',
                  label: 'Totalizador',
                },
                nature_type: {
                  value: 'egreso',
                  label: 'Egreso',
                },
                activity_type: {
                  value: 'industrial',
                  label: 'Industrial',
                },
                obligation_type: {
                  value: 'pensional',
                  label: 'Pensional',
                },
                pension_type: {
                  value: 'bono',
                  label: 'Bono',
                },
                liquidates_taxes: false,
                is_advance: true,
                has_error: false,
                error_message: null,
              },
            ],
          },
        },
      }
      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._validatePaymentConceptsFile(payload)

      // Assert
      expect(mockPost).toHaveBeenCalledTimes(1)
      const callArgs = mockPost.mock.calls[0]
      expect(callArgs[0]).toBe(`${URL_PATH}/import/validate`)

      const sentFormData = callArgs[1]
      expect(sentFormData instanceof FormData).toBe(true)
      expect(result).toEqual(mockResponse.data.data)
    })

    it('should handle error when validating payment concepts file', async () => {
      // Arrange
      const store = usePaymentConceptsStoreV1()
      const payload = new File(['dummy content'], 'test.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const mockError = new Error('Network Error')
      const mockPost = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._validatePaymentConceptsFile(payload)

      // Assert
      expect(mockPost).toHaveBeenCalledTimes(1)
      expect(result).toBeNull()
    })
  })

  describe('_downloadExcelFileValidationErrors', () => {
    const payload: IPaymentConceptsErrorsFileValidationPayload = {
      errors: [
        {
          id: 3,
          structure_id: 7,
          structure_code: '007',
          concept_code: '1',
          concept_name: 'test',
          concept_type: {
            value: 'totalizador',
            label: 'Totalizador',
          },
          nature_type: {
            value: 'egreso',
            label: 'Egreso',
          },
          activity_type: {
            value: 'industrial',
            label: 'Industrial',
          },
          obligation_type: {
            value: 'pensional',
            label: 'Pensional',
          },
          pension_type: {
            value: 'bono',
            label: 'Bono',
          },
          liquidates_taxes: false,
          is_advance: true,
          has_error: true,
          error_message: 'El codigo de concepto ya esta registrado',
          row_number: 1,
          created_at: '',
          updated_at: '',
        },
      ],
    }
    it('fetches errors excel data and triggers download', async () => {
      // Arrange
      const store = usePaymentConceptsStoreV1()

      const mockData = new ArrayBuffer(8)
      const mockPost = jest.fn().mockResolvedValue({
        data: mockData,
        headers: {
          'content-type':
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'content-disposition': 'attachment; filename="export_data.xlsx"',
        },
      })

      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      await store._downloadExcelFileValidationErrors(payload)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}/import/errors`,
        payload,
        {
          responseType: 'blob',
        }
      )
    })

    it('handles error when fetching errors excel data fails', async () => {
      // Arrange
      const store = usePaymentConceptsStoreV1()
      const mockPost = jest.fn().mockRejectedValue(new Error('Network error'))

      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      await store._downloadExcelFileValidationErrors(payload)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}/import/errors`,
        payload,
        { responseType: 'blob' }
      )
    })
  })

  describe('_createPaymentConceptsBulk', () => {
    const payload: IPaymentConceptsCreateBulkPayload = {
      concepts: [
        {
          structure_id: 7,
          structure_code: '007',
          concept_code: '1',
          concept_name: 'test',
          concept_type: 'totalizador',
          nature_type: 'egreso',
          activity_type: 'industrial',
          obligation_type: 'pensional',
          pension_type: 'bono',
          liquidates_taxes: false,
          is_advance: true,
          has_error: false,
          error_message: null,
          row_number: 1,
          concept_code_length: 1,
          disabled_is_advance: false,
          disabled_liquidates_taxes: false,
          disabled_pension_type: false,
          structure_purpose: '',
          structure_structure: '',
        },
      ],
    }

    it('should create a new payment concept bulk income successfully', async () => {
      // Arrange
      const store = usePaymentConceptsStoreV1()

      const mockResponse = {
        data: {
          success: true,
          message: {
            error_count: 0,
            success_count: 1,
          },
          data: [],
        },
      }
      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createPaymentConceptsBulk(payload)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}/import/bulk`, payload)
      expect(mockPost).toHaveBeenCalledTimes(1)
      expect(result).toBe(mockResponse.data.data)
    })

    it('should handle error creating a new payment concept bulk income successfully', async () => {
      // Arrange
      const store = usePaymentConceptsStoreV1()

      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'Error al crear registros',
          data: null,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createPaymentConceptsBulk(payload)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}/import/bulk`, payload)
      expect(result).toBeNull
    })
  })
})
