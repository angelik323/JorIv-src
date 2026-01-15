export interface IAuthorizationAssignmentBankAccountsPages {
  currentPage: number
  lastPage: number
}

export interface IAuthorizationAssignmentBankAccountsItem {
  id: number
  user: string
  bank: string
  bank_description: string
  account: string
  status_id: number
  state: number
  balance: number
  business_grantor: string
  business_assign: string
  date: string
  selected: boolean
  parent_id?: number
  uniqueKey?: string
}

export interface IAuthorizationAssignmentBankAccountsFormModel {
  bank: string
  account_bank: string
  name_business_assign: string
  code_movement_expenses: string
  name_movement_expenses: string
  code_movement_incomes: string
  name_movement_incomes: string
  rejection_reason: string
}

export interface IAuthorizationAssignmentBankAccountsPayload {
  requests?: number[]
  approvals?: Array<{
    bank_account_grantor_request_id: number
    requests: number[]
  }>
}

export interface IAuthorizationAssignmentBankAccountsApiResponseItem {
  id: number
  status_id: number
  created_at: string
  bank_accounts?: Omit<IAuthorizationAssignmentBankAccountsItem, 'state'>[]
  description?: IAuthorizationAssignmentBankAccountsFormModel
}

export interface IAuthorizationAssignmentBankAccountsRejectPayload {
  requests?: number[]
  rejection_reason?: string
  bank_account_grantor_request_id?: number
  rejections?: Array<{
    bank_account_grantor_request_id: number
    rejections: Array<{
      bank_account_id: number
      reason: string
    }>
  }>
  [key: string]: unknown
}

export interface IAuthorizationAssignmentBankAccountsRejectArrayPayload {
  rejections: Array<{
    bank_account_grantor_request_id: number
    rejections: Array<{
      bank_account_id: number
      reason: string
    }>
  }>
}
