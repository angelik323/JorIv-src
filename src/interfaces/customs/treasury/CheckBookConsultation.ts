export interface ICheckbookQuery {
  id: number
  checkbook: string
  check_number: string
  check_date: string
  beneficiary: string
  value: number
  conciliation: string
  status: 'GENERADO' | 'IMPRESO' | 'ENTREGA' | 'ANULADO'
  business?: {
    id: number
    name: string
    code: string
  }
  bank?: {
    id: number
    name: string
    code: string
  }
  bank_account?: {
    id: number
    name: string
    account_number: string
  }
  history?: ICheckHistoryItem[]
}
export interface ICheckbookQueryFilters {
  business: number | null
  bank: number | null
  bank_account: string
  period: string
  checkbook: number | null
  page: number
  rows: number
}

export interface ICheckbookHistory {
  id: number
  checkbook: string
  status: 'GENERADO' | 'IMPRESO' | 'ENTREGA' | 'ANULADO'
  date: string
  user: string
  annulment_reason: string
  check_number: string
}

export interface ICheckHistoryItem {
  id: number
  checkbook_code: string
  check_number: string
  check_date: string
  user: string
  cancellation_reason: string | null
  amount: number
  status?: {
    id: number
    name: string
    description?: string
  } | null
}

export interface ICheckbookDetailResponse {
  id: number
  code: string
  status: string
  created_at: string
  created_by: string
  amount: number
  user: string
  business_name: string
  bank_name: string
  bank_account_name: string
  history: ICheckHistoryItem[]
  business: string
  bank: string
  bank_account: string
}

export interface ICheckbookHistoryRaw {
  id: number
  checkbook: { code: string }
  check_number?: string
  status: {
    id: number
    name: string
    description?: string
  } | null
  date: string
  user: string
  cancellation_reason?: string | null
  changes?: {
    has_changes: boolean
    changes: {
      field: string
      value?: string
      old_value?: string
      new_value?: string
    }[]
  }
  business: string
  bank: string
  bank_account: string
  consecutive_check: string
}

export interface ICheckbookHeader {
  checkbook?: {
    business_trust?: { name?: string | null }
    bank?: { name?: string | null; code?: string | null }
    bank_account?: {
      account_name?: string | null
      account_number?: string | null
    }
  }
  business?: string
  bank?: string
}

export type HistoryUser =
  | { id?: number | null; name?: string | null; email?: string | null }
  | string
  | null
