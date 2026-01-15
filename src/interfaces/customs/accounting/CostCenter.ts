export interface ICostCenter {
  id: number
  code: string
  name: string
  type: string
  estructura: string
  purpose: string
  code_structure?: string
  status: ICostCenterStatus | string
  status_id?: number
  account_structure_id?: number
  account_chart_id?: number
  cost_center_type?: string
}

export interface ICostCenterItem {
  code: string
  id: number
  name: string
  purpose: string
  status_id: number
  status?: ICostCenterStatus
  structure: string
  type: string
}

export interface ICostCenterStatus {
  id: number
  name?: string
}

export interface ICostCenterModel {
  id?: number
  account_structure_id: number
  account_chart_id: number
  account_chart?: string
  code_structure?: string
  estructura: string
  purpose: string
  type: string
  status_id: number
  cost_center_type?: string
  costCenters: {
    id?: number
    code: string
    name: string
    type: string
  }[]
}

export interface ICostCenterCatalog {
  id?: number
  code: string
  name: string
  type: string
}

export interface ICostCenterCreatePayload {
  account_structures_id: number
  accounts_chart_id: number
  centers: Array<{
    code: string
    name: string
    type: string
  }>
}

export interface ICostCenterResponse {
  structure: {
    id: number
    structure: string
    purpose: string
    type: string
  }
  chart: {
    id: number
    structure: string
    purpose: string
    type: string
  }
  cost_centers: Array<{
    id: number
    code: string
    name: string
    type: string
  }>
}
