export interface ITypesContractingDocumentsList {
  id: number
  document_code: string
  document_name: string
  category: {
    id: number
    label: string
  }
  budget_validity: {
    id: number
    label: string
  }
  status_id: number
  created_at?: string
  updated_at?: string
}

export interface ITypesContractingDocumentsBasicDataForm {
  document_code?: string | null
  document_name: string | null
  category?: string | number | null
  numbering_type?: number | null
  business_numbering_type: number | null
  contract_type: number | null
  contract_value_in: number | null
  max_amount_allowed: number | null
  max_allowed_value: number | null
  modality: number | null
  has_work_plan: boolean
  has_supervisor: boolean
  has_stamp_tax: boolean
  status_id: number | null
  budget_validity: number | null
  avail_document_id: number | null
  avail_movement_id: number | null
  comm_document_id: number | null
  comm_movement_id: number | null
  bud_document_id: number | null
  bud_movement_id: number | null
}

export interface ITypesContractingDocumentsFlowStatesForm {
  id?: number | null
  type: string | number | null
  flow?: ITypesContractingDocumentsFlowParent[]
}

export interface ITypesContractingDocumentsFlowChild {
  id: number | null
  order_child: number | null
  status_child_id: number | null
  label: string | null
}

export interface ITypesContractingDocumentsFlowParent {
  id: number | null
  order_parent: number | null
  status_parent_id: number | null
  label: string | null
  description?: string | null
  children?: ITypesContractingDocumentsFlowChild[]
}

export interface IFlowRelationshipResponse {
  id: number | null
  order_parent: number | null
  order_child: number | null
  type: string | null
  status_flow_relationship: {
    parent_status_id: number | null
    parent_status: {
      id: number | null
      name: string | null
      description: string | null
    }
    child_status: {
      id: number | null
      name: string | null
      description: string | null
    }
  }
}

export interface ITypesContractingDocumentsRequest {
  document_type: ITypesContractingDocumentsBasicDataForm | null
  status_flow: ITypesContractingDocumentsFlowStatesForm | null
}

export interface ITypesContractingDocumentsResponse
  extends Omit<
    ITypesContractingDocumentsBasicDataForm,
    'budget_validity' | 'category'
  > {
  flow_relationships?: IFlowRelationshipResponse[]
  budget_validity: {
    id: number | null
  }
  category: {
    id: number | null
    label: string | null
  }
}
