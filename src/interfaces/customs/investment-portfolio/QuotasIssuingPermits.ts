export interface IQuotasIssuingPermitsResponse {
  id: number
  id_transmitter: number
  description_transmitter: string
  code: number
  description: string
  type: string
  papers: string
}

export interface IQuotasIssuingPermitsRequest {
  id?: number
  emitter_id: number | null
  document_emitter?: number
  description_emitter_name?: string
  investment_portfolio_id: number
  general_quota: number
  has_bank_accounts: number | boolean
  description_portfolio_name?: string
  type_of_investment?: string
  paper_type_id: number
  has_emission: number | boolean
  quota_generates: string
  absolute_value_general_quota: string
  issue_value: string
  emission_percentage: string
  absolute_value_of_issue: string
  issuing_banks: IIssuingBank[]
  history_quotas_issuing_Permit?: IHistoryQuotasIssuingPermit
  Papers?: string
  portfolio_code?: string
}

export interface IIssuingBank {
  id: number
  account_number: string
  coin_type: string
}

export interface IHistoryQuotasIssuingPermit {
  created_at: string
  creator_data: string
  updated_at: string
  update_data: string
}
