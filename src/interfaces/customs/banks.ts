export interface IBanks {
  id?: number | null
  description: string | null
  type: string | null
  accounting_account: string | null
}

export interface IBanksList {
  id: number | null
  description: string | null
  type: string | null
  accounting_account: string | null
  status: Status
  status_id: number | null
}

export interface IRowBanks {
  id: number
  description: string | null
  type: string | null
  accounting_account: string | null
  status: Status
  status_id: number | null
}

export interface Status {
  id: number
  status: string
}

export interface IBankAccountTable {
  id: number
  is_main: boolean
  bank_name: string | null
  bank_id: number | null
  bank_code: string | null
  city: string | null
  branch: string | null
  branch_id: number | null
  type: string | null
  account_number: string | null
  has_active_payments: boolean
  saved?: boolean
}
