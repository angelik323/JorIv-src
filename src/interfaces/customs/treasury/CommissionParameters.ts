export interface ICommissionParametersForm {
  accounting_blocks_collection_id: number | null
  account_chart_id: number | null
  cost_center_id: number | null
  aux_type: string | null
  third_party_id: number | null
  cash_flow_structure_id: number | null
  contra_account_chart_id: number | null
  contra_cost_center_id: number | null
  contra_aux_type: string | null
  contra_third_party_id: number | null
  contra_cash_flow_structure_id: number | null
  budget_item_id: number | null
  budget_area_id: number | null
  budget_resource_id: number | null
  budget_document_type_id: number | null
  budget_movement_code_id: number | null
}

export interface ICommissionParametersList {
  id: number
  accounting_blocks_collection: AccountingBlocksCollection
  account_chart: {
    id: number
    code: string
    name: string
  }
  cost_center: {
    id: number
    code: string
    name: string
  }
  aux_type: string | null
  third_party: ThirdParty
  cash_flow_structure: {
    id: number
    code: string
    name: string
  }
  contra_account_chart: {
    id: number
    code: string
    name: string
  }
  contra_cost_center: {
    id: number
    code: string
    name: string
  }

  contra_aux_type: string | null
  contra_third_party: ThirdParty
  contra_cash_flow_structure: {
    id: number
    code: string
    name: string
  }
  budget_item: BudgetDetail
  budget_area: BudgetDetail
  budget_resource: BudgetDetail
  budget_document_type: BudgetDetail
  budget_movement_code: BudgetDetail
  created_by: number | null
  updated_by: number | null
}

interface AccountingBlocksCollection {
  id: number
  code: string
  description: string
  collection_structure: Structure
  accounting_structure: Structure
  cost_center_structure: Structure
  budget_structure: unknown
  business: Business[]
}

interface Structure {
  id: number
  code: string
  structure: string
  purpose: string
}

interface Business {
  id: number
  business_code: string
  name: string
}

interface ThirdParty {
  id: number
  document: string
  document_type: {
    name: string
    abbreviation: string
  }
  name: string
  natural_person: {
    name: string
    last_name: string
  }
  type: string
  contacts?: Contact[]
}

interface Contact {
  id: number
  third_party_id: number
  contact_type: string
  contact_value: string
  is_main: boolean
  created_at: string
  updated_at: string
}

interface BudgetDetail {
  id: number
  code: string
  description: string
}