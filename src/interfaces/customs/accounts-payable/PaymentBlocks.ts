export interface IPaymentBlockFilters {
  'filter[id]': string
  'filter[accounting_structure_id]': string
  'filter[payment_structure_id]': string
  'filter[budget_requirement_id]': string
}

export interface IPaymentConceptFilters {
  'filter[search]': string
}

export interface IPaymentBlockForm {
  id?: number | null
  block_code: string
  block_name: string
  accounting_structure_id: number | null
  payment_structure_id: number | null
  budget_requirement_id: number | null
}

export interface IPaymentBlockItem {
  id: number
  block_code: string
  block_name: string
  accounting_structure_id: number
  accounting_structure_code: string
  accounting_structure_description: string
  payment_structure_id: number
  payment_structure_code: string
  payment_structure_description: string
  budget_requirement_id: number
  budget_requirement_code: string
  created_at: string
  updated_at: string
  deleted_at: string
}

export interface IPaymentConceptItem {
  id: number | null
  payment_block_id: number | null
  payment_concept_id: number | null
  payment_concept_code: string
  payment_concept_name: string
  obligation_type: string
  obligation_type_label: string
  nature_type: string
  nature_type_label: string
  activity_type: string
  activity_type_label: string
  from_budget_item_id: number | null
  from_budget_item_code: string
  to_budget_item_id: number | null
  to_budget_item_code: string
  from_budget_resource_id: number | null
  from_budget_resource_code: string
  to_budget_resource_id: number | null
  to_budget_resource_code: string
  created_at: string
  updated_at: string
  settlement_concepts: ISettlementConcepts[]
}

export interface ISettlementConcepts {
  id: number
  payment_block_payment_concept_id: number | null
  settlement_concept_id: number | null
  settlement_concept_code: string
  settlement_concept_name: string
  is_main_concept: boolean
  created_at: string
  updated_at: string
}

export interface IPaymentConceptUpdate {
  block_code: string
  block_name: string
  obligation_type: string
  from_budget_item_id: number | null
  to_budget_item_id: number | null
  from_budget_resource_id: number | null
  to_budget_resource_id: number | null
  from_budget_item_code: string | null
  to_budget_item_code: string | null
  from_budget_resource_code: string | null
  to_budget_resource_code: string | null
}

export interface ISettlementConceptsUpdate {
  settlement_concept_id: number | null
  settlement_concept_code: string
  settlement_concept_name: string
  is_main_concept: boolean
}

export interface IBusinessesPaymentBlock {
  id: number
  business_code: string
  name: string
  start_date: string
  end_date: string
  has_extend: boolean
  status_id: number
  status_name: string
}
