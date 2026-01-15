export interface ISuppliesForm {
  id?: number | null
  code: string
  name: string
  measurement_unit: string
  description: string | null
}

export interface ILinkedAssetsTable {
  id: number
  asset_name: string | null
  asset_id: string | null
  association_date: string | null
  description: string | null
  quantity: string | null
  saved?: boolean
}
