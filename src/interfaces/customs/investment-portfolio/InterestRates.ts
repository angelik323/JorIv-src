export interface IInterestRate {
  id?: number
  code: string
  interest_rate_code?: string
  interest_rate_description: string
  description?: string
  mode: string
  mode_code?: string
  payment_frequency_code?: string
  modality_id?: number
  modality_description?: string
  payment_frequency: string
  periodicity_id?: number
  periodicity_description?: string
  number_months: string | number
  date: string
  rate_value: string | number
  created_at?: string
  updated_at?: string
}

export interface IInterestRateFilters {
  modality: string | null
  frequency: string | null
  search: string | null
  page: number
  rows: number
}

export interface IInterestRateResource {
  id: number
  interest_rate_description: string
  mode: string
  payment_frequency: string
}

export interface IInterestRateFormModel {
  code: string
  interest_rate_description: string
  mode: string
  mode_code: string
  payment_frequency: string
  payment_frequency_code: string
  number_months: number
  date: string
  rate_value: string | number
}

export interface IInterestRateModel {
  id?: number
  interest_rate_code: string
  mode_code: string
  payment_frequency_code: string
  code: string
  mode: string
  payment_frequency: string
  interest_rate_description: string
  periodicity_description?: string
  modality_description?: string
  date: string
  rate_value: string | number
  number_months: number
  history_interest_rate?: IHistoryCurrencyData
}
export interface IInterestRateViewModel extends IInterestRateModel {
  created_at?: string
  updated_at?: string
  creator_data?: string
  update_data?: string
}
export interface IHistoryCurrencyData {
  created_at?: string
  updated_at?: string
  creator_data?: string
  update_data?: string
}

export interface IInterestRateResponse extends IInterestRate {
  history_interest_rate?: IHistoryCurrencyData
}
