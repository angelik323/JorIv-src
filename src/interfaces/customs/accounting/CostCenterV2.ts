type NullableNumberString = number | string | null

export interface ICostCenterListItem {
  id: number
  code?: string
  structure?: string
  purpose?: string
  status?: {
    id?: number
    name?: string
  }
}

export interface ICostCenterTableItemForm {
  id?: number
  code: NullableNumberString
  type: string | null
  name: string | null
  isNew?: boolean
}

export interface ICostCenterInformationForm {
  id?: number
  account_structure: NullableNumberString
  purpose: NullableNumberString
  structure: NullableNumberString
  status: NullableNumberString
  costCenters: ICostCenterTableItemForm[]
}

export interface ICostCenterToCreate {
  account_structures_id: number
  centers: {
    code: string
    name: string
    type: string
  }[]
}

export interface ICostCenterToEdit {
  centers: {
    id?: number // Se envía al editar un registro existente
    code?: string // Se envía al crear un nuevo código
    name: string
    type: string
  }[]
  centers_to_delete: number[]
}

export interface ICostCenterResponse {
  structure: {
    id: number
    code?: string
    structure?: string
    purpose?: string
    type?: string
    status?: {
      id?: number
      name?: string
    }
  }
  cost_centers?: {
    id?: number
    status?: {
      id?: number
      name?: string
    }
    code?: string
    type?: string
    name?: string
  }[]
}
