export interface IBalancesOnlineList {
  id?: number | null
  business_code?: string
  account_bank?: string
  account_number?: string
  account_name?: string
  coin_type?: string
  status?: string
  initial_balance?: string
  total_income?: string
  total_expense?: string
  final_balance?: string
  taxed_withholding?: string
  taxed_gmf?: string
  gmf_rate?: string
  initial_balance_foreign?: string
  total_income_foreign?: string
  total_expense_foreign?: string
  final_balance_foreign?: string
}
