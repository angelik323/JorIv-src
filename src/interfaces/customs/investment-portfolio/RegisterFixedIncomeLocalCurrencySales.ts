export interface IRegisterFixedIncomeLocalCurrencySalePayload {
  investment_portfolio_id: number | null
  operation_type_id: number | null
  operation_date: string
  issuer_id: number | null
  purchaser_id: number | null
  titles: {
    title_id: number
    market_value: number
    sale_value: number
    compensation_system: string
    irr_sale?: number
  }[]
  portfolio_description?: string
  operation_type_description?: string
  issuer_description?: string
  purchaser_description?: string
}

export interface IOperationTypes {
  id: number
  code: string
  description: string
}

export interface IOpt {
  label: string
  value: string | number
}

export interface SaleTableRow {
  index: number
  title_id: number
  title: string
  market_value: string
  sale_value: string
  compensation_system: string
  tir_sale: number | null
}

export type TypeCurrency = 'local' | 'foreign'

export interface IIrrSaleForTitleRequest {
  title_id: number
  operation_date: string
  sale_value: number
  type_currency: TypeCurrency
}

export interface IIrrSaleForTitleResponse {
  irr_sale_value: number | null
}
