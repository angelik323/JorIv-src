export interface IProjectManagementItem {
  id: number
  code: string
  name: string
  business: string
  business_id?: number
  business_code?: string
  business_name?: string
  status: {
    id: number
    status: string
  }
  start_date: string
  end_date: string
  expenditure_computer: string
  created_at?: string
  updated_at?: string
}

export interface IProjectManagementList extends Array<IProjectManagementItem> {}

export interface IProjectManagementBusinessChildrenItem {
  business_id: number
  code: string
  name: string
  status: {
    id: number
    status: string
  }
  is_associated: boolean
}

export interface IProjectManagementBusinessChildrenList
  extends Array<IProjectManagementBusinessChildrenItem> {}

export interface IProjectManagementAssociatedBusinessItem {
  id: number
  business_id?: number
  code?: string | null
  business_code?: string | null
  name: string
  status: {
    id: number
    status: string
  }
  is_associated?: boolean
}

export interface IProjectManagementAssociatedBusinessList
  extends Array<IProjectManagementAssociatedBusinessItem> {}

export interface IProjectManagementBasicDataForm {
  name: string | null
  description: string | null
  start_date: string | null
  end_date: string | null
  expenditure_computer: string | null
  status_id?: number | null
}

export interface IProjectManagementAssociatedBusinessForm {
  fiduciary_business_id: string | number | null
  business_type_id: string | number | null
  business_status_id: string | number | null
}

export interface IProjectManagementRequest
  extends IProjectManagementBasicDataForm {
  fiduciary_business_id: number | null
  business_type_id?: number | null
  business_status_id?: number | null
  business_ids?: number[]
}

export interface IProjectManagementResponse extends IProjectManagementRequest {
  id: number
  status: {
    id: number
  }
  business_id: number | null
}
