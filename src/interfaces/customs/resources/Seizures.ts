export interface ISeizureAssetsProductsTypeResource {
  id: number
  description: string
  repository: string
}

export interface IManagementAreaResource {
  id: number
  name: string
  label?: string
  value?: number
}

export interface ICourtResource {
  id: number
  name: string
  label?: string
  value?: number
}

export interface IProcessTypeResource {
  id: number
  name: string
  label?: string
  value?: number
}

export interface ITypeDefendantResource {
  id: number
  name: string
  label?: string
  value?: number
}

export interface ISeizureStatusResource {
  id: number
  status: string
  label?: string
  value?: number
}

export interface ISeizureProcedureTypeResource {
  id: number
  description: string
  label?: string
  value?: number
}
