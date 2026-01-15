export interface IDetailDispersionGroupRequest {
  id: number | null | undefined
  value: string
  gmf: string | null
  record_expense_id: number
  method_payment_id: number
  bank_id: number
  bank_account_id: number
  authorized_document_type_id: number | null
  beneficiary_bank_account: number | null
  beneficiary_bank_id: number | null
  nit_third_party_id: number | null
  group: boolean
}

export interface IDispersionDetailGroupResponse {
  id?: number | null
  bank: string
  bank_account: string | null
  bank_account_id: number
  bank_code: string
  bank_id: number
  bank_name: string
  business: string
  business_name: string
  method_payment_code: string
  means_of_payment: string
  method_payment_id: number
  number_associated_payments: number
  record_expense_id: number
  type_mean_of_payments: string
  dispersion_type: string
  business_id: number
}

export interface IDispersionBreakdownGroupResponse {
  id: number
  business: string
  office: string
  bank_id: number
  bank_name: string
  bank_account: string | null
  bank_account_id: number
  means_of_payment: string
  method_payment_id: number
  gmf: string | null
  value: string
  type_document: string
  authorized_document_type_id: number
  beneficiary_bank_account: number
  beneficiary_bank_id: number
  nit_third_party_id: number
  third_party_name: string | null
  record_expense_id: number
  group: boolean
}

export interface IDetailDispersionGroupRequestV2 {
  id?: number | null

  value: string
  gmf: string | null

  record_expense_id: number | null
  bank_transfer_id: number | null

  method_payment_id: number
  bank_id: number
  bank_account_id: number

  authorized_document_type_id: number | null
  beneficiary_bank_account: number | null
  beneficiary_bank_id: number | null
  nit_third_party_id: number | null

  group: boolean
}

export interface IDispersionBreakdownGroupResponsev2 {
  id: number
  number: string | null
  business: string
  office: string

  bank_id: number
  bank_name: string
  bank_account: string | null
  bank_account_id: number
  bank_account_name: string
  bank_account_type: string

  means_of_payment: string | null
  method_payment_id: number | null

  fund: string | null
  investment_plan: string | null
  payment_order: string | null
  monetary_order: string | null
  validity: string | null

  date: string
  value: string
  gmf: string | null

  type_document: string | null
  authorized_document_type_id: number | null

  third_party_name: string | null
  third_party_document: string | null
  nit_third_party_id: number | null

  beneficiary_bank_name: string | null
  beneficiary_bank_account_number: string | null
  beneficiary_bank_account_type: string | null
  beneficiary_bank_account: number | null
  beneficiary_bank_id: number | null

  record_expense_id: number | null
  bank_transfer_id: number | null

  ids: number[] | null
}
