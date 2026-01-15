export interface ISupplies {
  id: number
  code: string
  name: string
  status_id: number
  quantity: string
  created_at: string
  measurement_unit: string
  measurement_unit_label: string
}

export interface ISuppliesRequest {
  id?: number
  code: string
  name: string
  association_date: string
  quantity: string
  measurement_unit: string
  description: string
  assets: Assets[]
}

export interface Assets {
  id: number
  asset: string
  plate_code: string
  association_date: string
  quantity: string
  description: string
}
