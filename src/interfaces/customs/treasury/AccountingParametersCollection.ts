export interface IAccountingParametersCollections {
  id?: number
  code: string
  description: string
  account_chart?: {
    id: number
    code: string
    name: string
  }
  collection_concept?: {
    description: string
    id: number
    structure_code: string
  }
  cost_center?: {
    id: number
    code: string
    name: string
  }
  third_party_type: string
  third_party?: {
    id: number
    name: string
  }
  distributes_business_percentage: boolean
  cash_flow_structure?: {
    id: number
    code: string
    structure_code: string
    type: string
    name: string
    nature: string
    activity_group: string
  }
  accounting_blocks_collection_id?: number | null
  budget_area: IBudgetStructure | null
  budget_document_type: IBudgetStructure | null
  budget_item: IBudgetStructure | null
  budget_movement_code: IBudgetStructure | null
  budget_resource: IBudgetStructure | null
}

export interface IAccountingParametersCollectionsForm {
  third_party_type: string | null
  third_party_id?: number | null
  third_party_name?: string | null
  account_chart_id: number | null
  account_chart_code?: string | null
  accounting_blocks_collection_id?: number | null
  accounting_blocks_collection_code?: string | number | null
  collection_concept_id?: number | null
  cost_center_id: number | null
  cost_center_code?: string | null
  distributes_business_percentage: boolean
  description: string
  cash_flow_structure_id: number | null
  cash_flow_structure_code?: string | null
  budget_item_id: number | null
  budget_area_id: number | null
  budget_resource_id: number | null
  budget_document_type_id: number | null
  budget_movement_code_id: number | null
}

interface IBudgetStructure {
  id: number
  code: string
  description: string
}

export interface IAccountingParametersCollectionsList
  extends Array<IAccountingParametersCollections> {}
