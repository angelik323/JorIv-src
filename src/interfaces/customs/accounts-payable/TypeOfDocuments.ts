export type Numbering = 'Manual' | 'Negocio' | 'Consolidado'
export type OperationType = 'Nacional' | 'Extranjera'

export interface ITypeOfDocumentFilters {
  'filter[document]'?: string
  'filter[code]'?: string
  'filter[operation_type]'?: string
  'filter[status_id]'?: number
}

export interface ITypeOfDocumentItem {
  id: number
  code: string
  name: string
  code_name: string
  numbering: string
  document_type: string
  operation_type: OperationType
  has_internal_consecutive: boolean
  has_client_consecutive: boolean
  has_order: boolean
  has_other_references: boolean
  has_legalization_date: boolean
  has_expiration_date: boolean
  status: { id: number; name: string }
}

export interface ITypeOfDocumentForm {
  name: string | null
  numbering: Numbering | null
  document_type: string | null
  operation_type: OperationType | null
  has_internal_consecutive: boolean
  has_client_consecutive: boolean
  has_order: boolean
  has_other_references: boolean
  has_legalization_date: boolean
  has_expiration_date: boolean
}

export interface ITypeOfDocumentCreatePayload {
  name: string
  numbering: Numbering
  document_type: string
  operation_type: OperationType
  has_internal_consecutive: boolean
  has_client_consecutive: boolean
  has_order: boolean
  has_other_references: boolean
  has_legalization_date: boolean
  has_expiration_date: boolean
}

export interface ITypeOfDocumentUpdatePayload
  extends ITypeOfDocumentCreatePayload {}

export interface ITypeOfDocumentApiItem {
  id?: number
  code?: string
  name?: string
  numbering?: string
  document_type?: string
  operation_type?: OperationType | string
  has_internal_consecutive?: boolean
  has_client_consecutive?: boolean
  has_order?: boolean
  has_other_references?: boolean
  has_legalization_date?: boolean
  has_expiration_date?: boolean
  status?: { id?: number; name?: string } | null
}