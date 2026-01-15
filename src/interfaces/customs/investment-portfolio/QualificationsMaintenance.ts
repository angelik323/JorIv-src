export interface IQualificationsMaintenance {
  id?: number | null
  document_third?: number | null
  description?: string
  history_issuers_counter_party?: {
    created_at?: string
    creator_data?: string
    update_data?: string
    updated_at?: string
  }
  cp_issuer_qualification_id?: number | null
  cp_issuer_rating?: string
  lp_issuer_qualification_id?: number | null
  lp_issuer_rating?: string

  cp_issuer_rating_new?: string
  lp_issuer_rating_new?: string
}
export interface IQualificationsMaintenanceUpdate {
  cp_issuer_rating?: string
  lp_issuer_rating?: string

  cp_issuer_rating_new?: string
  lp_issuer_rating_new?: string

  cp_issuer_qualification_id?: string
  lp_issuer_qualification_id?: string
}
