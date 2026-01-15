export interface IIsinesCodesForm {
  id?: number | null
  isin_code?: string
  description?: string
  mnemonic?: string
  issuer_code?: string
  administrator_code?: string
  title_class?: string
  issue_date?: string
  maturity_date?: string
  perioricity?: string
  rate_type?: string
  issuance_series?: string
  issuance_year?: number | null
  fixed_rate_value?: number | null
  rate_code?: string
  rate_behavior?: string
  observation?: string
  modality?: string | number | undefined
  spread?: string
  isin_code_history?: {
    created_at?: string
    created_by_user?: string
    updated_at?: string
    updated_by_user?: string
  } | null
}
