import { setActivePinia, createPinia } from 'pinia'
import { useAccountStructuresV1 } from './account-structures-v1'
import { executeApi } from '@/apis'

const URL_PATH = 'accounting/api/accounting/account-structures'
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

describe('useAccountStructures', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should fetch account structure list and update state on success', async () => {
    // Arrange
    const store = useAccountStructuresV1()
    const mockResponse = {
      data: {
        success: true,
        data: {
          current_page: 1,
          data: [
            {
              id: 10,
              code: '010',
              structure: '0.0.00.00.00.00.00.00',
              purpose: 'Contable fondos de inversion',
              type: {
                value: 'Catálogo de cuentas contables',
                name: 'ACCOUNTING_ACCOUNTS',
              },
              status: {
                id: 2,
                name: 'Inactivo',
              },
              catalog_limits: [
                {
                  id: 3,
                  code: '002',
                  description: 'Pasivo',
                  nature: {
                    value: 'Crédito',
                    name: 'CREDIT',
                  },
                  type: {
                    value: 'Balance',
                    name: 'BALANCE',
                  },
                  group: {
                    value: 'Ingresos',
                    name: 'INCOME',
                  },
                  from_account: '61',
                  to_account: '63',
                },
              ],
              created_at: '2025-05-06 16:51:31',
            },
          ],
          last_page: 1,
          per_page: 20,
        },
        message: 'Listado obtenido exitosamente.',
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = '&filter[search]=Contable'

    // Act
    await store._getListAction(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1${params}`)
    expect(store.account_structures_list).toEqual(mockResponse.data.data.data)
  })

  it('should handle error when fetching account structure list', async () => {
    // Arrange
    const store = useAccountStructuresV1()
    const mockError = new Error('Network Error')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = '&filter[search]=Contable'

    // Act
    await store._getListAction(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1${params}`)
    expect(store.account_structures_list).toEqual([])
  })

  it('should handle response.data as undefined when fetching the account structure list', async () => {
    // Arrange
    const store = useAccountStructuresV1()
    const mockResponse = { data: undefined }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = '&filter[description]=test'

    // Act
    await store._getListAction(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1${params}`)
    expect(store.account_structures_list).toEqual([])
    expect(store.account_structures_pages.currentPage).toBe(0)
    expect(store.account_structures_pages.lastPage).toBe(0)
  })

  it('should handle response.data as null when fetching the account structure list', async () => {
    // Arrange
    const store = useAccountStructuresV1()
    const mockResponse = { data: null }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = '&filter[description]=test'

    // Act
    await store._getListAction(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1${params}`)
    expect(store.account_structures_list).toEqual([])
    expect(store.account_structures_pages.currentPage).toBe(0)
    expect(store.account_structures_pages.lastPage).toBe(0)
  })

  it('should create an account structure successfully', async () => {
    // Arrange
    const store = useAccountStructuresV1()
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
      catalog_limits: [],
      purpose: 'Contable fondos de inversión',
      status_id: 1,
      structure: '0',
      type: 'Catálogo de centros de costo',
    }

    // Act
    const result = await store._createAccountStructure(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}`, payload)
    expect(result).toBe(true)
  })

  it('should handle error when creating an account structure', async () => {
    // Arrange
    const store = useAccountStructuresV1()
    const mockError = {
      response: {
        data: {
          message: 'Ocurrío un error al crear la estructura de cuenta',
        },
      },
    }
    const mockPost = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = {
      purpose: 'Contable fondos de inversión',
      status_id: 1,
      structure: '0',
      type: 'Catálogo de centros de costo',
      catalog_limits: [
        {
          description: 'Activos Corrientes',
          nature: 'Débito',
          type: 'Balance',
          group: 'Activo',
          from_account: '1000',
          to_account: '1999',
        },
      ],
    }

    // Act
    const result = await store._createAccountStructure(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}`, payload)
    expect(result).toBe(false)
  })

  it('should fetch an account structure by ID', async () => {
    // Arrange
    const store = useAccountStructuresV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Registro obtenido exitosamente.',
        data: {
          id: 11,
          code: '011',
          structure: '0.0.00.00.00.00.00.00.00',
          purpose: 'Contable fondos de inversión',
          type: {
            value: 'Catálogo de centros de costo',
            name: 'COST_CENTERS',
          },
          status: {
            id: 1,
            name: 'Activo',
          },
          catalog_limits: [],
        },
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const id = 1
    // Act
    const response = await store._getAccountStructure(id)
    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/${id}`)
    expect(response).toEqual(mockResponse.data.data)
  })

  it('should handle error when fetching an account structure by ID', async () => {
    // Arrange
    const store = useAccountStructuresV1()
    const mockError = new Error('Network Error')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const id = 1
    // Act
    const response = await store._getAccountStructure(id)
    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/${id}`)
    expect(response).toBeNull()
  })

  it('should update an account structure successfully', async () => {
    // Arrange
    const store = useAccountStructuresV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Estructura de cuenta actualizada exitosamente.',
      },
    }
    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const id = 1
    const payload = {
      structure: 'Estructura ejemplo modificada',
      purpose: 'Finalidad de ejemplo modificada',
      type: 'Catálogo de conceptos recaudo',
      status_id: 2,
      catalog_limits: [],
    }
    // Act
    const result = await store._updateAccountStructure(id, payload)
    // Assert
    expect(mockPut).toHaveBeenCalledWith(`${URL_PATH}/${id}`, payload)
    expect(result).toBe(true)
  })

  it('should handle error when updating an account structure', async () => {
    // Arrange
    const store = useAccountStructuresV1()
    const mockResponse = new Error('Network Error')
    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const id = 1
    const payload = {
      structure: 'Estructura ejemplo modificada',
      purpose: 'Finalidad de ejemplo modificada',
      type: 'Catálogo de conceptos recaudo',
      status_id: 2,
      catalog_limits: [],
    }
    // Act
    const result = await store._updateAccountStructure(id, payload)
    // Assert
    expect(mockPut).toHaveBeenCalledWith(`${URL_PATH}/${id}`, payload)
    expect(result).toBe(false)
  })

  it('should update an account structure status successfully', async () => {
    // Arrange
    const store = useAccountStructuresV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Estado actualizado exitosamente.',
      },
    }
    const mockPatch = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

    const id = 1
    const accountStructure = {
      id: 1,
      code: '001',
      structure: 'Estructura ejemplo modificada',
      purpose: 'Finalidad de ejemplo modificada',
      type: {
        value: 'Catálogo de conceptos recaudo',
        name: 'ACCOUNTING_ACCOUNTS',
      },
      status: {
        id: 1,
        name: 'Activo',
      },
      catalog_limits: [],
    }
    const payload = {
      status_id: 2,
    }
    // Act
    store._selectAccountStructure(accountStructure)
    const result = await store._toggleAccountStructureStatus()
    // Assert
    expect(mockPatch).toHaveBeenCalledWith(`${URL_PATH}/${id}/status`, payload)
    expect(result).toBe(true)
  })

  it('should handle error when updating account structure status', async () => {
    // Arrange
    const store = useAccountStructuresV1()
    const mockResponse = new Error('Network Error')
    const mockPatch = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

    const id = 1
    const accountStructure = {
      id: 1,
      code: '001',
      structure: 'Estructura ejemplo modificada',
      purpose: 'Finalidad de ejemplo modificada',
      type: {
        value: 'Catálogo de conceptos recaudo',
        name: 'ACCOUNTING_ACCOUNTS',
      },
      status: {
        id: 1,
        name: 'Activo',
      },
      catalog_limits: [],
    }
    const payload = {
      status_id: 2,
    }
    // Act
    store._selectAccountStructure(accountStructure)
    const result = await store._toggleAccountStructureStatus()
    // Assert
    expect(mockPatch).toHaveBeenCalledWith(`${URL_PATH}/${id}/status`, payload)
    expect(result).toBe(false)
  })
})
