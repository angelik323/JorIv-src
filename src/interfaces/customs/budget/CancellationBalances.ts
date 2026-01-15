export interface IListBudgetDocuments {
  id?: number
  cancellation_id?: number
  document_number?: number
  business_trusts_ids?: number[]
  movement_code?: string
  movement_description?: string
  cancelation_movement_code?: string
  cancelation_movement_description?: string
  budget_item_code?: string
  budget_item_description?: string
  budget_resource_code?: string
  budget_resource_description?: string
  area_responsibility_code?: string
  area_responsibility_description?: string
  balance?: number
  balance_cancellation?: number
  is_from_operation_log?: boolean
}

export interface ICreateCancellationBalancePayload {
  cancellation_value: string
  operation_log_id?: number
  budget_transfer_id?: number
  is_from_operation_log?: boolean
}

export interface IUpdateCancellationBalancePayload {
  cancellation_value: string
}
