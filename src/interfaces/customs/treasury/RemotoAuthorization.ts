export interface IRemoteAuthorizationItem {
  id: number
  authorization_code: string
  module: string
  process: string
  description: string
  motives: string
  authorization_request_date: string
  status: {
    id: number
    name: string
  }
  created_by: {
    id: number
    name: string
  }
  authorizable: {
    id: number
    code: string
    description: string
  }
  attempts_count: number
  can_authorize: boolean
  can_reject: boolean
  is_pending: boolean
  status_label?: string
  module_label?: string
  request_user?: {
    id: number
    username: string
    first_name: string
    last_name: string
    display?: string
  }
  authorization_number?: string
  record_number?: string
  observations?: string
  requested_at?: string
}

export interface IRemoteAuthorizationDetail extends IRemoteAuthorizationItem {
  rejection_reason?: string
  history?: {
    created_at: string
    created_by: string
    updated_at?: string
    updated_by?: string
  }
}

export interface RemoteAuthStatus {
  id: number
  code: string
  name: string
}

export interface RemoteAuthModule {
  id: number
  code: string
  name: string
}

export interface RemoteAuthProcess {
  id: number
  code: string
  name: string
}

export interface StatsGeneral {
  total: number
  authorized: number
  pending: number
  rejected: number
}

export interface StatsByModuleItem {
  module_code: string
  module_name: string
  total: number
  authorized: number
  pending: number
  rejected: number
}

export type StatsByModule = StatsByModuleItem[]

export type Mode = 'authorize' | 'reject'

export type ModalRow = IRemoteAuthorizationItem & { __idx: number }

export type ModelFilters = {
  status: string | null
  module: string | null
  search: string | '' | null
  date_from: string | null
  date_to: string | null
  page: number
  rows: number
}

export type RemoteAuthorizationModalEmit = {
  (e: 'update:openDialog', v: boolean): void
  (e: 'update:selected', v: IRemoteAuthorizationItem[]): void
  (e: 'done'): void
  (e: 'cancel'): void
}

export interface AuthorizationViewModel {
  number: string
  request_date: string
  register: string
  process: string
  requester_user: string
  module: string
  status: string
  status_id: number | string
  description: string
  requester_notes: string
  rejection_reason: string
}
