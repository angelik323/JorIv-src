export interface ISupplier {
  id?: number | null
  name: string | null
  nit: number | string | null
  phone: string | null
  description: string | null
  address: string | null
}

export interface ISupplierList {
  id: number | null
  name: string | null
  description: string | null
  nit: number | null
  phone: string | null
  address: string | null
  status_id: number | null
}

export interface IRowSupplier {
  address: string
  created_at: Date
  description: string
  id: number
  name: string
  nit: string
  phone: string
  rn: string
  status: Status
  status_id: string
  updated_at: Date
}

export interface Status {
  id: number
  status: string
}
