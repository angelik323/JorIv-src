export interface IRegisterFixedIncomeForeignCurrencyPayload {
  trader: string
  investment_portfolio_id: number
  portfolio_description: string
  operation_date: string
  operation_type_id: number
  operation_type_description?: string
  negotiation: 'Operacion Spot' | 'Operacion Contado'
  number_days?: number
  market: string
  issuer_id: number
  issuer_nit?: string
  issuer_name?: string
  isin_code_id?: number
  mnemonic: string
  issue_date: string
  maturity_date: string
  perioricity: string
  modality: string
  paper_type_id: number
  paper_type_description?: string
  paper_flow_type?: 'I' | 'C'
  rate_type: string
  rate_code?: string
  fixed_rate_value?: number
  spread?: number
  face_value: number
  purchase_value: number
  currency_id: number
  currency_description?: string
  counterparty_id: number
  counterparty_nit?: string
  counterparty_name?: string
  deposit_issuer_id: number
  compensation_system: string
  folio: number
  title_id?: number
  investment_class: 'IN' | 'DV'
  complies_origin_currency: boolean
  complies_currency_id: number
  currency_value_negotiation: number
  compliance_date: string
  placement_resource_date?: string
  compliace_value_currency_origin: number
  value_purchase_currency_origin: number
  rate_class: string
  spot_rate_value: number
  spot_rate_compliance_value?: number
  conversion_factor?: number
  local_currency_compliance_transfer: number
  flows?: IOperationFloww[]
  tir_purchase?: number
  currency_value: number
}

export interface IOperationFloww {
  date: string
  interest: number
  capital: number
}

export interface ISelectOpti {
  label: string
  value: string | number
}

export interface ISelectOptionWithMeta<T> extends ISelectOpti {
  meta: T
}

export interface IIsinApiResponse {
  description: string
  isin_code_id: number
  isin_code: string
  mnemonic?: string
  issue_date?: string
  maturity_date?: string
  perioricity?: string
  rate_type?: string
  rate_code?: string | null
  fixed_rate_value?: string | null
  modality?: string
  spread?: string | null
}

export interface IIsinMetadata {
  mnemonic: string
  issue_date: string
  maturity_date: string
  due_date: string
  perioricity: string
  periodicity: string
  rate_type: string
  rate_code: string
  fixed_rate_value: string
  modality: string
  spread: string
}

export interface ICurrencyMetadata {
  rate: number
  code: string
  type_of_currency: string
  paper_type_id: number
  paper_type_code: string | null
}

export interface ICurrencyForPaperTypeRaww {
  id: number | string
  code: string
  description: string
  value?: number | string | null
  type_of_currency?: string | null
  paper_type_id?: number | string | null
  paper_type_code?: string | null
}

export interface IIrrFlowRequestt {
  face_value: number
  purchase_value: number
  rate: number
  issue_date: string
  maturity_date: string
  purchase_date: string
  period_months: number
  day_count_base: number
  mode: string
}

export interface IIrrFlowResponsee {
  face_value: string
  purchase_value: string
  rate: number
  issue_date: string
  maturity_date: string
  purchase_date: string
  term: {
    years: number
    months: number
    days: number
  }
  total_days: number
  mode: string
  day_count_base: number
  period_months: number
  period_days: number
  cashflows: ICashflow[]
  tir: number
  paper_type_info: {
    rate_type: string
    rate: string
    payment_flow: string
    is_variable: boolean
  }
}

export interface ICashflow {
  date: string
  amount: number
  type: 'investment' | 'coupon' | 'capital'
  rate_type?: string
  capital?: number
}

export interface IRegisterFixedIncomeForeignCurrencyBackend {
  investment_portfolio_id: number
  operation_type_id: number
  operation_date: string
  negotiation: 'Operacion Spot' | 'Operacion Contado'
  number_days?: number
  market: string
  issuer_id: number
  isin_code_id?: number
  mnemonic: string
  issue_date: string
  maturity_date: string
  perioricity: string
  rate_type: string
  fixed_rate_value?: number
  rate_code?: string
  modality: string
  spread?: number
  paper_type_id: number
  face_value: number
  purchase_value: number
  currency_id: number
  counterparty_id: number
  deposit_issuer_id: number
  compensation_system: string
  folio: number
  title_id?: number
  investment_class: 'IN' | 'DV'
  complies_origin_currency: boolean
  complies_currency_id: number
  currency_value_negotiation: number
  compliance_date: string
  placement_resource_date?: string
  compliace_value_currency_origin: number
  spot_rate_value: number
  spot_rate_compliance_value?: number
  conversion_factor?: number
  local_currency_compliance_transfer: number
  flows?: IOperationFloww[]
  tir_purchase?: number
}

export interface IIrrFlowForeignRequest {
  operation_date: string
  issue_date: string
  maturity_date: string
  rate_class?: string
  perioricity: string
  rate_type?: string
  fixed_rate_value?: number
  rate_code?: string
  modality: string
  spread?: number
  paper_type_id: number
  face_value: number
  purchase_value: number
}

export interface IOptionss {
  label: string
  value: string | number
}
