export interface IForeignCurrencyWithdrawalParticipationPayload {
  investment_portfolio_id: string
  operation_date: string
  issuer_id: string
  counterparty_id: string
  administrator_id: string
  details: {
    unit_value: string
    portfolio_class: string
    operation_type_id: string
    cash_operation_days: string
  }
  compliance: {
    withdrawal_value_origin_currency: string
    compliance_date: string
    placement_resource_date: string
  }
}

export interface IForeignCurrencyWithdrawalParticipationForm {
  investment_portfolio_id?: number | string | null
  investment_portfolio_description?: string | null
  operation_date?: string | null
  issuer_id?: number | string | null
  issuer_description?: string | null
  counterparty_id?: number | string | null
  counterparty_description?: string | null
  administrator_description?: string | null
  administrator_id?: number | string | null

  details?: {
    unit_value?: number | string | null
    portfolio_class?: string | null
    operation_type_id?: number | string | null
    cash_operation_days?: number | string | null
  }

  compliance?: {
    withdrawal_value_origin_currency?: number | string | null
    compliance_date?: string | null
    placement_resource_date?: string | null
  }

  portfolio_class?: string | null
  security_type?: string | null
  origin_currency?: string | null
  isin?: string | null
  participation_count?: number | string | null
  title_count?: number | string | null
  origin_currency_balance?: number | string | null | undefined
  origin_currency_unit_value?: number | string | null | undefined
  current_balance_units?: number | string | null | undefined
  operation_code?: number | string | null
  operation_description?: string | null
  cash_operation_days?: number | string | null
  unit?: string | null
  currency_value?: number | string | null
  conversion_factor?: number | null
  local_currency_compliance?: number | null
  compliance_value_currency_origin?: number | null
  withdrawal_units_count?: number | null
}

export interface IFicForeignCurrencyWithdrawalParticipation {
  portfolio_class: string
  paper_type: string
  currency_origin: string
  isin: string
  participation_number: number
  title_id: number
  origin_currency_balance: number
  unit_value_currency_origin: string
  current_balance_units: number
  currency_value: string
  conversion_factor: number
  compliance_value_currency_origin: number
  local_currency_compliance: number
}
