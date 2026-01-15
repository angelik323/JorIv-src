export interface IOwnList {
  id: number
  name: string
  status: string
  created_at?: string
  updated_at?: string
}

export interface IOwnListThirdPartyFile {
  id?: number
  name: string
  totalRegisters: number
  key_data?: string
  statusId?: number
  progress?: number
  errorMessage?: string
}
export interface IOwnListForm {
  name_list: string
  code: string
}

export interface IOwnListFileUploadProps {
  filesSelected?: IOwnListThirdPartyFile | null
  fileProcessingStatus?: IOwnListFileUploadStatus | null
  showTableActions?: boolean
}

export interface IOwnListFileUploadStatus {
  statusId?: number
  progress?: number
}

export interface IOwnListLoadedListItem {
  id?: number
  identificationType: string
  identificationNumber: string
  name: string
}

export interface IOwnListLoadedListProps {
  loading?: boolean
  rows?: IOwnListLoadedListItem[]
  pages?: {
    currentPage: number
    lastPage: number
  }
  rowsPerPageOptions?: number[]
  showActions?: boolean
}

export interface IOwnListImportThirdPartyPayload {
  file: File
  listName: string
}
export interface IOwnListImportThirdPartyRecord {
  id?: number
  type_identification: string
  identification_number: string
  name: string
}

export interface IOwnListInfoFile {
  file_name: string
  total_number_records: number
  status: string
  status_id?: number
}

export interface IOwnListImportThirdPartyResponse {
  key_data?: string
  list_name?: string
  info_file?: IOwnListInfoFile
  list_loaded?: IOwnListImportThirdPartyRecord[]
  errors?: boolean
}

export interface IOwnListDetail {
  basic_data: IOwnListForm
  info_file: IOwnListInfoFile
  list_loaded: IOwnListImportThirdPartyRecord[]
}

export interface IOwnListUpdateNewRecord {
  name: string
  identification_number: string
  type_identification: string
}

export interface IOwnListUpdatePayload {
  id_to_delete: number[]
  new_list: IOwnListUpdateNewRecord[]
  list_name: string
}
