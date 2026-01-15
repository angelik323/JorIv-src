export interface IRegisterCancellationParticipationFics
  extends IBasicDataRegisterCancellationParticipationFics {
  data_operation: IOperationDataRegisterCancellationParticipationFics
}

export interface IBasicDataRegisterCancellationParticipationFics {
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

export interface IOperationDataRegisterCancellationParticipationFics {
  unit: number | null
  portfolio_class: number | null
  currency_id: number | null
  currency_value: number | null
  operation_type_id: number | null
  operation_type_description: string | null
  paper_type_id: number | null
  participation_number: number | null
  title_id: number | null
  participation_balance_pesos: number | null
  current_balance_pesos: number | null
  current_balance_units: number | null
  cancellation_value: number | null
}
