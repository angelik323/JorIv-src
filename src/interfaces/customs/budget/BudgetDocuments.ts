// List
export interface IBudgetDocumentsListItem {
  id: number
  business_trust: IBusinessTrust | null
  vigency: number
  date: string
  budget_document_type: IBudgetDocumentType
  budget_document_number: number
  addition: boolean
  operation_log_document: IBudgetOperationLogDocument | null
  responsability_area: IResponsibilityArea
  city: ICity | null
  third_party: IThirdParty | null
  value: string
  observations: string | null
  status: IBudgetDocumentStatus
  has_operation_log: boolean
  has_order_payment: boolean
  has_accounting: boolean
}

interface IBudgetOperationLogDocument {
  id: number | null
  observations: string | null
}

interface IBusinessTrust {
  id: number
  code: string
  name: string
}

interface IBudgetDocumentType {
  id: number | null
  code: string | null
  description: string | null
}

interface IResponsibilityArea {
  id: number | null
  code: string | null
  description: string | null
}

interface ICity {
  id: number
  name: string
}

interface IThirdParty {
  id: number
  document: string
  name: string | null
  legal_person: {
    business_name: string
  } | null
  natural_person: {
    full_name: string
  } | null
}

interface IBudgetDocumentStatus {
  id: number
  status: string
  comments: string | null
}

export interface IBudgetDocumentsAssociatedListItem {
  id: number
  vigency: string
  document_type: {
    id: number
    name: string
    document_number: number
  }
  balance: string
}

export interface IBudgetDocumentsAccountingVoucherListItem {
  id: number
  date: string
  period: string
  voucher: {
    code: string
    number: string
  }
}

export interface IBudgetDocumentsPaymentOrderListItem {
  id: number
  vigency: string
  date: string
  payment_order: string
}

// View

export interface IBudgetDocumentDetailsListItem {
  id: number
  vigency: number
  month: number
  day: number
  area_responsability: IResponsibilityArea
  code_movement: ICodeMovement
  budget_item: IBudgetItem
  budget_resource: IBudgetResource
  balance: string
}

export interface IBudgetBalanceListItem {
  id: number
  vigency: number
  area_responsibility: IResponsibilityArea
  budget_item: IBudgetItem
  budget_resource: IBudgetResource
  total_value: number
}

interface ICodeMovement {
  id: number
  code: string
  description: string
}

interface IBudgetItem {
  id: number
  code: string
  description: string
}

interface IBudgetResource {
  id: number
  code: string
  description: string
}

export interface IBudgetDcocumentsTableEmitValue {
  loading: boolean
  length: number
}

export interface IBudgetDocumentsTableEmits {
  (e: 'update:table', value: IBudgetDcocumentsTableEmitValue): void
}
