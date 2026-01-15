export interface ICheckBalanceCostCenter {
  id: number
  account_code: string
  account_name: string
  cost_center_code?: string
  cost_center_name?: string
  initial_balance: number
  debit: number
  credit: number
  total: number
  foreign_currency: number
}
