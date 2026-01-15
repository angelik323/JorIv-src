export interface ICreateUpdateDispatch {
  official_document_number: string | null
  tracking_number: string | null
  asset_id: number | null
  dispatch_type_id: number | null
  shipping_date: string | null
  origin_warehouse_id: number | null
  destination_warehouse_id: number | null
  observations: string | null
}

export interface IDispatchList {
  asset: string
  destination_warehouse: string
  origin_warehouse: string
  shipping_date: string
  shipping_type: string
  status: IStatus
}

interface IStatus {
  id: number
  status: string
}
