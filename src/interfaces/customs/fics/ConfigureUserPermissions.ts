export interface IPermissible {
  id: number
  fund_code: string
  fund_name: string
  business_trust_id: number
  consolidation_option_id: number
  fic_rating: string
  has_participation_types: boolean
  is_fund_validated: boolean
  status_id: number
  created_at: string
  updated_at: string
  fund_type_id: number
  last_closing_date: string | null
}

export interface IStatusPermissions {
  id: number
  status: string
  comments: string | null
}

export interface ICollectiveInvestmentFund {
  id: number
  user_id: number
  status_id: number
  created_at: string
  updated_at: string
  permissible: IPermissible
  status: IStatusPermissions
}

export interface IPagination {
  currentPage: number
  lastPage: number
  total?: number
  page?: number
  rowsPerPage?: number
  rowsNumber?: number
}

export interface ICollectiveInvestmentFundsResponse {
  success: boolean
  data: {
    current_page: number
    data: ICollectiveInvestmentFund[]
    first_page_url: string
    from: number
    last_page: number
    last_page_url: string
    links: Array<{ url: string | null; label: string; active: boolean }>
    next_page_url: string | null
    path: string
    per_page: number
    prev_page_url: string | null
    to: number
    total: number
  }
  message: string
}

export interface IOfficePermissible {
  id: number
  regional_id: number
  office_code: string
  office_description: string
  office_schedule_start: string
  office_schedule_end: string
  extended_schedule_start: string | null
  extended_schedule_end: string | null
  status_id: number
  created_at: string
  updated_at: string
}

export interface IOfficePermission {
  id: number
  user_id: number
  status_id: number
  created_at: string
  updated_at: string
  permissible: IOfficePermissible
  status: IStatusPermissions
}

export interface IOfficePermissionsResponse {
  success: boolean
  data: {
    current_page: number
    data: IOfficePermission[]
    first_page_url: string
    from: number
    last_page: number
    last_page_url: string
    links: Array<{ url: string | null; label: string; active: boolean }>
    next_page_url: string | null
    path: string
    per_page: number
    prev_page_url: string | null
    to: number
    total: number
  }
  message: string
}

export interface IOperationPermissible {
  id: number
  code: string
  description: string
  created_at: string
  updated_at: string
}

export interface IOperationPermission {
  id: number
  user_id: number
  status_id: number
  created_at: string
  updated_at: string
  permissible: IOperationPermissible
  status: IStatusPermissions
}

export interface IOperationPermissionsResponse {
  success: boolean
  data: {
    current_page: number
    data: IOperationPermission[]
    first_page_url: string
    from: number
    last_page: number
    last_page_url: string
    links: Array<{ url: string | null; label: string; active: boolean }>
    next_page_url: string | null
    path: string
    per_page: number
    prev_page_url: string | null
    to: number
    total: number
  }
  message: string
}

export interface IOfficeItem {
  id: number
  office_code: string
  office_description: string
  office_schedule_start: string
  office_schedule_end: string
  extended_schedule_start: string | null
  extended_schedule_end: string | null
  status_id: number
  created_at: string
  updated_at: string
}

export interface IOfficesResponse {
  success: boolean
  data: {
    current_page: number
    data: IOfficeItem[]
    first_page_url: string
    from: number
    last_page: number
    last_page_url: string
    links: Array<{ url: string | null; label: string; active: boolean }>
    next_page_url: string | null
    path: string
    per_page: number
    prev_page_url: string | null
    to: number
    total: number
  }
  message: string
}

export interface IOffice {
  id: number
  region: string
  office_code: string
  office_name: string
}

export interface IRegionOption {
  label: string
  value: number
}
