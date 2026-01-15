export interface IBudgetRegistrationCertificateList {
  id: number
  operation_log: {
    id: number
    validity: number
    business_trust: {
      id: number
      business_code: string
      name: string
    }
    user_created: {
      id: number
      name: string
      last_name: string
    }
    authorized_user: {
      id: number
      name: string
      last_name: string
    }
    status: {
      id: number
      name: string
    }
    budget_document_type: {
      id: number
      code: string
      description: string
      budget_level_id: number
      level: {
        id: number
        level: string
        description: string
        class: string
      }
    }
  }
  user_signature: {
    id: number
    name: string
    last_name: string
    full_name: string
  }
  generated_at: string
}

export interface IBudgetRegistrationCertificateListResponse {
  last_description_society: string
  last_file_exportable_id: number | null
  data: IBudgetRegistrationCertificateList[]
}

export interface IBudgetRegistrationCertificateExportResponse {
  success: boolean
  data: {
    file_exportable_id: number
    process_id: number
    status: string
    status_id: number
    check_status_endpoint: string
  } | null
}

export enum IBudgetRegistrationCertificatesGenerationStatuses {
  PENDING = 25,
  IN_PROCESS = 26,
  COMPLETED = 29,
  ERRORS = 30,
}

export interface IBudgetRegistrationCertificateStatusResponse {
  file_exportable_id: number
  process_id: number
  status: string
  status_id: IBudgetRegistrationCertificatesGenerationStatuses
  status_name?: string
  is_ready: boolean
  progress?: {
    total_items: number
    processed_items: number
    progress_percentage: number
    status_id: number
    status: string
  }
  file_url?: string
  error?: string
  downloaded_at: string
}
