export interface IGroundsBankRefund {
  id?: number
  causal_code?: string
  name: string
  apply: string
  status?: {
    id?: number | null
    comments?: string | null
    status?: string
  }
}
export interface IGroundsBankRefundForm {
  name: string
  apply: string
  status_id: number | null
  causal_code: string
}
