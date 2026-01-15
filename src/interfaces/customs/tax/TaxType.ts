export interface ITaxTypeTaxRequest {
  name: string
  sign: string
  scope: string
  usage: string
  observations: string
}

export interface ITaxTypeTaxResponse {
  id: number
  code: string
  name: string
  sign: string
  scope: string
  usage: string
  observations: string
  is_active: boolean
  created_by: number
  updated_by: number
  created_at: string
  updated_at: string
  deleted_at: string
}

export interface ITaxTypeTaxList {
  id: number
  code: string
  name: string
  sign: string
  scope: string
  usage: string
  observations: string
  is_active: boolean
  created_by: number
  updated_by: string
  created_at: string
  updated_at: string
  deleted_at: string
}
