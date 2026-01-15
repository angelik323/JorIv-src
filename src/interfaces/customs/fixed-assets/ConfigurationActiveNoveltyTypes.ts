export interface IConfigurationActive {
  id?: number | null
  code?: number | null
  description: string | null
  accounting: boolean | null
  affectation: string | null
  created_at: string | null
}

export interface IConfigurationActiveForm {
  id?: number | null
  code?: number | null
  created_by_name?: string | null
  updated_by_name?: string | null
  updated_at?: string | null
  created_at?: string | null
  configuration_active_novelty_types: IConfigurationActiveCreate[]
}

export interface IConfigurationActiveCreate {
  id?: number | null
  code?: number | null
  description: string | null
  accounting: boolean | null
  affectation_type: string | null
}

export interface IConfigurationActiveEdit {
  id: number
  description: string | null
  accounting: boolean | null
  affectation_type: string | null
  code?: number | null
  updated_at?: string | null
  created_at?: string | null
  deleted_at?: null
}

export interface IConfigurationActiveResponse {
  id: number
  code: number | null
  description: string | null
  accounting: boolean | null
  affectation_type: string | null
  sequence_number: number | null
  updated_at: string | null
  created_at: string | null
}

export interface IConfigurationActiveResponseList {
  id: number
  code: number | null
  description: string | null
  accounting: boolean | null
  affectation_type: string | null
  sequence_number?: number | null
  updated_at?: string | null
  created_at?: string | null
}
export interface IActiveNoveltyFilters {
  'filter[start_date]': string
  'filter[end_date]': string
  'filter[q]': string
}
