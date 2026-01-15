import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { useManualUnitValueStoreV1 } from './manual-unit-value-v1'

jest.mock('@/composables', () => {
  const showAlertMock = jest.fn()
  const showCatchErrorMock = jest.fn().mockReturnValue('Error inesperado')
  return {
    useAlert: () => ({ showAlert: showAlertMock }),
    useShowError: () => ({ showCatchError: showCatchErrorMock }),
    __esModule: true,
    showAlertMock,
    showCatchErrorMock,
  }
})

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  })),
}))

describe('useManualUnitValueStoreV1', () => {
  let showAlertMock: jest.Mock
  let showCatchErrorMock: jest.Mock

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()

    const composables = require('@/composables')
    showAlertMock = composables.showAlertMock
    showCatchErrorMock = composables.showCatchErrorMock
  })

  it('should fetch the list successfully', async () => {
    const store = useManualUnitValueStoreV1()

    const mockResponse = {
      data: {
        success: true,
        message: 'Listado cargado',
        data: {
          data: [{ id: 1 }],
          current_page: 2,
          last_page: 5,
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction('&filter[year]=2025')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/manual-unit-value/list?paginate=1&filter[year]=2025`
    )
    expect(store.manual_unit_value_list).toEqual([{ id: 1 }])
    expect(store.manual_unit_value_pages).toEqual({ currentPage: 2, lastPage: 5 })
    expect(showAlertMock).toHaveBeenCalledWith('Listado cargado', 'success', undefined, expect.any(Number))
  })

  it('should handle error on _getListAction', async () => {
    const store = useManualUnitValueStoreV1()

    const mockGet = jest.fn().mockRejectedValue(new Error('Network error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction()

    expect(showCatchErrorMock).toHaveBeenCalled()
    expect(showAlertMock).toHaveBeenCalledWith('Error inesperado', 'error', undefined, expect.any(Number))
  })

  it('should fetch by ID and update form', async () => {
    const store = useManualUnitValueStoreV1()
    const responseMock = {
      data: {
        success: true,
        message: 'OK',
        data: { id: 99, emitter_id: 1000 },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(responseMock)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdManualUnitValue(99)

    expect(store.data_information_form).toEqual({ id: 99, emitter_id: 1000 })
    expect(showAlertMock).toHaveBeenCalledWith('OK', 'success', undefined, expect.any(Number))
  })

  it('should create a new unit value and return true', async () => {
    const store = useManualUnitValueStoreV1()

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Creado' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createManualUnitValue({ id: 1, emitter_id: 1000 })

    expect(result).toBe(true)
    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/manual-unit-value/new`,
      { id: 1, emitter_id: 1000 }
    )
    expect(showAlertMock).toHaveBeenCalledWith('Creado', 'success', undefined, expect.any(Number))
  })

  it('should handle error in _createManualUnitValue', async () => {
    const store = useManualUnitValueStoreV1()

    const mockPost = jest.fn().mockRejectedValue(new Error('Error interno'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createManualUnitValue({ id: 1, emitter_id: 1000 })

    expect(result).toBe(false)
    expect(showCatchErrorMock).toHaveBeenCalled()
    expect(showAlertMock).toHaveBeenCalledWith('Error inesperado', 'error', undefined, expect.any(Number))
  })

  it('should delete item and return true', async () => {
    const store = useManualUnitValueStoreV1()

    const mockDelete = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Eliminado' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const result = await store._deleteManualUnitValue(10)

    expect(result).toBe(true)
    expect(mockDelete).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/manual-unit-value/destroy/10`
    )
    expect(showAlertMock).toHaveBeenCalledWith('Eliminado', 'success', undefined, expect.any(Number))
  })

  it('should handle error in _deleteManualUnitValue', async () => {
    const store = useManualUnitValueStoreV1()

    const mockDelete = jest.fn().mockRejectedValue(new Error('Error al eliminar'))
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const result = await store._deleteManualUnitValue(10)

    expect(result).toBe(false)
    expect(showCatchErrorMock).toHaveBeenCalled()
    expect(showAlertMock).toHaveBeenCalledWith('Error inesperado', 'error', undefined, expect.any(Number))
  })

  it('should set data information form', () => {
    const store = useManualUnitValueStoreV1()
    const payload = { id: 2, emitter_id: 200 }

    store._setDataInformationForm(payload)

    expect(store.data_information_form).toEqual(payload)
  })

  it('should clean data', () => {
    const store = useManualUnitValueStoreV1()
    store.manual_unit_value_list = [{ id: 1 }]
    store.manual_unit_value_pages = { currentPage: 5, lastPage: 10 }

    store._cleanData()

    expect(store.manual_unit_value_list).toEqual([])
    expect(store.manual_unit_value_pages).toEqual({ currentPage: 0, lastPage: 0 })
  })
})
