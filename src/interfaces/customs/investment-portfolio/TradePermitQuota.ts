export interface ITradePermitQuota {
  id?: number
  trader_id: number
  general_quota: number
  individual_quota: number
  investment_portfolio_id: number
  counterpart_id: number
  emitter_id: number
  paper_type_id: number
  document_trader?: string
  description_trader?: string
  description_portfolio_name?: string
  document_counterpart?: number
  description_counterpart_name?: string
  document_emitter?: number
  description_emitter_name?: string
  type_of_investment?: string
  Papers?: string
  portfolio_code?: string
  history_permits_quotas_counterpart?: {
    created_at?: string
    creator_data?: string
    updated_at?: string
    update_data?: string | null
  }
}

export interface ITradePermitQuotaList {
  id: number
  portfolio_code: string
  description: string
  emitter_id: string
  description_emitter_name: string
  counterpart_id: string
  description_counterpart_name: string
}
