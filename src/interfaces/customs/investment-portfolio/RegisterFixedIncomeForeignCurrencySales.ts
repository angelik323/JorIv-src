export interface IRegisterFixedIncomeForeignCurrencySalePayload {
  investment_portfolio_id: number | null
  operation_type_id: number | null
  operation_date: string
  negotiation: string
  number_days: number | null
  issuer_id: number | null
  purchaser_id: number | null
  portfolio_description?: string
  operation_type_description?: string
  issuer_description?: string
  purchaser_description?: string
  titles: Array<ITitleRow>
  complies_origin_currency: boolean
  complies_currency_id: number
  currency_value_negotiation: number
  placement_resource_date: string
  conversion_factor: number
  spot_rate_compliance_value?: number
}

export interface IOperationT {
  id: number
  code: string
  description: string
}

export interface ITitleRow {
  title_id: number
  market_value_currency_origin: number
  market_value_local_currency: number
  sale_value_currency_origin: number
  irr_sale: number
}

export interface SaleTableRows {
  index: number
  title_id: number
  title: string
  market_value_currency_origin: number
  market_value_local_currency: number | null
  sale_value_currency_origin: string | null
  tir_sale: number | null
}

export type TypeCurrencys = 'local' | 'foreign'

export interface IIrrSaleForTitleRequests {
  title_id: number
  operation_date: string
  sale_value: number
  type_currency: TypeCurrencys
}

export interface IIrrSaleForTitleResponses {
  irr_sale_value: number | null
}

export interface IComplianceFactorRequest {
  currency_id: number
  origin_value: number
  spot_rate: number
}

export interface IComplianceFactorResponse {
  compliance_factor: number
}

export interface IRegisterFixedIncomeForeignCurrencySaleTitle {
  id: number
  issuers_counterparty_id: number
  balance: number
  status_id: number
  unit_value: number
  purchase_value: number | null
  currency_code?: string
  paper_type_id?: number | null
  currency_value?: number | null
}
