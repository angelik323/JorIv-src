export interface IAmortizationAdvanceCommissionResponse {
  id: number
  invoice_number: string
  accumulated_amortization: string
  amortized_value: string
  balance_amortized: string
  invoice_total: string
  number_of_amortizations: number
  amortization_start_date: string | null
  amortization_end_date: string | null
  amortizations?: IAmortizationAdvanceCommissionDetail[]
  business_code_snapshot: string
  business_name_snapshot: string
  generation_commission_invoices_id: number
  status: {
    id: number
    name: string
    created_by: string | null
    created_at: string
    updated_at?: string
  }
  status_id: number
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
  amortization_date: string | null
}

export interface IAmortizationAdvanceCommissionDetail {
  id: number
  number_invoice: string
  amortization_date: string
  amortized_value: number
  status: {
    id: number
    name: string
  }
  cancellation_reason: string | null
}

export interface IAmortizationAdvanceCommissionItemList {
  id: number
  name_business: string
  number_invoice: string
  amortization_accumulated: number
  total_invoice_amount: number
}

export interface IAmortizationAdvanceCommissionInformationForm {
  invoice_number: string | null
  amortization_start_date: string | null
  balance_amortized: number | null
  accumulated_amortization: number | null
  amortized_value: number | null
  invoice_total: number | null
}

export interface IAmortizationAdvanceCommissionCreate {
  id: number | null
  invoice_number: string
  accumulated_amortization: string
  amortized_value: string | number
  balance_amortized: string
  invoice_total: string
  number_of_amortizations?: number
  amortization_start_date?: string | null
  amortization_end_date?: string | null
  amortizations?: IAmortizationAdvanceCommissionDetail[]
  business_code_snapshot?: string
  business_name_snapshot?: string
  generation_commission_invoices_id?: number
  status?: {
    id: number
    name: string
    created_by: string | null
    created_at: string
    updated_at?: string
  }
  status_id?: number
  created_at?: string
  updated_at?: string
  created_by?: string | null
  updated_by?: string | null
}
