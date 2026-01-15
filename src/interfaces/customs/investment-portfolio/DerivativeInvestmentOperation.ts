export interface IDerivativeInvestmentOperationList {
  id: number
  portfolio_code: string
  description: string
  forward_type: string
  title_number: string
  forward_number: string
  creation_date: string
  status: string
}

export interface IDerivativeInvestmentOperationToCreate {
  created_by: number | string
  operation_type_id: number | null | string
  operation_date: string
  investment_portfolio_id: number | null
  investment_portfolio_description: string
  compliance_type: string
  issuers_counterparty_id: number | null | string
  derivative_class_id: number | null
  paper_type_id: number | null
  derivative_objective: string
  coverage_type_id: number | null
  badge_x_id: number | null
  badge_y_id: number | null
  currency_id: number | null
  value_currency: number
  base_days: number | null
  days: string
  constitution_date: string
  expiration_date: string
  compliance_date: string
  rate_spot_badge_y: number
  strike_badge_y: number
  spot_badge_y: number
  forward_badge_y: number
  fixed_agreed_rate: number
  agreed_value_badge_y: number
  status_id: number
}

export interface IDerivativeInvestmentOperationView {
  forward_operation_id: number
  title_id: number
  code: string
  description: string
  operation: string
  value_currency: string
  agree_rate: number
  spot_rate: number
  spot_date: string
  differential: number
  usd: number
  cop: number
  liquidated: number
  payment_date: string
}
