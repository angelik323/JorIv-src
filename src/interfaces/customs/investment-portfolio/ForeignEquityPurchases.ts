export interface IForeignEquityPurchases {
  investment_portfolio_id: number
  operation_type_id: number
  has_commision: boolean
  negotiation: string
  number_days: number
  issuer: IEmitterFormForeign
  unit_compliances: IComplianceFormForeign
}

export interface IEmitterFormForeign {
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
  commission_base: boolean
  percentage_or_fixed_value: number | null
  unit_or_share: string
  has_commission?: boolean
}

export interface IComplianceFormForeign {
  quantity_units: number | null
  unit_value_currency_origin: number | null
  complies_origin_currency: boolean
  purchase_value?: number | null
  commission_value?: number | null
  total_operation_value?: number | null
  has_commission?: boolean
  commission_type?: '%' | '$'
  commission_percentage?: number | null
  commission_fixed_value?: number | null
  currency_negotiation_value: number | null
  placement_resources_date: string
  spot_rate_value: number | null
  conversion_factor: number | null
  complies_origin_currency_value?: number | null
  local_compliance_value?: number | null
  compliance_spot_value?: number | null
  operation_type: string
  commission_base?: number | null
  compliance_currency?: string | null
  negotiation?: boolean
  compliance_date?: string | null
}
