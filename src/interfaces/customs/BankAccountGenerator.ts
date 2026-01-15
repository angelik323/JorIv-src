export interface IBank {
  id?: number | string
  bank_id?: string | number
  bank_code: string
  branch: string | number
  branch_id: number | null
  city: string
  account_number?: string
  type?: string
  bank_name?: string
  is_main?: boolean
}
