import { setActivePinia, createPinia } from 'pinia'
import { useAnnualPaymentAmountsStoreV1 } from './annual-payment-amounts-v1'
import { executeApi } from '@/apis'
import { URL_PATH_ACCOUNTS_PAYABLE } from '@/constants/apis'
import {
  IAnnualPaymentAmountsForm,
  IAnnualPaymentAmountsItem,
} from '@/interfaces/customs'

const URL_PATH = `${URL_PATH_ACCOUNTS_PAYABLE}/annual-payment-amounts`

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

describe('useAnnualPaymentAmountsStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  describe('_getAnnualPaymentAmountsList', () => {
    const filters = {
      paginate: 1,
      order_by: 'year,desc',
      'filter[year]': 2025,
    }

    const params = {
      ...filters,
    }
    it('should fetch annual payment amounts list and update state on success', async () => {
      // Arrange
      const store = useAnnualPaymentAmountsStoreV1()

      const mockResponse = {
        data: {
          data: {
            data: [
              {
                id: 4,
                year: 2025,
                minimum_salary: 400000,
                transport_subsidy: 20000,
                uvt: 400000,
                obligated_iva_uvt_pn: 200,
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
      await store._getAnnualPaymentAmountsList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
        params: params,
      })
      expect(store.annual_payment_amounts_list).toEqual(
        mockResponse.data.data.data
      )
    })

    it('should handle error when fetching annual payment amounts list', async () => {
      // Arrange
      const store = useAnnualPaymentAmountsStoreV1()
      const mockError = new Error('Network Error')
      const mockGet = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      await store._getAnnualPaymentAmountsList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
        params: params,
      })
      expect(store.annual_payment_amounts_list).toEqual([])
    })

    it('should handle response.data as undefined when fetching annual payment amounts list', async () => {
      // Arrange
      const store = useAnnualPaymentAmountsStoreV1()
      const mockResponse = { data: undefined }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      await store._getAnnualPaymentAmountsList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
        params: params,
      })
      expect(store.annual_payment_amounts_list).toEqual([])
    })

    it('should handle response.data as null when fetching annual payment amounts list', async () => {
      // Arrange
      const store = useAnnualPaymentAmountsStoreV1()
      const mockResponse = { data: null }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      await store._getAnnualPaymentAmountsList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
        params: filters,
      })
      expect(store.annual_payment_amounts_list).toEqual([])
    })
  })

  describe('_createAnnualPaymentAmounts', () => {
    const mockAnnualPaymentAmountsPayload: IAnnualPaymentAmountsForm = {
      year: 2025,
      minimum_salary: '400000',
      transport_subsidy: '20000',
      uvt: '400000',
      obligated_iva_uvt_pn: '200',
    }

    it('should create a new annual payment amount income successfully', async () => {
      // Arrange
      const store = useAnnualPaymentAmountsStoreV1()
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Created',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      await store._createAnnualPaymentAmounts(mockAnnualPaymentAmountsPayload)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}`,
        mockAnnualPaymentAmountsPayload
      )
      expect(mockPost).toHaveBeenCalledTimes(1)
    })

    it('should handle error creating a new annual payment amount income successfully', async () => {
      // Arrange
      const store = useAnnualPaymentAmountsStoreV1()

      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'El registro no pudo ser creado.',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createAnnualPaymentAmounts(
        mockAnnualPaymentAmountsPayload
      )

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}`,
        mockAnnualPaymentAmountsPayload
      )
      expect(result).toBe(false)
    })
  })

  describe('_getAnnualPaymentAmountsById', () => {
    const annuaPaymentAmountsId = 4
    it('should fetch annual payment amounts by id and update state on success', async () => {
      // Arrange
      const store = useAnnualPaymentAmountsStoreV1()

      const mockResponse = {
        data: {
          data: {
            id: 4,
            year: 2025,
            minimum_salary: 400000,
            transport_subsidy: 20000,
            uvt: 400000,
            obligated_iva_uvt_pn: 200,
          },
          message: 'Registro obtenido exitosamente.',
          success: true,
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const result = await store._getAnnualPaymentAmountsById(
        annuaPaymentAmountsId
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/${annuaPaymentAmountsId}`
      )
      expect(result).toEqual(mockResponse.data.data)
    })

    it('should handle error when fetching annual payment amounts by id', async () => {
      // Arrange
      const store = useAnnualPaymentAmountsStoreV1()

      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'No se encontro el registro.',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      const result = await store._getAnnualPaymentAmountsById(
        annuaPaymentAmountsId
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/${annuaPaymentAmountsId}`
      )
      expect(result).toEqual(null)
    })
  })

  describe('_updateAnnualPaymentAmounts', () => {
    const mockAnnualPaymentAmountsPayload: IAnnualPaymentAmountsItem = {
      id: 1,
      year: 2025,
      minimum_salary: '400000',
      transport_subsidy: '20000',
      uvt: '400000',
      obligated_iva_uvt_pn: '200',
    }
    const annuaPaymentAmountsId = 4

    it('should update a new annual payment amount income successfully', async () => {
      // Arrange
      const store = useAnnualPaymentAmountsStoreV1()
      const mockPut = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Created',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._updateAnnualPaymentAmounts(
        mockAnnualPaymentAmountsPayload,
        annuaPaymentAmountsId
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_PATH}/${annuaPaymentAmountsId}`,
        mockAnnualPaymentAmountsPayload
      )
      expect(mockPut).toHaveBeenCalledTimes(1)
      expect(result).toBe(true)
    })

    it('should handle error updating a payment amount income successfully', async () => {
      // Arrange
      const store = useAnnualPaymentAmountsStoreV1()

      const mockPut = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'El registro no pudo ser creado.',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._updateAnnualPaymentAmounts(
        mockAnnualPaymentAmountsPayload,
        annuaPaymentAmountsId
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_PATH}/${annuaPaymentAmountsId}`,
        mockAnnualPaymentAmountsPayload
      )
      expect(result).toBe(false)
    })
  })

  describe('_deleteAnnualPaymentAmounts', () => {
    const annuaPaymentAmountsId = 4
    it('should delete annual payment amounts', async () => {
      // Arrange
      const store = useAnnualPaymentAmountsStoreV1()
      const mockDelete = jest.fn().mockResolvedValue({
        success: true,
        data: null,
        message: 'Registro eliminado exitosamente.',
      })
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      await store._deleteAnnualPaymentAmounts(annuaPaymentAmountsId)

      // Assert
      expect(mockDelete).toHaveBeenCalledWith(
        `${URL_PATH}/${annuaPaymentAmountsId}`
      )
      expect(mockDelete).toHaveBeenCalledTimes(1)
    })

    it('should handle error deleting annual payment amount', async () => {
      // Arrange
      const store = useAnnualPaymentAmountsStoreV1()
      const mockDelete = jest.fn().mockResolvedValue({
        success: true,
        data: null,
        message: 'Registro eliminado exitosamente.',
      })
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      const result = await store._deleteAnnualPaymentAmounts(
        annuaPaymentAmountsId
      )

      // Assert
      expect(mockDelete).toHaveBeenCalledWith(
        `${URL_PATH}/${annuaPaymentAmountsId}`
      )
      expect(result).toBe(false)
    })
  })
})
