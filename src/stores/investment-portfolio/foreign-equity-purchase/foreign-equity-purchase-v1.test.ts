import { useForeignEquityPurchaseStoreV1 } from './foreign-equity-purchase-v1'
import { IForeignEquityPurchases } from '@/interfaces/customs'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    post: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({
    showCatchError: jest.fn(() => 'Error capturado'),
  })),
}))

describe('useForeignEquityPurchaseStoreV1', () => {
  const BASE_URL = `${URL_PATH_INVESTMENT_PORTFOLIO}/buy-shares-foreign-currency`

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('successfully creates a record in _createAction (success case)', async () => {
    const store = useForeignEquityPurchaseStoreV1()
    const payload: IForeignEquityPurchases = {
      investment_portfolio_id: 1,
      operation_type_id: 2,
      has_commision: false,
      negotiation: 'false',
      number_days: 0,
      issuer: {
        issuers_counterparty_id: 4,
        action_class: 'Ordinaria',
        paper_type_id: 1,
        isin_code_id: 1,
        currency_id: 2,
        commission_base: false,
        percentage_or_fixed_value: 0,
        unit_or_share: 'Unidad nombre',
        issuers_counterparty_seller_id: 5,
        issuers_counterparty_administrator_id: 6,
        issuers_counterparty_commissioner_id: 7,
      },
      unit_compliances: {
        quantity_units: 100,
        unit_value_currency_origin: 1500,
        complies_origin_currency: false,
        purchase_value: 1500000,
        commission_value: 0,
        total_operation_value: 1500000,
        currency_negotiation_value: 0,
        spot_rate_value: 0,
        conversion_factor: 0,
        placement_resources_date: '2023-05-24',
        operation_type: 'contado',
      },
    }

    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Registro exitoso',
      },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction(payload)

    expect(mockPost).toHaveBeenCalledWith(`${BASE_URL}/new`, payload)
    expect(result).toBe(true)
  })

  it('returns false if an error occurs in _createAction', async () => {
    const store = useForeignEquityPurchaseStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('Falló'))

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction({
      investment_portfolio_id: 1,
      operation_type_id: 2,
      has_commision: false,
      negotiation: 'false',
      number_days: 0,
      issuer: {
        issuers_counterparty_id: 4,
        action_class: 'Ordinaria',
        paper_type_id: 1,
        isin_code_id: 1,
        currency_id: 2,
        commission_base: false,
        percentage_or_fixed_value: null,
        unit_or_share: 'Unidad nombre',
        issuers_counterparty_seller_id: 5,
        issuers_counterparty_administrator_id: 6,
        issuers_counterparty_commissioner_id: 7,
      },
      unit_compliances: {
        quantity_units: 100,
        unit_value_currency_origin: 1500,
        complies_origin_currency: false,
        purchase_value: 1500000,
        commission_value: 0,
        total_operation_value: 1500000,
        currency_negotiation_value: 0,
        spot_rate_value: 0,
        conversion_factor: 0,
        placement_resources_date: '2023-05-24',
        operation_type: 'contado',
      },
    })

    expect(mockPost).toHaveBeenCalled()
    expect(result).toBe(false)
  })
})
