export interface ITypeCommissionsResponseV2 {
  id: number
  code: number
  commission_class_catalog: IResource
  commission_type_catalog: IResource
  commission_type_catalog_id: number
  commission_class_catalog_id: number
  value: number
  description: string
  created_by: number
  updated_by: number | null
  created_at: string
  updated_at: string
}

export interface ITypeCommissionsListV2 {
  id: number
  commission_class_catalog: IResource
  commission_type_catalog: IResource
  description: string
  created_by: number
  updated_by: number | null
  created_at: string
  updated_at: string
  code: string
}

export interface ITypeCommissionsInformationFormV2 {
  code?: number | null
  description: string | null
  commission_type_catalog_id: number | null
  commission_class_catalog_id: number | null
}

interface IResource {
  id: number
  name: string
}
