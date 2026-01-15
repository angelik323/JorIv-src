export interface ITaxJurisdictionRequest {
  code: string
  name: string
  level: string
  country_code: string
  country_name: string
  department_code?: string
  department_name?: string
  municipality_code?: string
  municipality_name?: string
  observations?: string
  tax_authority: string
}

export interface ITaxJurisdictionModels {
  name: string
  level: string
  country: string
  department: string
  city: string
  tax_authority: string
  observations: string
}

export interface ITaxJurisdictionResponse {
  id: number
  code: string
  name: string
  level: string
  country_code: string
  department_code: string
  municipality_code: string
  observations: string
  is_active: boolean
  created_by: number
  updated_by: number
  created_at: string
  updated_at: string
  deleted_at: string
  country_name: string
  department_name: string
  tax_authority: string
  municipality_name: string
}

export interface ITaxJurisdictionList {
  id: number
  code: string
  name: string
  level: string
  country_code: string
  department_code: string
  municipality_code: string
  observations: string
  is_active: boolean
  created_by: number
  updated_by: string
  created_at: string
  updated_at: string
  deleted_at: string
  country_name: string
  department_name: string
  municipality_name: string
  tax_authority: string
}
