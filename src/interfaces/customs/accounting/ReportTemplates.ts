export interface IReportTemplatesRequest {
  report_template_id?: number
  code?: string
  name: string
  logo?: ILogoTable
  signatures?: ISignatureTable[]
}
export interface IReportTemplatesResponse {
  id: number
  code: string
  name: string
}

export interface ILogoTable {
  id?: number
  logo_id?: number
  image_url?: string
  image_path: string
  image_name?: string
  app_name: string
  entity: string
  is_validated?: boolean
}

export interface ISignatureTable {
  id?: number
  signature_id?: number
  image_path?: string
  image_url?: string
  code?: string
  position?: string
  name?: string
  is_active: boolean
  user?: {
    name: string
    profile_type: string
  }
  is_validated?: boolean
}

export interface IGeneratePresignedUrl {
  document_type: string
  app_name: string
  file_type: string
  name: string
  entity: string
}

export interface IInventoryTable {
  id?: number
  code_report: string
  name_report: string
}

export interface IUpdateImage {
  id: number
  image_path?: string
  is_active?: boolean
}

// Interfaces for V2 Report Templates

export interface IReportTemplateListItem {
  id: number | string
  name: string
  code?: string
  status: {
    id: number | string
    status: string
  }
}

export interface IReportTemplateListLogoItem {
  id: number | string
  name: string
  url_to_preview?: string
  status?: {
    id: number | string
    status: string
  }
}

export interface IReportTemplateSignatureItem {
  id: number | string
  url_to_preview: string
  user: {
    id: number | string
    number_document: string
    name: string
  }
  status: {
    id: number | string
    status: string
  }
}

export interface IReportTemplateResponseShow {
  id: number | string
  url_to_preview: string
  name?: string
  user?: {
    id: number | string
    number_document: string
    name: string
  }
  status?: {
    id: number | string
    status: string
  }
}

export interface IReportTemplatePayloadLogoAndSignature {
  image_path?: string
  app_name?: string
  user_id?: number | string
}

export interface IReportTemplateModifyLogoAndSignature {
  name?: string
  logo?: {
    image_path?: string
    app_name?: string
    entity?: string
  }
  signatures?: Array<{
    image_path?: string
    is_active?: boolean
  }>
}

export interface IReportSignatures {
  manage_signature: boolean
  responsible_type: string
  report_signature_id: number
  order: number
  signature_type: string
  show_position: boolean
  show_identification_number: boolean
  show_professional_card: boolean
  show_signature_image: boolean
  show_signature_legend: boolean
  profession_card_number: string
  signature_legend: string
}

export interface IReportNotes {
  has_note: boolean
  description: string
  position: number
  has_second_note?: boolean
  description_second_note?: string
  has_third_note?: boolean
  description_third_note?: string
}

export interface IReportTemplatePayload {
  name?: string
  header: {
    has_first_header: boolean | null
    text_first_header: string | null
    has_first_logo: boolean | null
    first_logo_id: number | null
    second_logo_id?: number | null
    has_second_logo: boolean | null
    show_header_name: boolean | null
    show_business_type: boolean | null
    has_accounting_book: boolean | null
    has_second_header: boolean | null
    text_second_header: string | null
    presentation_business_type?: number | null
  }
  signatures: Array<IReportSignatures>
  notes: Array<IReportNotes>
  list_reports?: number[]
}

export interface IReportTemplateReportsGeneric {
  id?: number | string
  name?: string
}

export interface IReportTemplateReportSignatureGeneric {
  id: number | string
  name?: string
  position?: string
}
