export interface IInvoiceGenerationResponse {
  id: number
  anulled_at: string | null
  observations: string | null
  business_code_snapshot: string
  invoice_number: string
  settled_commission: ISettledCommision
  status: {
    id: number
    name: string
  }
  created_by: number
  updated_by: number | null
  created_at: string
  updated_at: string
}

export interface IInvoiceGenerationForm {
  transmitter?: number | null
  method: string | null
  payday: number | null
  rows: IInvoiceGenerationList[] | null
  ids?: number[] | null
}

export interface ISettledCommision {
  business_code_snapshot: string
  business_name_snapshot: string
  commission_type_catalog: string
  commission_class_catalog: string
  observation: string
  base_amount: string
  iva_amount: string
  total_amount: string
  settlement_date: string
  created_by: number
  updated_by: number
  created_at: string
  updated_at: string
  status: {
    id: number
    name: string
  }
}
export interface IInvoiceGenerationList {
  id: number
  authorization_date: string
  business_code_snapshot: string
  commission_class_catalog: string
  commission_type_catalog: string
  expire_at: string
  status_id: number
  pdf_signed_url: string | null
  settled_commission: ISettledCommision
  created_by: number
  updated_by: number | null
  created_at: string
  updated_at: string
  status?: {
    id: number
    name: string
  }
}
