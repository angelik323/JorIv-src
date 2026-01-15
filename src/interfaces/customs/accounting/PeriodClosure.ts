export interface IPeriodClosureItem {
  id: number
  execution_period: string
  accounting_structure: string
  from_business: string
  current_period_from: string
  to_business: string
  current_period_to: string
  executed_at: string | null
  period_closure: string | null
  business_trust: {
    id: number
    description: string
    current_period: string
  } | null
}

export interface IPeriodClosureModel {
  executed_at: string
  accounting_structure_id: number
  from_date: string
  to_date: string
  from_business_trust_id: number
  to_business_trust_id: number
}

export interface IPeriodClosureV2Model {
  accounting_structure_id: number
  period: string
  from_business_trust: string | undefined
  to_business_trust: string | undefined
  from_business_code?: string
  to_business_code?: string
}

export interface IReportItem {
  id: number
  business_code: string
  business_name: string
  detail: string
}

export interface FilterFields {
  nombre?: string
  edad?: number
  estado?: string
  page?: number
  rows?: number
  [key: string]: string | number | boolean | null | undefined
}

export interface IPeriodClosureBusinessTrustOption {
  value: number
  label: string
  current_period: string
}
