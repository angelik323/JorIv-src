export interface ITreasuryClosingSummary {
  id: number
  business_cod: number
  status: string
  type: string
  initial_balance: number
  income_local: number
  expense_local: number
  final_balance_local: number
  performance_value: number
  reexpression_difference: number
}
