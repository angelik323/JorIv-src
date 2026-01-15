export interface IBankingAccountsList {
  id: number
  business?: {
    id: number
    name: string
    code: string
  }
  bank?: {
    id: number
    description: string
    code: string
  }
  account_bank: string
  account_number: string
  account_name: string
  status: IStatusBankAccount
}

export interface IStatusBankAccount {
  id: number
  status: string
}

export interface IBankAccount {
  business_id: number
  bank_id: number
  account_name: string
  account_bank: string
  account_number: string
  responsible_owner_id: number
  operation_type: string
  account_type: string
  product_type: string
  bank_branch_id: number
  opening_date: string
  treasury_concillation_closing_date: string
  treasury_closing_date: string
  control_balance: boolean
  accounting_account_id: number | null
  accounting_account_code?: string | null
  accounting_account_name?: string | null
  cost_center_id: number | null
  taxed_withholding: boolean
  taxed_gmf: number | boolean | null
  gmf_rate: string
  accounting_account_gmf: number | null
  gmf_business_accounting_account_id: number | null
  cost_center_gmf_id: number | null
  gmf_fund_accounting_account_id: number | null
  gmf_decimals: number
  gmf_movements: number
  coin_type: string
  coin: number | null
  handles_checkbook: number | boolean | null
  format: string
  status: IStatusBankAccount | null
  status_id: number
  blocking_reasons: string
  cancellation_date: string
  cancellation_reasons: string
  responsible_owner_document: string
  responsible_owner_name: string
  bank_account_id: string
  gmf_business_accounting_account_name: string
  gmf_business_accounting_account_code: string
  cost_center_code: string
  cost_center_description: string
  cost_center_gmf_code: string
  cost_center_gmf_description: string
  gmf_fund_accounting_account_code: string
  gmf_fund_accounting_account_name: string
  gmf_movements_code: string
  gmf_movements_description: string
  inactive_days: string
  coin_id?: number | null
}

export interface IBankAccountPerformance {
  treasury_movement_id: number | null
  validate_balance: number
  movement_codes_id: string | null
  accounting_account_id: number | null
  type_thirdparty: number | null
  cost_center_id: number | null
  rate_type: string
  rates: IBankingAccountsRates[]
  treasury_movement_code: string
  treasury_movement_description: string
  movement_codes_code: string
  movement_codes_description: string
  accounting_account_code: string
  accounting_account_name: string
  cost_center_code: string
  cost_center_description: string
}

export interface IBankingAccountsRates {
  range_from: number
  range_up: number
  rate: number
}

export interface IBankAccountRestatement {
  treasury_movement_positive_id: number | null
  treasury_movement_negative_id: number | null
  movement_codes_positive_id: number | null
  movement_codes_negative_id: number | null
  accounting_account_positive_id: number | null
  accounting_account_negative_id: number | null
  cost_center_positive_id: number | null
  cost_center_negative_id: number | null
  type_thirdparty_positive: number | null
  type_thirdparty_negative: number | null
  treasury_movement_positive_code: string
  treasury_movement_positive_description: string
  treasury_movement_negative_code: string
  treasury_movement_negative_description: string
  movement_codes_positive_code: string
  movement_codes_positive_description: string
  movement_codes_negative_code: string
  movement_codes_negative_description: string
  accounting_account_positive_code: string
  accounting_account_positive_name: string
  accounting_account_negative_code: string
  accounting_account_negative_name: string
  cost_center_positive_code: string
  cost_center_positive_description: string
  cost_center_negative_code: string
  cost_center_negative_description: string
}
