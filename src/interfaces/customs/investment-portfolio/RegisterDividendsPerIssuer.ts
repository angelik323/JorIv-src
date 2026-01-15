export interface IEmitterDividend {
  emitter_id: number
  emitter_name?: string
  operation_date: string
  operation_code?: number | string
  operation_type_id?: number
  class_action: string
  unit_id_action: string
  number_of_shares: number
  dividend_type: string
  dividend_record_date: string
  ex_dividend_date: string
  due_date: string
  payment_date: string
  has_recorded: number
  currency_id: number
  dividend_value: number
  dividend_value_local_currency?: number
  tax_percentage: number
  dividend_value_after_tax: number
  dividend_value_local_currency_after_tax?: number
  enforceability_value: number
  demand_value_local_currency?: number
  tax_value: number
  tax_value_local_currency?: number
  document_emitter?: string
  description_emitter_name?: string
  type_of_currency?: string
  history_issuer_dividend?: IHistoryIssuerDividend
  spot_rate?: number
  operation_type_code?: string
  operation_type_description?: string
  history_foreign_currency_shar?: string | number | null
}

export interface IHistoryIssuerDividend {
  created_at: string
  creator_data: string
  updated_at: string
  updated_data: string
}
