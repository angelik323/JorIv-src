export interface ITerritorialTaxesFilters {
  'filter[city_id]'?: number
  'filter[settlement_concept_id]'?: number
  'filter[third_party_id]'?: number
  'filter[status_id]'?: number
}

export interface ITerritorialTaxesItem {
  id: number
  city: {
    id: number
    name: string
    code: string
  }
  third_party: {
    id: number
    document: string
    validator_digit: number | null
    document_type_id: number
    support_document_numbering_issuer_status_id: number
    support_document_numbering_issuer_delegate_id: number | null
    legal_person: null | {
      business_name: string
    }
    natural_person: null | {
      full_name: string
      
    }
    document_type: {
      id: number
      name: string
      abbreviation: string
      model: string
      status_id: number
    }
  }
  settlement_concept: {
    id: number
    concept_code: string
    class: string
    description: string
  }
  status: {
    id: number
    name: string
    description: string | null
  }
}

export interface ITerritorialTaxesForm {
  city_id: number | null
  third_party_id: number | null
  settlement_concept_id: number | null
  status_id?: number | null
}