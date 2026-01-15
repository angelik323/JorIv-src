import { IUploadedFile } from '@/interfaces/global'
import { IFileTableRecordTransfer } from './RecordTransfers'

export interface IDocumentAssignmentList {
  id?: number
  created_at: string
  updated_at: string
  business: {
    id: number
    name: string
    business_code: number
  }
  document_type: {
    id: number
    description: string
    document_code?: string
  }
}

export interface IDocumentAssignmentCreate {
  id?: number | null
  businessTrustId?: number | null
  document_type_id?: number | null
  related_items?: IRelatedItems[] | null
  name?: string
  file?: IAttachments
}
interface IAttachments {
  id: number | string
  is_validated: boolean
}
export interface IDocumentAssignmentEdit {
  id?: number
}

export interface IDocumentAssignmentResponse {
  id?: number
  business_id: number | null | string
  document_type_id: number | null | string
  related_items?: IRelatedItems[] | null
  characteristics?: IRelatedItems[] | null
  file?: IUploadedFile
  created_at?: string
  updated_at?: string
  name?: string
  business?: {
    business_code: number
    name: string
    id: number
  }
  document_type?: {
    id: number
    description: string
    document_code?: string
    created_at?: string
    updated_at?: string
  }
  documents?: IFileTableRecordTransfer[]
  files?: IPolicyDocumentsResponse
  date?: string
  upload_date?: string
  state_id?: string
  business_trust_id?: number
  document_type_trust?: string
}

interface IPolicyDocumentsResponse {
  id: number
  original_name: string
  is_validated: boolean
  created_at: string
  s3_file_path: string
}

export interface IRelatedItems {
  id?: number
  characteristic: string
  name?: string
  value: string | number | null
  structure_id?: number
  structure?: {
    type: string
    id: number
  }
}

export interface IDocumentAssignmentForm {
  id?: number
  business_id: number | null | string
  document_type_id: number | null | string
  related_items?: IRelatedItems[] | null
  file?: IUploadedFile
  name?: string
  business_trust_id?: number
}

export interface IDocumentAssignmentFormData {
  id: number
  value: string
  business_trust_document_structure: {
    description: string
    is_obligatory?: boolean
  }
  document_structure_id?: number
  characteristic?: string
}
