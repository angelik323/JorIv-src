export interface IAssignEncryptDocument {
  id: number
  checked?: boolean
  type_format_id: number
  assign_encrypt_id: number
  bank: string
  description: string
  type_format: string
  apply_encrypt: boolean
  path_key: string
  type_encrypt: string
}

export interface IPaginatedAssignEncryptDocuments {
  current_page: number
  data: IAssignEncryptDocument[]
  last_page: number
  per_page: number
  total: number
}

export interface IAssignEncryptDocumentWithIndex
  extends IAssignEncryptDocument {
  rowIndex: number
}

export interface IAssignEncryptDocumentUpdatePayload {
  apply_encrypt: boolean
  type_encrypt?: string
  bank_id: number
  bank_structure_id: number
  assign_encrypt_id: number
  file: {
    id: number
    is_validated: boolean
    path: string
  } | null
}

export interface IGenerateFileSignPayload {
  name: string
  document_type: string
}

export interface IGenerateFileSignResponse {
  document_id: number
  upload_url: string
  file_path: string
}

export interface IApiResponse<T> {
  success: boolean
  data: T
  message: string
}
