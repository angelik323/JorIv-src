export interface IStructureType {
  id: number
  name: string
  code: string
  status: { id: number; name: string }
}

export interface IStructureTypeCreatePayload {
  name: string
}

export interface IStructureTypeDetailResponse {
  id: number
  name: string
}

export interface IStructureTypeFilters {
  status: string | null
  search: string | null
  page: number
  rows: number
}

export interface IStructureTypeModel {
  id?: number
  code: string
  name: string
  status_id: string | number
}

export interface IStructureTypeFormModel {
  id?: number
  code: string
  name: string
  status_id: number
}

export interface IStructureTypeDetailResponse {
  code: string
  name: string
  status: string | number
}
