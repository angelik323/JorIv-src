type StringBooleanOrNull = string | boolean | null
type NumberStringOrNull = number | null | string

export interface IAccountingSettingsResponseV2 {
  id: number
  business_id: number
  billing_trust: {
    id: number
    business_id: number
    business_code_snapshot: string
    business_name_snapshot: string
    snapshotted_at: string
    start_date: string
    end_date: string
    periodicity: string
    code: null
  }
  business_code_snapshot: string
  business_name_snapshot: string
  snapshotted_at: string
  who_pays: string
  accounts: boolean
  generates_iva: boolean
  iva: string
  created_by: number
  updated_by: number | null
  billing_trusts_id: number
  created_at: string
  updated_at: string
  business_movement_code_snapshot: string | null
  business_movement_name_snapshot: string | null
  business_movement_id_snapshot: string | null
  business_movement_nature_snapshot: string | null
  is_accounting: boolean
  has_iva: boolean
  has_retefuente: boolean
  has_reteica: boolean
  has_reteiva: boolean
  retefuente: string
  reteica: string
  reteiva: string
}

export interface IAccountingSettingsListV2 {
  id: number
  start_date: string
  end_date: string
  periodicity: string
  code: string
  business_movement_code_snapshot: string
  business_movement_name_snapshot: string
  business_code_snapshot: string
  business_name_snapshot: string
}

export interface IAccountingSettingsInformationFormV2 {
  who_pays?: string | null
  accounts: StringBooleanOrNull

  business_code_snapshot: string | number | null
  billing_trusts_id: number | string | null

  start_date?: string | null
  end_date?: string | null

  generates_iva: StringBooleanOrNull
  has_retefuente: StringBooleanOrNull
  has_reteica: StringBooleanOrNull
  has_reteiva: StringBooleanOrNull

  iva: NumberStringOrNull
  retefuente: NumberStringOrNull
  reteica: NumberStringOrNull
  reteiva: NumberStringOrNull

  business_movement_code_snapshot: string | null
  business_movement_name_snapshot: string | null
  business_movement_id_snapshot: string | number | null
  business_movement_nature_snapshot: string | null

  periodicity?: string | null
  business_name?: string | null
  billing_trusts_name?: string | null
}
