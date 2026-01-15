export interface IAccountingBudgetParameterItem {
  id: number
  nature: null | string
  business_trust: null | {
    id: number
    business_code: string
    name: string
    business: string
    current_period: string
  }
  business_trust_id: number
  accounting_account: {
    id: number
    code_account: string
    code: string
  }
  from_cost_center: {
    id: number
    code: string
    name: string
  }
  to_cost_center: {
    id: number
    code: string
    name: string
  }
  from_voucher_type: {
    id: number
    label: string
    value: number
    related: [
      {
        label: string
        value: number
      }
    ]
  }
  to_voucher_type: {
    id: number
    label: string
    value: number
    related: [
      {
        label: string
        value: number
      }
    ]
  }
  from_auxiliary: {
    id: number
    full_name_code: string
  }
  to_auxiliary: {
    id: number
    full_name_code: string
  }
  code_movement_treasury: {
    id: number
    code: string
    description: string
    nature: string
    handles_accounting_offset: boolean
  }
  budget_resource: {
    id: number
    description: string
    code: string
  }
  budget_document_type: {
    id: number
    code: string
    description: string
  }
  budget_item: {
    id: number
    code: string
    description: string
  }
  responsability_area: {
    id: number
    code: string
    description: string
  }
  code_movement: {
    id: number
    code: string
    description: string
  }
}

export interface IBudgetAccountingParameterItem {
  id: number
  business_trust: null | {
    id: number
    business_code: string
    name: string
    business: string
    current_period: string
  }
  business_trust_id: number
  voucher_type: {
    id: number
    label: string
    value: number
    related: [
      {
        label: string
        value: number
      }
    ]
  }
  sub_voucher_type: {
    label: string
    value: number
  }
  source_accounting_account: {
    id: number
    code_account: string
    code: string
  }
  counterpart_accounting_account: {
    id: number
    code_account: string
    code: string
  }
  source_cost_center: {
    id: number
    code: string
    name: string
  }
  counterpart_cost_center: {
    id: number
    code: string
    name: string
  }
  source_auxiliary: {
    id: number
    full_name_code: string
  }
  counterpart_auxiliary: {
    id: number
    full_name_code: string
  }
  budget_item_id: number
  responsability_area_id: number
  budget_document_type_id: number
  code_movement_id: number
  nature: string
  budget_resource: {
    id: number
    code: string
    description: string
  }
  responsability_area: {
    id: number
    code: string
    description: string
  }
  budget_item: {
    id: number
    code: string
    description: string
  }
  code_movement: {
    id: number
    code: string
    description: string
  }
  budget_document_type: {
    id: number
    code: string
    description: string
  }
}

export interface IBudgetAccountingHomologationParameterModel {
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

export interface IAccountingBudgetHomologationParameterModel {
  business_trust_id: number | null
  business_trust_description: string | null
  accounting_account_id: number | null
  accounting_account_description: string | null
  nature: string | null
  from_cost_center_id: number | null
  from_cost_center_description: string | null
  to_cost_center_id: number | null
  to_cost_center_description: string | null
  from_voucher_type_id: number | null
  from_voucher_type_description: string | null
  to_voucher_type_id: number | null
  to_voucher_type_description: string | null
  from_auxiliary_id: number | null
  from_auxiliary_description: string | null
  to_auxiliary_id: number | null
  to_auxiliary_description: string | null
  code_movement_treasury_id: number | null
  code_movement_treasury_description: string | null
  budget_resource_id: number | null
  budget_resource_description: string | null
  responsability_area_id: number | null
  responsability_area_description: string | null
  budget_document_type_id: number | null
  budget_document_type_description: string | null
  budget_resource_type_id: number | null
  budget_resource_type_description: string | null
  budget_item_id: number | null
  budget_item_description: string | null
  code_movement_id: number | null
  code_movement_description: string | null
}

export interface IAccountingBudgetHomologationParameterPayload {
  business_trust_id: number | null
  accounting_account_id: number | null
  nature: string | null
  from_cost_center_id: number | null
  to_cost_center_id: number | null
  from_voucher_type_id: number | null
  to_voucher_type_id: number | null
  from_auxiliary_id: number | null
  to_auxiliary_id: number | null
  code_movement_treasury_id: number | null
  budget_resource_id: number | null
  responsability_area_id: number | null
  budget_document_type_id: number | null
  budget_item_id: number | null
  code_movement_id: number | null
}

export interface IBudgetAccountingHomologationParameterPayload {
  business_trust_id: number | null
  budget_item_id: number | null
  responsability_area_id: number | null
  budget_resource_type_id: number | null
  code_movement_id: number | null
  voucher_type_id: number | null
  sub_voucher_type_id: number | null
  nature: 'D' | 'C' | null
  source_accounting_account_id: number | null
  counterpart_accounting_account_id: number | null
  source_cost_center_id: number | null
  counterpart_cost_center_id: number | null
  source_auxiliary_id: number | null
  counterpart_auxiliary_id: number | null
}
