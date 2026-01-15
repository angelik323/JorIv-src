// Pinia - Apis
import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces - Constants
import { ISecondAuthorizationActionsPayload } from '@/interfaces/customs/accounts-payable/SecondAuthorization'
import { URL_PATH_ACCOUNTS_PAYABLE } from '@/constants/apis'

// Stores
import { useSecondAuthorizationStoreV1 } from '@/stores/accounts-payable/second-authorization/second-authorization-v1'

const URL_PATH = `${URL_PATH_ACCOUNTS_PAYABLE}/orpa-authorization`

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
  const getNameBlobMock = jest.fn().mockReturnValue('file.pdf')
  const downloadBlobXlxxMock = jest.fn()

  const useAlert = jest.fn(() => ({ showAlert: showAlertMock }))
  const useShowError = jest.fn(() => ({ showCatchError: showCatchErrorMock }))
  const useUtils = jest.fn(() => ({
    getNameBlob: getNameBlobMock,
    downloadBlobXlxx: downloadBlobXlxxMock,
  }))

  return {
    useAlert,
    useShowError,
    useUtils,
    showAlertMock,
    showCatchErrorMock,
    getNameBlobMock,
    downloadBlobXlxxMock,
  }
})

const mockSecondAuthorizationActionsPayload: ISecondAuthorizationActionsPayload =
  {
    payment_request_ids: [1, 5, 3],
  }
const secondAuthorizationId = 1
const instructionId = 1

