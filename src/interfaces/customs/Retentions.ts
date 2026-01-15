export interface ICreateUpdateRetentions {
  name: string | null
  account_chart_id: number | null
  third_party_id: number | null
  type: string | null
  percentage: number | string | null
}

export interface IRetentionsData {
  name: string
  code: string
  account: IAccount
  type: string
  type_label: string
  percentage: number | string
  percentage_formatted: string
}

export interface IRetentionsFilters {
  'filter[type]': string | null
  'filter[third_party_id]': number | string | null
  'filter[status_id]': number | string | null
  'filter[search]': string | null
  page?: number
}

interface IAccount {
  id: number
  name: string
  code: string
  nature: string
}
