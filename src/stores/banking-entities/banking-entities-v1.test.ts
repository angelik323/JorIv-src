import { setActivePinia, createPinia } from 'pinia'
import { useBankingEntities } from './banking-entities-v1'
import { executeApi } from '@/apis'
import { IBankEntity, IBankingEntitiesList } from '@/interfaces/customs'

const URL_PATH_TREASURIES = 'treasuries/api/treasuries'
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

describe('useBankingEntities', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should fetch banking entities list and update state on success', async () => {
    // Arrange
    const store = useBankingEntities()
    const mockResponse = {
      data: {
        success: true,
        message: 'Listado obtenido exitosamente.',
        data: {
          data: [
            {
              id: 1,
              description: 'Bancolombia',
              type: 'Banco',
              accounting_account: '111005',
              status_id: 1,
              code: '07',
              bank_code: null,
              third_party_id: 1,
              has_movements: false,
            },
          ],
          current_page: 1,
          last_page: 2,
        },
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = '&filter[description]=test'

    // Act
    await store._getBankingEntitiesList(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/banking-entities/banks?paginate=1${params}`
    )
    expect(store.banking_entities_list).toEqual(mockResponse.data.data.data)
  })

  it('should handle error when fetching banking entities list', async () => {
    // Arrange
    const store = useBankingEntities()
    const mockError = new Error('Network Error')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = '&filter[description]=test'

    // Act
    await store._getBankingEntitiesList(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/banking-entities/banks?paginate=1${params}`
    )
    expect(store.banking_entities_list).toEqual([])
  })

  it('should handle response.data as undefined when fetching the banking entities list', async () => {
    // Arrange
    const store = useBankingEntities()
    const mockResponse = { data: undefined }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = '&filter[description]=test'

    // Act
    await store._getBankingEntitiesList(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/banking-entities/banks?paginate=1${params}`
    )
    expect(store.banking_entities_list).toEqual([])
    expect(store.banking_entities_pages.currentPage).toBe(0)
    expect(store.banking_entities_pages.lastPage).toBe(0)
  })

  it('should handle response.data as null when fetching the banking entities list', async () => {
    // Arrange
    const store = useBankingEntities()
    const mockResponse = { data: null }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = '&filter[description]=test'

    // Act
    await store._getBankingEntitiesList(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/banking-entities/banks?paginate=1${params}`
    )
    expect(store.banking_entities_list).toEqual([])
    expect(store.banking_entities_pages.currentPage).toBe(0)
    expect(store.banking_entities_pages.lastPage).toBe(0)
  })

  it('should create a banking entity successfully', async () => {
    // Arrange
    const store = useBankingEntities()
    const mockResponse = {
      data: {
        success: true,
        message: 'Entidad bancaria creada exitosamente.',
      },
    }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = { description: 'Bancolombia', type: 'Banco' }

    // Act
    const result = await store._createBankingEntities(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      'treasuries/api/treasuries/banking-entities/banks/save',
      payload
    )
    expect(result).toBe(true)
  })

  it('should handle error with a valid message when creating a banking entity', async () => {
    // Arrange
    const store = useBankingEntities()
    const mockError = {
      response: {
        data: {
          message:
            'El código bancario ya ha sido asignado al banco 2221 ZXCZXCZX',
        },
      },
    }
    const mockPost = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = {
      description: 'PROBANDO BANCO CARTAGENA',
      third_party_id: 15,
      bank_code: '2221',
      type: 'Banco',
      justification: '',
      validated: true,
      status_id: 1,
    }

    // Act
    const result = await store._createBankingEntities(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      'treasuries/api/treasuries/banking-entities/banks/save',
      payload
    )
    expect(result).toBe(false)
    expect(store.error_information_form).toBe(
      'El código bancario ya ha sido asignado al banco 2221 ZXCZXCZX'
    )
  })

  it('should handle error with an invalid message when creating a banking entity', async () => {
    // Arrange
    const store = useBankingEntities()
    const mockError = {
      response: {
        data: {
          message: null,
        },
      },
    }
    const mockPost = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = { description: 'Bancolombia', type: 'Banco' }

    // Act
    const result = await store._createBankingEntities(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      'treasuries/api/treasuries/banking-entities/banks/save',
      payload
    )
    expect(result).toBe(false)
    expect(store.error_information_form).toBe(null)
  })

  it('should fetch a banking entity by ID and update state on success', async () => {
    // Arrange
    const store = useBankingEntities()
    const mockResponse = {
      data: {
        success: true,
        message: 'Entidad bancaria obtenida exitosamente.',
        data: {
          id: 1,
          description: 'Bancolombia',
          type: 'Banco',
          accounting_account: '111005',
          status_id: 1,
          code: '07',
          bank_code: null,
          third_party_id: 1,
          has_movements: false,
        },
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const id = 1

    // Act
    await store._getByIdBankingEntities(id)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/banking-entities/banks/${id}`
    )
    expect(store.bank_receipt_request).toEqual(mockResponse.data.data)
  })

  it('should handle error when fetching a banking entity by ID', async () => {
    // Arrange
    const store = useBankingEntities()
    const mockError = new Error('Network Error')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const id = 1

    // Act
    await store._getByIdBankingEntities(id)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/banking-entities/banks/${id}`
    )
    expect(store.bank_receipt_request).toBeNull()
  })

  it('should update a banking entity successfully', async () => {
    // Arrange
    const store = useBankingEntities()
    const mockResponse = {
      data: {
        success: true,
        message: 'Entidad bancaria actualizada exitosamente.',
      },
    }
    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const id = 1
    const payload = { description: 'Bancolombia Actualizado', type: 'Banco' }

    // Act
    const result = await store._updateBankingEntities(id, payload)

    // Assert
    expect(mockPut).toHaveBeenCalledWith(
      'treasuries/api/treasuries/banking-entities/banks/save/1',
      payload
    )
    expect(result).toBe(true)
  })

  it('should set data_information_form with provided data', () => {
    // Arrange
    const store = useBankingEntities()
    const mockData: IBankEntity = {
      description: '12212121',
      nit: 15,
      bank_code: '1123',
      status: 0,
      code: '',
    }

    // Act
    store._setDataBasicBankingEntitie(mockData)

    // Assert
    expect(store.data_information_form).toEqual(mockData)
  })

  it('should set data_information_form to null when no data is provided', () => {
    // Arrange
    const store = useBankingEntities()

    // Act
    store._setDataBasicBankingEntitie(null)

    // Assert
    expect(store.data_information_form).toBeNull()
  })

  it('should handle errors when delete type useBankingEntities', async () => {
    // Arrange
    const store = useBankingEntities()
    const mockDelete = jest.fn().mockRejectedValue(new Error('Error de API'))
    const params = 1

    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    // Act
    await store._deleteBankingEntities(params)

    // Assert
    expect(mockDelete).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/banking-entities/banks/${params}`
    )
  })

  it('should delete types collection', async () => {
    // Arrange
    const store = useBankingEntities()
    const mockDelete = jest.fn().mockResolvedValue({})
    const mockGet = 54

    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    // Act
    await store._deleteBankingEntities(mockGet)

    // Assert
    expect(mockDelete).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/banking-entities/banks/${mockGet}`
    )
  })

  // Test para _setBankReceiptRequest
  it('should set bank_receipt_request with provided data', () => {
    // Arrange
    const store = useBankingEntities()
    const mockData: IBankingEntitiesList = {
      id: 1,
      description: 'Banco de Prueba',
      type: 'Banco',
      accounting_account: '123456',
      code: '01',
      status: {
        id: 1,
        name: 'Activo',
      },
      nit: {
        id: 1,
        nit: '123456789',
      },
      bank_code: '001',
      has_movements: false,
      created_at: '',
      created_by: ''
    }

    // Act
    store._setBankReceiptRequest(mockData)

    // Assert
    expect(store.bank_receipt_request).toEqual(mockData)
  })

  it('should set bank_receipt_request to null when no data is provided', () => {
    // Arrange
    const store = useBankingEntities()

    // Act
    store._setBankReceiptRequest(null)

    // Assert
    expect(store.bank_receipt_request).toBeNull()
  })

  it('should set error_information_form with parsed data when valid JSON is provided', () => {
    // Arrange
    const store = useBankingEntities()
    const mockData = JSON.stringify({ message: 'Error de prueba' })

    // Act
    store._dataBasicError(mockData)

    // Assert
    expect(store.error_information_form).toEqual({ message: 'Error de prueba' })
  })

  it('should set error_information_form to null when null is provided', () => {
    // Arrange
    const store = useBankingEntities()

    // Act
    store._dataBasicError(null)

    // Assert
    expect(store.error_information_form).toBeNull()
  })
})
