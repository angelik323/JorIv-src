export interface IPaymentConceptsItem {
  id?: number
  structure_id: number
  structure_code: string
  concept_code: string
  concept_name: string
  concept_type: {
    value: string
    label: string
  }
  nature_type: {
    value: string
    label: string
  }
  activity_type: {
    value: string
    label: string
  }
  obligation_type: {
    value: string
    label: string
  }
  pension_type: {
    value: string
    label: string
  } | null
  liquidates_taxes: boolean
  is_advance: boolean
  created_at: string
  updated_at: string
}

export interface IPaymentConceptsForm {
  structure_id: number | null
  concept_code: string | null
  concept_name: string | null
  concept_type: string | null
  nature_type: string | null
  activity_type: string | null
  obligation_type: string | null
  pension_type: string | null
  liquidates_taxes: boolean
  is_advance: boolean
}

export interface IPaymentConceptsItemFileValidation
  extends IPaymentConceptsItem {
  structure_code: string
  has_error: boolean
  row_number: number
  error_message: string | null
}

export interface IPaymentConceptsItemFileValidationCreate
  extends IPaymentConceptsForm {
  structure_code: string
  has_error: boolean
  row_number: number
  error_message: string | null
  structure_purpose: string | null
  structure_structure: string | null
  concept_code_length: number
  disabled_pension_type: boolean
  disabled_liquidates_taxes: boolean
  disabled_is_advance: boolean
}

export interface IPaymentConceptsFileValidationResponse {
  error_rows: IPaymentConceptsItemFileValidation[]
  summary: {
    errors: number
    has_errors: number
    success: 1
    total: 1
  }
  validated_rows: IPaymentConceptsItemFileValidation[]
}

export interface IPaymentConceptsCreateBulkResponse {
  error_count: number
  success_count: number
}

export interface IPaymentConceptsErrorsFileValidationPayload {
  errors: IPaymentConceptsItemFileValidation[]
}

export interface IPaymentConceptsCreateBulkPayload {
  concepts: IPaymentConceptsItemFileValidationCreate[]
}
