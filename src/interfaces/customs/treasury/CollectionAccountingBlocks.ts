export interface ICollectionAccountingBlocksResponse {
  id?: number
  code?: string
  description?: string
  collection_structure?: IStructure
  accounting_structure?: IStructure
  cost_center_structure?: IStructure
  budget_structure?: {
    id: number,
    formatted_structure: string
    budget_item_code: string
    budget_resource_code: string
    responsability_area_code: string
  }
  cash_flow_structure?: IStructure
  business?: IBusiness[]
  created_by?: number
  updated_by?: number | null
  collection_structure_id?: number
  accounting_structure_id?: number
  cost_center_structure_id?: number | null
  budget_structure_id?: number | null
  cash_flow_structure_id?: number | null
}

export interface ICollectionAccountingBlocksForm {
  id?: number
  code?: string
  description?: string
  collection_structure_name?: string
  accounting_structure_name?: string
  cost_center_structure_name?: string
  budget_structure_name?: string
  cash_flow_structure_name?: string
}

export interface IBusiness {
  id: number
  business_code: string
  name: string
}

export interface IStructure {
  id: number
  code: string
  name?: string
  code_name?: string
  business_code?: string
  structure: string
  purpose?: string
}

export interface ICollectionAccountingParameterResponse {
  id: number
  code: string
  description: string
  account_chart: ICollectionAccountingParameterIAccountChart
  cost_center: ICollectionAccountingParameterICenterCost
  third_party_type: string
  third_party: ICollectionAccountingParameterThirdParty
  distributes_business_percentage: boolean
  cash_flow_structure: ICollectionAccountingParameterCashFlowStructure
  created_by: number
  updated_by: number
}

export interface ICollectionAccountingParameterIAccountChart {
  id: number
  code: string
  name: string
}

export interface ICollectionAccountingParameterICenterCost {
  id: number
  code: string
  name: string
  status_id?: number
  status?: {
    id?: number
  }
  type?: string
  estructura?: string
  purpose?: string
}

export interface ICollectionAccountingParameterThirdPartys {
  id: number
  document: string
  document_type: ICollectionAccountingParameterDocumentType
  name: string
  natural_person: ICollectionAccountingParameterNaturalPerson
  type: string
  contacts: IContact[]
}

export interface ITypeDocument {
  name: string
  abbreviation: string
}

export interface INaturalPerson {
  name: string
  last_name: string
}

export interface IContact {
  id: number
  third_party_id: number
  contact_type: string
  contact_value: string
  is_main: boolean
  created_at: string
  updated_at: string
}

export interface ICollectionAccountingParameterCashFlowStructure {
  id: number
  code: string
  structure_code: string
  type: string
  name: string
  nature: string
  activity_group: string
}

// Parametros contables de recaudo
export interface ICollectionAccountingParameterList {
  id: number
  code: string
  description: string
  account_chart: GenericObject
  cost_center: GenericObject
  third_party_type: string
  third_party: ICollectionAccountingParameterThirdParty
  distributes_business_percentage: boolean
  cash_flow_structure: ICollectionAccountingParameterCashFlowStructure
  budget_area: IBugetStructure
  budget_document_type: IBugetStructure
  budget_item: IBugetStructure
  budget_movement_code: IBugetStructure
  budget_resource: IBugetStructure
  created_by: number
  updated_by: number
}

export interface GenericObject {
  id: number
  code: string
  name: string
}

export interface CashFlowStructure {
  id: number
  code: string
  structure_code: string
  type: string
  name: string
  nature: string
  activity_group: string
}

interface ICollectionAccountingParameterThirdParty {
  id: number
  document: string
  document_type: ICollectionAccountingParameterDocumentType
  name: string
  natural_person: ICollectionAccountingParameterNaturalPerson
  type: string
  contacts: object[]
  addresses: object[]
  financialInfo: null
  fundingSourceLegalPerson: null
  fundingSourceNaturalPerson: null
}

interface ICollectionAccountingParameterDocumentType {
  name: string
  abbreviation: string
}

interface ICollectionAccountingParameterNaturalPerson {
  name: string
  second_last_name: null
  middle_name: null
  last_name: string
}

// Bloques contables de recaudo
export interface ICollectionAccountingBlocksList {
  id: number
  code: string
  description: string
  collection_structure: ICollectionAccountingBlocksStructure
  accounting_structure: ICollectionAccountingBlocksStructure
  cost_center_structure: ICollectionAccountingBlocksStructure
  budget_structure: ICollectionAccountingBlocksStructure
}

export interface ICollectionAccountingBlocksStructure {
  id: number
  code: string
  structure: string
}

interface IBugetStructure {
  id: number
  code: string
  description: string
}
