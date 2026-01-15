export interface IBudgetDocumentCancellation {
  has_accounting_vouchers: boolean
  has_movements: boolean
  has_derivative_contracting: boolean
  operation: IBudgetOperation | null
  transfer: IBudgetTransfer | null
}

export interface IBudgetOperation {
  id: number
  document_year: number
  business_trust_id: number
  budget_document_type_id: number
  status: IStatus
  details: IBudgetOperationDetail[]
  observations: string
  total_value: number
}

export interface IBudgetOperationDetail {
  id: number
  year: number
  month: number
  budget_item: IBudgetItem
  budget_resource: IBudgetResource
  areas_responsibility: IAreaResponsibility
  value: string
  adjusted_value: string | null
}

export interface IBudgetTransfer {
  id: number
  document_year: number
  budget_document_type_id: number
  status: IStatus
  details: IBudgetTransferDetail[]
  observations: string | null
  total_value: string
}

export interface IBudgetTransferDetail {
  id: number
  business_trust_id: number
  nature: 'ORIGEN' | 'DESTINO'
  month: number
  value: string
  budget_item: IBudgetItem
  budget_resource: IBudgetResource
  areas_responsibility: IAreaResponsibility
}

export interface IStatus {
  id: number
  name: string
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

export interface IAreaResponsibility {
  id: number
  code: string
  description: string
}

export type IBudgetDocumentDetail =
  | IBudgetOperationDetail
  | IBudgetTransferDetail

export interface IBudgetDocumentAccountingVoucherForm {
  period: string
  cancellation_date: string
}

export type IBudgetDocumentCancellationOperation = 'transfer' | 'operation'

export interface IBudgetDocumentCancellationPayload {
  id: number
  operation_type: IBudgetDocumentCancellationOperation
  business_trust_id: number
  cancellation_date?: string
  period?: number
}

export interface IBudgetDocumentErrorLogPayload {
  id: number
  operation_type: IBudgetDocumentCancellationOperation
}
