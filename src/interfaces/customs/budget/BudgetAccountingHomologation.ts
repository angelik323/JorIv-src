export interface IBudgetAccountingHomologationItem {
  id: number
  business: null | {
    id: number
    business_code: string
    name: string
    business: string
    current_period: string
  }
  validity: number
  document_type: {
    id: number
    code: string
    description: string
  }
  document_number: string
  voucher_id: number
  homologation_date: string
  status: {
    id: number
    status: string
  }
  is_from_operation_log: boolean
  document_type_operation: string
}

export interface IHomologationPendingDocumentsItem {
  id: number
  business: null | {
    id: number
    business_code: string
    name: string
    business: string
    current_period: string
  }
  validity: number
  document_type: {
    id: number
    code: string
    description: string
  }
  budget_resource: {
    id: number
    code: string
    description: string
  }
  budget_item: {
    id: number
    code: string
    description: string
  }
  area: {
    id: number
    code: string
    description: string
  }
  code_movement: {
    id: number
    code: string
    description: string
  }
  document_number: string
  voucher_id: number
  homologation_date: string
  is_from_operation_log: boolean
  document_type_operation: string
  status?: number
}

export interface IBudgetAccountingHomologationModel {
  business_trust_id: number | null
  business_trust_description: string | null
  budget_item_id: number | null
  responsability_area_id: number | null
  budget_resource_id: number | null
  budget_document_type_id: number | null
  code_movement_id: number | null
  voucher_type_id: number | null
  sub_voucher_type_id: number | null
  nature: string | null
  source_accounting_account_id: number | null
  counterpart_accounting_account_id: number | null
  source_cost_center_id: number | null
  counterpart_cost_center_id: number | null
  source_auxiliary_id: number | null
  counterpart_auxiliary_id: number | null
}

export interface IBudgetAccountingHomologationPayload {
  operation_log_id: number
  homologation_date: string
  is_from_operation_log: boolean
  validity: string
  confirm_create: boolean
}

export interface IBudgetHomologationProcessData {
  business: string
  validty: number
  document_type: string
  document_number: number
  document_type_operation: string
  resource: string
  budget_item: string
  area: string
  code_movement: string
  reciept_type: {
    id: number
    code: number
    name: string
    status_id: number
  }
  sub_reciept_type: {
    id: number
    code: number
    name: string
    receipt_type_id: number
    status_id: number
    receipt_type: {
      id: number
      code: number
      name: string
      type: string
    }
  }
  errors: [string]
  voucher_id: number
  successfully_homologated: boolean
}

export interface IBudgetAccountingHomologationRead {
  id: number
  business: {
    id: number
    business_code: string
    name: string
  }
  validity: number
  document_type: {
    id: number
    code: string
    description: string
  }
  document_number: number
  voucher_data: {
    id: number
    receipt_type: {
      id: number
      code: number
      name: string
    }
    sub_receipt_type: {
      id: number
      code: number
      name: string
    }
  }
  homologation_date: string
  is_from_operation_log: true
  resource: {
    id: number
    code: string
    description: string
  }
  budget_item: {
    id: number
    code: string
    description: string
    budget_structure: null
    resource_structure: null
    accounting_structure: null
  }
  area: {
    id: number
    code: string
    description: string
  }
  code_movement: {
    id: number
    movement_code: string
    movement_description: string
  }
  value: string
  period: string
  source_accounting_account_id: {
    code: string
    description: string
  }
  source_cost_center_id: {
    code: string
    name: string
  }
  source_auxiliary_id: {
    id: number
    full_name_code: string
  }
  counterpart_accounting_account_id: {
    code: string
    description: string
  }
  counterpart_cost_center_id: {
    code: string
    name: string
  }
  counterpart_auxiliary_id: {
    id: number
    full_name_code: string
  }
}
