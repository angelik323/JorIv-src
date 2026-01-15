export interface IForeignCurrencyEquityStockSale
  extends IBasicDataForeignFormData {
  issuer: IEmitterForeignFormData[]
  compliance_units: IComplianceForeignFormData[]
}

export interface IBasicDataForeignFormData {
  investment_portfolio_id: number | null
  portfolio_operation_date: string
  operation_id: number | null
  commission: boolean
  negotiation: string
  number_days: number | null
  investment_portfolio_description?: string
  operation_description?: string
}

export interface IEmitterForeignFormData {
  emitter_id: number | null
  class_action: string
  buyer_id: number | null
  commissioner_id: number | null
  commission_base: string
  commission_value: number
  unit_actions: string
}

export interface IComplianceForeignFormData {
  origin_currency: number | null
  origin_currency_value: number
  available_shares_quantity: number
  sale_shares_quantity: number
  sale_unit_value_currency: number | string
  commission_value_currency_origin: number
  complies_in_origin_currency: boolean
  compliance_currency: number | null
  compliance_date: string
  resource_placement_date: string
  negotiation_currency_value: number
  operation_value_origin_currency: number
  spot_rate_value: number
  compliance_spot_rate_value: number
  conversion_factor: number
  local_currency_compliance_amount: number
}
