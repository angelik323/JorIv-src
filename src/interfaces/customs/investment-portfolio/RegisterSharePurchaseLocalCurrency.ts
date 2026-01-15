export interface IRegisterSharePurchaseLocalCurrency {
  investment_portfolio_id: number
  operation_type_id: number
  has_commision: boolean
  issuer: IEmitterFormData
  unit_compliances: IComplianceFormData
}

export interface IEmitterFormData {
  issuers_counterparty_id: number | null
  issuers_counterparty_description?: string
  action_class: string
  paper_type_id: number | null
  isin_code_id: number | null
  nemoten_code_id?: string
  issuers_counterparty_seller_id: number | null
  issuers_counterparty_seller_description?: string
  issuers_counterparty_administrator_id: number | null
  issuers_counterparty_administrator_description?: string
  issuers_counterparty_commissioner_id: number | null
  issuers_counterparty_commissioner_description?: string
  currency_id: number | null
  value_currency?: string
  commission_base: boolean | null
  percentage_or_fixed_value: number | null
  unit_or_share: string
  has_commision?: boolean
}

export interface IComplianceFormData {
  quantity_units: number | null
  unit_value: number | null
  purchase_value?: number | null
  commission_value?: number | null
  total_operation_value?: number | null
  commission_type?: '%' | '$'
  commission_percentage?: number | null
  commission_fixed_value?: number | null
  has_commision?: boolean
}
