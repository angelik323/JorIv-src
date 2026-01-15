export interface IDefinitionSupportingDocumentsList {
  id: number
  name: string
  description: string
  required: boolean
  active: boolean
  status: string
  created_at: string
  updated_at: string
}

export interface IDefinitionSupportingDocumentsResponse {
  id: number
  structure_documental_code: number | null
  structure: string | null
  purpose: string | null
  document_code: string | null
  type: string | null
  module: string | null
  name: string | null
  process: string | null
  support: string | null
  general_file_retention: string | null
  mandatory: string | null
  final_provision: string | null
}

export interface IDefinitionSupportingDocumentsForm {
  structure_id: number | string | null
  structure: string | null
  purpose: string | null
  document_code: string | null
  name: string | null
  type: string | null
  module: string | null
  process: string | null
  support: string | null
  mandatory: string | null
  general_file_retention: string | null
  final_provision: string | null
  user_id?: number | null
  created_by?: number | null
  status_id?: boolean
}
