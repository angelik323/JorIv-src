export interface IDesativateDailyClosingVouchers {
  id: number
  structure: number
  from_business_trust_id: IBusinessTrustID
  to_business_trust_id: IBusinessTrustID
  last_closing_daily: string
  revert_balances_date: string
  status: IStatus
}

interface IBusinessTrustID {
  id: number
  business_code: string
  business_name: string
}

interface IStatus {
  id: number
  status: string
}

export interface IDesativateDailyClosingVouchersCreate {
  structure?: number
  from_business_trust_id?: number
  from_business_trust_code?: string
  to_business_trust_id?: number
  to_business_trust_code?: string
  last_closing_daily?: string
  last_closing_day: string
  revert_balances_date: string
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
