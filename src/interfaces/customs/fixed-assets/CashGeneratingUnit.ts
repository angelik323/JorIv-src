export interface ICashUnitFilters {
  'filter[business_trust_id]': string
  'filter[start_date]': string
  'filter[end_date]': string
  'filter[configuration_type_id]': string
  'filter[status_id]': string
}

export interface ICashUnitResponseList {
  id: number | null
  code: number | null
  business_trust: {
    business_code: number | null
    name: string
  }
  configuration_type: {
    code: number
    description: string
  }
  description: string | null
  created_at: number | null
  initial_value: string | number | null
  currency: string
  status: {
    id: number
    name: string
  }
}

export interface ICashUnitCreate {
  business_trust_id: number | null
  description: string | null
  configuration_type_id: number | null
  description_type: string | null
  cash_flow_generation_date: string | null
  initial_value: string
}
export interface ICashUnitForm {
  id: number | null
  code: number | null
  business_trust_id: number | null
  business_trust: null | {
    id: number | null
    name: string
  }
  configuration_type: null | {
    code: number
    description: string
    asset_class?: string
  }
  description: string | null
  configuration_type_id: number | null
  description_type: string | null
  created_at: string | null
  initial_value: string
  cash_flow_generation_date: string | null
  currency: string | null
  status: null | {
    id: number | null
    name: string | null
  }
  statuses_uge: number | null
  created_by: null | {
    name: string | null
  }
  updated_by: null | {
    name: string | null
  }
  updated_at: string | null
}
