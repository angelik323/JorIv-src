export interface IFiduciaryCommissionListV2 {
  id: number
  business_trust_commissions_id: number
  comission_settlement_statuses_id: number
  period_start: string | null
  period_end: string | null
  period_code: number | null
  base_amount: string
  iva_percentage: number
  iva_amount: string
  retefuente_percentage: number | null
  retefuente_amount: number | null
  reteica_percentage: number | null
  reteica_amount: number | null
  reteiva_percentage: number | null
  reteiva_amount: number | null
  total_amount: string
  status: {
    id: number
    name: string
  }
  business_trust_commissions: {
    id: number
    business_id: number
    commission_type_id: number
    third_party_billings_id: number | null
    business_code_snapshot: string
    business_name_snapshot: string
    business_status_snapshot: number
    business_start_date_snapshot: string
    business_end_date_snapshot: string
    periodicity: string
    collection: string
    type_commission: {
      id: number
      code: string
      description: string
    }
    third_party_billing: {
      id: number
      name: string
      email: string
      phone: string
      document_type: string
      documennt: string
      address: string
    } | null
    billing_trust: {
      id: number
      business_id: number
      code: string
      start_date: string
      end_date: string
      periodicity: string
    }
  }
  created_by: number | null
  updated_by: number | null
  created_at: string
  updated_at: string | null
  settled_at: string | null
}

export interface IFiduciaryCommissionLiquidateV2 {
  commission_ids: number[]
}
