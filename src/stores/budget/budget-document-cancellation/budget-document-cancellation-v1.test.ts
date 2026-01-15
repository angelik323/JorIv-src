import { createPinia, setActivePinia } from 'pinia'
import { useBudgetDocumentCancellationStoreV1 } from './budget-document-cancellation-v1'
import { executeApi } from '@/apis'

import { IErrors } from '@/interfaces/global'
import {
  IBudgetDocumentCancellation,
  IBudgetDocumentCancellationPayload,
  IBudgetDocumentErrorLogPayload,
} from '@/interfaces/customs/budget/BudgetDocumentCancellation'

import { URL_PATH_BUDGET } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const URL_PATH_BUDGET_CANCELLATION = `${URL_PATH_BUDGET}/budget-document-cancellation`

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    put: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  })),
}))

jest.mock('@/composables', () => {
  const showAlertMock = jest.fn()
  const showCatchErrorMock = jest.fn()
  const getNameBlobMock = jest.fn(() => 'test-file.xlsx')
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

describe('useBudgetDocumentCancellationStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  describe('_getDocumentCancellationWithDetailsById tests', () => {
    it('should fetch a document cancellation objetc with details', async () => {
      // Arrange
      const store = useBudgetDocumentCancellationStoreV1()

      const mockResponse = {
        data: {
          success: true,
          data: {
            has_accounting_vouchers: true,
            has_movements: true,
            has_derivative_contracting: false,
            operation: {
              id: 4,
              document_year: 2000,
              business_trust_id: 7,
              budget_document_type_id: 1,
              status: {
                id: 8,
                name: 'Por aprobar',
              },
              details: [
                {
                  id: 130,
                  year: 2000,
                  month: 2,
                  budget_item: { id: 8, code: '11', description: 'prueba' },
                  budget_resource: {
                    id: 16,
                    code: 'BR-0225',
                    description: 'TEMPORA VOLUPTAS REM AB VERITATIS.',
                  },
                  areas_responsibility: {
                    id: 12,
                    code: 'SA-0805',
                    description: 'SUNT ARCHITECTO AUTEM.',
                  },
                  value: '480842.13',
                  adjusted_value: null,
                },
              ],
              observations:
                'Doloremque omnis quibusdam dolorum earum eveniet odio doloremque.',
              total_value: 1835208.06,
            },
            transfer: null,
          } as IBudgetDocumentCancellation,
          message: 'Listado obtenido exitosamente.',
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const servicePayload = {
        'filter[validity_period]': 1994,
        'filter[business_trust_id]': 7,
        'filter[budget_document_type_id]': 1,
        'filter[id]': 4,
      }

      // Act
      const budgetDocumentCancellation =
        await store._getDocumentCancellationWithDetailsById(servicePayload)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH_BUDGET_CANCELLATION}/list`,
        { params: { ...servicePayload } }
      )
      expect(budgetDocumentCancellation?.operation).toBeTruthy()
      expect(budgetDocumentCancellation?.transfer).toBeNull()
      expect(budgetDocumentCancellation?.operation?.business_trust_id).toBe(7)
      expect(budgetDocumentCancellation?.operation?.details).toHaveLength(1)
    })

    it('should handle error when fetching a document cancellation objetc with details', async () => {
      // Arrange
      const store = useBudgetDocumentCancellationStoreV1()

      const mockErr = new Error('Network Error')

      const mockGet = jest.fn().mockRejectedValue(mockErr)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const { showCatchErrorMock, showAlertMock } =
        jest.requireMock('@/composables')

      const servicePayload = {
        'filter[validity_period]': 1994,
        'filter[business_trust_id]': 7,
        'filter[budget_document_type_id]': 1,
        'filter[id]': 4,
      }

      // Act
      const budgetDocumentCancellation =
        await store._getDocumentCancellationWithDetailsById(servicePayload)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH_BUDGET_CANCELLATION}/list`,
        { params: { ...servicePayload } }
      )

      expect(budgetDocumentCancellation).toBeNull()
      expect(showCatchErrorMock).toHaveBeenCalledWith(mockErr)
      expect(showAlertMock).toHaveBeenCalled()
    })
  })

  describe('_cancelBudgetDocument tests', () => {
    it('should cancel a budget document object successfully', async () => {
      // Arrange
      const store = useBudgetDocumentCancellationStoreV1()

      const mockResponse = {
        data: {
          success: true,
          message: 'Documento presupuestal anulado exitosamente',
        },
      }

      const { showAlertMock } = jest.requireMock('@/composables')

      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const payload: IBudgetDocumentCancellationPayload = {
        id: 4,
        operation_type: 'operation',
        business_trust_id: 7,
        cancellation_date: '2025-11-11',
        period: 202511,
      }

      // Act
      const result = await store._cancelBudgetDocument(payload)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH_BUDGET_CANCELLATION}/cancel`,
        payload
      )

      expect(result).toEqual({
        success: true,
        hasGeneratedErrorLogs: false,
      })

      expect(showAlertMock).toHaveBeenCalledWith(
        'Documento presupuestal anulado exitosamente',
        'success',
        undefined,
        TIMEOUT_ALERT
      )
    })

    it('should handle generic error when cancelling a budget document object', async () => {
      // Arrange
      const store = useBudgetDocumentCancellationStoreV1()

      const mockError = new Error('Network Error')
      const mockPost = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const payload: IBudgetDocumentCancellationPayload = {
        id: 4,
        operation_type: 'operation',
        business_trust_id: 7,
        cancellation_date: '2025-11-11',
        period: 202511,
      }

      const { showCatchErrorMock, showAlertMock } =
        jest.requireMock('@/composables')

      // Act
      const result = await store._cancelBudgetDocument(payload)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH_BUDGET_CANCELLATION}/cancel`,
        payload
      )

      expect(result).toEqual({
        success: false,
        hasGeneratedErrorLogs: false,
      })

      expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
      expect(showAlertMock).toHaveBeenCalled()
    })

    it('should set hasGeneratedErrorLogs to true when endpoint returns status 422', async () => {
      // Arrange
      const store = useBudgetDocumentCancellationStoreV1()

      const mockError = {
        status: 422,
        message:
          'Se presentan errores en la anulación, revise el log de errores haciendo uso del botón (Errores en la anulación).',
      }
      const mockPost = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const payload: IBudgetDocumentCancellationPayload = {
        id: 4,
        operation_type: 'operation',
        business_trust_id: 7,
        cancellation_date: '2025-11-11',
        period: 202511,
      }

      const { showCatchErrorMock, showAlertMock } =
        jest.requireMock('@/composables')

      // Act
      const result = await store._cancelBudgetDocument(payload)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH_BUDGET_CANCELLATION}/cancel`,
        payload
      )

      expect(result).toEqual({
        success: false,
        hasGeneratedErrorLogs: true,
      })

      expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
      expect(showAlertMock).toHaveBeenCalled()
    })
  })

  describe('_downloadDocumentCancellationErrorLogs', () => {
    it('should download the error logs file siccessfully', async () => {
      // Arrange
      const store = useBudgetDocumentCancellationStoreV1()
      const { getNameBlobMock, downloadBlobXlxxMock } =
        jest.requireMock('@/composables')

      const mockResponse = {
        data: new Blob(['test data'], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }),
        headers: {
          'content-type':
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const payload: IBudgetDocumentErrorLogPayload = {
        id: 3,
        operation_type: 'operation',
      }

      // Act
      await store._downloadDocumentCancellationErrorLogs(payload)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH_BUDGET_CANCELLATION}/error-logs`,
        { params: { ...payload }, responseType: 'blob' }
      )

      expect(getNameBlobMock).toHaveBeenCalledWith(mockResponse)
      expect(downloadBlobXlxxMock).toHaveBeenCalledWith(
        mockResponse.data,
        'test-file.xlsx'
      )
    })

    it('should display an error when download api call fails', async () => {
      // Arrange
      const store = useBudgetDocumentCancellationStoreV1()
      const { showAlertMock, showCatchErrorMock } =
        jest.requireMock('@/composables')

      const mockErr = new Error('Network Error')
      const mockGet = jest.fn().mockRejectedValue(mockErr)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const payload: IBudgetDocumentErrorLogPayload = {
        id: 3,
        operation_type: 'operation',
      }

      // Act
      await store._downloadDocumentCancellationErrorLogs(payload)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH_BUDGET_CANCELLATION}/error-logs`,
        { params: { ...payload }, responseType: 'blob' }
      )
      expect(showCatchErrorMock).toHaveBeenCalledWith(mockErr)
      expect(showAlertMock).toHaveBeenCalledWith(
        showCatchErrorMock(mockErr as unknown as IErrors),
        'error',
        undefined,
        3000
      )
    })
  })
})
