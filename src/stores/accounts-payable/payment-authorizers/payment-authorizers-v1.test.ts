// Pinia - Apis
import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces - Constants
import {
  IPaymentAuthorizersCreateBulkPayload,
  IPaymentAuthorizersForm,
} from '@/interfaces/customs/accounts-payable/PaymentAuthorizers'
import { URL_PATH_ACCOUNTS_PAYABLE } from '@/constants/apis'

// Stores
import { usePaymentAuthorizersStoreV1 } from '@/stores/accounts-payable/payment-authorizers/payment-authorizers-v1'

const URL_PATH = `${URL_PATH_ACCOUNTS_PAYABLE}/payment-autorizers`

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

const mockPaymentAuthorizersPayload: IPaymentAuthorizersForm = {
  autorized_user_id: 23,
  amount_from: '0',
  amount_to: '1000000',
}
const paymentAuthorizersId = 4

describe('usePaymentAuthorizersStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  describe('_getPaymentAuthorizersList', () => {
    const filters = {
      paginate: 1,
      'filter[autorized_user_id]': 7,
      'filter[date_from]': null,
      'filter[date_to]': null,
    }

    const params = {
      ...filters,
    }
    it('should fetch payment authorizers list and update state on success', async () => {
      // Arrange
      const store = usePaymentAuthorizersStoreV1()

      const mockResponse = {
        data: {
          data: {
            data: [
              {
                id: 4,
                amount_from: '100.00',
                amount_to: '200.00',
                created_at: '2025-11-24 12:20:50',
                autorized_user: {
                  id: 13736,
                  name: '2020',
                  last_name: 'telefonia',
                  full_name: '2020 telefonia',
                  document: '5144205792',
                  email: 'telefonia2020@fiduprevisora.com.co',
                },
              },
              {
                id: 2,
                amount_from: '100000.00',
                amount_to: '700000.00',
                created_at: '2025-11-21 12:08:50',
                autorized_user: {
                  id: 13978,
                  name: 'ABRAVO',
                  last_name: 'ABRAVO',
                  full_name: 'ABRAVO ABRAVO',
                  document: '5156200412',
                  email:
                    'ABRAVO_bancodeoccidente.com.co#EXT#@fiduprevisora.onmicrosoft.com',
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
      const result = await store._getPaymentAuthorizersList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
        params: params,
      })
      expect(result?.list).toEqual(mockResponse.data.data.data)
    })

    it('should handle error when fetching payment authorizers list', async () => {
      // Arrange
      const store = usePaymentAuthorizersStoreV1()
      const mockError = new Error('Network Error')
      const mockGet = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      const result = await store._getPaymentAuthorizersList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
        params: params,
      })
      expect(result).toEqual(null)
    })

    it('should handle response.data as undefined when fetching payment authorizers list', async () => {
      // Arrange
      const store = usePaymentAuthorizersStoreV1()
      const mockResponse = { data: undefined }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      const result = await store._getPaymentAuthorizersList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
        params: params,
      })
      expect(result).toEqual(null)
    })

    it('should handle response.data as null when fetching payment authorizers list', async () => {
      // Arrange
      const store = usePaymentAuthorizersStoreV1()
      const mockResponse = { data: null }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      const result = await store._getPaymentAuthorizersList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
        params: filters,
      })
      expect(result).toEqual(null)
    })
  })

  describe('_createPaymentAuthorizers', () => {
    it('should create a new payment authorizer income successfully', async () => {
      // Arrange
      const store = usePaymentAuthorizersStoreV1()
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Created',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      await store._createPaymentAuthorizers(mockPaymentAuthorizersPayload)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}`,
        mockPaymentAuthorizersPayload
      )
      expect(mockPost).toHaveBeenCalledTimes(1)
    })

    it('should handle error creating a new payment authorizer income successfully', async () => {
      // Arrange
      const store = usePaymentAuthorizersStoreV1()

      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'El registro no pudo ser creado.',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createPaymentAuthorizers(
        mockPaymentAuthorizersPayload
      )

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}`,
        mockPaymentAuthorizersPayload
      )
      expect(result).toBe(false)
    })
  })

  describe('_getPaymentAuthorizersById', () => {
    it('should fetch payment authorizers by id and update state on success', async () => {
      // Arrange
      const store = usePaymentAuthorizersStoreV1()

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
      const response = await store._getPaymentAuthorizersById(
        paymentAuthorizersId
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/${paymentAuthorizersId}`
      )
      expect(response).toEqual(mockResponse.data.data)
    })

    it('should handle error when fetching payment authorizers by id', async () => {
      // Arrange
      const store = usePaymentAuthorizersStoreV1()

      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'No se encontro el registro.',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      const response = await store._getPaymentAuthorizersById(
        paymentAuthorizersId
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/${paymentAuthorizersId}`
      )
      expect(response).toEqual(null)
    })
  })

  describe('_updatePaymentAuthorizers', () => {
    it('should update a new payment authorizer income successfully', async () => {
      // Arrange
      const store = usePaymentAuthorizersStoreV1()
      const mockPut = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Registro actualizado exitosamente',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._updatePaymentAuthorizers(
        mockPaymentAuthorizersPayload,
        paymentAuthorizersId
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_PATH}/${paymentAuthorizersId}`,
        mockPaymentAuthorizersPayload
      )
      expect(mockPut).toHaveBeenCalledTimes(1)
      expect(result).toBe(true)
    })

    it('should handle error updating a payment authorizer successfully', async () => {
      // Arrange
      const store = usePaymentAuthorizersStoreV1()

      const mockPut = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'El registro actualizado.',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._updatePaymentAuthorizers(
        mockPaymentAuthorizersPayload,
        paymentAuthorizersId
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_PATH}/${paymentAuthorizersId}`,
        mockPaymentAuthorizersPayload
      )
      expect(result).toBe(false)
    })
  })

  describe('_deletePaymentAuthorizers', () => {
    it('should delete payment authorizers', async () => {
      // Arrange
      const store = usePaymentAuthorizersStoreV1()
      const mockDelete = jest.fn().mockResolvedValue({
        success: true,
        data: null,
        message: 'Registro eliminado exitosamente.',
      })
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      await store._deletePaymentAuthorizers(paymentAuthorizersId)

      // Assert
      expect(mockDelete).toHaveBeenCalledWith(
        `${URL_PATH}/${paymentAuthorizersId}`
      )
      expect(mockDelete).toHaveBeenCalledTimes(1)
    })

    it('should handle error deleting payment authorizer', async () => {
      // Arrange
      const store = usePaymentAuthorizersStoreV1()
      const mockDelete = jest.fn().mockResolvedValue({
        success: true,
        data: null,
        message: 'Error al eliminar el registro.',
      })
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      const result = await store._deletePaymentAuthorizers(paymentAuthorizersId)

      // Assert
      expect(mockDelete).toHaveBeenCalledWith(
        `${URL_PATH}/${paymentAuthorizersId}`
      )
      expect(result).toBe(false)
    })
  })

  describe('_downloadExcelPaymentAuthorizersTemplate', () => {
    it('fetches Excel data and triggers download', async () => {
      // Arrange
      const store = usePaymentAuthorizersStoreV1()

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
      await store._downloadExcelPaymentAuthorizersTemplate()

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/import/template`, {
        responseType: 'blob',
      })
    })

    it('handles error when fetching Excel data fails', async () => {
      // Arrange
      const store = usePaymentAuthorizersStoreV1()

      const mockGet = jest.fn().mockRejectedValue(new Error('Network error'))

      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._downloadExcelPaymentAuthorizersTemplate()

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/import/template`, {
        responseType: 'blob',
      })
    })
  })

  describe('_validatePaymentAuthorizersFile', () => {
    it('should validate payment authorizers file successfully', async () => {
      // Arrange
      const store = usePaymentAuthorizersStoreV1()
      const payload = new File(['dummy content'], 'test.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })

      const mockResponse = {
        data: {
          data: {
            has_errors: true,
            valid_rows: [
              {
                row_id: 1,
                authorized_user_id: 48,
                authorized_user_email: 'user@example.com',
                amount_from: '0.00',
                amount_to: '10000.00',
              },
            ],
            errors_file_id: '550e8400-e29b-41d4-a716-446655440000',
          },
        },
      }
      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._validatePaymentAuthorizersFile(payload)

      // Assert
      expect(mockPost).toHaveBeenCalledTimes(1)
      const callArgs = mockPost.mock.calls[0]
      expect(callArgs[0]).toBe(`${URL_PATH}/import/analyze`)

      const sentFormData = callArgs[1]
      expect(sentFormData instanceof FormData).toBe(true)
      expect(result).toEqual(mockResponse.data.data)
    })

    it('should handle error when validating payment authorizers file', async () => {
      // Arrange
      const store = usePaymentAuthorizersStoreV1()
      const payload = new File(['dummy content'], 'test.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const mockError = new Error('Network Error')
      const mockPost = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._validatePaymentAuthorizersFile(payload)

      // Assert
      expect(mockPost).toHaveBeenCalledTimes(1)
      expect(result).toBeNull()
    })
  })

  describe('_downloadExcelFileValidationErrors', () => {
    const batch_id = '550e8400-e29b-41d4-a716-446655440000'
    it('fetches errors excel data and triggers download', async () => {
      // Arrange
      const store = usePaymentAuthorizersStoreV1()

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
      await store._downloadExcelFileValidationErrors(batch_id)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/import/errors/${batch_id}`,
        {
          responseType: 'blob',
        }
      )
    })

    it('handles error when fetching errors excel data fails', async () => {
      // Arrange
      const store = usePaymentAuthorizersStoreV1()
      const mockGet = jest.fn().mockRejectedValue(new Error('Network error'))

      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._downloadExcelFileValidationErrors(batch_id)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/import/errors/${batch_id}`,
        { responseType: 'blob' }
      )
    })
  })

  describe('_createPaymentAuthorizersBulk', () => {
    const payload: IPaymentAuthorizersCreateBulkPayload = {
      valid_rows: [
        {
          row_id: 1,
          authorized_user_id: 48,
          amount_from: '0.00',
          amount_to: '10000.00',
        },
        {
          row_id: 2,
          authorized_user_id: 48,
          amount_from: '10000.00',
          amount_to: '20000.00',
        },
      ],
    }

    it('should create a new payment authorizer bulk income successfully', async () => {
      // Arrange
      const store = usePaymentAuthorizersStoreV1()

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
      const result = await store._createPaymentAuthorizersBulk(payload)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}/import`, payload)
      expect(mockPost).toHaveBeenCalledTimes(1)
      expect(result).toBe(mockResponse.data.data)
    })

    it('should handle error creating a new payment authorizer bulk income successfully', async () => {
      // Arrange
      const store = usePaymentAuthorizersStoreV1()

      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'Error al crear registros',
          data: null,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createPaymentAuthorizersBulk(payload)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}/import`, payload)
      expect(result).toBeNull
    })
  })
})
