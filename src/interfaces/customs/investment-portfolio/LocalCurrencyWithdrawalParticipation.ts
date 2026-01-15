type NumStrNull = number | string | null

export interface ILocalCurrencyWithdrawalParticipationPayload {
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

export interface ILocalCurrencyWithdrawalParticipationForm {
  investment_portfolio_id: NumStrNull
  investment_portfolio_description: string | null
  operation_date: string | null
  issuer_id: NumStrNull
  issuer_description: string | null
  counterparty_id: NumStrNull
  counterparty_description: string | null
  administrator_description: string | null
  administrator_id: NumStrNull
operation_type_id?: NumStrNull

  currency_id: NumStrNull
  value_currency: NumStrNull
  cash_value_currency: NumStrNull
  withdrawal_value: NumStrNull

  portfolio_class: string | null
  security_type: string | null
  origin_currency: string | null
  isin: string | null
  participation_count: NumStrNull
  title_count: NumStrNull
  current_participation_balance_in_pesos: NumStrNull
  current_balance_in_units: NumStrNull
  participation_balance_in_pesos: NumStrNull
  operation_code: NumStrNull
  operation_description: string | null
  cash_operation_days: NumStrNull
  unit: string | null
  currency_value: NumStrNull
  conversion_factor: number | null

  details: {
    unit_value: NumStrNull
    portfolio_class: string | null
    operation_type_id: NumStrNull
    paper_type_id: NumStrNull
    paper_type: NumStrNull
    currency_id: NumStrNull
    value_currency: NumStrNull
    withdrawal_value: NumStrNull
  }
}

export interface IFicLocalCurrencyWithdrawalParticipation {
  portfolio_class: string
  paper_type: string
  currency_origin: string
  isin: string
  participation_number: number
  title_id: number
  current_participation_balance_in_pesos: number
  current_balance_in_units: string
  participation_balance_in_pesos: number
  currency_value: string
  conversion_factor: number
  compliance_value_currency_origin: number
  local_currency_compliance: number
}
export interface IPortfolioOption {
  value: number | string
  label?: string
  description?: string
  currency_id?: number | null
  paper_type_id?: number | null
  paper_type?: string | null
  extra?: {
    currency_id?: number | null
    paper_type_id?: number | null
    paper_type?: string | null
  }
}
export interface IFicLocalCurrencyWithdrawalExtended
  extends IFicLocalCurrencyWithdrawalParticipation {
  currency_id?: number | null
  currency?: { id: number | null } | null
  paper_type_id?: number | null
}
