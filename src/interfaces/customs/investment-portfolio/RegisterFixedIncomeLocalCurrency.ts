export interface IRegisterFixedIncomeLocalCurrencyPayload {
  investment_portfolio_id: number | null
  operation_type_id: number | null
  portfolio_description?: string
  operation_date: string

  market: 'Primario' | 'Secundario'

  issuer_id: number | null
  isin_code_id?: number | null
  mnemonic: string
  issue_date: string
  maturity_date: string
  perioricity: string
  rate_type: string
  fixed_rate_value: number | null
  rate_code?: string | null
  modality: string
  spread: number | null
  rate_class: string
  paper_type_id: number | null
  face_value: number | null
  purchase_value: number | null
  currency_id: number | null
  currency_code: string | null
  counterparty_id: number | null
  deposit_issuer_id: number | null
  compensation_system: string
  folio: number | null
  title_id?: number | null
  tir_purchase?: number | null
}

export interface IOperationFlow {
  date: string
  interest: number
  capital: number
}

export interface IIsinRaw {
  id: number
  isin_code_id: string
  isin_code: string
  mnemonic?: string
  issue_date?: string
  maturity_date?: string
  perioricity?: string
  rate_type?: string
  rate_code?: string
  fixed_rate_value?: string | number
  modality?: string
  spread?: string | number
}

export interface IIsinMeta {
  mnemonic: string
  issue_date: string
  due_date: string
  periodicity: string
  rate_type: string
  rate_code: string
  fixed_rate_value: string | number
  modality: string
  spread: string | number
  maturity_date: string
  perioricity: string
}

export interface ICounterpartyMeta {
  nit: string
  name: string
}

export interface IDepositMeta {
  nit: string
  name: string
}

export interface ICurrencyForPaperTypeRaw {
  paper_type_code: string
  paper_type_id: number
  type_of_currency: string
  description_currency: string
  value: number
  currency_id: number
  currency_code: string
}

export interface ICurrencyMeta {
  rate: number
  code: string
  type_of_currency: string
  paper_type_id: number
  paper_type_code: string
}

export interface IOptions {
  label: string
  value: string | number
}

export interface IOptionWithMeta<M> extends IOptions {
  meta: M
}

export interface IIrrFlowRequest {
  operation_date: string
  issue_date: string
  maturity_date: string
  perioricity: string
  rate_type: string
  fixed_rate_value?: number
  rate_code?: string
  modality: string
  spread?: number
  rate_class: string
  paper_type_id: number | null
  face_value: number | null
  purchase_value: number | null
}

export type CashflowType = 'investment' | 'coupon' | 'capital'

export interface IIrrCashflowItem {
  date: string
  amount: number
  type: CashflowType
  rate_type?: string
  capital?: number
}

export interface IIrrFlowResponse {
  face_value: string
  purchase_value: string
  rate: number
  issue_date: string
  maturity_date: string
  purchase_date: string
  term: { years: number; months: number; days: number }
  total_days: number
  mode: string
  day_count_base: number
  period_months: number
  period_days: number
  cashflows: IIrrCashflowItem[]
  tir: number
  paper_type_info: {
    rate_type: string
    rate: string
    payment_flow: string
    is_variable: boolean
  }
}

export interface ITirPurchaseFlow {
  date: string
  interest: number
  capital: number
}

export interface ITirPurchaseForm {
  flows: ITirPurchaseFlow[]
  tir_purchase: number | null
}

export interface ITirPurchaseFlow {
  date: string
  interest: number
  capital: number
}

export interface ITirPurchaseForm {
  flows: ITirPurchaseFlow[]
  tir_purchase: number | null
}

export interface ITableRoww extends ITirPurchaseFlow {
  __index: number
  __key: string
}
