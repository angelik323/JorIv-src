export interface IAssignmentBankAccountsPages {
  currentPage: number
  lastPage: number
}

export interface IAssignmentBankAccounts {
  'filter[search]': string
}

export interface IAccountStatus {
  id: number
  status: string
  comments?: string
}

export interface IAssignmentBankAccountsItem {
  id: number
  account_number: string
  account_bank: string
  bank_description_: String
  account_name: string
  status_id: number
  status: IAccountStatus
  balance: number
  balance_foreign: number
  to_transfer: boolean
}

export interface IAssignmentBankAccountsFormModel {
  assigneeBusinessId: number | null
  assigneeBusinessName: string
  expenseMovementId: string
  expenseMovementCode: string
  expenseMovementName: string
  incomeMovementId: string
  incomeMovementCode: string
  incomeMovementName: string
  grantorDate: string
}

export interface IMovementCode {
  id: string | number
  description: string
}

export interface IAssignmentBankAccountsPayload {
  business_trust_grantor_id: string
  business_trust_assign_id: string
  code_movement_incomes_id: string
  code_movement_expenses_id: string
  grantor_date: string
  accounts_grantor: number[]
}
