import { executeApi } from '@/apis'
import { setActivePinia, createPinia } from 'pinia'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { useCollectionsConceptsV1 } from './collections-concepts-v1'

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
  return {
    useAlert,
    useShowError,
    showAlertMock,
    showCatchErrorMock,
  }
})

describe('useCollectionsConceptsV1', () => {
  let store: ReturnType<typeof useCollectionsConceptsV1>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useCollectionsConceptsV1()

    jest.clearAllMocks()
  })

  it('should call showAlert with correct arguments on successful _getCollectionConceptsList', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: {
          data: [{ id: 2, name: 'Balance 2' }],
          current_page: 2,
          last_page: 10,
        },
        message: 'Datos obtenidos correctamente',
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const showAlertMock = require('@/composables').showAlertMock

    await store._getCollectionConceptsList('&filter[period]=2024-01')
    expect(showAlertMock).toHaveBeenCalledWith(
      'Datos obtenidos correctamente',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('should call showAlert with error type when _getCollectionConceptsList response is unsuccessful', async () => {
    const mockResponse = {
      data: {
        success: false,
        data: {
          data: [],
          current_page: 0,
          last_page: 0,
        },
        message: 'Error al obtener datos',
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const showAlertMock = require('@/composables').showAlertMock

    await store._getCollectionConceptsList('&filter[period]=2024-01')
    expect(showAlertMock).toHaveBeenCalledWith(
      'Error al obtener datos',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('should call showAlert with correct arguments on successful _createCollectionConcepts', async () => {
    const payload = { id: 3, name: 'Nuevo concepto' }
    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Creado correctamente',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const showAlertMock = require('@/composables').showAlertMock

    await store._createCollectionConcepts(payload as any)
    expect(showAlertMock).toHaveBeenCalledWith(
      'Creado correctamente',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('should call showAlert with error type on failed _createCollectionConcepts', async () => {
    const payload = { id: 4, name: 'Concepto fallido' }
    const mockPost = jest.fn().mockRejectedValue(new Error('Error de creación'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const showAlertMock = require('@/composables').showAlertMock
    const showCatchErrorMock = require('@/composables').showCatchErrorMock

    await store._createCollectionConcepts(payload as any)
    expect(showAlertMock).toHaveBeenCalledWith(
      showCatchErrorMock(new Error('Error de creación')),
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('should call showAlert with correct arguments on successful _updateCollectionConcepts', async () => {
    const payload = { id: 5, name: 'Concepto actualizado' }
    const mockPut = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Actualizado correctamente',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const showAlertMock = require('@/composables').showAlertMock

    await store._updateCollectionConcepts(5, payload)
    expect(showAlertMock).toHaveBeenCalledWith(
      'Actualizado correctamente',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('should call showAlert with error type on failed _updateCollectionConcepts', async () => {
    const payload = { id: 6, name: 'Concepto no actualizado' }
    const mockPut = jest
      .fn()
      .mockRejectedValue(new Error('Error de actualización'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const showAlertMock = require('@/composables').showAlertMock
    const showCatchErrorMock = require('@/composables').showCatchErrorMock

    await store._updateCollectionConcepts(6, payload)
    expect(showAlertMock).toHaveBeenCalledWith(
      showCatchErrorMock(new Error('Error de actualización')),
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('should call showAlert with correct arguments on successful _deleteCollectionConcepts', async () => {
    const mockDelete = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Eliminado correctamente',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const showAlertMock = require('@/composables').showAlertMock

    await store._deleteCollectionConcepts(7)
    expect(showAlertMock).toHaveBeenCalledWith(
      'Eliminado correctamente',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('should call showAlert with error type on failed _deleteCollectionConcepts', async () => {
    const mockDelete = jest
      .fn()
      .mockRejectedValue(new Error('Error de eliminación'))
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const showAlertMock = require('@/composables').showAlertMock
    const showCatchErrorMock = require('@/composables').showCatchErrorMock

    await store._deleteCollectionConcepts(8)
    expect(showAlertMock).toHaveBeenCalledWith(
      showCatchErrorMock(new Error('Error de eliminación')),
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('should return false for success when _deleteCollectionConcepts response is unsuccessful', async () => {
    const mockDelete = jest.fn().mockResolvedValue({
      data: {
        success: false,
        message: 'No se pudo eliminar',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const showAlertMock = require('@/composables').showAlertMock
    const { showCatchErrorMock } = require('@/composables')

    const result = await store._deleteCollectionConcepts(1)
    expect(showAlertMock).not.toHaveBeenCalledWith(
      showCatchErrorMock(new Error('Error al obtener por ID')),
      'error',
      undefined,
      TIMEOUT_ALERT
    )
    expect(result).toBe(false)
  })

  it('should call showAlert with correct arguments on successful _getByIdCollectionConcepts', async () => {
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: { id: 9, name: 'Concepto por ID' },
        message: 'Obtenido correctamente',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const showAlertMock = require('@/composables').showAlertMock

    await store._getByIdCollectionConcepts(9)
    expect(showAlertMock).toHaveBeenCalledWith(
      'Obtenido correctamente',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('should call showAlert with error type on failed _getByIdCollectionConcepts', async () => {
    const mockGet = jest
      .fn()
      .mockRejectedValue(new Error('Error al obtener por ID'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const showAlertMock = require('@/composables').showAlertMock
    const showCatchErrorMock = require('@/composables').showCatchErrorMock

    await store._getByIdCollectionConcepts(10)
    expect(showAlertMock).toHaveBeenCalledWith(
      showCatchErrorMock(new Error('Error al obtener por ID')),
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('should not mutate original object when setting data_information_form', () => {
    const data = { id: 11, name: 'Concepto original' }
    store._setDataCollectionsConcepts(data)
    expect(store.data_information_form).not.toBe(data)
    expect(store.data_information_form).toEqual(data)
  })

  it('should set error_information_form with parsed data when valid JSON is provided', () => {
    const mockData = JSON.stringify({ message: 'Error de prueba' })

    store._dataBasicError(mockData)

    expect(store.error_information_form).toEqual({ message: 'Error de prueba' })
  })
})
