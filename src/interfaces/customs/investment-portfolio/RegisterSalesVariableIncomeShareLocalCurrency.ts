export interface IRegisterShareSaleLocalCurrency {
  investment_portfolio_id: number | string
  description_portfolio_name: string
  portfolio_operation_date: string
  operation_type_id: number | string
  operation_type_description: string
  has_commission: boolean
  title_id?: number | string
  operation_number?: string
  title_status?: 'Activo' | 'Vendido'
  title_sequence?: string
}

export interface IComplianceForm {
  purchase_unit_value: number | null
  available_units_by_issuer: number | null
  sale_quantity: number | null
  sale_unit_value: number | null
  sale_value: number | null
  commission_value: number | null
  total_operation_value: number | null
  profit_or_loss_value: number | null

  quantity_units?: number | null
  unit_value?: number | null
  purchase_value?: number | null
  has_commission?: boolean
  commission_type?: '%' | '$'
  commission_percentage?: number | null
  commission_fixed_value?: number | null
}

export interface IEmitterForm {
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
  commission_base: 'Porcentaje' | 'Valor de unidad' | null
  percentage_or_fixed_value: number | null
  unit_or_share: string
}

export interface IEmitterItem {
  issuer_counterparty_id?: number
  issuers_counterparty_id?: number
  issuers_counterparty_seller_id?: number
  issuers_counterparty_commissioner_id?: number
  issuer_id?: number
  emitter_id: number
  class_action: string
  action_class?: string
  buyer_id: number
  commissioner_id: number
  commission_base?: string
  commission_value_base?: number
  unit_actions: string
  percentage_or_fixed_value?: number
  unit_or_share?: string
}

export interface IComplianceUnit {
  purchase_unit_value: number
  available_shares_quantity: number
  sale_shares_quantity: number
  sale_unit_value: number
  unit_value: number
  commission_value: number
  total_operation_value: number
  profit_or_loss_value: number
}

export type Id = number | string

export interface IOption {
  value: Id
  label?: string
  code?: string
  description?: string
  active?: boolean
}

export interface ISelectOptions {
  issuers: IOption[]
  issuersCounterparties: IOption[]
  actionClass: IOption[]
  [key: string]: IOption[]
}

export interface IInformationSelectOptions {
  operation_type: IOption[]
  investment_portfolio: IOption[]
  [key: string]: IOption[]
}

export interface IInformationFormData {
  investment_portfolio_id: Id | null
  description_portfolio_name: string
  operation_date: string
  operation_type_id: Id | null
  operation_type_description: string
  has_commission: boolean
}

export type CommissionBase = 'Porcentaje' | 'Valor de unidad' | null

export interface IRegisterShareSaleLocalCurrencyPayload {
  investment_portfolio_id: number
  portfolio_operation_date: string
  operation_id: number
  commission: boolean
  issuer: IEmitterItem[]
  compliance_units: IComplianceUnit[]
}
