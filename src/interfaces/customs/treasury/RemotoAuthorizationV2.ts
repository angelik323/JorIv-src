export interface IRemoteAuthorizationItemV2 {
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
  old_entity?: string
  authorized_by?: {
    id: number | string
    name: string
  }
  bank_data?: {
    nit: string
    bank_code: string
  }
}

export interface IRemoteAuthorizationDetailV2
  extends IRemoteAuthorizationItemV2 {
  rejection_reason?: string
  history?: {
    created_at: string
    created_by: string
    updated_at?: string
    updated_by?: string
  }
}

export interface RemoteAuthStatusV2 {
  id: number
  code: string
  name: string
}

export interface RemoteAuthModuleV2 {
  id: number
  code: string
  name: string
}

export interface RemoteAuthProcessV2 {
  id: number
  code: string
  name: string
}

export interface StatsGeneralV2 {
  total: number
  authorized: number
  pending: number
  rejected: number
}

export interface StatsByModuleItemV2 {
  module_code: string
  module_name: string
  total: number
  authorized: number
  pending: number
  rejected: number
}

export type StatsByModuleV2 = StatsByModuleItemV2[]

export type Mode = 'authorize' | 'reject'

export type ModalRow = IRemoteAuthorizationItemV2 & { __idx: number }

export type ModelFilters = {
  status: string | null
  module: string | null
  search: string | '' | null
  date_from: string | null
  date_to: string | null
  page: number
  rows: number
}

export type RemoteAuthorizationModalEmitV2 = {
  (e: 'update:openDialog', v: boolean): void
  (e: 'update:selected', v: IRemoteAuthorizationItemV2[]): void
  (e: 'done'): void
  (e: 'cancel'): void
}

export interface AuthorizationViewModelV2 {
  number: string
  request_date: string
  register: string
  process: string
  requester_user: string
  module: string
  status_id: number | string
  description: string
  requester_notes: string
  rejection_reason: string
  old_entity?: string
  authorized_by?: {
    id: number | string
    name: string
  }
  bank_data?: {
    nit: string
    bank_code: string
  }
  status?: {
    id: number
    name: string
  }
}
