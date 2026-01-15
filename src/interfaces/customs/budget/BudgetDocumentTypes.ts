export interface IBudgetDocumentTypeItem {
  id: number
  code: string
  description: string
  level?: {
    id: number
    name: string
    description: string
  }
  validity: boolean
  requires_authorization: boolean
  allows_adjustments: boolean
  validity_closure: boolean
  creates_new_document: boolean
  allows_additions: boolean
  allows_deductions: boolean
  validates_area: boolean
  requires_city: boolean
  requires_balance_validation_by_document_type: boolean
  has_expiration_date: boolean
  expiration_periodicity: null | string
  numbering_type: null | string
  budget_document_type_balance_validations: []
  index?: number
  selected?: boolean
}

export interface IBugdetDocumentTypeResponse {
  budget_level_id: number | null
  code: string
  description: string
  validity: string | null
  requires_authorization: boolean
  allows_adjustments: boolean
  validity_closure: boolean
  creates_new_document: boolean
  allows_additions: boolean
  allows_deductions: boolean
  validates_area: boolean
  requires_city: boolean
  requires_balance_validation_by_document_type: boolean
  has_expiration_date: boolean
  expiration_periodicity: null | string
  numbering_type: null | string
  budget_document_type_balance_validations: IBalanceValidationItemModel[]
}

export interface IBudgetDocumentTypeBalanceValidationItem {
  id: number
  budget_structure: {
    id: number
    name: string
  }
  movement_code: {
    id: number
    code: string
    description: string
  }
  budget_level: {
    id: number
    code: string
    description: string
  }
  document_type: {
    id: number
    code: string
    description: string
  }
  index?: number
  selected?: boolean
}

export interface IBalanceValidationItemResponse {
  id: number
  budget_structure_id: number
  budget_item_structure: {
    code: string | null
    description: string | null
  }
  resource_structure: {
    code: string | null
    description: string | null
  }
  area_structure: {
    code: string | null
    description: string | null
  }
  movement_code: {
    id: number
    code: string | null
    description: string | null
  }
  movement_code_description: string | null
  balance_validation_level: {
    id: number
    code: string
    description: string
    level: string
  }
  balance_validation_level_description: string | null
  validates_document_type: {
    id: number
    code: string
    description: string
    validates_document_type: boolean
  }
  index?: number
}

export interface IDocumentTypeStoreModel {
  id?: number
  budget_level_id: number | null
  code: string
  description: string
  validity: string | null
  requires_authorization: boolean
  allows_adjustments: boolean
  validity_closure: boolean
  creates_new_document: boolean
  allows_additions: boolean
  allows_deductions: boolean
  validates_area: boolean
  requires_city: boolean
  requires_balance_validation_by_document_type: boolean
  has_expiration_date: boolean
  expiration_periodicity?: null | string
  numbering_type: null | string
  balance_validations?: IBalanceValidations[]
}

export interface IBalanceUpdate {
  validates_document_type: boolean
  validated_document_type_id: number
  balance_validation_level_id: number
}

export interface IBalanceValidations {
  budget_accounting_mapping_parameter_id: number | null
  code_movement_id: number | null
  balance_validation_level_id: number | null
  validates_document_type: boolean
  validated_document_type_id: number | null
}

export interface IBalanceValidationItemModel {
  id?: number
  accounting_budget_mapping_parameter_id: number | null
  budget_item_structure: string | null
  resource_structure: string | null
  area_structure: string | null
  code_movement_id: string | null
  movement_code_description: string | null
  balance_validation_level_id: string | null
  balance_validation_level_description: string | null
  validates_document_type: boolean
  validated_document_type_id: number | null
  validated_document_type_description: string | null
}
