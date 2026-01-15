export interface IBudgetTransferBusinessData {
  id: number
  business_code: string
  name: string
  business: string
  current_period: string | null
}
export interface IBudgetTransferBusiness {
  id: number | null
  budget_document_type_id: number | null
  code: string
  document_type: string
  from_business_source: IBudgetTransferBusinessData | null
  to_business_source: IBudgetTransferBusinessData | null
  from_business_target: IBudgetTransferBusinessData | null
  to_business_target: IBudgetTransferBusinessData | null
  one_to_one: boolean | number | null
}

export interface IBudgetTransferAreaParameter {
  id: number
  from_area_source_id: number
  to_area_source_id: number
  from_area_target_id: number
  to_area_target_id: number
  business_transfer_parameter_id: number
}

export interface IBudgetTransferBudgetItemParameter {
  id: number
  from_budget_item_source_id: number
  to_budget_item_source_id: number
  from_budget_item_target_id: number
  to_budget_item_target_id: number
  business_transfer_parameter_id: number
}

export interface IBudgetTransferAPIResponse {
  business: IBudgetTransferBusiness
  area_transfer_parameters: IBudgetTransferAreaParameter[]
  budget_item_transfer_parameters: IBudgetTransferBudgetItemParameter[]
}

export interface IBudgetTransferListItem {
  business: IBudgetTransferBusiness
  area_transfer: {
    id: number
    from_area_source: string | null
    to_area_source: string | null
    from_area_target: string | null
    to_area_target: string | null
  }
  budget_item_transfer: {
    id: number | null
    from_budget_item_source: string | null
    to_budget_item_source: string | null
    from_budget_item_target: string | null
    to_budget_item_target: string | null
  }
}

export interface IBudgetTransferBusinessCreate {
  budget_document_type_id: number | null
  code?: string | null
  document_type?: string // Solo para view (valor quemado del tipo de documento)
  from_business_source_id: number | null
  to_business_source_id: number | null
  from_business_target_id: number | null
  to_business_target_id: number | null
  one_to_one: number | boolean | null
  from_business_source_description?: string
  to_business_source_description?: string
  from_business_target_description?: string
  to_business_target_description?: string
}

export interface IBudgetTransferAreaCreate {
  id: number | null
  from_area_source_id: number | null
  from_description_area_source?: string | null
  to_area_source_id: number | null
  to_description_area_source?: string | null
  from_area_target_id: number | null
  from_description_area_target?: string | null
  to_area_target_id: number | null
  to_description_area_target?: string | null
}

export interface IBudgetTransferSectorCreate {
  id: number | null
  from_budget_item_source_id: number | null
  from_description_item_source?: string | null
  to_budget_item_source_id: number | null
  to_description_item_source?: string | null
  from_budget_item_target_id: number | null
  from_description_item_target?: string | null
  to_budget_item_target_id: number | null
  to_description_item_target?: string | null
}

export interface IBudgetTransferAreaUpdatePayload {
  id: number | null
  from_area_source_id: number | null
  to_area_source_id: number | null
  from_area_target_id: number | null
  to_area_target_id: number | null
}

export interface IBudgetTransferSectorUpdatePayload {
  id: number | null
  from_budget_item_source_id: number | null
  to_budget_item_source_id: number | null
  from_budget_item_target_id: number | null
  to_budget_item_target_id: number | null
}

export interface IBudgetTransferUpdateResponse {
  success: boolean
  data: IBudgetTransferAPIResponse
  message: string
}
