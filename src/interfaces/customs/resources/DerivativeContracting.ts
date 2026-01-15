import { IGenericResource } from './Common'

export interface IContractTypeIdName extends Omit<IGenericResource, 'value'> {
  value?: string | number | null
  document_name: string | null
  document_code: string | null
  category_name: string | null
  numbering_type_name: string | null
}

export interface IAvailableDocumentTypes
  extends Omit<IGenericResource, 'value'> {
  value: string | number | null
  type: string | null
}

export interface ITrustBusinessDerivativeContracting
  extends Omit<IGenericResource, 'value'> {
  id?: number
  value: string | number | null
  business_code?: string | null
  name?: string
  register_type?: string | null
  business_type_id?: number | null
  status?: {
    id: number
    status: string
  }
  status_id?: number
}

export interface IDerivatedContractingNfi extends IGenericResource {
  structure_plan_code_id: number
  structure_name: string

  structure?: {
    code?: string
    structure?: string
    purpose?: string
  }[]
  label_code_purpose?: string
}

export interface ITrustBusinessDerivativeContracting
  extends Omit<IGenericResource, 'value'> {
  id?: number
  value: string | number | null
  business_code?: string | null
  name?: string
  register_type?: string | null
  business_type_id?: number | null
  status?: {
    id: number
    status: string
  }
  status_id?: number
}

export interface IBasicInfoContract extends IGenericResource {
  contract_number: string
  validity_years?: string[]
}

export interface IContractPaymentMilestones extends IGenericResource {
  display_label: string
}
export interface IContractDocumentStructure extends IGenericResource {
  contract_document_code: string
  contract_document_name: string
  requires_publication: boolean
  type_document: {
    id: number
    deleted_at: string | null
    document_code: string
    document_name: string
    category: number
    numbering_type: number
    business_numbering_type: number | null
    contract_value_in: number
    max_amount_allowed: number
    max_allowed_value: string
    has_work_plan: boolean
    has_supervisor: boolean
    has_stamp_tax: boolean
    contract_type: number
    modality: number
    created_at: string
    updated_at: string
    created_by_id: number
    updated_by_id: number
    deleted_by_id: number | null
    status_id: number
    bud_document_id: number
    bud_movement_id: number
    budget_validity: number
    avail_document_id: number
    comm_movement_id: number
    avail_movement_id: number | null
    comm_document_id: number | null
  }
}

export interface IContractClausesCode extends IGenericResource {
  clause_type_id: number | null
  clausule: string | null
}

export interface IContractAttachments extends IGenericResource {
  mandatory: string
  stage: string
  status_id: number
  contract_document_id: number
  type_attached_document: {
    id: number
    name: string
    policy_type: boolean
  }
}

export interface IContractorAddition extends IGenericResource {
  document: string
  natural_person: {
    full_name: string
  }
}
