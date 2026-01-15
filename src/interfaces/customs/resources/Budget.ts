import { IGenericResource } from './Common'

export interface IBudgetLevelResource extends IGenericResource {
  level: string
  class: string
}

export interface IMovementCodeResource extends IGenericResource {
  movement_code: string
  movement_description: string
}

export interface IOperationLogs extends IGenericResource {
  total_value: number
  date: string
  operation_log_details: OperationDetails[]
}

interface OperationDetails {
  id: number
  operation_log_id: number | null
  year: number | null
  month: number | null
  day: number | null
  areas_responsibility_id: number | null
  code_movements_source_destination_id: number | null
  budget_item_id: number | null
  budget_resource_id: number | null
  value: string | null
  adjusted_value: string | null

  milestone_assigned: MilestoneAssigned[]
}

interface MilestoneAssigned {
  temporal_id: string | null
  value_assigned: number | null
  value_milestone?: number | null
  associated_budget_records_id: number | null
}
export interface IBudgeNfiResource extends IGenericResource {
  budgetItem: {
    id: number
    code: string
    description: string
  }
  budgetResourceType: {
    id: number
    code: string
    description: string
  }
  responsabilityArea: {
    id: number
    code: string
    description: string
  }
}
export interface IOperationLogsAuthorized extends IGenericResource {
  observations: string
  total_value: number
  date: string
  budget_document_type_id: number
  budget_document_type: {
    id: number
    code: string | null
    description: string | null
  }
  operation_log_details: OperationDetails[]
  operation_label: string
}
export interface IAccountingBudgetMappingParameters extends IGenericResource {
  id: number
  business_trust: null
  code_movement: string | null
  budgetItem: {
    type: string | null
    nature: string | null
    id: number
    code: string | null
    description: string | null
  }
  budgetResourceType: {
    id: number
    code: string | null
    description: string | null
  }
  budgetResource: {
    id: number
    code: string | null
    description: string | null
  }
  responsabilityArea: {
    id: number
    code: string | null
    description: string | null
    type: string | null
    description_cost_center: string | null
    description_auxiliary: string | null
  }
}
export interface IBudgetBusinessTrustResource extends IGenericResource {
  business_code: string
  id: number
  name: string
  description: string
}

export interface IThirdPartyDocumentResource extends IGenericResource {
  document: string
  natural_person: {
    full_name: string
  }
  legal_person: {
    business_name: string
  }
}

export interface IBudgeNfiResource extends IGenericResource {
  budgetItem: {
    id: number
    code: string
    description: string
  }
  budgetResourceType: {
    id: number
    code: string
    description: string
  }
  responsabilityArea: {
    id: number
    code: string
    description: string
  }
}

export interface IBudgeTransferDetail extends IGenericResource {
  responsibility_area: {
    id: number
    code: string
    description: string
    type: string
  }
  area_resposability: {
    id: number
    code: string
    description: string
    type: string
  }
  budget_item: {
    id: number
    code: string
    description: string
    type: string
    nature: string
  }
  resource: {
    id: number
    code: string
    description: string
    type: string
  }
  budget_resource: {
    id: number
    code: string
    description: string
    type: string
  }
}

export interface IBudgetDocumentNumber extends IGenericResource {
  id: number
  operation_type: string
  label: string
}

export interface IBudgetDocumentTypeResource extends IGenericResource {
  id: number
  description: string
  code: string
  business_transfer_parameters?: {
    one_to_one: number
    from_business_source_id: number
    to_business_source_id: number
    from_business_target_id: number
    to_business_target_id: number
  }
}

export interface IBudgetDocumentTypeByBusinessResource extends IGenericResource {
  id: number
  description: string
  code: string
}

export interface IBudgetClosuresResource extends IGenericResource {
  id: number
  business_trust_budget_id: number
  business: {
    id: number
    business_code: string
    name: string
    business: string
    current_period: string
  }
  label: string
}
