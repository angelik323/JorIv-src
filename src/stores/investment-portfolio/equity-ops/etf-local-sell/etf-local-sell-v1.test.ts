import { useLocalSellExchangeTradedFundStoreV1 } from './etf-local-sell-v1'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { IEtfLocalSellOperation } from '@/interfaces/customs'
import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'

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
}))

describe('useLocalSellExchangeTradedFundStoreV1', () => {
  const BASE_URL = `${URL_PATH_INVESTMENT_PORTFOLIO}/local-sell-exchange-traded-fund`

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('returns data correctly in _showAction', async () => {
    const store = useLocalSellExchangeTradedFundStoreV1()
    const mockResponse = {
      data: {
        success: true,
        data: { id: 1, exchange_traded_fund_id: 5 },
        message: 'Correcto',
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._showAction('1')

    expect(mockGet).toHaveBeenCalledWith(`${BASE_URL}/1/show`)
    expect(result).toEqual({ id: 1, exchange_traded_fund_id: 5 })
  })

  it('returns null on error in _showAction', async () => {
    const store = useLocalSellExchangeTradedFundStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Error inesperado'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._showAction('123')

    expect(mockGet).toHaveBeenCalled()
    expect(result).toBeNull()
  })

  it('creates data correctly in _createAction', async () => {
    const store = useLocalSellExchangeTradedFundStoreV1()
    const payload = {
      title_id: 1,
      operation_date: '2025-09-08',
      investment_portfolio_id: 1,
      operation_type_id: 2,
      exchange_traded_fund_id: 3,
      paper_type_id: 4,
      quantity_sell_units: '100',
      operation_number_days: 10,
      commission_base: 'Valor',
      commission_value: 20,
      value_unit_sell: 12.5,
      value_compliance: '1250.00',
      seller_id: 5,
    } as IEtfLocalSellOperation

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Creado correctamente' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction(payload)

    expect(mockPost).toHaveBeenCalledWith(`${BASE_URL}/new`, payload)
    expect(result).toBe(true)
  })

  it('returns false on error in _createAction', async () => {
    const store = useLocalSellExchangeTradedFundStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('Falló'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction({} as IEtfLocalSellOperation)

    expect(mockPost).toHaveBeenCalled()
    expect(result).toBe(false)
  })
})
