export interface IInvestmentPlanOperationResponseDetailItem {
  id: number
  treasury_collection_form_id: number
  collection_form_code?: string
  collection_form: string
  value: number
  check: number
  check_bank: string
  collection_bank_id: number
  collection_bank: string
  fic_account_bank_id: number
  fic_account: string
  account_bank_id: number
  observation: string
}

export interface IToggleAuthorizationInvestmentPlanOperationPayload {
  state_id?: number
  fund_id?: string | number | null
  operation_type?: 'aporte' | 'retiro' | 'cancelacion'
  operation_investment_plan_id?: string | number | null
}

export interface IModalAccountInfo {
  bank: {
    code: string
  }
  responsible_owner_name: string
  responsible_owner_document: string
  account_number: string
  account_type: string
}

export interface ISelectedRowAccountInfo {
  initial_balance: number
  account_type: string
}
