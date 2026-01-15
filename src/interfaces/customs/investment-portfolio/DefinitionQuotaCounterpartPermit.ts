export interface IDefinitionQuotaCounterpartPermitHistory {
  created_at?: string | null
  creator_data?: string | null
  updated_at?: string | null
  update_data?: string | null
}

export interface IDefinitionQuotaCounterpartPermitForm {
  id?: number | null
  counterpart_id: number | null
  description_counterpart_name?: string | null
  document_counterpart?: number | null
  investment_portfolio_id: number | null
  portfolio_code?: string | null
  description_portfolio_name?: string | null
  general_quota: number | null
  type_of_investment?: string | number | null
  paper_type_id: number | null
  papers?: string | null
  history_permits_quotas_counterpart: IDefinitionQuotaCounterpartPermitHistory
}

export interface IDefinitionQuotaCounterpartPermitRequest {
  counterpart_id: number | null
  investment_portfolio_id: number | null
  general_quota: number | null
  paper_type_id: number | null
}

export interface IDefinitionQuotaCounterpartPermitList
  extends Array<IDefinitionQuotaCounterpartPermitForm> {}