describe('useSecondAuthorizationStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  describe('_getSecondAuthorizationList', () => {
    const filters = {
      paginate: 1,
      'filter[status]': 'pending',
      'filter[date_from]': null,
      'filter[date_to]': null,
    }

    const params = {
      ...filters,
      order_by: 'id,desc',
    }

    it('should fetch second authorization list and update state on success', async () => {
      // Arrange
      const store = useSecondAuthorizationStoreV1()

      const mockResponse = {
        data: {
          data: {
            data: [
              {
                id: 1,
                office: {
                  id: 1,
                  office_code: 'OF-001',
                  office_description: 'Oficina Principal',
                },
                business_trust: {
                  id: 1,
                  name: 'Trust Business One',
                  code: 'TB001',
                },
                from_payment_request_id: 100,
                to_payment_request_id: 105,
                orpa_number: 2025001,
                has_instructions: 'yes',
                request_number: 'REQ-2025-001',
                status: {
                  id: 1,
                  name: 'Pending',
                  description: 'Awaiting authorization',
                },
                first_authorization_tax_settlement_generation_status: {
                  id: 1,
                  name: 'Pending',
                  description: 'Tax settlement pending',
                },
                orpa_status: {
                  id: 1,
                  name: 'Active',
                  description: 'ORPA is active',
                },
                cancellation_rejection_reason: null,
                value: '50.000',
                milestone_id: 1,
              },
              {
                id: 2,
                office: {
                  id: 2,
                  office_code: 'OF-002',
                  office_description: 'Oficina Secundaria',
                },
                business_trust: {
                  id: 2,
                  name: 'Trust Business Two',
                  code: 'TB002',
                },
                from_payment_request_id: 200,
                to_payment_request_id: 210,
                orpa_number: 2025002,
                has_instructions: 'yes',
                request_number: 'REQ-2025-002',
                status: {
                  id: 2,
                  name: 'Authorized',
                  description: 'Successfully authorized',
                },
                first_authorization_tax_settlement_generation_status: {
                  id: 2,
                  name: 'Completed',
                  description: 'Tax settlement completed',
                },
                orpa_status: {
                  id: 2,
                  name: 'Active',
                  description: 'ORPA is active',
                },
                cancellation_rejection_reason: null,
                value: '10.000',
                milestone_id: 2,
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
      const result = await store._getSecondAuthorizationList(filters, true)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
        params: params,
      })

      expect(result?.list).toEqual(mockResponse.data.data.data)
    })

    it('should handle error when fetching second authorization list', async () => {
      // Arrange
      const store = useSecondAuthorizationStoreV1()
      const mockError = new Error('Network Error')
      const mockGet = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const result = await store._getSecondAuthorizationList(filters, false)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
        params: params,
      })
      expect(result).toEqual(null)
    })

    it('should handle response.data as undefined when fetching second authorization list', async () => {
      // Arrange
      const store = useSecondAuthorizationStoreV1()
      const mockResponse = { data: undefined }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const result = await store._getSecondAuthorizationList(filters, false)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
        params: params,
      })
      expect(result).toEqual(null)
    })

    it('should handle response.data as null when fetching second authorization list', async () => {
      // Arrange
      const store = useSecondAuthorizationStoreV1()
      const mockResponse = { data: null }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const result = await store._getSecondAuthorizationList(filters, false)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
        params: params,
      })
      expect(result).toEqual(null)
    })
  })

  describe('_getSecondAuthorizationById', () => {
    it('should fetch second authorization by id on success', async () => {
      // Arrange
      const store = useSecondAuthorizationStoreV1()

      const mockResponse = {
        data: {
          data: {
            id: 1,
            office: {
              id: 1,
              office_code: 'OF-001',
              office_description: 'Oficina Principal',
            },
            business_trust: {
              id: 1,
              name: 'Trust Business One',
              code: 'TB001',
            },
            from_payment_request_id: 100,
            to_payment_request_id: 105,
            orpa_number: 2025001,
            has_instructions: 'yes',
            request_number: 'REQ-2025-001',
            status: {
              id: 1,
              name: 'Pending',
              description: 'Awaiting authorization',
            },
            first_authorization_tax_settlement_generation_status: {
              id: 1,
              name: 'Pending',
              description: 'Tax settlement pending',
            },
            orpa_status: {
              id: 1,
              name: 'Active',
              description: 'ORPA is active',
            },
            cancellation_rejection_reason: null,
            value: '50.000',
            milestone_id: 1,
          },
          message: 'Registro obtenido exitosamente.',
          success: true,
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const response = await store._getSecondAuthorizationById(
        secondAuthorizationId
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/${secondAuthorizationId}`
      )
      expect(response).toEqual(mockResponse.data.data)
    })

    it('should handle error when fetching second authorization by id', async () => {
      // Arrange
      const store = useSecondAuthorizationStoreV1()

      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'No se encontro el registro.',
          data: null,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const response = await store._getSecondAuthorizationById(
        secondAuthorizationId
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/${secondAuthorizationId}`
      )
      expect(response).toEqual(null)
    })

    it('should handle network error when fetching second authorization by id', async () => {
      // Arrange
      const store = useSecondAuthorizationStoreV1()
      const mockError = new Error('Network Error')
      const mockGet = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const response = await store._getSecondAuthorizationById(
        secondAuthorizationId
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/${secondAuthorizationId}`
      )
      expect(response).toEqual(null)
    })
  })

  describe('_downloadPdfPaymentRequest', () => {
    it('should download pdf payment request successfully', async () => {
      // Arrange
      const store = useSecondAuthorizationStoreV1()

      const mockData = new ArrayBuffer(8)
      const mockGet = jest.fn().mockResolvedValue({
        data: mockData,
        headers: {
          'content-type': 'application/pdf',
          'content-disposition': 'attachment; filename="payment_request.pdf"',
        },
      })

      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._downloadPdfPaymentRequest(secondAuthorizationId)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/${secondAuthorizationId}/download-pdf`,
        {
          responseType: 'blob',
        }
      )
    })

    it('should handle error when downloading pdf payment request', async () => {
      // Arrange
      const store = useSecondAuthorizationStoreV1()

      const mockGet = jest.fn().mockRejectedValue(new Error('Network error'))

      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._downloadPdfPaymentRequest(secondAuthorizationId)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/${secondAuthorizationId}/download-pdf`,
        {
          responseType: 'blob',
        }
      )
    })
  })

  describe('_executeAuthorizationAction', () => {
    it('should execute authorize action successfully', async () => {
      // Arrange
      const store = useSecondAuthorizationStoreV1()

      const mockResponse = {
        data: {
          data: {
            id: 1,
            status: 'authorized',
          },
          message: 'Autorizado exitosamente.',
          success: true,
        },
      }

      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._executeAuthorizationAction(
        mockSecondAuthorizationActionsPayload,
        'authorize'
      )

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}/actions/authorize`,
        mockSecondAuthorizationActionsPayload
      )
      expect(result).toEqual(mockResponse.data.data)
    })

    it('should execute reject action successfully', async () => {
      // Arrange
      const store = useSecondAuthorizationStoreV1()

      const mockResponse = {
        data: {
          data: {
            id: 1,
            status: 'rejected',
          },
          message: 'Rechazado exitosamente.',
          success: true,
        },
      }

      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._executeAuthorizationAction(
        mockSecondAuthorizationActionsPayload,
        'reject'
      )

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}/actions/reject`,
        mockSecondAuthorizationActionsPayload
      )
      expect(result).toEqual(mockResponse.data.data)
    })

    it('should execute return action successfully', async () => {
      // Arrange
      const store = useSecondAuthorizationStoreV1()

      const mockResponse = {
        data: {
          data: {
            id: 1,
            status: 'returned',
          },
          message: 'Devuelto exitosamente.',
          success: true,
        },
      }

      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._executeAuthorizationAction(
        mockSecondAuthorizationActionsPayload,
        'return'
      )

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}/actions/return`,
        mockSecondAuthorizationActionsPayload
      )
      expect(result).toEqual(mockResponse.data.data)
    })

    it('should handle error when executing authorization action', async () => {
      // Arrange
      const store = useSecondAuthorizationStoreV1()

      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'No se pudo autorizar el registro.',
          data: null,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._executeAuthorizationAction(
        mockSecondAuthorizationActionsPayload,
        'authorize'
      )

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}/actions/authorize`,
        mockSecondAuthorizationActionsPayload
      )
      expect(result).toEqual(null)
    })

    it('should handle network error when executing authorization action', async () => {
      // Arrange
      const store = useSecondAuthorizationStoreV1()

      const mockError = new Error('Network Error')
      const mockPost = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._executeAuthorizationAction(
        mockSecondAuthorizationActionsPayload,
        'authorize'
      )

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}/actions/authorize`,
        mockSecondAuthorizationActionsPayload
      )
      expect(result).toEqual(null)
    })
  })

  describe('_getSecondAuthorizationInstructionBeneficiaries', () => {
    it('should fetch instruction beneficiaries successfully', async () => {
      // Arrange
      const store = useSecondAuthorizationStoreV1()

      const mockResponse = {
        data: {
          data: [
            {
              id: 1,
              instruction_id: 1,
              beneficiary_id: 100,
              beneficiary_name: 'Beneficiary One',
              beneficiary_email: 'beneficiary1@example.com',
              amount: '25000.00',
            },
            {
              id: 2,
              instruction_id: 1,
              beneficiary_id: 101,
              beneficiary_name: 'Beneficiary Two',
              beneficiary_email: 'beneficiary2@example.com',
              amount: '25000.00',
            },
          ],
          message: 'Beneficiarios obtenidos exitosamente.',
          success: true,
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const result =
        await store._getSecondAuthorizationInstructionBeneficiaries(
          instructionId
        )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/instructions/${instructionId}/beneficiaries`
      )
      expect(result?.list).toEqual(mockResponse.data.data)
    })

    it('should handle error when fetching instruction beneficiaries', async () => {
      // Arrange
      const store = useSecondAuthorizationStoreV1()

      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'No se encontraron beneficiarios.',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const result =
        await store._getSecondAuthorizationInstructionBeneficiaries(
          instructionId
        )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/instructions/${instructionId}/beneficiaries`
      )
      expect(result).toEqual(null)
    })

    it('should handle network error when fetching instruction beneficiaries', async () => {
      // Arrange
      const store = useSecondAuthorizationStoreV1()

      const mockError = new Error('Network Error')
      const mockGet = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const result =
        await store._getSecondAuthorizationInstructionBeneficiaries(
          instructionId
        )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/instructions/${instructionId}/beneficiaries`
      )
      expect(result).toBeUndefined()
    })
  })
})
