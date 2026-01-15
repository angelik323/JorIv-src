export interface IRiskStatus {
  id: number
  name: string
}

export interface IRiskDefinitionResponse {
  id: number
  code: string
  name: string
  nature: string
  minimum_percentage: string | number
  maximum_percentage: string | number
  status_id: number
  status?: IRiskStatus
  created_at?: string
  updated_at?: string
}

export interface IRiskDefinitionForm {
  code: string
  name: string
  nature: string
  minimum_percentage: string | number
  maximum_percentage: string | number
  status_id?: number
}

export interface IRiskListItem {
  id: number
  name: string
  minimum_percentage: string
  maximum_percentage: string
  status_id: number
} 