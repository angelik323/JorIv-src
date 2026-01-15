export interface IInvoiceGenerationOtherItemsResponse {
  id: number
  status_id: number
  issuer_business_code_snapshot: string
  issuer_business_name_snapshot: string
  issuer_business_document_type_snapshot: string
  issuer_business_document_snapshot: string
  business_code_snapshot: string
  business_name_snapshot: string
  business_document_type_snapshot: string
  business_document_snapshot: string
  third_party_billing_document_type_snapshot: string
  third_party_billing_document_snapshot: string
  third_party_billing_name_snapshot: string
  movement_code_code_snapshot: string
  movement_code_movement_snapshot: string
  movement_code_descriptions_snapshot: string | null
  movement_code_has_iva_snapshot: boolean
  movement_code_percentage_iva_snapshot: number
  base_amount: string
  iva_amount: string
  total_amount: string
  method_payment: string
  payday: number
  invoice_number: string
  expire_at: string
  invoice_description: string
  observations: string
  snapshotted_at: string | null
  created_by: number
  updated_by: number
  created_at: string
  updated_at: string
  issuer_business_id: number
  business_id: number
  status: {
    id: number
    name: string
  }
}

export interface IInvoiceGenerationOtherItemsList {
  id: number
  status_id: number
  business_code_snapshot: string
  business_name_snapshot: string
  third_party_billing_document_type_snapshot: string
  third_party_billing_document_snapshot: string
  third_party_billing_name_snapshot: string
  total_amount: string
  invoice_number: string
  created_at: string
}

export interface IInvoiceGenerationOtherItemsForm {
  issuer_business_id_snapshot?: number | null
  issuer_business_code_snapshot: string | null
  issuer_business_name_snapshot?: string | null
  business_document_snapshot: string | null
  business_document_type_snapshot: string | null

  business_id_snapshot?: number | null
  business_code_snapshot: string | null
  business_name_snapshot?: string | null

  third_party_billing_id?: string | null
  third_party_billing_document_type_snapshot: string | null
  third_party_billing_document_snapshot: string | null
  third_party_billing_name_snapshot: string | null
  third_party_billing_address_snapshot?: string | null
  third_party_billing_phone_snapshot?: string | null
  third_party_billing_email_snapshot?: string | null

  movement_code_id_snapshot?: number | null
  movement_code_code_snapshot: string | null
  movement_code_movement_snapshot: string | null
  movement_code_descriptions_snapshot?: string | null
  movement_code_has_iva_snapshot: boolean | string | null
  movement_code_percentage_iva_snapshot: number | string | null

  base_amount: number | null
  method_payment: string | null
  payday: number | null

  invoice_description: string | null
  observations: string | null
  snapshotted_at?: string | null

  status_id?: number | null
  number_invoice?: string | null

  iva_amount?: number | null
  is_source_network?: boolean | string | null
  source_network_percentage?: number | string | null
  is_ica?: boolean | string | null
  ica_percentage?: number | string | null
  is_source_iva?: boolean | string | null
  source_iva_percentage?: number | string | null
  source_network_amount?: number | null
  source_ica_amount?: number | null
  source_iva_amount?: number | null
  total_amount?: number | null
}

export interface IInvoiceGenerationOtherItemsGenerate {
  ids: number[]
}
