export interface IDividendLocal {
  description: string
  index_type: string
  index_description: string
  administrator_id: number
  admin_description: string
  transmitter_id: number
  transmitter_description: string
  currency_id: number
  isin_code_id: number
  nemotechnic: string
  status_id: number
  etf_number: number
}

export interface IDividendLocalItem {
  real_id?: number
  title?: string
  parameters: {
    emitter?: { id?: number }
    exchange_traded_fund?: { id?: number }
    emitter_id: number
    exchange_traded_fund_id: number
    quantity_exchange_traded_fund: number
  }
  register_dividend: {
    register_date: string
    dividend_type: string
    dividend_value: number
    enforceability_date: string
    ex_dividend_date: string
    graved: boolean
    currency?: { id: number; code: string; value?: number }
    currency_id: number
    currency_code: string
    currency_value: number
    tax_value: number
    value_tax_currency: number
    dividend_value_after_tax: number
  }
  values_compliance: {
    date_pay_dividend: string
    enforceability_value_dividend: number
  }
  history?: IHistoryDividendLocal
}

export type IDividendLocalEdit = {
  parameters: {
    emitter?: { id?: number }
    emitter_id: number
    exchange_traded_fund?: { id?: number }
    exchange_traded_fund_id: number
    quantity_exchange_traded_fund: number
  }
  register_dividend: {
    register_date: string
    dividend_type: string
    dividend_value: number
    enforceability_date: string
    ex_dividend_date: string
    graved: boolean
    currency?: { id: number; code: string; value: number }
    currency_id: number
    currency_code: string
    currency_value: number
    tax_value: number
    value_tax_currency: number
    dividend_value_after_tax: number
  }
  values_compliance: {
    date_pay_dividend: string
    enforceability_value_dividend: number
  }
  history?: IHistoryDividendLocal
}

export interface IHistoryDividendLocal {
  created_at: string
  created_by_user: string
  updated_at: string
  updated_by_user: string
}
