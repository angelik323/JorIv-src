export interface IGeneralRequests {
  number?: number
  business_trust?: {
    id: number
    name: string
    business_code: number
  }
  record_status?: {
    id: number
    status: string
  }
  currency?: {
    code: string
    description: string
  }
  business_trust_id: number | null
  currency_id: number | null
  id?: number
  fund_id: number | null
  fund_code?: number | null
  fund_name?: string | null
  fund?: {
    fund_code: number
    fund_name: string
    id: number
  }
  name: string
  record_status_id: number | null
  point_asociate?: boolean
}
