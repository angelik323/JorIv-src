type NullableNumberString = number | string | null

export interface IPaperTypeListItem {
  id: number
  code?: string
  description?: string
  investment_type?: string
  investment_class?: string
  created_at?: string
}

export interface IPaperTypeInformationForm {
  id?: number
  code: string | null
  description: string | null
  currency: NullableNumberString
  investment_type: NullableNumberString
  investment_class: string | null
  rate_type: string | null
  rate_class: string | null
  rate: string | null
  rate_mode: string | null
  base_flow_rate: string | null
  flow_type: string | null
  payment_flow: string | null
  hasAmortization: boolean | null
  amortization_type: string | null
  created_at?: string | null
  creator_data?: string | null
}

export interface ITypePaperToCreate {
  code: string | null
  description: string | null
  currency_id: number | null
  inversion_type_id: number | null
  investment_class: string | null
  rate_type: string | null
  rate_class: string | null
  rate: string | null
  rate_mode: string | null
  base_flow_rate: string | null
  flow_type: string | null
  payment_flow: string | null
  amortization_type: string | null
  created_at?: string | null
  creator_data?: string | null
}

export interface ITypePaperResponse {
  id: number
  code?: string
  description?: string
  currency?: string
  investment_type?: string
  investment_class?: string
  rate_type?: string
  rate_class?: string
  rate?: string
  rate_mode?: string
  base_flow_rate?: string
  flow_type?: string
  payment_flow?: string
  amortization_type?: string
  created_at?: string
  creator_data?: string
}
