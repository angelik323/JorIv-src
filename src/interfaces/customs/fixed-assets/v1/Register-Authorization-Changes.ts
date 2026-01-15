export interface INoveltyListItem {
  id: number
  novelty_code?: string | null
  novelty_description: string
  source: string
  novelty_type: {
    id: number
    description: string
    code: string
  }
  estimated_solution_date: string
  cost: number
  asset_status: {
    id: number
    status: string
  }
  novelty_status: {
    id: number
    status: string
  }
}

export interface INoveltyListResponseItem {
  id: number
  description: string
  source: string
  novelty_type: {
    id: number
    description: string
    code: string
  }
  solution_date: string
  cost: string
  asset_status: {
    id: number
    status: string
  }
  status: {
    id: number
    status: string
  }
}

export interface IAccountingVoucher {
  id: number
  voucher_number: string
  registration_date: string
  status: {
    id: number
    status: string
  }
}

export interface INoveltyType {
  id: number
  name: string
}

export interface IUserAudit {
  id: number
  name: string
}

export interface INoveltyDocument {
  id: number
  document_type: string
  file: {
    name: string
    size_mb: number
  }
}

export interface IFixedAssetBasic {
  id: number
  code: string
  name: string
}

export interface INoveltyDetail {
  id: number
  description: string
  novelty_code?: string | null
  source: string
  solution_date: string
  asset_id: number
  generates_accounting: boolean
  cost: string
  novelty_type: {
    id: number
    description: string
    code: string
  }
  asset_status: {
    id: number
    status: string
  }
  status: {
    id: number
    status: string
  }
  created_at: string
  updated_at?: string
  created_by?: string | null
  updated_by?: string | null
  documents?: IFixedAssetNoveltyDocument[]
  accounting_voucher_id?: number | null
  voucher_data?: RawAccountingVoucherResponse | null
}

export interface ICreateNoveltyPayload {
  asset_id: number
  novelty_type_id: number
  generates_accounting: boolean
  estimated_solution_date: string
  cost: number
  currency: string
  description: string
  additional_observation?: string
  document_ids?: number[]
  group_token?: string
  status_id?: number
}

export interface IFixedAssetNoveltyFormData {
  creation_date: string
  fixed_asset_id: number | null
  novelty_type_id: number | null
  novelty_type_code?: string
  novelty_type_description?: string
  generates_accounting: boolean | null
  asset_affectation?: 'Inicio' | 'Novedad' | 'Retiro'
  estimated_solution_date?: string | null
  cost?: number | null
  description: string
  additional_observation?: string
}

export interface INoveltyTypeOption {
  value: number
  generates_accounting: boolean
  asset_affectation: 'Inicio' | 'Novedad' | 'Retiro'
}

export interface IAuthorizedNoveltyFile {
  id?: number
  name?: string
  original_name?: string
  path?: string
  extension?: string
  size?: number
  created_at?: string
}

export interface IFixedAssetNoveltyDocument {
  id: number
  document_id?: number
  original_name?: string
  file_name: string
  document_type: string
  size_mb: number
  file?: File | null
  file_path?: string
}

export interface IFixedAssetNoveltyDocumentResponse {
  id: number
  file_name: string
  original_name?: string
  file_type: string
  file_size: number
  file_path: string
}

export interface ISignedFilePayload {
  name: string
  file_type: string
  file_size: number
}

export interface IFileSignedPayload {
  group_token: string
  files: ISignedFilePayload[]
}

export interface IFileSignedValidatePayload {
  document_ids: number[]
}

export type FixedAssetDocumentStatus =
  | 'PENDING'
  | 'SIGNING'
  | 'SIGNED'
  | 'SUCCESS'
  | 'ERROR'

export interface INoveltyListParams {
  page: number
  rows: number
  source?: number
  asset_id?: number
  asset_status_id?: number
  novelty_code?: string
  search?: string
}

export interface INoveltyAuditInfo {
  novelty_code: string
  status: string
  created_at: string
  created_by: string
  updated_at?: string
  updated_by?: string
}

export interface IInformationFormRef {
  validateForm: () => Promise<boolean>
  getValues: () => IFixedAssetNoveltyFormData
}

export interface IUploadFormRef {
  hasDocuments: boolean
  getDocumentsPayload?: () => unknown
}

export interface IAccountingVoucherView {
  voucher_number: string
  registration_date: string
  status: string
}

export interface INoveltyView {
  novelty_code: string
  status: string
  created_at: string
  asset: string
  created_by: string
  updated_at: string
  updated_by: string
  novelty_type: string
  description: string
  solution_date: string
  cost: number
  generates_accounting: boolean
  affectation_type: string
  additional_observation: string
  documents: INoveltyDetail['documents']
  accounting_voucher_id?: number | null
  accounting_voucher?: IAccountingVoucherView | null
}
export interface INoveltyDocumentDownloadResponse {
  novelty_document_id: number
  original_name: string
  download_url: string
}

export type RawAccountingVoucherResponse = {
  code?: number | string
  registration_date?: string
  status?: {
    id?: number
    status?: string
  }
}
