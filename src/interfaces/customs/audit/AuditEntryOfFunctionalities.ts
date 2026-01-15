export interface IAuditEntryOfFunctionalitiesList {
  id: number
  user_id: number
  user_name: string
  role_name: string
  module_app_id: number
  permission_id: number
  permission_description: string
  parent_permission_id: number
  parent_permission_name: string
  parent_permission_description: string
  ip_address: string
  accessed_at: string
}

export interface IAuditEntryOfFunctionalitiesFilters {
  'filter[is_confidential]': boolean
  'filter[date_from]': string
  'filter[date_to]': string
  'filter[search]': string
  'filter[role_name]': string
  'filter[module_app_id]': number
  'filter[parent_permission_id]': number
  'filter[permission_id]': number
}

export interface IAuditEntryFunctionalitiesAction {
  id: number
  name: string
  description: string
  is_confidential: boolean
  permission: string

  has_logs: boolean
}

export interface IAuditEntryFunctionalitiesSubmodule {
  id: number
  permission: string
  name: string
  is_confidential: boolean
  actions: IAuditEntryFunctionalitiesAction[]

  has_logs: boolean
}

export interface IAuditEntryFunctionalitiesModule {
  id: number
  description: string
  submodule: IAuditEntryFunctionalitiesSubmodule[]

  selected?: boolean
}

export interface IAuditEntryFunctionalitiesUpdateConfidencialPayload {
  confidential_permissions: number[]
  confidentials: boolean[]
}
