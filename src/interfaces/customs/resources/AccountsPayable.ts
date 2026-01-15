import { IGenericResource } from './Common'

export interface ISettlementConcept extends IGenericResource {
  description: string
  concept_code: string
  class: string
}

export interface ISettlementConceptByStructureAndType extends IGenericResource {
  structure: string
  concept: string
  type: string
  class: string
  percentage: string
  liability_account: string | null
  fiscal_charge: string
  expense_account: string | null
  status: {
    id: number
    name: string
    description: string | null
  }
}
export interface IPaymentConceptCodes extends IGenericResource {
  concept_code: string
  concept_name: string
  obligation_type: string
  obligation_type_label: string
}

export interface IMovementManagementCodes extends IGenericResource {
  has_contract_execution: boolean
  has_handle_budget: boolean
}

export interface IDocumentTypeCode extends IGenericResource {
  has_internal_consecutive: boolean
  has_client_consecutive: boolean
  has_order: boolean
  has_other_references: boolean
  has_legalization_date: boolean
  has_expiration_date: boolean
}

export interface IPaymentRequest extends IGenericResource {
  request_number: string
  radicated_code: string
  invoice_number: string
  reception_date: string
  total_value: string
  status_id: number
}
export interface IOrpaAuthorizationResources extends IGenericResource {
  request_number: string
  number?: string | null
  status_id?: number | null
  status?: string | null
}
export interface IPaymentAuthorizersResource extends IGenericResource {
  autorized_user_id: number
  amount_from: string
  amount_to: string
}
export interface IPaymentRequestConsecutiveCode extends IGenericResource {
  consecutive_code: string
}
