export interface IDispersionLetter {
  id: number
  business_code: string
  business_name: string
  bank_code: string
  bank_name: string
  bank_account: string
  group_code: string
  giro_quantity: number
  date: string
  status: 'Agrupado' | 'Generado' | 'Re-Generado'
  group_value: string
  gmf: 'SI' | 'NO'
  format: string
  selected?: boolean
}
export interface IDispersionLetterFilters {
  year: string
  printed_status: 'todos' | 'impresos' | 'no_impresos'
  office_code: string | null
  office_name: string
  business_code: string | null
  business_name: string
  bank_code: string | null
  bank_name: string
  generation_date: string | null
  page: number
  rows: number
}

export interface IDetailRow {
  id: number
  registration_date: string
  business_code: string
  voucher_type: string
  period: string
  fund: string
  investment_plan: string
  beneficiary: string
  bank: string
  destination_account: string
  branch: string
  gmf: string
  value: string
}

export interface IStatusGroup {
  id: number
  status: string
}

export interface IGroupItem {
  id: number
  business_code: string
  business_name: string
  bank_code: string | null
  bank_name: string
  bank_account: string
  group: number
  turns: number
  date: string
  status: IStatusGroup
  value_group: string
  gmf: string
  format: string
}

export interface ITreasuryGenerateDispersionGroupLetter {
  id: number
  business_code: string
  business_name: string
  bank_code: null
  bank_name: string
  bank_account: string
  group: number
  turns: number
  date: Date
  status: IStatusGenerateDispersionGroupLetter
  value_group: string
  gmf: string
  format: string
}

export interface IStatusGenerateDispersionGroupLetter {
  id: number
  status: string
}

export interface ILink {
  url: string | null
  label: string
  active: boolean
}

export interface IPaginatedGroups {
  current_page: number
  data: IGroupItem[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: ILink[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

export interface IGroupsResponse {
  success: boolean
  data: IPaginatedGroups
  message: string
}

export interface IDetailGroupItem {
  id: number
  business: string
  means_of_payment: string
  bank: string
  bank_account: string
  found: string
  plain_investment: string
  order_payment: string
  operation_coin: string
  validity: number
  third_type_document: string
  third_party_document: string
  beneficiary_bank_id: string
  beneficiary_bank_account: string
  bank_branch: string
  value: string
  gmf: string
}

export interface ILink {
  url: string | null
  label: string
  active: boolean
}

export interface IPaginatedDetailGroup {
  current_page: number
  data: IDetailGroupItem[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: ILink[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

export interface IDetailGroupResponse {
  success: boolean
  data: IPaginatedDetailGroup
  message: string
}

export interface IAuthorization {
  status_id: number
  attempts_count: number
  authorization_code: string
  module: string
  process: string
  authorizable_id: number
  authorizable_type: string
  description: string
  motives: string
  business_id: number
  bank_account_id: number
  authorization_request_date: string
  id: number
}

export interface IAuthorizationPayload {
  group_id: number
  action: string
  motives: string
}
