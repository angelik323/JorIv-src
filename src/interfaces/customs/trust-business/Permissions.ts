// Por Usuario

export interface IBusinessPermissionListItem {
  id: number
  code: string
  name: string
  has_permission: boolean
}

export interface IBusinessPermissionRowSelection {
  rows: number
  selected: IBusinessPermissionListItem[]
}

export interface IManagePermissionsByUser {
  business: {
    business_id: number
    has_permission: boolean
  }[]
}

// Por Negocio

export interface IUserPermissionListItem {
  id: number
  name: string
  last_name: string
  document: string
  has_permission: boolean
}

export interface IUserPermissionRowSelection {
  rows: number
  selected: IUserPermissionListItem[]
}

export interface IManagePermissionsByBusiness {
  users: {
    user_id: number
    has_permission: boolean
  }[]
}
