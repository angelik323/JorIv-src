export interface IRoles {
  id?: number | null
  name: string | null
  description: string | null
}

export interface IRolesList {
  id: number | null
  name: string | null
  status: Status
  status_id: number | null
}

export interface IRowRoles {
  id: number | string | null
  name: string
  status: Status
  status_id: number | null
  users: number | string | any
}

export interface Status {
  id: number
  status: string
}

export interface IRolesCount {
  total: number
  active: number
  inactive: number
}

export interface IJsonOptionsInactive {
  role_inactive_option_id: number | string | any
  role_id: number | string | any
}

export interface IPermissionRole {
  isChecked: boolean
  id: number
  name: string
  description: string
  module: string
  status: string
  status_id: number
  children: ChildRole[]
}

export interface IFormDataRole {
  name: null | string
  description: null | string
  priority_level: null | number | string
  authorization_level_id: null | number | string
  permissions: null | IPermissionRole[] | string[]
  is_schedule_restricted?: boolean
  schedule_start_hour?: null | string
  schedule_end_hour?: null | string
  has_expiration?: null | string | number
  expired_months?: null | string | number
  requires_mfa?: boolean
  mfa_duration_months?: null | string | number
  has_password_policy?: boolean
  password_expiration_days?: null | string | number
}
export interface ChildRole {
  permission: string
  path: null | string
  actions: string[]
  description: string
  id: 9
  isChecked: true
  status: string
  name: string
}
