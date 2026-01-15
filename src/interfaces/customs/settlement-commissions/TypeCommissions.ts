export interface ITypeCommissionsResponse {
  id: number
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

export interface ITypeCommissionsList {
  id: number
  commission_class_catalog: IResource
  commission_type_catalog: IResource
  description: string
  created_by: number
  updated_by: number | null
  created_at: string
  updated_at: string
}

export interface ITypeCommissionsInformationForm {
  description: string | null
  commission_type_catalog_id: number | null
  commission_class_catalog_id: number | null
  value: number | null
}

interface IResource {
  id: number
  name: string
}
