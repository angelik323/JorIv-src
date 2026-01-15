export interface ICancellationRejectionReasonsItem {
  id: number
  reason_type: string
  reason_code: string
  description: string
  has_reports_dian: boolean
  is_applies_tax_refund: boolean
}

export interface ICancellationRejectionReasonsForm {
  reason_code: string | null
  reason_type: string | null
  description: string | null
  has_reports_dian: boolean
  is_applies_tax_refund: boolean
}
