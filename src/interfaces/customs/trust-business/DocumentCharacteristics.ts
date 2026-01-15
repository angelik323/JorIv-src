export interface IDocumentCharacteristicsList {
  id: number
  business_trust_id: number
  document_type_id: number
  created_at: Date
  business_trust: BusinessTrust
  business_trust_document_type: BusinessTrustDocumentType
}

interface BusinessTrust {
  id: number
  name: string
  business_code: string
}

interface BusinessTrustDocumentType {
  id: number
  document_code: string
  document_description: string
}

export interface IDocumentCharacteristicsForm {
  business_trust_id: string | number
  document_type_id: string | number
  created_at: string
  characteristics_document: IDocumentStructuresForCharacteristics[]
  business_trust?: {
    id: number | string
    name: string
    business_code: string
  }
}

export interface IDocumentStructuresForCharacteristics {
  id: number
  description: string
  characteristic_code: string
  type: string
  obligatory: boolean
  alert: boolean
  business_trust_id: number | string
  order: number
  business_trust_document_structure?: {
    alert: boolean
    characteristic_code: string
    description: string
    id: number
    is_obligatory: boolean
    type_data: string
  }
  is_obligatory?: boolean
}

export interface IDocumentCharacteristicsPayload {
  document_type_id: number | string
  characteristics_document: {
    document_structure_id: number | string
    order: number
  }[]
  action: 'create' | 'update'
}

export interface IBusinessTrustOnCreateDocumentCharacteristics {
  id: number
  name: string
}
