export interface IDisciplinaryProcesses {
  disciplinary_process: IDisciplinaryProcessesDetail
  paginated_histories: IPaginatedHistories
}

export interface IDisciplinaryProcessesDetail {
  id: number
  asset_id: string
  asset_name: string
  job_number: string
  start_date: string // Puede ser `Date` si prefieres trabajar con objetos de fecha
  observations: string
  user_id: any
  status_id: number
  created_at: string // Puede ser `Date` si prefieres objetos de fecha
  updated_at: string
  user_functionary: string
  follow_up: string
}
export interface IPaginatedHistories {
  current_page: number
  data: IDisciplinaryProcessesHistory[]
  last_page: number
}

export interface IDisciplinaryProcessesHistory {
  rn: string
  id: number
  disciplinary_process_id: string
  state_change_date: string
  process_state: string
  observations: string
  created_at: string
  updated_at: string
}

export interface IDisciplinaryProcessesList {
  id: number
  asset_id: number | string | null
  job_number: number | string | null
  start_date: number | string | null
  user_id: number | string | null
  status_id: number | null
}
