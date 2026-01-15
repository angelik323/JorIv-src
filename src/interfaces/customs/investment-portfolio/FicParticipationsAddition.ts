export interface IBasicDataForm {
  investment_portfolio_id: number
  operation_date: string
  issuer_id: number
  counterparty_id: number
  administrator_id: number
}

export interface IOperationDataForm {
  unit: number
  portfolio_class: string
  currency_id: number
  operation_type_id: number
  paper_type_id: number
  participation_number: number
  title_id: number
  participation_balance_pesos: number
  unit_value_previous_day: number
  current_balance_units: number
  addition_value: number
  current_balance_pesos: number
}

export interface IDataOperationForeignCurrencyForm {
  unit_id: number
  portfolio_class: string
  paper_type_id: number
  currency_id: number
  isin_id: number
  operation_type_id: number
  number_days: number
  participation_number: number
  title_id: number
  origin_currency_balance: string
  value_unit_currency_origin: string
  current_balance_units: string
}

export interface IComplianceConditionsForm {
  currency_value: number
  conversion_factor: number
  value_addition_currency_origin: number
  compliance_date: string
  resource_placement_date: string
  value_compliance_currency_origin: number
  local_currency_compliance_transfer: number
}

export interface IParticipationsAdditionLocalCurrencyCreate extends IBasicDataForm {
  data_operation: IOperationDataForm
}

export interface IParticipationsAdditionForeignCurrencyCreate extends IBasicDataForm {
  data_operation: IDataOperationForeignCurrencyForm
  compliance: IComplianceConditionsForm
}

export interface IBasicDataFormDescriptions {
  description?: string
  emitter_description?: string
  counterparty_description?: string
  administrator_description?: string
  operation_description?: string
  currency_value?: string
  currency_label?: string
  isin_label?: string
  paper_type_label?: string
}