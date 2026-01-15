export type AccountsPayableClosingAction = 'close' | 'undo'
export type AccountsPayableClosingFrequency = 'daily' | 'monthly'

export interface IAccountsPayableClosing {
  id: number
  business_trust: string
  business_trust_id: number
  period: string
  closure_date: string
  closure_type: string
  last_closure_date_business: string
  user?: string
  status: {
    id: number
    name: string
    description: string | null
  }
}

export interface IAccountsPayableClosingRequest {}

export interface IAccountsPayableClosingForm {
  action_type: AccountsPayableClosingAction | null
  closing_mode: AccountsPayableClosingFrequency | null
  closing_date: string | null
  business_from: string | null
  business_to: string | null
}

export interface IAccountsPayableClosingCreatePayload {
  closure_type: string
  last_closure_date_business: string
  closure_date: string
  period: string
  action_type: string
  business_name: string
  business_code: number | string
  business_trust_id: number
  status_id?: number
  error_description?: string | null
}

export interface IAccountsPayableClosingBusiness
  extends IAccountsPayableClosingCreatePayload {
  id: number
  code?: string
  business_trust?: string
  status_name?: string
  error_description?: string | null
}

export interface IAccountsPayableClosingBusinessFilters {
  business_trust_code_since: number | string
  business_trust_code_until: number | string
  closure_type: string
  action_type: string
  closure_date: string
  accounts_payables: string[]
  business_trust_id?: number | string | null
  closing_mode: string
}

export interface IAccountsPayableClosingExecuteItem {
  id: number
  business_trust_id: number
  closure_date: string
  status_id?: number
}

export interface IAccountsPayableClosingReportItem {
  id: number
  business_trust_id: number
  closure_date: string
}

export interface IAccountsPayableClosingExcelItem {
  id: number
  business_trust: string
  period: string
  closure_type: string
  closure_date: string
  status_name: string
  error_description?: string | null
}

export interface IAccountsPayableClosingApiResponse {
  closing?: string
  last_closing_date?: string
  validity?: number
  account_structure_id?: number
  business_trust_id?: number
  business_code?: number | string
  business_name?: string
  name?: string
  business_trust?: {
    id: number
    business_code: string
    name: string
    status_id: number
    status_name?: string
    status?: {
      id: number
      status: string
      comments: string | null
    }
  }
  accounting_structure?: {
    id: number
    code: string
    purpose: string
  }
  [key: string]: unknown
}

export interface IBusinessClosingRow {
  id: number
  business_trust: string
  period: string
  closure_type: string
  closure_date: string
  user?: string
  status: {
    id: number
    name: string
    description: string | null
  }
}
