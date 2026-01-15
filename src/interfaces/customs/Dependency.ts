export interface IDependencyList {
  area: string
  code: string
  id: number
  name: string
  responsible: string
  status: string
  status_id: string | number
  type: string
}

export interface ICreateUpdateDependency {
  code: string | null
  name: string | null
  area_id: number | null
  responsible_id: number | null
  type: string | null
}

export interface IDependencyData {
  area: string
  area_id: number
  code: string
  id: number
  name: string
  responsible: string
  responsible_id: number
  status: string
  status_id: number
  type: string
}
