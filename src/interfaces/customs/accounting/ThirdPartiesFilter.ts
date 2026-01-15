export interface IThirdPartiesFilter {
  type_person: string | null
  identification_operator: string | null
  identification_value: string | null
  name_operator: string | null
  name_value: string | null
}

export interface IThirdPartiesFilterResponse {
  data: IThirdPartiesFilterItem[]
  current_page: number
  last_page: number
}

export interface IThirdPartiesFilterItem {
  id: number
  name: string
  number_document: string
}
