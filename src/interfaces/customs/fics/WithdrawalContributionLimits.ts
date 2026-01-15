export interface IWithdrawalContributionLimit {
  id: number
  position: string
  minimum_amount: string
  maximum_amount: string
  type: number
  created_at: string
  updated_at: string
}

export interface IWithdrawalContributionLimitRequest {
  id?: number
  position: string | null
  minimum_amount: string
  maximum_amount: string
  type: number
}
