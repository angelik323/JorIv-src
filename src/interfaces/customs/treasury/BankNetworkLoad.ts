export interface IBankNetworkLoadPages {
  currentPage: number
  lastPage: number
}

export interface IILoadedRecordPages {
  currentPage: number
  lastPage: number
}

export interface IBankNetworkLoadItem {
  id: number
  upload_number: string
  file_name: string
  upload: string
  bussiness: string
  request_type: string
  bank: string
  account_bank: string
  records: string
  state: string
}

export interface IBankNetworkLoadModel {
  id?: number
  type: string
  office_id: string | number
  business_id: string | number
  business_name: string
  bank_id: string | number
  bank_name: string
  format_id?: string | number
  format_name?: string
  closing_date: string
  upload_date: string
  bank_account_id: string | number
  bank_account_name?: string
  documentFiles: File[]
  uploaded_at?: string
  request_type?: string
  total_count?: string | number
  status?: {
    id: 72
    status: string
    comments: null
  }
  business_trust?: {
    id: number
    name: string
    code: string
  }
  bank?: {
    id: number
    description: string
    code?: string
  }
  format_type?: {
    id: number
    description: string
    code?: string
  }
  bank_account?: {
    id: number
    account_number: string
    account_type?: string
  }
  file_name?: string
  created_at?: string
  updated_at?: string
  office?: {
    id: number
    office_code: string
    office_description: string
  }
  details?: IBankNetworkLoadDetail[]
  structure_validation_summary?: {
    total_records: number
    processed_records: number
    valid_records: number
    failed_records: number
    no_apply_records: number
    has_errors: boolean
    status: string
  }
  treasury_movement_code_id?: string | number
  treasury_movement_code?: {
    id: number
    code: string
    description: string
  }
}

export interface ILoadedRecord {
  id: number
  row: string
  record: string
  status: number
}

export interface IBankNetworkLoadDetail {
  id: number
  date: string
  voucher: string
  sub_voucher: string
  movement: {
    id: number
    name: string | null
    code: string
  }
  status: {
    id: number
    status: string
    comments: string | null
  }
}

export interface ILoadedFileInfo {
  id: number
  name: string
  totalRecords: number
  documentId?: string
  fileExtension?: string
}

export interface IFileSignedRequest {
  name: string
  document_type: string
}

export interface IFileSignedResponse {
  success: boolean
  data?: {
    upload_url?: string
    file_path?: string
    document_id?: number
  }
  message?: string
}

export interface IBankNetworkUploadRequest {
  request_type: string
  business_trust_id: number | null
  bank_id: string | number | null
  format_type_id: number | null
  bank_account_id: number | null
  document_id: number | null
  office_id: string | number | null
  treasury_movement_code_id: number | null
}

export interface IBankNetworkUploadResponse {
  success: boolean
  data?: {
    upload_id?: number
    status?: string
    banking_network_upload?: {
      id: number
      uploaded_at: string
      request_type: string
      total_count: number
    }
    structure_validation?: {
      failed_records?: Array<{
        line_number: number
        error: string
      }>
      valid_records?: Array<{
        line_number: number
        record_type: string
        is_control: boolean
        data: Record<string, string>
        validation_status: string
        business_validation: unknown[]
      }>
      summary?: {
        total_records: number
        processed_records: number
        valid_records: number
        failed_records: number
        no_apply_records: number
        has_errors: boolean
        status: string
      }
    }
  }
  message?: string
}

export interface IFileLoadedResponse {
  success: boolean
  data: {
    document_id: string
    total_count: number
    file_name: string
    file_extension: string
  }
  message: string
}

export interface IValidationResult {
  success: boolean
  message: string
  data: {
    success: boolean
    message: string
    status: string
    validation_summary: {
      total_records: number
      valid_count: number
      invalid_count: number
      control_count: number
      detail_valid_count: number
      warning_count: number
    }
    validation_details: {
      records: Array<{
        line_number: number
        record_type: string
        is_control: boolean
        data: Record<string, string>
        validation_status: string
        business_validation: unknown[]
      }>
      invalid_records: Array<unknown>
      warnings: Array<unknown>
    }
  }
}

export interface IProcessBankNetworkUploadResponse {
  success: boolean
  data: {
    success: boolean
    message: string
    error?: string
    processed_count: number
    error_count: number
    errors: Array<{
      record: {
        line_number: number
        record_type: string
        is_control: boolean
        data: Record<string, string>
      }
      error: string
    }>
    status: string
  }
  message: string
}
