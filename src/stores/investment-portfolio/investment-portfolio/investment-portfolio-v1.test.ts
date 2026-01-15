import { setActivePinia, createPinia } from 'pinia'
import { useInvestmentPortfolioStoreV1 } from './investment-portfolio-v1'
import { executeApi } from '@/apis'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'

const URL_PATH = `${URL_PATH_INVESTMENT_PORTFOLIO}/portfolio`
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

  const useAlert = jest.fn(() => ({ showAlert: showAlertMock }))
  const useShowError = jest.fn(() => ({ showCatchError: showCatchErrorMock }))

  return { useAlert, useShowError, showAlertMock, showCatchErrorMock }
})

describe('useInvestmentPortfolios', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should fetch investment portfolio list and update state on success', async () => {
    // Arrange
    const store = useInvestmentPortfolioStoreV1()
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
    await store._getInvestmentPortfolioList(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1${params}`)
    expect(store.investment_portfolio_list).toEqual(mockResponse.data.data.data)
  })

  it('should handle error when fetching investment portfolio list', async () => {
    // Arrange
    const store = useInvestmentPortfolioStoreV1()
    const mockError = new Error('Network Error')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = '&filter[search]=estructura'

    // Act
    await store._getInvestmentPortfolioList(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1${params}`)
    expect(store.investment_portfolio_list).toEqual([])
  })

  it('should handle response.data as undefined when fetching the investment portfolio list', async () => {
    // Arrange
    const store = useInvestmentPortfolioStoreV1()
    const mockResponse = { data: undefined }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = '&filter[search]=estructura'

    // Act
    await store._getInvestmentPortfolioList(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1${params}`)
    expect(store.investment_portfolio_list).toEqual([])
    expect(store.investment_portfolio_pages.currentPage).toBe(0)
    expect(store.investment_portfolio_pages.lastPage).toBe(0)
  })

  it('should handle response.data as null when fetching the investment portfolio list', async () => {
    // Arrange
    const store = useInvestmentPortfolioStoreV1()
    const mockResponse = { data: null }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = '&filter[search]=estructura'

    // Act
    await store._getInvestmentPortfolioList(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1${params}`)
    expect(store.investment_portfolio_list).toEqual([])
    expect(store.investment_portfolio_pages.currentPage).toBe(0)
    expect(store.investment_portfolio_pages.lastPage).toBe(0)
  })

  it('should create an investment portfolio successfully', async () => {
    // Arrange
    const store = useInvestmentPortfolioStoreV1()
    const mockResponse = {
      data: {
        data: [],
        success: true,
        message: 'Registro creado exitosamente.',
      },
    }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = {
      name: 'Portafolio Ejemplo',
      code: 'PF182',
      business_code: 5635639,
      fic_code: '6',
      currency: 1,
      cost_center_id: 111,
      last_valuation_date: '2025-05-23',
      bank_id: [1, 2],
      bank_account: [10, 11],
      collection_method: [1, 2],
      method_payment: [1, 2],
    }

    // Act
    const result = await store._createInvestmentPortfolio(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}`, payload)
    expect(result).toBe(true)
  })

  it('should handle error when creating an investment portfolio', async () => {
    // Arrange
    const store = useInvestmentPortfolioStoreV1()
    const mockError = {
      response: {
        data: {
          message: 'Ocurrío un error al crear el comprobante contable',
        },
      },
    }
    const mockPost = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = {
      name: 'Portafolio Ejemplo',
      code: 'PF182',
      business_code: 5635639,
      fic_code: '6',
      currency: 1,
      cost_center_id: 111,
      last_valuation_date: '2025-05-23',
      bank_id: [1, 2],
      bank_account: [10, 11],
      collection_method: [1, 2],
      method_payment: [1, 2],
    }

    // Act
    const result = await store._createInvestmentPortfolio(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}`, payload)
    expect(result).toBe(false)
  })

  it('should fetch an investment portfolio by ID', async () => {
    // Arrange
    const store = useInvestmentPortfolioStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Registro obtenido exitosamente.',
        data: {},
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const id = 1
    // Act
    const response = await store._getInvestmentPortfolio(id)
    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/${id}`)
    expect(response).toBe(true)
  })

  it('should handle error when fetching an investment portfolio by ID', async () => {
    // Arrange
    const store = useInvestmentPortfolioStoreV1()
    const mockError = new Error('Network Error')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const id = 1
    // Act
    const response = await store._getInvestmentPortfolio(id)
    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/${id}`)
    expect(response).toBe(false)
  })

  it('should update an investment portfolio successfully', async () => {
    // Arrange
    const store = useInvestmentPortfolioStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Comprobante contable actualizado exitosamente.',
      },
    }
    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const id = 1
    const payload = {
      name: 'Portafolio Ejemplo',
      code: 'PF182',
      business_code: 5635639,
      fic_code: '6',
      currency: 1,
      cost_center_id: 111,
      last_valuation_date: '2025-05-23',
      bank_id: [1, 2],
      bank_account: [10, 11],
      collection_method: [1, 2],
      method_payment: [1, 2],
    }
    // Act
    const result = await store._updateInvestmentPortfolio(id, payload)
    // Assert
    expect(mockPut).toHaveBeenCalledWith(`${URL_PATH}/${id}`, payload)
    expect(result).toBe(true)
  })

  it('should handle an investment portfolio update on false success', async () => {
    // Arrange
    const store = useInvestmentPortfolioStoreV1()
    const mockResponse = {
      data: {
        success: false,
        message: 'No se pudo actualizar el comprobante',
      },
    }
    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const id = 1
    const payload = {
      name: 'Portafolio Ejemplo',
      code: 'PF182',
      business_code: 5635639,
      fic_code: '6',
      currency: 1,
      cost_center_id: 111,
      last_valuation_date: '2025-05-23',
      bank_id: [1, 2],
      bank_account: [10, 11],
      collection_method: [1, 2],
      method_payment: [1, 2],
    }
    // Act
    const result = await store._updateInvestmentPortfolio(id, payload)
    // Assert
    expect(mockPut).toHaveBeenCalledWith(`${URL_PATH}/${id}`, payload)
    expect(result).toBe(false)
  })

  it('should handle error when updating an investment portfolio', async () => {
    // Arrange
    const store = useInvestmentPortfolioStoreV1()
    const mockResponse = new Error('Network Error')
    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const id = 1
    const payload = {
      name: 'Portafolio Ejemplo',
      code: 'PF182',
      business_code: 5635639,
      fic_code: '6',
      currency: 1,
      cost_center_id: 111,
      last_valuation_date: '2025-05-23',
      bank_id: [1, 2],
      bank_account: [10, 11],
      collection_method: [1, 2],
      method_payment: [1, 2],
    }
    // Act
    const result = await store._updateInvestmentPortfolio(id, payload)
    // Assert
    expect(mockPut).toHaveBeenCalledWith(`${URL_PATH}/${id}`, payload)
    expect(result).toBe(false)
  })

  it('should toggle investment portfolio status successfully', async () => {
    // Arrange
    const store = useInvestmentPortfolioStoreV1()
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
    const result = await store._updateInvestmentPortfolioStatus(id)
    // Assert
    expect(mockPatch).toHaveBeenCalledWith(`${URL_PATH}/${id}/toggle-status`)
    expect(result).toBe(true)
  })

  it('should handle toggle investment portfolio statuson false success', async () => {
    // Arrange
    const store = useInvestmentPortfolioStoreV1()
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
    const result = await store._updateInvestmentPortfolioStatus(id)
    // Assert
    expect(mockPatch).toHaveBeenCalledWith(`${URL_PATH}/${id}/toggle-status`)
    expect(result).toBe(false)
  })

  it('should handle error when updating an investment portfolio', async () => {
    // Arrange
    const store = useInvestmentPortfolioStoreV1()
    const mockResponse = new Error('Network Error')
    const mockPatch = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

    const id = 1
    // Act
    const result = await store._updateInvestmentPortfolioStatus(id)
    // Assert
    expect(mockPatch).toHaveBeenCalledWith(`${URL_PATH}/${id}/toggle-status`)
    expect(result).toBe(false)
  })
})
