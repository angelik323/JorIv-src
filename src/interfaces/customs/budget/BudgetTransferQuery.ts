// Base interfaces for reusable types
export interface IBusinessTrust {
  id: number
  business_code: string
  name: string
}

export interface IBudgetDocumentType {
  id: number
  code: string
  description: string
}

export interface IBudgetItem {
  id: number
  code: string
  description: string
}

export interface IBudgetResource {
  id: number
  code: string
  description: string
}

export interface IBudgetArea {
  id: number
  code: string
  description: string
}

// Main interfaces
export interface IBudgetTransferQueryList {
  id: number
  transfer_number: string
  fiscal_year: number
  date: string
  budget_document_type_id: number
  code_movement_id: number
  third_party_requester_id: number
  description: string | null
  resolution_number: string
  total_amount: string
  status_id: number
  budget_document_type?: IBudgetDocumentType
  nature?: string
  validity?: string
  balance?: number
  value?: number
  amount?: number
  balance_adjust?: number
  budget_third_party?: string
  month?: number
  operation_log?: string
  business_trust?: IBusinessTrust
  budget_item?: IBudgetItem
  budget_resource?: IBudgetResource
  budget_area?: IBudgetArea
  details?: IBudgetTransferQueryDetailsList[]
}

export interface IBudgetTransferQueryDetailsList {
  nature: string
  business_trust_id: number
  business_trust: IBusinessTrust
  budget_item: IBudgetItem
  budget_resource: IBudgetResource
  budget_area: IBudgetArea
  month: number
  amount: number
  balance_adjust: number
  operation_log?: string
}

export interface IBudgetTransferQueryDocument {
  id: number
  vigency: number
  document_type: string | null
  document_number: number
  value: string
  has_documents_associated: boolean
}

export interface IBudgetTransferQueryParams {
  [key: string]: string | number | undefined
  'filter[vigency]'?: string
  'filter[date]'?: string
  'filter[budget_document_type_id]'?: string | number
  'filter[from_number_traslate]'?: string | number
  'filter[to_number_traslate]'?: string | number
  to_number_traslate?: string | number
}
