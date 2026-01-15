import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'
import { useDerivativeInvestmentOperationStoreV1 } from './derivative-investment-operation-v1'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import {
  IDerivativeInvestmentOperationList,
  IDerivativeInvestmentOperationToCreate,
  IDerivativeInvestmentOperationView,
} from '@/interfaces/customs'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({
    showCatchError: jest.fn(() => 'Error capturado'),
  })),
}))

describe('useDerivativeInvestmentOperationStoreV1', () => {
  const BASE_URL = `${URL_PATH_INVESTMENT_PORTFOLIO}/forward-operation`

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('lists data correctly on _getDerivativeInvestmentOperationList', async () => {
    const store = useDerivativeInvestmentOperationStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Cargado correctamente',
        data: {
          data: [{ id: 1 }] as IDerivativeInvestmentOperationList[],
          current_page: 2,
          last_page: 5,
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getDerivativeInvestmentOperationList('page=2')

    expect(mockGet).toHaveBeenCalledWith(`${BASE_URL}?page=2`)
    expect(store.derivative_investment_operation_list).toEqual({
      data: [{ id: 1 }],
      current_page: 2,
      last_page: 5,
    })
    expect(store.derivative_investment_operation_pages.currentPage).toBe(2)
    expect(store.derivative_investment_operation_pages.lastPage).toBe(5)
  })

  it('handles error in _getDerivativeInvestmentOperationList', async () => {
    const store = useDerivativeInvestmentOperationStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Falló petición'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getDerivativeInvestmentOperationList('page=1')

    expect(mockGet).toHaveBeenCalled()
    expect(store.derivative_investment_operation_list).toEqual([])
  })

  it('creates data correctly in _createDerivativeInvestmentOperation', async () => {
    const store = useDerivativeInvestmentOperationStoreV1()
    const payload = {
      /* campos mínimos de prueba */
      operation_type: 'op',
    } as Partial<IDerivativeInvestmentOperationToCreate>

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Creado correctamente' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createDerivativeInvestmentOperation(payload)

    expect(mockPost).toHaveBeenCalledWith(`${BASE_URL}`, payload)
    expect(result).toBe(true)
  })

  it('returns false on error in _createDerivativeInvestmentOperation', async () => {
    const store = useDerivativeInvestmentOperationStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('Error crear'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createDerivativeInvestmentOperation(
      {} as Partial<IDerivativeInvestmentOperationToCreate>
    )

    expect(mockPost).toHaveBeenCalled()
    expect(result).toBe(false)
  })

  it('gets data correctly in _getDerivativeInvestmentOperationById', async () => {
    const store = useDerivativeInvestmentOperationStoreV1()
    const mockResponse = {
      data: {
        success: true,
        data: { id: 1 } as unknown as IDerivativeInvestmentOperationView,
        message: 'Encontrado',
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getDerivativeInvestmentOperationById(1)

    expect(mockGet).toHaveBeenCalledWith(`${BASE_URL}/1/settlement`)
    expect(store.data_information_view).toEqual({ id: 1 })
  })

  it('handles error in _getDerivativeInvestmentOperationById', async () => {
    const store = useDerivativeInvestmentOperationStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Error show'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getDerivativeInvestmentOperationById(123)

    expect(mockGet).toHaveBeenCalled()
    expect(store.data_information_view).toBeNull()
  })

  it('settles correctly in _settlement', async () => {
    const store = useDerivativeInvestmentOperationStoreV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Liquidado' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = {
      forward_operation_id: 5,
    } as Partial<IDerivativeInvestmentOperationView>

    const result = await store._settlement(5, payload)

    expect(mockPost).toHaveBeenCalledWith(`${BASE_URL}/5/settled`, payload)
    expect(result).toBe(true)
  })

  it('handles error in _settlement', async () => {
    const store = useDerivativeInvestmentOperationStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('Error settle'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = {
      forward_operation_id: 5,
    } as Partial<IDerivativeInvestmentOperationView>

    const result = await store._settlement(5, payload)

    expect(mockPost).toHaveBeenCalled()
    expect(result).toBe(false)
  })

  it('clears data correctly with _clearData', () => {
    const store = useDerivativeInvestmentOperationStoreV1()
    store.derivative_investment_operation_list = [
      {
        id: 9,
        portfolio_code: '',
        description: '',
        forward_type: '',
        title_number: '',
        forward_number: '',
        creation_date: '',
        status: '',
      } as IDerivativeInvestmentOperationList,
    ]
    store.derivative_investment_operation_to_create = {
      created_by: 1,
      operation_type_id: null,
      operation_date: '',
      investment_portfolio_id: null,
      investment_portfolio_description: '',
      compliance_type: '',
      issuers_counterparty_id: null,
      derivative_class_id: null,
      paper_type_id: null,
      derivative_objective: '',
      coverage_type_id: null,
      badge_x_id: null,
      badge_y_id: null,
      currency_id: null,
      value_currency: 0,
      base_days: null,
      days: '',
      constitution_date: '',
      expiration_date: '',
      compliance_date: '',
      rate_spot_badge_y: 0,
      strike_badge_y: 0,
      spot_badge_y: 0,
      forward_badge_y: 0,
      fixed_agreed_rate: 0,
      agreed_value_badge_y: 0,
      status_id: 0,
    } as IDerivativeInvestmentOperationToCreate
    store.derivative_investment_operation_pages = {
      currentPage: 3,
      lastPage: 4,
    }
    store.data_information_view = {
      forward_operation_id: 9,
      title_id: 1,
      code: '',
      description: '',
      operation: '',
      value_currency: '',
      agree_rate: 0,
      spot_rate: 0,
      spot_date: '',
      differential: 0,
      usd: 0,
      cop: 0,
      liquidated: 0,
      payment_date: '',
    } as IDerivativeInvestmentOperationView

    store._clearData()

    expect(store.derivative_investment_operation_list).toEqual([])
    expect(store.derivative_investment_operation_to_create).toBeNull()
    expect(store.derivative_investment_operation_pages.currentPage).toBe(0)
    expect(store.derivative_investment_operation_pages.lastPage).toBe(0)
    expect(store.data_information_view).toBeNull()
  })

  it('handles backend success=false in _getDerivativeInvestmentOperationList', async () => {
    const store = useDerivativeInvestmentOperationStoreV1()
    const mockResponse = {
      data: {
        success: false,
        message: 'Error carga',
        data: {
          data: [],
          current_page: 0,
          last_page: 0,
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getDerivativeInvestmentOperationList('page=1')

    expect(mockGet).toHaveBeenCalledWith(`${BASE_URL}?page=1`)
    expect(store.derivative_investment_operation_list).toEqual([])
  })

  it('returns false when backend responds success=false in _createDerivativeInvestmentOperation', async () => {
    const store = useDerivativeInvestmentOperationStoreV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: false, message: 'No creado' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createDerivativeInvestmentOperation(
      {} as Partial<IDerivativeInvestmentOperationToCreate>
    )

    expect(mockPost).toHaveBeenCalledWith(`${BASE_URL}`, {})
    expect(result).toBe(false)
  })

  it('keeps null when backend responds success=false in _getDerivativeInvestmentOperationById', async () => {
    const store = useDerivativeInvestmentOperationStoreV1()
    const mockResponse = { data: { success: false, message: 'No encontrado' } }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getDerivativeInvestmentOperationById(999)

    expect(mockGet).toHaveBeenCalledWith(`${BASE_URL}/999/settlement`)
    expect(store.data_information_view).toBeNull()
  })

  it('returns false when backend responds success=false in _settlement', async () => {
    const store = useDerivativeInvestmentOperationStoreV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: false, message: 'No liquidado' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = {
      forward_operation_id: 77,
    } as Partial<IDerivativeInvestmentOperationView>

    const result = await store._settlement(77, payload)

    expect(mockPost).toHaveBeenCalledWith(`${BASE_URL}/77/settled`, payload)
    expect(result).toBe(false)
  })
})
