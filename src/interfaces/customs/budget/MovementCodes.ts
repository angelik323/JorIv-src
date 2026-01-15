export interface IMovementCodesBasicDataForm {
  id?: number
  movement_code?: string
  movement_description?: string
  validity?: string
  is_derived_contract?: boolean
  cancellation_code_id?: number | null
  cancellation_code?: string
  cancellation_code_description?: string
  balance_cancellation_code_id?: number | null
  balance_cancellation_code?: string
  balance_cancellation_code_description?: string
}

export interface IMovementCodesBasicDataResponse {
  id?: number
  movement_code?: string
  movement_description?: string
  validity?: string
  is_derived_contract?: boolean
  cancellation_code_id?: number | null
  cancellation_code?: string
  cancellation_code_description?: string
  balance_cancellation_code_id?: number | null
  balance_cancellation_code?: string
  balance_cancellation_code_description?: string
}

export interface IMovementCodesDestinationResponse {
  id?: number | null
  module?: string
  source_id?: number | null
  movement_source_code?: string
  movement_source_description?: string
  destination_id?: number | null
  movement_destination_code?: string
  movement_destination_description?: string
}
