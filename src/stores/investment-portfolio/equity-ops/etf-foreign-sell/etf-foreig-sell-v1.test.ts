import { useForeignSellExchangeTradedFundStoreV1 } from './etf-foreign-sell-v1'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
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

describe('useForeignSellExchangeTradedFundStoreV1', () => {
  const BASE_URL = `${URL_PATH_INVESTMENT_PORTFOLIO}/foreign-sell-exchange-traded-fund`

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('returns data correctly in _showAction', async () => {
    const store = useForeignSellExchangeTradedFundStoreV1()
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
    const store = useForeignSellExchangeTradedFundStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Error inesperado'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._showAction('123')

    expect(mockGet).toHaveBeenCalled()
    expect(result).toBeNull()
  })

  it('creates data correctly in _createAction', async () => {
    const store = useForeignSellExchangeTradedFundStoreV1()
    const payload = {
      basic_information: {
        investment_portfolio_id: 1,
        operation_type_id: 2,
        operation_date: '2025-09-08',
      },
      negotiation_conditions: {
        exchange_traded_fund_id: 3,
        paper_type_id: 4,
        seller_id: 5,
        quantity_units: '100',
        folio_number: 12312,
        operation_number_days: 10,
        commission_base: 'Valor',
        commission_value: 20,
      },
      compliance_conditions: {
        origin_currency_id: 39,
        value_origin_currency: 0.232,
        compliance_currency_id: 40,
        value_negotiation_currency: 123,
        compliance_date: '2025-09-13',
        colocation_resources_date: '2025-09-12',
        factor_conversion: '1.0000',
      },
      values_compliance: {
        value_unit_local_currency: '123',
        value_commission_local_currency: '5712.768',
        value_total_local_currency: '5958.768',
        value_unit_origin_currency: '123',
        value_commission_origin_currency: '5712.768',
        value_total_origin_currency: '5958.768',
        value_unit_compliance_currency: '123',
        value_commission_compliance_currency: '5712.768',
        value_total_compliance_currency: '5958.768',
      },
    }

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Creado correctamente' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction(payload)

    expect(mockPost).toHaveBeenCalledWith(`${BASE_URL}/new`, payload)
    expect(result).toBe(true)
  })

  it('returns false on error in _createAction', async () => {
    const store = useForeignSellExchangeTradedFundStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('Falló'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction({})

    expect(mockPost).toHaveBeenCalled()
    expect(result).toBe(false)
  })
})
