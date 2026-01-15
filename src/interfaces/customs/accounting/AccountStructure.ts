import { IResource } from '@/interfaces/global'

export interface IAccountStructure {
  id: number
  code: string
  structure: string
  purpose: string
  type: IAccountStructureType
  status: IAccountStructureStatus
}

export interface IAccountStructureResponse {
  id: number
  code: string
  structure: string
  purpose: string
  type: IAccountStructureType
  status: IAccountStructureStatus
  catalog_limits: ICatalogLimitResponse[]
}

export interface IAccountStructureStatus {
  id: number
  name: string
}

export interface IAccountStructureType {
  name: string
  value: string
}

export interface IAccountStructureModel {
  id?: number
  code?: string
  structure: string
  purpose: string
  type: string
  status_id: number
  catalog_limits: ICatalogLimit[]
}

export interface ICatalogLimit {
  id?: number
  code?: string
  description: string
  nature: string
  type: string
  group: string
  from_account: string
  to_account: string
}

export interface ICatalogLimitResponse {
  id?: number
  code: string
  description: string
  nature: IRelationRecord
  type: IRelationRecord
  group: IRelationRecord
  from_account: string
  to_account: string
}

export interface ICatalogLimitGroups {
  balance: IResource[]
  control: IResource[]
  resultados: IResource[]
}

export type CatalogGroupType = keyof ICatalogLimitGroups

export interface IRelationRecord {
  name: string
  value: string
}

export interface IAccountStructureResource {
  id: number
  code: string
  structure: string
  name?: string
  purpose?: string
  code_name?: string
  label?: string
  value?: number
  children?: IAccountStructureResource[] | null
}

export interface IAccountStructuresByType {
  'Catálogo de rubros presupuestal': Pick<
    IAccountStructureResource,
    'id' | 'structure'
  >[]
  'Catálogo de conceptos recaudo': Pick<
    IAccountStructureResource,
    'id' | 'structure'
  >[]
  'Catálogo de cuentas contables': Pick<
    IAccountStructureResource,
    'id' | 'structure'
  >[]
  'Catálogo de centros de costo': Pick<
    IAccountStructureResource,
    'id' | 'structure'
  >[]
  'Catálogo de cuentas flujo de caja': Pick<
    IAccountStructureResource,
    'id' | 'structure'
  >[]
}

export enum BusinessTrustAccountStructureTypesEnum {
  Principal = 'Estructura documento fuente',
  Equivalente = 'Estructura equivalente',
  Fiscal = 'Estructura fiscal',
}
