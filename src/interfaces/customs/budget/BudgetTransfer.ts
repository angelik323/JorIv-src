export interface IBusinessTrustStatus {
  id: number
  status: string
}

export interface IBusinessTrust {
  id: number
  business_code: string
  name: string
  start_date: string
  end_date: string
  has_extend: boolean
  status_id: number
  business_subtype_id: number
  derivate_contracting: boolean
  status_name: string
  biling_collect: unknown[]
  status: IBusinessTrustStatus
  document_type: unknown[]
}

export interface IBudgetTransferRow {
  budget_structure_id: number
  resource_structure_id: number
  accounting_structure_id: number
  code: number
  description: string
  type: string
  nature: string
}

export interface IBudgetTransferDetail {
  nature: string
  business_trust: IBusinessTrust[]
  budget_item: string
  budget_resource: string
  budget_area: string
  budget_third_party: string | null
  month: number
  amount: string
  balance_adjust: string
}

export interface IBudgetTransferBase {
  id: number
  fiscal_year: number
  date: string
  budget_document_type_id: number
  code_movement_id: number
  third_party_requester_id: number
  description: string
  resolution_number: string
  total_amount: number
  status_id: number
  details: IBudgetTransferDetail[]
}

export interface IBudgetTransferList extends IBudgetTransferBase {
  budget_document_type_id_description: string
  code_movement_id_description: string
  third_party_requester_id_description: string
}

export interface IBudgetTransferCreate extends IBudgetTransferBase {}

export interface IBudgetTransferModel {
  id: number
  nature: string
  business: number | null
  budgetItems: number | null
  resource: number | null
  area: number | null
  third: number | null
  month: number | null
  value: number
  adjustedValue: number
  businessDescription?: string
  budgetItem?: string
  budgetItemDescription?: string
  resourceDescription?: string
  areaDescription?: string
  thirdName?: string
}

export interface IBudgetTransferDetailItem {
  type: 'ORIGEN' | 'DESTINO'
  business_id: number
  budget_item_id: number
  budget_resource_id: number
  area_id: number
  third_party_id: number | null
  month: number
  value: number
}

export interface IBudgetTransferDetails {
  origins: IBudgetTransferDetailItem[]
  destinations: IBudgetTransferDetailItem[]
}

export interface IBudgetTransferCreatePayload {
  fiscal_year: number
  date: string
  budget_document_type_id: number
  description_document?: string
  code_movement_id: number
  description_code_movement?: string
  third_party_requester_id: number
  description_third_party_requester?: string
  description: string
  resolution_number: string
  total_amount: number
  details: IBudgetTransferDetails
}
