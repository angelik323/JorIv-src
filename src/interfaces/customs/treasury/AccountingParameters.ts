export interface IAccountingParameters {
  id?: number
  accounting_blocks_collection_id?: number | string
  account_chart_id?: number
  account_chart?: string | number
  cost_center_id?: number | string
  aux_type?: string
  third_party_id?: number | string
  cash_flow_structure_id?: number | string
  contra_account_chart_id?: number
  contra_cost_center_id?: null | string | number
  contra_aux_type?: number | null | string
  contra_third_party_id?: number | null | string
  contra_cash_flow_structure_id?: number | string
  cash_flow_structure?: string | number
  third_party?: string | number
  contra_account_chart?: string | number
  contra_cost_center?: string | number
  contra_third_party?: string | number
  cost_center?: string | number
}
