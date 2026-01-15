export interface IFileUploadItem {
  id: number
  name: string
  file: File
  statusId: number // 20: pending, 104: success, 30: error
  progress: number
  totalRegisters?: number
  uploadId?: number
  matchesCount?: number
  fileUploadStatus?: IFileUploadStatus
  errorDetails?: string | null
  cacheKey: string
}

export interface IMassConsultationImportPayload {
  file: File
  list_name?: string
}

export interface IMassConsultationImportResponse {
  upload_id?: number
  cache_key: string
  hasErrors: boolean
}

export interface IFileInfo {
  file_name: string
  rows_count: number
  charging_status_id: number // "Cargando" | "Exitoso" | "Error"
}

export interface IRecordsInformation {
  number_records: number | null
  matches_count: number | null
}

export interface IInspektorResponse {
  message: string
  priority: number
  name: string
  document: string
}

export interface IVigiaResponse {
  message?: string
  priority?: number
  name?: string
  document?: string
}

export interface IAuthorizationItems {
  authorization_number: number
  identification_number: string
  name: string
  level_match_id: string
  matching_system: string
  inspektor_response: IInspektorResponse | null
  vigia_response: IVigiaResponse | null
}

export interface IFileUploadStatus {
  info_file: IFileInfo
  records_information: IRecordsInformation
  register_match: IAuthorizationItems[]
  error_details: string | null
}
