import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'
import { useBankBranches } from './bank-branches-v1'
import { useAlert } from '@/composables'
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

describe('useBankBranches', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('debería obtener la lista de sucursales bancarias y actualizar el estado correctamente', async () => {
    const store = useBankBranches()
    const mockResponse = {
      data: {
        success: true,
        data: {
          data: [{ id: 1, name: 'Sucursal 1' }],
          current_page: 1,
          last_page: 2,
        },
        message: 'Datos obtenidos correctamente',
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = '&filter[status]=1'
    const id = 114
    // Act
    await store._getBankBranchesByEntitiesList(params, id)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/banking-entities/bank/branches/by-bank/${id}?paginate=1${params}`
    )
    expect(store.bank_branches_list).toEqual(mockResponse.data.data.data)
  })

  it('debería crear una sucursal bancaria y actualizar el estado correctamente', async () => {
    const store = useBankBranches()
    const mockResponse = {
      data: {
        success: true,
        data: [{ id: 1, name: 'Sucursal creada' }],
        message: 'Sucursal creada correctamente',
      },
    }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const params = { name: 'Sucursal creada' }
    // Act
    const result = await store._createBankBranches(params)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/banking-entities/bank/branches`,
      params
    )
    expect(store.bank_branches_list).toEqual(mockResponse.data.data)
    expect(result).toBe(true)
  })

  it('debería obtener una sucursal bancaria por ID y actualizar el estado correctamente', async () => {
    const store = useBankBranches()
    const mockResponse = {
      data: {
        success: true,
        data: { id: 1, name: 'Sucursal 1' },
        message: 'Sucursal obtenida correctamente',
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const id = 1
    // Act
    await store._getByIdBankBranches(id)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/banking-entities/bank/branches/${id}`
    )
    expect(store.bank_branches_request).toEqual(mockResponse.data.data)
  })

  it('debería actualizar una sucursal bancaria y devolver el estado de éxito', async () => {
    const store = useBankBranches()
    const mockResponse = {
      data: {
        success: true,
        message: 'Sucursal actualizada correctamente',
      },
    }
    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const id = 1
    const payload = { name: 'Sucursal actualizada' }
    // Act
    const result = await store._updateBankBranches(id, payload)

    // Assert
    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/banking-entities/bank/branches/${id}`,
      payload
    )
    expect(result).toBe(true)
  })

  it('debería eliminar una sucursal bancaria correctamente', async () => {
    const store = useBankBranches()
    const mockDelete = jest.fn().mockResolvedValue({})
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const id = 1
    // Act
    await store._deleteBankBranches(id)

    // Assert
    expect(mockDelete).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/banking-entities/bank/branches/${id}`
    )
  })

  it('debería manejar errores al obtener una sucursal bancaria por ID', async () => {
    const store = useBankBranches()
    const error = new Error('Error al obtener la sucursal')
    const mockGet = jest.fn().mockRejectedValue(error)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const id = 1
    // Act
    await store._getByIdBankBranches(id)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/banking-entities/bank/branches/${id}`
    )
    const { showCatchErrorMock } = require('@/composables')
    expect(useAlert().showAlert).toHaveBeenCalledWith(
      showCatchErrorMock(error),
      'error',
      undefined,
      3000
    )
  })

  it('debería manejar errores al actualizar una sucursal bancaria', async () => {
    const store = useBankBranches()
    const error = new Error('Error al actualizar la sucursal')
    const mockPut = jest.fn().mockRejectedValue(error)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const id = 1
    const payload = { name: 'Sucursal actualizada' }
    // Act
    const result = await store._updateBankBranches(id, payload)

    // Assert
    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/banking-entities/bank/branches/${id}`,
      payload
    )
    const { showCatchErrorMock } = require('@/composables')

    expect(useAlert().showAlert).toHaveBeenCalledWith(
      showCatchErrorMock(error),
      'error',
      undefined,
      3000
    )
    expect(result).toBe(false)
  })

  it('debería manejar errores al eliminar una sucursal bancaria', async () => {
    const store = useBankBranches()
    const error = new Error('Error al eliminar la sucursal')
    const mockDelete = jest.fn().mockRejectedValue(error)
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const id = 1
    // Act
    await store._deleteBankBranches(id)

    // Assert
    expect(mockDelete).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/banking-entities/bank/branches/${id}`
    )
    const { showCatchErrorMock } = require('@/composables')

    expect(useAlert().showAlert).toHaveBeenCalledWith(
      showCatchErrorMock(error),
      'error',
      undefined,
      3000
    )
  })

  it('should set data_information_form with provided data', () => {
    // Arrange
    const store = useBankBranches()
    const mockData = {
      description: '12212121',
      nit: 15,
      bank_code: '1123',
      status: 0,
      code: '',
    }

    // Act
    store._setDataBasicBankBranches(mockData)

    // Assert
    expect(store.data_information_form).toEqual(mockData)
  })

  it('should set data_information_form to null when no data is provided', () => {
    // Arrange
    const store = useBankBranches()

    // Act
    store._setDataBasicBankBranches(null)

    // Assert
    expect(store.data_information_form).toBeNull()
  })
  it('debería manejar errores al obtener la lista de sucursales bancarias', async () => {
    const store = useBankBranches()
    const error = new Error('Error al obtener la lista de sucursales')
    const mockGet = jest.fn().mockRejectedValue(error)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = '&filter[status]=1'
    const id = 114

    // Act
    await store._getBankBranchesByEntitiesList(params, id)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/banking-entities/bank/branches/by-bank/${id}?paginate=1${params}`
    )
    const { showCatchErrorMock } = require('@/composables')

    expect(useAlert().showAlert).toHaveBeenCalledWith(
      showCatchErrorMock(error),
      'error',
      undefined,
      3000
    )
  })

  it('debería manejar errores al crear una sucursal bancaria', async () => {
    const store = useBankBranches()
    const error = new Error('Error al crear la sucursal')
    const mockPost = jest.fn().mockRejectedValue(error)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const params = { name: 'Sucursal Nueva' }

    // Act
    const result = await store._createBankBranches(params)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/banking-entities/bank/branches`,
      params
    )
    const { showCatchErrorMock } = require('@/composables')

    expect(useAlert().showAlert).toHaveBeenCalledWith(
      showCatchErrorMock(error),
      'error',
      undefined,
      3000
    )
    expect(result).toBe(false)
  })
})
