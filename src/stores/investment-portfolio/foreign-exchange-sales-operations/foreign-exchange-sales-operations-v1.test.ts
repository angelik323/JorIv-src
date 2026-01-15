import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { useForeignExchangeSalesStoreV1 } from './foreign-exchange-sales-operations-v1'
import { IForeignExchangeSalesBuy } from '@/interfaces/customs'

const URL_PATH = `${URL_PATH_INVESTMENT_PORTFOLIO}/foreign-currency-transactions`
jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    put: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
  })),
}))

jest.mock('@/composables', () => {
  const showAlertMock = jest.fn()
  const showCatchErrorMock = jest.fn()

  const useAlert = jest.fn(() => ({ showAlert: showAlertMock }))
  const useShowError = jest.fn(() => ({ showCatchError: showCatchErrorMock }))

  return { useAlert, useShowError, showAlertMock, showCatchErrorMock }
})

describe('useForeignExchangeSalesBuys', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should fetch investment portfolio list and update state on success', async () => {
    // Arrange
    const store = useForeignExchangeSalesStoreV1()
    const mockResponse = {
      data: {
        success: true,
        data: {
          current_page: 1,
          data: [],
          last_page: 1,
          per_page: 20,
        },
        message: 'Listado obtenido exitosamente.',
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = '&filter[search]=estructura'

    // Act
    await store._getForeignExchangeSalesBuyList(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/list?paginate=1${params}`)
    expect(store.foreign_exchange_sales_list).toEqual(
      mockResponse.data.data.data
    )
  })

  it('should handle error when fetching investment portfolio list', async () => {
    // Arrange
    const store = useForeignExchangeSalesStoreV1()
    const mockError = new Error('Network Error')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = '&filter[search]=estructura'

    // Act
    await store._getForeignExchangeSalesBuyList(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/list?paginate=1${params}`)
    expect(store.foreign_exchange_sales_list).toEqual([])
  })

  it('should handle response.data as undefined when fetching the investment portfolio list', async () => {
    // Arrange
    const store = useForeignExchangeSalesStoreV1()
    const mockResponse = { data: undefined }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = '&filter[search]=estructura'

    // Act
    await store._getForeignExchangeSalesBuyList(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/list?paginate=1${params}`)
    expect(store.foreign_exchange_sales_list).toEqual([])
    expect(store.foreign_exchange_sales_pages.currentPage).toBe(0)
    expect(store.foreign_exchange_sales_pages.lastPage).toBe(0)
  })

  it('should handle response.data as null when fetching the investment portfolio list', async () => {
    // Arrange
    const store = useForeignExchangeSalesStoreV1()
    const mockResponse = { data: null }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = '&filter[search]=estructura'

    // Act
    await store._getForeignExchangeSalesBuyList(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/list?paginate=1${params}`)
    expect(store.foreign_exchange_sales_list).toEqual([])
    expect(store.foreign_exchange_sales_pages.currentPage).toBe(0)
    expect(store.foreign_exchange_sales_pages.lastPage).toBe(0)
  })

  it('should create an investment portfolio successfully', async () => {
    // Arrange
    const store = useForeignExchangeSalesStoreV1()
    const mockResponse = {
      data: {
        data: [],
        success: true,
        message: 'Registro creado exitosamente.',
      },
    }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload: IForeignExchangeSalesBuy = {
      investment_portfolio_id: 12,
      investment_description: 'Port. Saklirpotj', // opcional
      operation_type_id: 6578,
      operation_type_description: 'Constitución Swaps tasas de interés IBR/TF', // opcional
      paper_type_id: 2,
      origin_currency_id: 1, // p. ej. COP
      destination_currency_id: 2, // p. ej. USD
      origin_bank_id: 3,
      origin_bank_account_id: 10,
      destination_bank_id: 5,
      destination_bank_account_id: 11,
      issuer_counterparty_id: 7,
      issuer_counterparty_description: 'Contraparte XYZ',
      operation_date: '2025-10-13',
      origin_amount: 2500000.75,
      official_rate: 2524.6554,
      negotiated_rate: 4567.891,
      description: 'Prueba de compra/venta de divisas (mock).',
      type: 'SELL', // 'BUY' | 'SELL'
      profit_loss_sale: 0,
    }

    // Act
    const result = await store._createForeignExchangeSalesBuy(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}/new`, payload)
    expect(result).toBe(true)
  })

  it('should handle error when creating an investment portfolio', async () => {
    // Arrange
    const store = useForeignExchangeSalesStoreV1()
    const mockError = {
      response: {
        data: {
          message: 'Ocurrío un error al crear el comprobante contable',
        },
      },
    }
    const mockPost = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload: IForeignExchangeSalesBuy = {
      investment_portfolio_id: 12,
      investment_description: 'Port. Saklirpotj', // opcional
      operation_type_id: 6578,
      operation_type_description: 'Constitución Swaps tasas de interés IBR/TF', // opcional
      paper_type_id: 2,
      origin_currency_id: 1, // p. ej. COP
      destination_currency_id: 2, // p. ej. USD
      origin_bank_id: 3,
      origin_bank_account_id: 10,
      destination_bank_id: 5,
      destination_bank_account_id: 11,
      issuer_counterparty_id: 7,
      issuer_counterparty_description: 'Contraparte XYZ',
      operation_date: '2025-10-13',
      origin_amount: 2500000.75,
      official_rate: 2524.6554,
      negotiated_rate: 4567.891,
      description: 'Prueba de compra/venta de divisas (mock).',
      type: 'SELL', // 'BUY' | 'SELL'
      profit_loss_sale: 0,
    }

    // Act
    const result = await store._createForeignExchangeSalesBuy(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}/new`, payload)
    expect(result).toBe(false)
  })

  it('should fetch an investment portfolio by ID', async () => {
    const store = useForeignExchangeSalesStoreV1()
    const dto = {
      id: 123,
      operation_date: '2025-09-11',
      operation_number: '00004',
      investment_portfolio_id: 8,
      operation_type_id: 16,
      paper_type_id: 57,
      origin_bank_id: 29,
      destination_bank_id: 1,
      official_rate: '1',
      negotiated_rate: '1',
      origin_amount: '1',
      status: 1,
      type: 'SELL',
    }
    const mockResponse = {
      data: {
        success: true,
        message: 'Registro obtenido exitosamente.',
        data: dto,
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const id = 1
    const response = await store._getForeignExchangeSalesBuy(id)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/${id}`)
    expect(response).toBe(true)
    expect(store.foreign_exchange_sales_detail).toEqual(dto)
  })

  it('should handle error when fetching an investment portfolio by ID', async () => {
    // Arrange
    const store = useForeignExchangeSalesStoreV1()
    const mockError = new Error('Network Error')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const id = 1
    // Act
    const response = await store._getForeignExchangeSalesBuy(id)
    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/${id}`)
    expect(response).toBe(false)
  })

  it('should update an investment portfolio successfully', async () => {
    // Arrange
    const store = useForeignExchangeSalesStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Comprobante contable actualizado exitosamente.',
      },
    }
    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const id = 1
    const payload: IForeignExchangeSalesBuy = {
      investment_portfolio_id: 12,
      investment_description: 'Port. Saklirpotj', // opcional
      operation_type_id: 6578,
      operation_type_description: 'Constitución Swaps tasas de interés IBR/TF', // opcional
      paper_type_id: 2,
      origin_currency_id: 1, // p. ej. COP
      destination_currency_id: 2, // p. ej. USD
      origin_bank_id: 3,
      origin_bank_account_id: 10,
      destination_bank_id: 5,
      destination_bank_account_id: 11,
      issuer_counterparty_id: 7,
      issuer_counterparty_description: 'Contraparte XYZ',
      operation_date: '2025-10-13',
      origin_amount: 2500000.75,
      official_rate: 2524.6554,
      negotiated_rate: 4567.891,
      description: 'Prueba de compra/venta de divisas (mock).',
      type: 'SELL', // 'BUY' | 'SELL'
      profit_loss_sale: 0,
    }

    // Act
    const result = await store._updateForeignExchangeSalesBuy(id, payload)
    // Assert
    expect(mockPut).toHaveBeenCalledWith(`${URL_PATH}/${id}`, payload)
    expect(result).toBe(true)
  })

  it('should handle an investment portfolio update on false success', async () => {
    // Arrange
    const store = useForeignExchangeSalesStoreV1()
    const mockResponse = {
      data: {
        success: false,
        message: 'No se pudo actualizar el comprobante',
      },
    }
    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const id = 1
    const payload: IForeignExchangeSalesBuy = {
      investment_portfolio_id: 12,
      investment_description: 'Port. Saklirpotj', // opcional
      operation_type_id: 6578,
      operation_type_description: 'Constitución Swaps tasas de interés IBR/TF', // opcional
      paper_type_id: 2,
      origin_currency_id: 1, // p. ej. COP
      destination_currency_id: 2, // p. ej. USD
      origin_bank_id: 3,
      origin_bank_account_id: 10,
      destination_bank_id: 5,
      destination_bank_account_id: 11,
      issuer_counterparty_id: 7,
      issuer_counterparty_description: 'Contraparte XYZ',
      operation_date: '2025-10-13',
      origin_amount: 2500000.75,
      official_rate: 2524.6554,
      negotiated_rate: 4567.891,
      description: 'Prueba de compra/venta de divisas (mock).',
      type: 'SELL', // 'BUY' | 'SELL'
      profit_loss_sale: 0,
    }

    // Act
    const result = await store._updateForeignExchangeSalesBuy(id, payload)
    // Assert
    expect(mockPut).toHaveBeenCalledWith(`${URL_PATH}/${id}`, payload)
    expect(result).toBe(false)
  })

  it('should handle error when updating an investment portfolio', async () => {
    // Arrange
    const store = useForeignExchangeSalesStoreV1()
    const mockResponse = new Error('Network Error')
    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const id = 1
    const payload: IForeignExchangeSalesBuy = {
      investment_portfolio_id: 12,
      investment_description: 'Port. Saklirpotj', // opcional
      operation_type_id: 6578,
      operation_type_description: 'Constitución Swaps tasas de interés IBR/TF', // opcional
      paper_type_id: 2,
      origin_currency_id: 1, // p. ej. COP
      destination_currency_id: 2, // p. ej. USD
      origin_bank_id: 3,
      origin_bank_account_id: 10,
      destination_bank_id: 5,
      destination_bank_account_id: 11,
      issuer_counterparty_id: 7,
      issuer_counterparty_description: 'Contraparte XYZ',
      operation_date: '2025-10-13',
      origin_amount: 2500000.75,
      official_rate: 2524.6554,
      negotiated_rate: 4567.891,
      description: 'Prueba de compra/venta de divisas (mock).',
      type: 'SELL', // 'BUY' | 'SELL'
      profit_loss_sale: 0,
    }

    // Act
    const result = await store._updateForeignExchangeSalesBuy(id, payload)
    // Assert
    expect(mockPut).toHaveBeenCalledWith(`${URL_PATH}/${id}`, payload)
    expect(result).toBe(false)
  })

  it('should toggle investment portfolio status successfully', async () => {
    // Arrange
    const store = useForeignExchangeSalesStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Estado actualizado',
      },
    }
    const mockPatch = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

    const id = 1
    // Act
    const result = await store._updateForeignExchangeSalesBuyStatus(id)
    // Assert
    expect(mockPatch).toHaveBeenCalledWith(`${URL_PATH}/${id}/toggle-status`)
    expect(result).toBe(true)
  })

  it('should handle toggle investment portfolio statuson false success', async () => {
    // Arrange
    const store = useForeignExchangeSalesStoreV1()
    const mockResponse = {
      data: {
        success: false,
        message: 'No se pudo actualizar el estado',
      },
    }
    const mockPatch = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

    const id = 1
    // Act
    const result = await store._updateForeignExchangeSalesBuyStatus(id)
    // Assert
    expect(mockPatch).toHaveBeenCalledWith(`${URL_PATH}/${id}/toggle-status`)
    expect(result).toBe(false)
  })

  it('should handle error when updating an investment portfolio', async () => {
    // Arrange
    const store = useForeignExchangeSalesStoreV1()
    const mockResponse = new Error('Network Error')
    const mockPatch = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

    const id = 1
    // Act
    const result = await store._updateForeignExchangeSalesBuyStatus(id)
    // Assert
    expect(mockPatch).toHaveBeenCalledWith(`${URL_PATH}/${id}/toggle-status`)
    expect(result).toBe(false)
  })
})
