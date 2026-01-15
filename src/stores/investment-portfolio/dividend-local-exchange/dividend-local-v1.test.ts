import { setActivePinia, createPinia } from 'pinia'
import { useDividendLocalStoreV1 } from './dividend-local-v1'
import { executeApi } from '@/apis'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'

const URL_PATH = `${URL_PATH_INVESTMENT_PORTFOLIO}/exchange-traded-fund/dividend/local`
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

describe('useDividendLocals', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should fetch operational etf list and update state on success', async () => {
    // Arrange
    const store = useDividendLocalStoreV1()
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
    await store._getDividendLocalList(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/list?paginate=1${params}`)
    expect(store.dividend_local_list).toEqual(mockResponse.data.data.data)
  })

  it('should handle error when fetching operational etf list', async () => {
    // Arrange
    const store = useDividendLocalStoreV1()
    const mockError = new Error('Network Error')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = '&filter[search]=estructura'

    // Act
    await store._getDividendLocalList(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/list?paginate=1${params}`)
    expect(store.dividend_local_list).toEqual([])
  })

  it('should handle response.data as undefined when fetching the operational etf list', async () => {
    // Arrange
    const store = useDividendLocalStoreV1()
    const mockResponse = { data: undefined }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = '&filter[search]=estructura'

    // Act
    await store._getDividendLocalList(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/list?paginate=1${params}`)
    expect(store.dividend_local_list).toEqual([])
    expect(store.dividend_local_pages.currentPage).toBe(0)
    expect(store.dividend_local_pages.lastPage).toBe(0)
  })

  it('should handle response.data as null when fetching the operational etf list', async () => {
    // Arrange
    const store = useDividendLocalStoreV1()
    const mockResponse = { data: null }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = '&filter[search]=estructura'

    // Act
    await store._getDividendLocalList(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/list?paginate=1${params}`)
    expect(store.dividend_local_list).toEqual([])
    expect(store.dividend_local_pages.currentPage).toBe(0)
    expect(store.dividend_local_pages.lastPage).toBe(0)
  })

  it('should create an operational etf successfully', async () => {
    // Arrange
    const store = useDividendLocalStoreV1()
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
      description: 'ETF de prueba',
      index_type: 'Renta Fija',
      index_description: 'Índice de Bonos Nacionales',
      administrator_id: 4,
      admin_description: 'Administrador ejemplo',
      transmitter_id: 1,
      transmitter_description: 'Emisor ejemplo',
      currency_id: 3,
      isin_code_id: 10,
      nemotechnic: 'ETF001',
      status_id: 1,
      etf_number: 1,
    }

    // Act
    const result = await store._createDividendLocal(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}/new`, payload)
    expect(result).toBe(true)
  })

  it('should handle error when creating an operational etf', async () => {
    // Arrange
    const store = useDividendLocalStoreV1()
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
      description: 'ETF de prueba',
      index_type: 'Renta Fija',
      index_description: 'Índice de Bonos Nacionales',
      administrator_id: 4,
      admin_description: 'Administrador ejemplo',
      transmitter_id: 1,
      transmitter_description: 'Emisor ejemplo',
      currency_id: 3,
      isin_code_id: 10,
      nemotechnic: 'ETF001',
      status_id: 1,
      etf_number: 1,
    }

    // Act
    const result = await store._createDividendLocal(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}/new`, payload)
    expect(result).toBe(false)
  })

  it('should fetch an operational etf by ID', async () => {
    // Arrange
    const store = useDividendLocalStoreV1()
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
    const response = await store._getDividendLocal(id)
    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/${id}/show`)
    expect(response).toBe(true)
  })

  it('should handle error when fetching an operational etf by ID', async () => {
    // Arrange
    const store = useDividendLocalStoreV1()
    const mockError = new Error('Network Error')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const id = 1
    // Act
    const response = await store._getDividendLocal(id)
    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/${id}/show`)
    expect(response).toBe(false)
  })

  it('should update an operational etf successfully', async () => {
    // Arrange
    const store = useDividendLocalStoreV1()
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
      description: 'ETF de prueba',
      index_type: 'Renta Fija',
      index_description: 'Índice de Bonos Nacionales',
      administrator_id: 4,
      admin_description: 'Administrador ejemplo',
      transmitter_id: 1,
      transmitter_description: 'Emisor ejemplo',
      currency_id: 3,
      isin_code_id: 10,
      nemotechnic: 'ETF001',
      status_id: 1,
      etf_number: 1,
    }

    // Act
    const result = await store._updateDividendLocal(id, payload)
    // Assert
    expect(mockPut).toHaveBeenCalledWith(`${URL_PATH}/${id}/update`, payload)
    expect(result).toBe(true)
  })

  it('should handle an operational etf update on false success', async () => {
    // Arrange
    const store = useDividendLocalStoreV1()
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
      description: 'ETF de prueba',
      index_type: 'Renta Fija',
      index_description: 'Índice de Bonos Nacionales',
      administrator_id: 4,
      admin_description: 'Administrador ejemplo',
      transmitter_id: 1,
      transmitter_description: 'Emisor ejemplo',
      currency_id: 3,
      isin_code_id: 10,
      nemotechnic: 'ETF001',
      status_id: 1,
      etf_number: 1,
    }
    // Act
    const result = await store._updateDividendLocal(id, payload)
    // Assert
    expect(mockPut).toHaveBeenCalledWith(`${URL_PATH}/${id}/update`, payload)
    expect(result).toBe(false)
  })

  it('should handle error when updating an operational etf', async () => {
    // Arrange
    const store = useDividendLocalStoreV1()
    const mockResponse = new Error('Network Error')
    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const id = 1
    const payload = {
      description: 'ETF de prueba',
      index_type: 'Renta Fija',
      index_description: 'Índice de Bonos Nacionales',
      administrator_id: 4,
      admin_description: 'Administrador ejemplo',
      transmitter_id: 1,
      transmitter_description: 'Emisor ejemplo',
      currency_id: 3,
      isin_code_id: 10,
      nemotechnic: 'ETF001',
      status_id: 1,
      etf_number: 1,
    }
    // Act
    const result = await store._updateDividendLocal(id, payload)
    // Assert
    expect(mockPut).toHaveBeenCalledWith(`${URL_PATH}/${id}/update`, payload)
    expect(result).toBe(false)
  })

  it('should toggle operational etf status successfully', async () => {
    // Arrange
    const store = useDividendLocalStoreV1()
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
    const result = await store._updateDividendLocalStatus(id)
    // Assert
    expect(mockPatch).toHaveBeenCalledWith(`${URL_PATH}/${id}/toggle-status`)
    expect(result).toBe(true)
  })

  it('should handle toggle operational etf statuson false success', async () => {
    // Arrange
    const store = useDividendLocalStoreV1()
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
    const result = await store._updateDividendLocalStatus(id)
    // Assert
    expect(mockPatch).toHaveBeenCalledWith(`${URL_PATH}/${id}/toggle-status`)
    expect(result).toBe(false)
  })

  it('should handle error when updating an operational etf', async () => {
    // Arrange
    const store = useDividendLocalStoreV1()
    const mockResponse = new Error('Network Error')
    const mockPatch = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

    const id = 1
    // Act
    const result = await store._updateDividendLocalStatus(id)
    // Assert
    expect(mockPatch).toHaveBeenCalledWith(`${URL_PATH}/${id}/toggle-status`)
    expect(result).toBe(false)
  })
})
