export interface IBankAccountBalance {
  id?: number
  business_id: number | null
  bank_id: number | null
  bank_account_id: number | null
  currency?: string | null
  initial_balance_local_currency: string | null
  initial_balance_foreign_currency: string | null
  opening_date?: string | null
  initial_balance_date: string | null
  business_trust?: {
    id: number
  }
  bank_account?: {
    id: number
  }
  bank?: {
    id: number
  }
}
