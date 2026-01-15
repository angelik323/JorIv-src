type NullableBooleanOrString = null | boolean | string
type NullableStringOrNumber = null | string | number

export interface ISupportingDocumentResponse {
  id: number
  business_trust: {
    id: number
    code: string
    name: string
  }
  type_document: string
  document_number: string
  third_party_billing: {
    id: number
    address: string
    phone: string
    email: string
    name: string
    document: string
    type_document: string
  }
  production_date: string
  payment_methods: string
  description: string
  support_document_number: string | null
  movement_code: {
    id: number
    code: string
    description: string
    generate_iva: boolean
    iva_percentage: string
    generate_source_rete: boolean
    rete_source_percentage: string
    generate_source_ica: boolean
    rete_ica_percentage: string
    generate_rete_iva: boolean
    rete_iva_percentage: string
  }
  base_amount: string
  base_iva: string
  rete_source: string
  rete_ica: string
  rete_iva: string
  total_amount: string
  days_for_pays: number
  created_by: number
  updated_by: number | null
  created_at: string
  updated_at: string
  status: {
    id: number
    name: string
  }
}

export interface ISupportingDocumentItemList {
  id: number
  business_trust_data: null
  third_party_billing_data: {
    id: number
    document_type: {
      id: number
      name: string
      abbreviation: string
      model: string
      status_id: number
    }
    natural_person: {
      id: number
      full_name: string
    }
  }
  business_trust: {
    id: number
    code: string
    name: string
  }
  type_document: string
  document_number: string
  third_party_billing: {
    id: number
    address: string
    phone: string
    email: string
  }
  production_date: string
  payment_methods: string
  description: string
  support_document_number: null
  total_amount: string
  status: {
    id: number
    name: string
  }
}

export interface ISupportingDocumentForm {
  // business
  business_trust_id: number | null
  business_code_snap: string | null
  business_name_snap: string | null
  type_document: string | null
  document_number: string | null
  // terceros
  third_party_billing_id: number | null
  third_party_billing_name?: string | null
  third_party_address_snap: string | null
  third_party_phone_snap: string | null
  third_party_email_snap: string | null
  third_party_type_document_snap: string | null
  third_party_document_snap: string | number | null
  third_party_name_snap: string | null
  // info
  production_date: string | null
  payment_methods: string | null
  description: string | null
  // movement code
  movement_code_id: number | null
  movement_code_snap: string | null
  movement_code_description?: string | null
  generate_iva: NullableBooleanOrString
  iva_percentage: NullableStringOrNumber
  generate_source_rete: NullableBooleanOrString
  rete_source_percentage: NullableStringOrNumber
  generate_source_ica: NullableBooleanOrString
  rete_ica_percentage: NullableStringOrNumber
  generate_rete_iva: NullableBooleanOrString
  rete_iva_percentage: NullableStringOrNumber
  // amounts
  base_amount: NullableStringOrNumber
  base_iva: NullableStringOrNumber
  rete_source: NullableStringOrNumber
  rete_ica: NullableStringOrNumber
  rete_iva: NullableStringOrNumber
  total_amount: NullableStringOrNumber
  days_for_pays: null | number

  supporting_document_number?: string | null
  status_id?: number | null
}
