export interface IAuditDatabaseLogsUpdateHasLogsPayload {
  has_logs_permissions: number[]
  has_logs: boolean[]
}

export interface IAuditDatabaseActivityLogsListItem {
  id: number
  module: string
  submodule: string
  action: string
  table: string
  users: string
  device_code: string
  phone: string
  ip: string
  operation_number: string
  old_data: string
  new_data: string
  created_at: string
}

export interface IAuditDatabaseActivityLogsParams {
  module_app_id: number
  'filter[user_name]'?: string
  'filter[submodule]'?: string
  'filter[action]'?: string
  'filter[dateRange]': string
}
