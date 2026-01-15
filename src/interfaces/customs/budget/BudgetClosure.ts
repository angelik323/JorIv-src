// List view
export interface IBudgetClosureProcessListItem {
  id: number
  user_id: number
  user_name: string
  status: number
  status_name: string
  action_type: IBudgetClosureProcessType
  closure_type: IBudgetClosureClosureType
  created_at: string
  hour_created_at: string
  started_at: string | null
  completed_at: string | null
  execution_results: IBudgetClosureExecutionResult[]
  successful_count: number
  error_count: number
  request_data: IBudgetClosureRequestData
}

interface IBudgetClosureExecutionResult {
  business_id: number
  business_code: string
  closure_id: number
  closure_detail_id: number
  status: number
  closure_date: string
  details_count: number
  has_errors: boolean
}

interface IBudgetClosureRequestData {
  action_type: string
  closure_type: string
  business_from: number
  business_to: number
  closure_date: string
  last_closure_date: string
  businesses: IBudgetClosureBusiness[]
  selected_businesses: number[]
}

interface IBudgetClosureBusiness {
  id: number
  business_code: string
  name: string
  business: string
  current_period: string
  budget: IBudgetClosureBusinessBudget
}

interface IBudgetClosureBusinessBudget {
  id: number
  budget_structure_id: number | null
  validity: number
  current_month: number
  last_closing_date: string
  closing_type: string
  mhcp_section_code: string
  generic_area_id: number
  expense_authorizer_id: number
}

// Create view

export type IBudgetClosureProcessType = 'crear' | 'deshacer'
export type IBudgetClosureClosureType = 'diario' | 'mensual'

export interface IBudgetClosureBusinessItem {
  id: number
  business_code: string
  name: string
  business: string
  current_period: string
  budget: IBudgetClosureBudget
}

export interface IBudgetClosureBudget {
  id: number
  budget_structure_id: number
  validity: number
  current_month: string
  last_closing_date: string
  closing_type: string
  mhcp_section_code: string
  generic_area_id: number
  expense_authorizer_id: number
}

export interface IBudgetClosureCreateClosure {
  action_type: IBudgetClosureProcessType
  closure_type: IBudgetClosureClosureType
  business_from: number
  business_to: number
  closure_date: string
  selected_businesses: number[]
}

export interface IBudgetClosureCreateClosureResponse {
  job_id: string
  message: string
}

// Show view
export interface IBudgetClosureProcessInfo {
  id: number
  status: number
  status_name: string
  user_id: number
  user_name: string
  created_at: string
  started_at: string | null
  completed_at: string | null
  type_closure: string
  action_type: string
  period: string
  request_data: {
    action_type: string
    closure_type: string
    business_from: number
    business_to: number
    closure_date: string
    last_closure_date: string
  }
}

export interface IBudgetClosureProcessedBusinessListItem {
  id: number
  business_trust_budget_id: number
  business: {
    id: number
    business_code: string
    name: string
    business: string
    current_period: string
  }
  closure_type: string
  closure_date: string
  previous_closure_date: string
  period: string
  closure_status: string
  notes: string
  action_type: string
  created_by_id: number
  created_by: string
  created_at: string
  updated_at: string
}

export interface IBudgetClosureProcessedBusinessDocumentListItem {
  business_id: number
  business_code: string
  business_name: string
  closure_type: string
  closure_date: string
  last_closure_date: string
  status: number
  business_errors: string[]
  details: IBudgetClosureProcessedBusinessDocumentListItemDetail[]
  summary: {
    total_details: number
    details_with_errors: number
    successful_details: number
    total_error_count: number
  }
}

export interface IBudgetClosureProcessedBusinessDocumentListItemDetail {
  business_info: string
  document_type: string
  document_number: number
  level: string
  budget_item: string
  budget_resource: string
  area: string
  balance: number
  value: string
  combined_details_count: number
  closure_type: string
  closure_date: string
  last_closure_date: string
  status: number
  errors: {
    detail_id: number | null
    document_id: number
    error: string
    budget_item: string
    budget_resource: string
    area: string
  }[]
  error_count: number
  details_with_errors: (number | null)[]
}
