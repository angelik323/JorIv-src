import { setActivePinia, createPinia } from 'pinia'
import { usePeriodClosureParametersV2 } from './period-closure-parameters-v2'
import { executeApi } from '@/apis'

const URL_PATH = 'accounting/api/accounting/v2/accounting-closing-parameters'
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

describe('usePeriodClosureParameters', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should fetch period closure parameter list and update state on success', async () => {
    // Arrange
    const store = usePeriodClosureParametersV2()
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

    const params = { 'filter[search]': '23' }

    // Act
    await store._getPeriodClosureParameterList(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
      params: {
        ...params,
        paginate: 1,
      },
    })
    expect(store.period_closure_parameter_list).toEqual(
      mockResponse.data.data.data
    )
  })

  it('should not update list when success is false', async () => {
    const store = usePeriodClosureParametersV2()
    const mockResponse = {
      data: {
        success: false,
        data: {
          current_page: 1,
          data: [],
          last_page: 1,
        },
        message: 'Error al obtener listado.',
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = { 'filter[search]': '23' }
    await store._getPeriodClosureParameterList(params)

    expect(store.period_closure_parameter_list).toEqual([])
  })

  it('should handle error when fetching period closure parameter list', async () => {
    // Arrange
    const store = usePeriodClosureParametersV2()
    const mockError = new Error('Network Error')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = { 'filter[search]': '23' }

    // Act
    await store._getPeriodClosureParameterList(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
      params: {
        ...params,
        paginate: 1,
      },
    })
    expect(store.period_closure_parameter_list).toEqual([])
  })

  it('should handle response.data as undefined when fetching the period closure parameter list', async () => {
    // Arrange
    const store = usePeriodClosureParametersV2()
    const mockResponse = { data: undefined }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = { 'filter[search]': '23' }

    // Act
    await store._getPeriodClosureParameterList(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
      params: {
        ...params,
        paginate: 1,
      },
    })
    expect(store.period_closure_parameter_list).toEqual([])
    expect(store.period_closure_parameter_pages.currentPage).toBe(0)
    expect(store.period_closure_parameter_pages.lastPage).toBe(0)
  })

  it('should handle response.data as null when fetching the period closure parameter list', async () => {
    // Arrange
    const store = usePeriodClosureParametersV2()
    const mockResponse = { data: null }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = { 'filter[search]': '23' }

    // Act
    await store._getPeriodClosureParameterList(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
      params: {
        ...params,
        paginate: 1,
      },
    })
    expect(store.period_closure_parameter_list).toEqual([])
    expect(store.period_closure_parameter_pages.currentPage).toBe(0)
    expect(store.period_closure_parameter_pages.lastPage).toBe(0)
  })

  it('should create a period closure parameter successfully', async () => {
    // Arrange
    const store = usePeriodClosureParametersV2()
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
      structure_id: 1,
      parameters: {
        daily_parameters: [],
        monthly_parameters: [],
        yearly_parameters: [],
      },
    }

    // Act
    const result = await store._createPeriodClosureParameter(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}`, payload)
    expect(result).toBe(true)
  })

  it('should handle error when creating a period closure parameter', async () => {
    // Arrange
    const store = usePeriodClosureParametersV2()
    const mockError = {
      response: {
        data: {
          message:
            'Ocurrío un error al crear el parámetro de cierre de periodo',
        },
      },
    }
    const mockPost = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = {
      structure_id: 1,
      parameters: {
        daily_parameters: [],
        monthly_parameters: [],
        yearly_parameters: [],
      },
    }

    // Act
    const result = await store._createPeriodClosureParameter(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}`, payload)
    expect(result).toBe(false)
  })

  it('should fetch a period closure parameter by ID', async () => {
    // Arrange
    const store = usePeriodClosureParametersV2()
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
    const response = await store._getPeriodClosureParameter(id)
    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/${id}`)
    expect(response).toBe(null)
  })

  it('should not update store when get by ID fails with success false', async () => {
    const store = usePeriodClosureParametersV2()
    const mockResponse = {
      data: {
        success: false,
        data: {},
        message: 'No se encontró el registro.',
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const id = 1
    const result = await store._getPeriodClosureParameter(id)

    expect(result).toBe(null)
  })

  it('should handle error when fetching a period closure parameter by ID', async () => {
    // Arrange
    const store = usePeriodClosureParametersV2()
    const mockError = new Error('Network Error')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const id = 1
    // Act
    const response = await store._getPeriodClosureParameter(id)
    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/${id}`)
    expect(response).toBe(null)
  })

  it('should update a period closure parameter successfully', async () => {
    // Arrange
    const store = usePeriodClosureParametersV2()
    const mockResponse = {
      data: {
        success: true,
        message: 'Parámetro de cierre de cuenta actualizado exitosamente.',
      },
    }
    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const id = 1
    const payload = {
      structure_id: 1,
      parameters: {
        daily_parameters: [],
        monthly_parameters: [],
        yearly_parameters: [],
      },
    }
    // Act
    const result = await store._updatePeriodClosureParameter(id, payload)
    // Assert
    expect(mockPut).toHaveBeenCalledWith(`${URL_PATH}/${id}`, payload)
    expect(result).toBe(true)
  })

  it('should handle error when updating a period closure parameter', async () => {
    // Arrange
    const store = usePeriodClosureParametersV2()
    const mockResponse = new Error('Network Error')
    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const id = 1
    const payload = {
      structure_id: 1,
      parameters: {
        daily_parameters: [],
        monthly_parameters: [],
        yearly_parameters: [],
      },
    }
    // Act
    const result = await store._updatePeriodClosureParameter(id, payload)
    // Assert
    expect(mockPut).toHaveBeenCalledWith(`${URL_PATH}/${id}`, payload)
    expect(result).toBe(false)
  })
})
