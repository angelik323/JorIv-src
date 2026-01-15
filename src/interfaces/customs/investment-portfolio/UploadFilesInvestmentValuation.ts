import { IFileTableRecordTransfer } from '@/interfaces/customs'

export interface IUploadFilesInvestmentValuationResponse {
  label_name: string | null
  method_name: string | null
}

export interface IUploadFilesInvestmentValuationListFilesResponse
  extends IUploadFilesInvestmentValuationResponse {
  file_structure_name: string | null
}

export interface IUploadFilesInvestmentValuationListFilesRequest
  extends IUploadFilesInvestmentValuationResponse {
  file_structure_name: File
}

export interface IUploadFilesInvestmentValuationCheckFileUploadStatus {
  expected_file_name: string | null
  uploaded_file_name: string | null
  group_charging_id: number | null
  status: number | null
  status_id: number | null
  upload_date: string | null
  update_date: string | null
  duration_charging: string | null
}

export interface IUploadFilesInvestmentValuationForm {
  id: number | null
  issuers_counterparty_id: number | null
  upload_date: string | null
  description: string | null
  selected_files: IUploadFilesInvestmentValuationListFilesResponse[]
  files: IUploadFilesInvestmentValuationListFilesRequest[]
  documents: IFileTableRecordTransfer[]
}
