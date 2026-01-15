export interface ICaculationFilters {
  'filter[id]': string
  'filter[business_trust_id]': string
  'filter[configuration_types_id]': string
  'filter[statuses_id]': string
}

export interface ICalculationResponseList {
  id: number
  business_trust_id: number
  business_trust: null | {
    id: number
    info: string
  }
  created_at: string
  created_by: number
  created_by_name: string
  updated_at: string
  updated_by: number
  updated_by_name: string

  reason_justification: string

  configuration_types_id: number
  configuration_subtypes_id: number
  statuses_id: number

  asset_id: number
  asset: {
    id: number
    info: string
  }

  configuration_type: {
    id: number
    info: string
  }

  configuration_subtype: {
    id: number
    info: string
  }

  book_value: number
  impairment_loss: number
  impairment_date: string

  status_id: number
  status_impairment: {
    id: number
    status: string
  }
}

export interface ICalculationForm {
  fixed_asset_id?: null
  subtype_id?: null
  type_id?: null
  id: number | string | null
  code_calculation: number | null
  business_trust_id: string | number | null
  configuration_types_id: number | null
  configuration_subtypes_id: number | null
  asset_id: number | null
  statuses_id: number | null
  reason_justification: string | null
  book_value: number | null
  fair_value: number | null
  acquisition_cost: number | null

  estimated_sale_value: number | null
  estimated_sale_cost: number | null
  total_residual_value: number | null

  total_cash_flows: number | null
  number_of_periods: number | null
  discount_rate: number | null

  recoverable_amount: string | number | null
  impairment_loss: string | number | null
  impairment_percentage: string | number | null

  code: number | null
  type: boolean | null
  subtype: string | null
  currency: number | null
  currency_deterioration: string | null
  date_deterioration?: string | null

  created_by_name?: string | null
  updated_by_name?: string | null
  created_at?: string | null
  updated_at?: string | null

  voucher_id?: number | null
  voucher: {
    id: number | null
    code: string | null
    registration_date: string | null
    status: {
      id: number
      status: string
    } | null
  } | null
  location?: string | null
  responsible_id?: number | null
  status_id?: number | null
  description?: string | null
  asset?: {
    id: number | null
    code: string | null | null
    description: string | null | null
    location: string | null | null
    responsible_id: number | null | null
    status_name: {
      id: number | null
      status: string | null
    }
  }
  created_at_string?: string | null
  created_by_name_string?: string | null
  updated_at_string?: string | null
  updated_by_name_string?: string | null
  currency_name?: string | null
  currency_deterioration_name?: string | null
  configuration_type_name?: string | null
  configuration_subtype_name?: string | null

  residual_value?: number | null
  value_in_use?: number | null
}
export interface ICalculationCreate {
  code_calculation: number | null
  business_trust_id: number | null
  configuration_types_id: number | null
  configuration_subtypes_id: number | null
  asset_id: number | null
  statuses_id: number | null
  reason_justification: string | null
  book_value: number | null
  fair_value: number | null
  acquisition_cost: number | null

  estimated_sale_value: number | null
  estimated_sale_cost: number | null
  total_residual_value: number | null

  total_cash_flows: number | null
  number_of_periods: number | null
  discount_rate: number | null
  value_in_use: number | null

  recoverable_amount: number | null
  impairment_loss: number | null

  code: number | null
  type: boolean | null
  subtype: string | null
  currency: number | null
  currency_deterioration: string | null
  date_deterioration?: string | null
}

export interface ICalculationImparment {
  book_value: number | null
  fair_value: number | null
  acquisition_cost: number | null
  estimated_sale_value: number | null
  estimated_sale_cost: number | null
  total_cash_flows: number | null
  number_of_periods: number | null
  discount_rate: number | null
}

export interface ICalculationResponse {
  success: boolean
  message: string
  data?: {
    recoverable_amount: number
    impairment_loss: number
    impairment_percentage: number
    total_residual_value?: number
    value_in_use?: number
  }
}
