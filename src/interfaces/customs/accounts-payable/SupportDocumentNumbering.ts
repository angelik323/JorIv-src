export interface ISupportDocumentNumberingItem {
  id: number
  document: string
  status_id: number
  support_document_numbering_issuer_delegate_id: number | null
  support_document_numbering_issuer_status_id: number
  support_document_numbering_issuer_status: ISupportDocumentNumberingStatus
  legal_person: ISupportDocumentNumberingItemLegalPerson | null
  natural_person: ISupportDocumentNumberingItemNaturalPerson | null
  document_type: ISupportDocumentNumberingItemDocumentType
}

export interface ISupportDocumentNumberingShowItem {
  id: number
  document: string
  legal_person: ISupportDocumentNumberingItemLegalPerson | null
  natural_person: ISupportDocumentNumberingItemNaturalPerson | null
  document_type: ISupportDocumentNumberingItemDocumentType
  support_document_numbering_issuer_delegate?: {
    id: number
    document: string
    validator_digit: string | null
    legal_person: ISupportDocumentNumberingItemLegalPerson | null
    natural_person: ISupportDocumentNumberingItemNaturalPerson | null
    document_type: ISupportDocumentNumberingItemDocumentType
  }
  status: ISupportDocumentNumberingStatus
}

export interface ISupportDocumentNumberingItemLegalPerson {
  third_party_id: number
  id: number
  business_name: string
}

export interface ISupportDocumentNumberingItemNaturalPerson {
  third_party_id: number
  id: number
  name: string
  middle_name: string
  last_name: string
  second_last_name: string
  full_name: string
}

export interface ISupportDocumentNumberingItemDocumentType {
  id: number
  name: string
  abbreviation: string
}

export interface ISupportDocumentNumberingForm {
  id?: number
  nit: string | null | number
  name: string | null
  status: number | null
  delegate_third_party_id: number | null
  delegate_third_party_nit?: string | number | null
  delegate_third_party_document_type: string | null
  delegate_third_party_name: string | null
}

export interface ISupportDocumentNumberingUpdatePayload {
  support_document_numbering_issuer_delegate_id: number
}

export interface ISupportDocumentNumberingResolution {
  id: number
  resolution: string
  resolution_date: string
  prefix: string
  range_start: number
  range_end: number
  next_available_number: number
  validity_start_date: string
  validity_end_date: string
  has_business_prefix: boolean
  third_party_id: number
  status: {
    id: number
    name: string
  }
}

export interface ISupportDocumentNumberingBusinessTrust {
  id: number
  third_party_id: number
  prefix: string
  business_code: string
  name: string
  business_mod: string
  status_id: number
  status_name: string
  account: ISupportDocumentNumberingBusinessTrustAccount
  status: ISupportDocumentNumberingStatus
  handles_issuer_data: boolean
  support_document_numberings:
    | ISupportDocumentNumberingBusinessTrustSupportDocumentNumberings[]
    | null
}

export interface ISupportDocumentNumberingBusinessTrustSupportDocumentNumberings {
  id: number
  support_document_numbering_resolution_id: number
  prefix: string | null
  status_id: number
  handles_issuer_data: boolean
  status: ISupportDocumentNumberingStatus
}

export interface ISupportDocumentNumberingBusinessTrustAccount {
  id: number
  business_trust_id: number
  identification_tax: string
  status_id: number
  status: ISupportDocumentNumberingStatus
}

export interface ISupportDocumentNumberingStatus {
  id: number
  status: string
}

export interface ISupportDocumentNumberingResolutionIssuerData {
  nit: string
  delegate_third_party_nit: string
  delegate_third_party_document_type: string
  delegate_third_party_name: string
}

export interface ISupportDocumentNumberingResolutionForm {
  resolution: string | null
  resolution_date: string | null
  prefix: string | null
  range_start: number | null
  range_end: number | null
  validity_start_date: string | null
  validity_end_date: string | null
  has_business_prefix: boolean | null
  next_available_number: number | null
  status_id: number | null
}

export interface ISupportDocumentNumberingResolutionCreatePayload
  extends ISupportDocumentNumberingResolutionForm {
  third_party_id: number
}

export interface ISupportDocumentNumberingBusinessForm {
  nit: string | null
  business_code: string | null
  resolution: string | null
  resolution_date: string | null
  prefix: string | null
  range_start: number | null
  range_end: number | null
  validity_start_date: string | null
  validity_end_date: string | null
  next_available_number: number | null
  status_id: number
  handles_issuer_data: boolean
}

export interface ISupportDocumentNumberingBusinessUpdatePayload {
  business_trust_id: number | null
  support_document_numbering_resolution_id: number | null
  prefix?: string | null
  handles_issuer_data: boolean
  status_id: number
}
