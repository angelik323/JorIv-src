export interface IConsolidatedBalanceInquiryList {
  id?: number
  account_code: string
  account_name: string
  business_code: string
  initial_balance: number
  debit: number
  credit: number
  final_balance: number
  foreign_currency_balance: number
}
