export interface IDesativateDailyClosingVouchersListItem {
  id: number
  accounting_structure: string
  business: string
  current_period: string
  initial_date: string
  final_date: string
}

export interface IDesativateDailyClosingVouchersCreate {
  current_period?: string
  accounting_structure_id?: number
  from_business?: number
  from_business_code?: string
  to_business?: number
  to_business_code?: string
  last_closing_day?: string
  revert_balances_date?: string
  opening_reason?: string
  business_ids?: number[]
}

export interface IBusinessAvailableListItem {
  id: number
  id_negocio: number
  negocio?: string
  periodo_actual?: string
  afecta_consolidacion?: boolean
}

export interface IRevertVouchersResource {
  id: number
  business_code: string
  name: string
  account: Account
}

interface Account {
  id: number
  business_trust_id: number
  accounting_structure_id: number
  current_period: string
  last_closing_daily?: string
  last_closing_day: string
}

export interface IInformProcessPendingListItem {
  id: number
  business_code: string
  business_name: string
  detail: string | null
}

export interface ISuccessProcessListItem {
  id: number
  business_code: string
  business_name: string
  start_date: string
  last_update_date: string
  affects_consolidation: boolean
}
