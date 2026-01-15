// types
export type AssetClassType = 'Inmueble (INM)' | 'Mueble (MUB)'
export type TypeType = 'activo fijo' | 'bien'
// list
export interface IConfigurationTypesSubtypesItemList {
  id: number | null
  code: string | null
  type: string | null
  asset_class: string | null
  description?: string | null
}

// form
export interface IAssetSubtypeForm {
  _uid: number //
  id?: number //
  code: string | null
  description: string | null
  life_span: number | null
  depreciation: number | null
}
export interface IAssetTypeForm {
  id?: number
  type: TypeType | null
  code: number | null
  description: string | null
  asset_class: AssetClassType | null
  created_at?: string
  created_by?: string | null
  updated_at?: string | null
  updated_by?: string | null
  subtypes: IAssetSubtypeForm[]
}

// request
export interface IAssetSubtypeCreateRequest {
  code: string
  description: string
  life_span: number
  depreciation: number
}

export interface IAssetSubtypeUpdateRequest extends IAssetSubtypeCreateRequest {
  id: number
}

export interface IAssetSubtypeDelete {
  id: number
  delete: true
}

export type IAssetSubtypeRequestUnion =
  | IAssetSubtypeCreateRequest
  | IAssetSubtypeUpdateRequest
  | IAssetSubtypeDelete

export interface IAssetTypeRequest {
  code: number
  type: TypeType
  description: string
  asset_class: AssetClassType
  subtypes: IAssetSubtypeRequestUnion[]
}

export type IConfigurationTypesSubtypesCreateRequest = IAssetTypeRequest

// response
export interface IAssetSubtypeResponse {
  id: number
  code: string
  description: string
  life_span: number
  depreciation: string
}

export interface IAssetTypeResponse {
  id: number
  code: number
  type: TypeType
  description: string
  asset_class: AssetClassType
  created_at?: string
  created_by?: string | null
  updated_at?: string | null
  updated_by?: string | null
  subtypes: IAssetSubtypeResponse[]
}

export interface IConfigurationTypesSubtypesCreateResponse {
  success: boolean
  data: IAssetTypeResponse
  message: string
}

// CrudFormLayout
export interface IHeaderProps {
  title: string
  breadcrumbs: Array<{
    label: string
    route?: string
  }>
}
