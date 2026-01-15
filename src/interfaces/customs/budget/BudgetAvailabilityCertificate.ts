export interface IBudgetAvailabilityCertificateList {
  id: number
  operation_log: {
    id: number
    validity: number
    business_trust: {
      id: number
      business_code: string | null
      name: string | null
    }
    user_created: {
      id: number
      name: string
      last_name: string
    } | null
    authorized_user: {
      id: number
      name: string
      last_name: string
    } | null
    status: {
      id: number
      name: string
    } | null
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
      } | null
    } | null
  }
  generated_at: string
  description_society: string
}

export interface IBudgetAvailabilityCertificateListExtraFields {
  success: boolean
  last_description_society: string
  last_file_exportable_id: number | null
}

export interface IBudgetAvailabilityCertificateForm {
  filter: {
    business_trust_id: number
    validity: number
    budget_level_id: number
    document_from: number
    document_to: number
  }
  description_society: string
}

export interface IBudgetAvailabilityCertificateExportResponse {
  success: boolean
  data: {
    file_exportable_id: number
    process_id: number
    status: string
    status_id: number
    check_status_endpoint: string
  } | null
}

export enum IBudgetAvailabilityCertificatesGenerationStatuses {
  PENDING = 25,
  IN_PROCESS = 26,
  COMPLETED = 29,
  ERRORS = 30,
}

export interface IBudgetAvailabilityCertificateStatusResponse {
  file_exportable_id: number
  process_id: number
  status: string
  status_id: IBudgetAvailabilityCertificatesGenerationStatuses
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
