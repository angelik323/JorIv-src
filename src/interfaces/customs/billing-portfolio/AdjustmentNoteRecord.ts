export interface IAdjustmentNoteRecordInformationForm {
  invoice_id: number | null
  invoice_number: string | null
  note_type: string
  affects: string
  amount: string | null
  adjustment_date: string
  observations: string
}

export interface IAdjustmentNote {
  id: number
  note_number: number
  note_type: string
  affects: string
  amount: string
  adjustment_date: string
  observations: string
  invoices_commissions_notes_id: number
  created_by: number
  updated_by: number | null
  created_at: string
  updated_at: string
}
export interface IInvoiceCommissionNote {
  id: number
  invoice_number: string | null
  invoice_total: string
  invoice_date: string
  business_code_snapshot: string
  business_name_snapshot: string
  third_party_billings_document_snapshot: string | null
  third_party_billings_name_snapshot: string | null
  generation_commission_invoices_id: number
  status_id: number
  created_by: number | null
  updated_by: number | null
  created_at: string
  updated_at: string
  status: IStatusAdjustmentNote
  adjustment_notes?: IAdjustmentNote | null
}

export interface IAdjustmentNoteRecordPayloadCreate {
  note_type: string
  affects: string
  amount: string
  adjustment_date: string
  observations: string
}

export interface IStatusAdjustmentNote {
  id: number
  name: string
  created_by: number | null
  created_at: string
  updated_at: string
}

export interface IInvoiceCommissionNoteListResponse {
  current_page: number
  data: IInvoiceCommissionNote[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: Array<{
    url: string | null
    label: string
    active: boolean
  }>
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}
