export interface IFiduciaryCommissionResponse {
  id: number
  base_amount: string
  business_trust_commissions_id: number
  comission_settlement_statuses: null
  comission_settlement_statuses_id: number
  iva_amount: string
  iva_percentage: number
  total_amount: string
  created_by: number | null
  updated_by: number | null
  created_at: string
  updated_at: string
}

export interface IFiduciaryCommissionList {
  id: number
  base_amount: string
  business_code_snapshot: string
  business_name_snapshot: string
  business_trust_commissions_id: number
  comission_settlement_statuses: null
  comission_settlement_statuses_id: number
  iva_amount: string
  iva_percentage: number
  total_amount: string
  created_by: number | null
  updated_by: number | null
  created_at: string
}

export interface IFiduciaryCommissionForm {
  base_amount: number | string | null
  iva_amount: number | string | null
  iva_percentage: number | null
  total_amount: number | string | null
}

export interface IFiduciaryCommissionLiquidate {
  ids: number[]
}
