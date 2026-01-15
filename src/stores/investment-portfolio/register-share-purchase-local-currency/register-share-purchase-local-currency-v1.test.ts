import { useRegisterSharePurchaseLocalCurrencyStoreV1 } from './register-share-purchase-local-currency-v1'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'
import { IRegisterSharePurchaseLocalCurrency } from '@/interfaces/customs'

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

describe('useRegisterSharePurchaseLocalCurrencyStoreV1', () => {
  const BASE_URL = `${URL_PATH_INVESTMENT_PORTFOLIO}/buy-shares-local-currency`

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('successfully creates a record in _createAction (success case)', async () => {
    const store = useRegisterSharePurchaseLocalCurrencyStoreV1()
    const payload: IRegisterSharePurchaseLocalCurrency = {
      investment_portfolio_id: 1,
      operation_type_id: 2,
      has_commision: false,
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
        unit_value: 1500,
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
    const store = useRegisterSharePurchaseLocalCurrencyStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('Falló'))

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction({
      investment_portfolio_id: 1,
      operation_type_id: 2,
      has_commision: false,
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
        unit_value: 1500,
      },
    })

    expect(mockPost).toHaveBeenCalled()
    expect(result).toBe(false)
  })
})
