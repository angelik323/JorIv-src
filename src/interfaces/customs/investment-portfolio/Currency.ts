type NullableNumberString = number | string | null

export interface ICurrencyListItem {
  id: number
  code?: string
  description?: string
  type_of_currency?: string
  value?: string
}

export interface ICurrencyResponse {
  id: number
  code?: string
  description?: string
  type_of_currency?: string
  value?: string
  history_currency?: {
    created_at?: string
    creator_data?: string
    updated_at?: string
    updated_data?: string
  }
}

export interface ICurrencyInformationForm {
  id?: number
  code: string | null
  description: string | null
  currency_type: NullableNumberString
  value: NullableNumberString
  status?: NullableNumberString
  created_at?: string | null
  created_by?: string | null
  updated_at?: string | null
  updated_by?: string | null
}

export interface ICurrencyToCreate {
  code: string
  description: string
  type_of_currency: string | number
  value: string | number
}

export interface ICurrencyToEdit {
  code: string
  description: string
  type_of_currency: string | number
  value: string | number
}
