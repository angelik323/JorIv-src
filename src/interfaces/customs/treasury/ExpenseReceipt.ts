export interface IExpenseReceiptResponse {
  id: number
  from_business: {
    id: number
    code: string
    name: string
  }
  up_business: {
    id: number
    code: string
    name: string
  }
  starting_date: string
  end_date: string
  from_voucher: {
    id: number
    code: string
    description: string
  }
  up_voucher: {
    id: number
    code: string
    description: string
  }
  from_expense: number
  up_expense: number
}
