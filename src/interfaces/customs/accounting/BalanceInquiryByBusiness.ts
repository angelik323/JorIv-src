export interface IBalanceInquiryByBusinessResponse {
  business: {
    id: number
    code: string
    name: string
  }
  account: {
    id: number
    code: string
    name: string
  }
  initial_balance: string
  total_debits: string
  total_credits: string
  final_balance: string
  initial_foreign_currency: string
  total_foreign_currency: string | null
  total_foreign_currency_balance: string
}
