export interface IQueryMovementAccount {
  period: string
  account_code: string
  account_name: string
  voucher_id: number
  sub_receipt_type: number
  consecutive: number
  registration_date: string
  auxiliary: string
  cost_center: string
  debit: number
  credit: number
  foreign_currency: number
  detail: string
}
