export interface IDividendForeign {
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

export type DividendType = 'Ex-Dividendo' | 'Exigible' | (string & {})

export interface IDividendForeignItem {
  parameters: {
    emitter_id: number
    exchange_traded_fund_id: number
    quantity_exchange_traded_fund: number
    operation_type_id?: number
  }
  register_dividend: {
    register_date: string
    dividend_type: string
    enforceability_date: string
    ex_dividend_date: string
    graved: boolean
    tax_value: number
    origin_currency_id: number
    origin_currency_code: string
    origin_currency_value: number
    origin_currency_value_tax: number
    origin_currency_dividend_value_after_tax: number
    origin_currency_unit_value: number
    local_currency_value_tax: number
    local_currency_dividend_value_after_tax: number
    local_currency_unit_value: number
  }
  values_compliance: {
    date_pay_dividend: string
    origin_currency_enforceability_value_dividend: number
    local_currency_enforceability_value_dividend: number
  }
  history?: IHistoryDividendForeign
}

export type IDividendForeignEdit = {
  parameters: {
    emitter?: {
      id: number
    }
    emitter_id: number
    exchange_traded_fund?: {
      id: number
    }
    exchange_traded_fund_id: number
    quantity_exchange_traded_fund: number
    operation_type_id?: number
  }
  register_dividend: {
    register_date: string
    dividend_type: string
    enforceability_date: string
    ex_dividend_date: string
    graved: boolean
    tax_value: number
    origin_currency?: {
      id: number
      value?: number
      unit_value?: number
    }
    origin_currency_id: number
    origin_currency_code: string
    origin_currency_value: number
    origin_currency_value_tax: number
    origin_currency_dividend_value_after_tax: number
    origin_currency_unit_value: number
    local_currency_value_tax: number
    local_currency_dividend_value_after_tax: number
    local_currency_unit_value: number
  }
  values_compliance: {
    date_pay_dividend: string
    origin_currency_enforceability_value_dividend: number
    local_currency_enforceability_value_dividend: number
  }
  history?: IHistoryDividendForeign
}

export interface IHistoryDividendForeign {
  created_at: string
  created_by_user: string
  updated_at: string
  updated_by_user: string
}

export type MaybeNumber = number | string | null | undefined
export type MaybeString = string | null | undefined
export type MaybeBool = boolean | string | number | null | undefined
