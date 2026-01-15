export interface IReportingLimitChangesInEquityCreatePayload {
  accounting_structure_id: number
  limit: ILimitChangesInEquity[]
}

interface ILimitChangesInEquity {
  from_account: string
  to_account: string
  limit_type: string
}

export interface IOptionPatrimonyLimitType {
  label: string
  value: string
}

export interface IReportingLimit {
  id: number
  from_account: string
  to_account: string
  limit_type: string
}

export interface IReportingLimitsUpdatePayload {
  limits: IReportingLimit[]
}

export interface IEquityChangeReportLimit {
  id: number
  business_trust: string
  account_structure: string
  from_account: string
  to_account: string
  limit_type: string
  business_trust_id: number
}

export interface IPaginationLink {
  url: string | null
  label: string
  active: boolean
}

export interface IPaginatedData<T> {
  current_page: number
  data: T[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: IPaginationLink[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

export interface IEquityChangeReportLimitsResponse {
  success: boolean
  data: IPaginatedData<IEquityChangeReportLimit>
  message: string
}

export interface IBusinessTrustTableRow {
  id: number
  business_code: string
  business_description: string
  current_period: string | null
}

export interface ITableRowLimit {
  id?: number | null
  limit: string | null
  from_account: string | null
  to_account: string | null
}

export interface IAccountStructureFilter {
  'filter[account_structure_id]'?: number | string | { id: number }
  account_structure_id?: number | string | { id: number }
  'filter[search]'?: string
  'filter[limit_type]'?: string
  [key: string]: string | number | { id: number } | undefined
}
