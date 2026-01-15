export interface IMovementManagementFilters {
  'filter[code_name]': string
  'filter[disbursement_type]': string
  'filter[status_id]': string
}

export interface IMovementManagementItem {
  id: number
  code: string
  code_name: string
  name: string
  disbursement_type: string
  disbursement_type_label: string
  has_handle_budget: boolean
  has_contract_execution: boolean
  has_generates_accrual: boolean
  has_compliance_without_treasury: boolean
  has_generates_treasury: boolean
  has_amortizes_fund: boolean
  status: {
    id: number
    name: string
    description: string
  }
}

export interface IMovementManagementForm {
  id?: number | null
  code_name: string | null
  name: string | null
  disbursement_type: number | string | null
  disbursement_type_label: string | null
  has_handle_budget: boolean
  has_requests_invoice: boolean
  has_contract_execution: boolean
  has_validates_final_act: boolean
  has_generates_accrual: boolean
  has_compliance_without_treasury: boolean
  has_generates_treasury: boolean
  has_amortizes_fund: boolean
  budget_reference_document_type_id: number | string | null
  budget_generate_document_type_id: number | string | null
  budget_generate_movement_id: number | string | null
  treasury_funds_payment_movement_id: number | string | null
  treasury_bank_payment_movement_id: number | string | null
  fund_movement_code_id: number | string | null
  accounting_accrual_subtype_id: number | string | null
  code: string | null
  status_id: number | null
  budget_reference_document_type_label?: string | null
  budget_generate_document_type_label?: string | null
  budget_generate_movement_label?: string | null
  treasury_funds_payment_movement_label?: string | null
  treasury_bank_payment_movement_label?: string | null
  fund_movement_code_label?: string | null
  accounting_accrual_subtype_label?: string | null
  status: {
    id: number
  } | null
  created_at: string | null
  updated_at: string | null
}

export interface IMovementManagementUpdatePayload {
  name: string | null
  has_handle_budget: boolean
  has_generates_accrual: boolean
  has_generates_treasury: boolean
  has_amortizes_fund: boolean
  has_contract_execution: boolean
  has_compliance_without_treasury: boolean
  has_requests_invoice: boolean
  has_validates_final_act: boolean
  budget_reference_document_type_id: number | null
  budget_generate_document_type_id: number | null
  budget_generate_movement_id: number | null
  fund_movement_code_id: number | null
  accounting_accrual_subtype_id: number | null
  treasury_funds_payment_movement_id: number | null
  treasury_bank_payment_movement_id: number | null
}

export interface IMovementManagementCreatePayload {
  name: string
  disbursement_type: string
  has_handle_budget: boolean
  has_generates_accrual: boolean
  has_generates_treasury: boolean
  has_amortizes_fund: boolean
  has_contract_execution: boolean
  has_compliance_without_treasury: boolean
  has_requests_invoice: boolean
  has_validates_final_act: boolean
  budget_reference_document_type_id: number
  budget_generate_document_type_id: number
  budget_generate_movement_id: number
  fund_movement_code_id: number
  accounting_accrual_subtype_id: number
  treasury_funds_payment_movement_id: number | null
  treasury_bank_payment_movement_id: number | null
}

export interface IMovementManagementFileResponse {
  inserted: number
  total: number
  errors: IMovementManagementFileError[]
}

export interface IMovementManagementFileError {
  row_number: number
  messages: string[]
}

export interface IMovementManagementFileErrorJson {
  summary: {
    total: number
    success: number
    errors: number
    has_errors: boolean
  }
  validated_rows: [] | IMovementManagementFileErrorJsonRow[]
  error_rows: [] | IMovementManagementFileErrorJsonRow[]
}

export interface IMovementManagementFileErrorJsonRow {
  row_number: number
  name: string
  disbursement_type: string
  has_handle_budget: boolean
  budget_reference_document_type_id: string | number | null
  budget_generate_document_type_id: string | number | null
  budget_generate_movement_id: string | number | null
  has_requests_invoice: boolean
  has_contract_execution: boolean
  has_validates_final_act: boolean
  has_generates_accrual: boolean
  accounting_accrual_subtype_id: string | number | null
  has_compliance_without_treasury: boolean
  has_amortizes_fund: boolean
  fund_movement_code_id: string | number | null
  has_generates_treasury: boolean
  treasury_funds_payment_movement_id: string | number | null
  treasury_bank_payment_movement_id: string | number | null
  has_error: boolean
  error_message: string
}

export interface IMovementManagementCreateBulkPayload {
  movement_codes: IMovementManagementFileErrorJsonRow[]
}
