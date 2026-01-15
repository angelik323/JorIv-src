import { setActivePinia, createPinia } from 'pinia'
import { useCancellationRejectionReasonsStoreV1 } from './cancellation-rejection-reasons-v1'
import { executeApi } from '@/apis'
import { URL_PATH_ACCOUNTS_PAYABLE } from '@/constants/apis'
import { ICancellationRejectionReasonsForm } from '@/interfaces/customs'

const URL_PATH = `${URL_PATH_ACCOUNTS_PAYABLE}/cancellation-rejection-reasons`

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

const mockCancellationRejectionReasonsPayload: ICancellationRejectionReasonsForm =
  {
    reason_code: '',
    reason_type: 'anulacion',
    description: 'Error en el proceso de facturación',
    has_reports_dian: true,
    is_applies_tax_refund: false,
  }

const cancellationRejectionReasonsId = 4

describe('useCancellationRejectionReasonsStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  describe('_getCancellationRejectionReasonsList', () => {
    const filters = {
      paginate: 1,
      order_by: 'id,desc',
      'filter[reason_type]': 'anulacion',
    }

    const params = {
      ...filters,
    }
    it('should fetch cancellation rejection reasons list and update state on success', async () => {
      // Arrange
      const store = useCancellationRejectionReasonsStoreV1()

      const mockResponse = {
        data: {
          data: {
            data: [
              {
                id: 2,
                reason_type: 'Anulación',
                reason_code: '002',
                description: 'test creando anulacion update2',
                has_reports_dian: true,
                is_applies_tax_refund: true,
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
      await store._getCancellationRejectionReasonsList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
        params: params,
      })
      expect(store.cancellation_rejection_reasons_list).toEqual(
        mockResponse.data.data.data
      )
    })

    it('should handle error when fetching cancellation rejection reasons list', async () => {
      // Arrange
      const store = useCancellationRejectionReasonsStoreV1()
      const mockError = new Error('Network Error')
      const mockGet = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      await store._getCancellationRejectionReasonsList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
        params: params,
      })
      expect(store.cancellation_rejection_reasons_list).toEqual([])
    })

    it('should handle response.data as undefined when fetching cancellation rejection reasons list', async () => {
      // Arrange
      const store = useCancellationRejectionReasonsStoreV1()
      const mockResponse = { data: undefined }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      await store._getCancellationRejectionReasonsList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
        params: params,
      })
      expect(store.cancellation_rejection_reasons_list).toEqual([])
    })

    it('should handle response.data as null when fetching cancellation rejection reasons list', async () => {
      // Arrange
      const store = useCancellationRejectionReasonsStoreV1()
      const mockResponse = { data: null }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      await store._getCancellationRejectionReasonsList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
        params: filters,
      })
      expect(store.cancellation_rejection_reasons_list).toEqual([])
    })
  })

  describe('_createCancellationRejectionReasons', () => {
    it('should create a new cancellation rejection reasons income successfully', async () => {
      // Arrange
      const store = useCancellationRejectionReasonsStoreV1()
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Created',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      await store._createCancellationRejectionReasons(
        mockCancellationRejectionReasonsPayload
      )

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}`,
        mockCancellationRejectionReasonsPayload
      )
      expect(mockPost).toHaveBeenCalledTimes(1)
    })

    it('should handle error creating a new cancellation rejection reasons income successfully', async () => {
      // Arrange
      const store = useCancellationRejectionReasonsStoreV1()

      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'El registro no pudo ser creado.',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createCancellationRejectionReasons(
        mockCancellationRejectionReasonsPayload
      )

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}`,
        mockCancellationRejectionReasonsPayload
      )
      expect(result).toBe(false)
    })
  })

  describe('_getCancellationRejectionReasonsById', () => {
    it('should fetch cancellation rejection reasons by id and update state on success', async () => {
      // Arrange
      const store = useCancellationRejectionReasonsStoreV1()

      const mockResponse = {
        data: {
          data: {
            id: 2,
            reason_type: 'Anulación',
            reason_code: '002',
            description: 'test creando anulacion update2',
            has_reports_dian: true,
            is_applies_tax_refund: true,
          },
          message: 'Registro obtenido exitosamente.',
          success: true,
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getCancellationRejectionReasonsById(
        cancellationRejectionReasonsId
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/${cancellationRejectionReasonsId}`
      )
      expect(store.cancellation_rejection_reasons_response).toEqual(
        mockResponse.data.data
      )
    })

    it('should handle error when fetching cancellation rejection reasons by id', async () => {
      // Arrange
      const store = useCancellationRejectionReasonsStoreV1()

      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'No se encontro el registro.',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      await store._getCancellationRejectionReasonsById(
        cancellationRejectionReasonsId
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/${cancellationRejectionReasonsId}`
      )
      expect(store.cancellation_rejection_reasons_response).toEqual(null)
    })
  })

  describe('_updateCancellationRejectionReasons', () => {
    it('should update a new cancellation rejection reasons income successfully', async () => {
      // Arrange
      const store = useCancellationRejectionReasonsStoreV1()
      const mockPut = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Registro actualizado exitosamente',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      await store._updateCancellationRejectionReasons(
        mockCancellationRejectionReasonsPayload,
        cancellationRejectionReasonsId
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_PATH}/${cancellationRejectionReasonsId}`,
        mockCancellationRejectionReasonsPayload
      )
      expect(mockPut).toHaveBeenCalledTimes(1)
    })

    it('should handle error updating a cancellation rejection reasons successfully', async () => {
      // Arrange
      const store = useCancellationRejectionReasonsStoreV1()

      const mockPut = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'El registro actualizado.',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._updateCancellationRejectionReasons(
        mockCancellationRejectionReasonsPayload,
        cancellationRejectionReasonsId
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_PATH}/${cancellationRejectionReasonsId}`,
        mockCancellationRejectionReasonsPayload
      )
      expect(result).toBe(false)
    })
  })

  describe('_deleteCancellationRejectionReasons', () => {
    it('should delete cancellation rejection reasons', async () => {
      // Arrange
      const store = useCancellationRejectionReasonsStoreV1()
      const mockDelete = jest.fn().mockResolvedValue({
        success: true,
        data: null,
        message: 'Registro eliminado exitosamente.',
      })
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      await store._deleteCancellationRejectionReasons(
        cancellationRejectionReasonsId
      )

      // Assert
      expect(mockDelete).toHaveBeenCalledWith(
        `${URL_PATH}/${cancellationRejectionReasonsId}`
      )
      expect(mockDelete).toHaveBeenCalledTimes(1)
    })

    it('should handle error deleting cancellation rejection reasons', async () => {
      // Arrange
      const store = useCancellationRejectionReasonsStoreV1()
      const mockDelete = jest.fn().mockResolvedValue({
        success: true,
        data: null,
        message: 'Error al eliminar el registro.',
      })
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      const result = await store._deleteCancellationRejectionReasons(
        cancellationRejectionReasonsId
      )

      // Assert
      expect(mockDelete).toHaveBeenCalledWith(
        `${URL_PATH}/${cancellationRejectionReasonsId}`
      )
      expect(result).toBe(false)
    })
  })
})
