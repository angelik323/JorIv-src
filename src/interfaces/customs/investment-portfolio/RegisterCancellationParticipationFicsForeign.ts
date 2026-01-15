export interface IRegisterCancellationParticipationFicsForeign
  extends IBasicDataRegisterCancellationParticipationFicsForeign {
  data_operation: IOperationDataRegisterCancellationParticipationFicsForeign
  compliance: IComplianceConditionsDataRegisterCancellationParticipationFicsForeign
}

export interface IBasicDataRegisterCancellationParticipationFicsForeign {
  investment_portfolio_id: number | null
  investment_portfolio_description: string
  operation_date: string | null
  issuer_id: number | null
  issuer_description: string | null
  counterparty_id: number | null
  counterparty_description: string | null
  administrator_id: number | null
  administrator_description: string | null
}

export interface IOperationDataRegisterCancellationParticipationFicsForeign {
  unit_id: number | null
  portfolio_class: number | null
  paper_type_id: number | null
  paper_type_label: string | null
  currency_id: number | null
  currency_label: string | null
  isin_id: number | null
  isin_label: string | null
  operation_type_id: number | null
  operation_type_description: string | null
  number_days: number | null
  participation_number: number | null
  title_id: number | null
  balance_participation_currency_origin: number | string | null
  balance_number_units: number | null
  cancellation_value_origin_currency: number | null
}

export interface IComplianceConditionsDataRegisterCancellationParticipationFicsForeign {
  value_currency: number | null
  conversion_factor: number | null
  compliance_date: string | null
  resource_placement_date: string | null
  value_compliance_currency_origin: number | null
  local_currency_compliance_transfer: number | null
}
