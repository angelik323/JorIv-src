export interface IDetailOfIndividualExpensesRequest {
  id?: number | null
  effective_date: string | null
  method_payment_id: number | null
  cost_center_id: number | null
  cash_flow_id: number | null
  bank_id: number | null
  bank_account_id: number | null
  concept: string | null
  foreign_currency_value: number
  coin: string | null
  trm: number
  value: number
  instructions: string | null
  local_currency_value_total: number | null
  local_currency_value: number | null
  nit_third_party_id: number | null
  beneficiary_bank_id: number | null
  beneficiary_bank_account: string | null
  authorized_document_type_id: number | null
  identification_authorized: string | number | null
  name_authorized: string | null
  beneficiary_bank_account_name: string | null
  bank_branch_id: number | null
  cash_flow_name: string | null
  bank_branch_name: string | null
  bank_account_name: string | null
  nit_third_party_name: string | null
  method_payment_name: string | null
  cost_center_name: string | null
  bank_name: string | null
  authorized_document_type_name: string | null
  gmf?: number | null
}

export interface IDetailOfIndividualExpensesFilterRequest {
  business_id: number | null
  date: string | null
  movement_id: number | null
  name_business: string | null
  name_office: string | null
  office_id: number | null
  sub_voucher: string | null
  voucher: string | null
  detail?: IDetailOfIndividualExpensesRequest[] | null
}

export interface IOptionSelectedProperty {
  value: number | string
  nameOffice?: string
  name?: string
}
