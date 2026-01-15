export interface IRegisterConstitutionGeneric {
  investment_portfolio_id: number | null
  operation_date: string | null | Date
  issuer_id: number | null
  counterparty_id: number | null
  administrator_id: number | null
}

export interface IGenericRegisterConstitutionRows {
  id: number
  portfolio_code: string
  description: string
  participation_type: string
  portfolio_class: string
  created_at: string | null | Date
}

export interface IGenericRegisterConstitutionAux {
  unit_value: string | number
  portfolio_class: string | null
  currency_id: number | null
  value_currency: number | null
  operation_type_id: number | null
  paper_type_id: number | null
  isin_id: number | null
  participation_number: number | null
  constitution_value: number | null
}
export interface IRegisterConstitutionValues {
  details: IGenericRegisterConstitutionAux
}

export interface IRegisterConstitutionDetails {
  unit_value?: string | number
  unit?: string | number
  portfolio_class: string | null
  currency_id: number | null
  value_currency?: number | null
  unit_value_origin_currency?: number | null
  constitution_value?: number | null
  constitution_value_origin_currency?: number | null
  operation_type_id: number | null
  paper_type_id: number | null
  isin_id: number | null
  participation_number: number | null
  constitution_unit_number?: number | null
  number_of_cash_operation_days?: number | null
}

export interface IRegisterConstitutionConditions {
  currency_value: number | null
  conversion_factor: number | null
  compliance_date: string | null
  resource_placement_date: string | null
  compliance_value_origin_currency: number | null
  compliance_transfer_value_local_currency: number | null
}

export interface IRegisterConstitutionBase
  extends IRegisterConstitutionGeneric {
  details: IRegisterConstitutionDetails
}

export interface IRegisterConstitutionWithConditions
  extends IRegisterConstitutionBase {
  conditions: IRegisterConstitutionConditions
}

export interface IRegisterConstitutionGenericValue {
  unit: string | number
  portfolio_class: string | null
  currency_id: number | null
  unit_value_origin_currency: number | null
  constitution_value_origin_currency: number | null
  isin_id: number | null
  participation_number: number | null
  constitution_unit_number: number | null
  operation_type_id: number | null
  number_of_cash_operation_days: number | null
  paper_type_id: number | null
}
export interface IRegisterConstitutionValuesForeign {
  details: IRegisterConstitutionGenericValue
}

export interface IRegisterConstitutionGenericConditions {
  currency_value: number | null
  conversion_factor: number | null
  compliance_date: string | null
  resource_placement_date: string | null
  compliance_value_origin_currency: number | null
  compliance_transfer_value_local_currency: number | null
}

export interface IRegisterConstitutionCurrencyLocal
  extends IRegisterConstitutionGeneric,
    IRegisterConstitutionValues {}

export interface IRegisterConstitutionForeignCurrency
  extends IRegisterConstitutionGeneric {
  conditions: IRegisterConstitutionConditions
}
