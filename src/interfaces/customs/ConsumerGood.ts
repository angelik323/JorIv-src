export interface IConsumerGoodList {
  id: number
  item: string
  good_status: string
  minimum_stock: number
  current_stock: number | null
  maximum_stock: number
  expiration_date: string | null
  status_id: number
  warehouse: string
  product_code: string
}

export interface ICreateUpdateConsumerGood {
  item_id: number | null
  good_status_id: number | null
  location_id: number | null
  unit_measurement: string | null
  minimum_stock: number | null
  maximum_stock: number | null
  expiration_date: string | null
  warehouse_id: number | null
  value_element: string | null
  product_code: string | null
  description: string | null
  good_class: string | null
  observations: string | null
  origin: number | null
  invoice_date: string | null
  invoice: string | null
  supplier_nit: string | null
  supplier: string | null
  reference: string | null
  quantity: number | null
  manufacture_date: string | null
}

export interface IConsumerGoodData {
  current_stock: number | null
  expiration_date: string
  good_status: IResource
  id: number
  item: IResource
  location: IResource
  maximum_stock: number
  minimum_stock: number
  unit_measurement: string
  warehouse: IResource
  product_code: string
  description: string
  value_element: string
  good_class: IResource
  observations: string | null
  origin: IResource
  invoice_date: string | null
  invoice: string | null
  supplier_nit: string | null
  supplier: IResource
  reference: string | null
  quantity: number | null
  manufacture_date: string | null
}

interface IResource {
  id: number
  name: string
  status_id: number
  code: string
}
