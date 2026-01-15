import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'
import { useDerivativeClassesStoreV1 } from './derivative-classes-v1'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { IDerivativeClassesToCreate } from '@/interfaces/customs/investment-portfolio/DerivativeClasses'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({
    showCatchError: jest.fn(() => 'Error capturado'),
  })),
  useUtils: jest.fn(() => ({
    defaultIconsLucide: { plusCircleOutline: 'plus-icon' },
  })),
}))

describe('useDerivativeClassesStoreV1', () => {
  const BASE_URL = `${URL_PATH_INVESTMENT_PORTFOLIO}/derivative-class`

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('lists data correctly on _getDerivateClassesList', async () => {
    const store = useDerivativeClassesStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Cargado correctamente',
        data: {
          data: [{ id: 1 }],
          current_page: 2,
          last_page: 5,
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getDerivateClassesList({ page: 2 })

    expect(mockGet).toHaveBeenCalledWith(BASE_URL, {
      params: { page: 2, paginate: 1 },
    })
    expect(store.derivative_classes_list).toEqual([{ id: 1 }])
    expect(store.derivate_classes_pages.currentPage).toBe(2)
    expect(store.derivate_classes_pages.lastPage).toBe(5)
  })

  it('handles error in _getDerivateClassesList', async () => {
    const store = useDerivativeClassesStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Falló petición'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getDerivateClassesList({ page: 1 })

    expect(mockGet).toHaveBeenCalled()
    expect(store.derivative_classes_list).toEqual([])
  })

  it('creates data correctly in _createDerivativeClasses', async () => {
    const store = useDerivativeClassesStoreV1()
    const payload = {
      code: 'CD001',
      derivative_type_id: 1,
      description: 'Clase Derivada',
      derivative_underlying_id: 1,
      currency_id: 1,
      operation_type: 'op',
      end_early: false,
      paper_type_id: 1,
      currency_payment_id: 1,
      badge_x_id: 1,
      badge_y_id: 1,
      rate_point_id: 1,
      rate_x_id: 1,
      rate_y_id: 1,
      status_id: 1,
    } as IDerivativeClassesToCreate

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Creado correctamente' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createDerivativeClasses(payload)

    expect(mockPost).toHaveBeenCalledWith(`${BASE_URL}`, payload)
    expect(result).toBe(true)
  })

  it('returns false on error in _createDerivativeClasses', async () => {
    const store = useDerivativeClassesStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('Error crear'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createDerivativeClasses(
      {} as IDerivativeClassesToCreate
    )

    expect(mockPost).toHaveBeenCalled()
    expect(result).toBe(false)
  })

  it('updates data correctly in _updateDerivativeClasses', async () => {
    const store = useDerivativeClassesStoreV1()
    const payload = {
      code: 'CD002',
      derivative_type_id: 1,
      description: 'Actualizado',
      derivative_underlying_id: 1,
      currency_id: 1,
      operation_type: 'op',
      end_early: false,
      paper_type_id: 1,
      currency_payment_id: 1,
      badge_x_id: 1,
      badge_y_id: 1,
      rate_point_id: 1,
      rate_x_id: 1,
      rate_y_id: 1,
      status_id: 1,
    } as IDerivativeClassesToCreate

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Actualizado correctamente' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateDerivativeClasses(payload, 10)

    expect(mockPut).toHaveBeenCalledWith(`${BASE_URL}/10`, payload)
    expect(result).toBe(true)
  })

  it('returns false on error in _updateDerivativeClasses', async () => {
    const store = useDerivativeClassesStoreV1()
    const mockPut = jest.fn().mockRejectedValue(new Error('Error update'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateDerivativeClasses(
      {} as IDerivativeClassesToCreate,
      99
    )

    expect(mockPut).toHaveBeenCalled()
    expect(result).toBe(false)
  })

  it('gets data correctly in _getDerivativeClassesById', async () => {
    const store = useDerivativeClassesStoreV1()
    const mockResponse = {
      data: { success: true, data: { id: 1 }, message: 'Encontrado' },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getDerivativeClassesById(1)

    expect(mockGet).toHaveBeenCalledWith(`${BASE_URL}/1`)
    expect(store.derivate_classes_response).toEqual({ id: 1 })
  })

  it('handles error in _getDerivativeClassesById', async () => {
    const store = useDerivativeClassesStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Error show'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getDerivativeClassesById(123)

    expect(mockGet).toHaveBeenCalled()
    expect(store.derivate_classes_response).toBeNull()
  })

  it('deletes data correctly in _deleteDerivativeClass', async () => {
    const store = useDerivativeClassesStoreV1()
    const mockDelete = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Eliminado' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    await store._deleteDerivativeClass(5)

    expect(mockDelete).toHaveBeenCalledWith(`${BASE_URL}/5`)
  })

  it('handles error in _deleteDerivativeClass', async () => {
    const store = useDerivativeClassesStoreV1()
    const mockDelete = jest.fn().mockRejectedValue(new Error('Error delete'))
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    await store._deleteDerivativeClass(5)

    expect(mockDelete).toHaveBeenCalled()
  })

  it('changes status correctly in _changeStatus', async () => {
    const store = useDerivativeClassesStoreV1()
    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Status cambiado' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    await store._changeStatus(1, 2)

    expect(mockPut).toHaveBeenCalledWith(`${BASE_URL}/1`, { status_id: 2 })
  })

  it('handles error in _changeStatus', async () => {
    const store = useDerivativeClassesStoreV1()
    const mockPut = jest.fn().mockRejectedValue(new Error('Error status'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    await store._changeStatus(1, 2)

    expect(mockPut).toHaveBeenCalled()
  })

  it('initializes store properties used by UI (version and header icon)', () => {
    const store = useDerivativeClassesStoreV1()
    expect(store.version).toBe('v1')
    expect(store.headerPropsDefault).toBeDefined()
    expect(store.headerPropsDefault.btn).toBeDefined()
    expect(store.headerPropsDefault.btn.icon).toBe('plus-icon')
  })
})
