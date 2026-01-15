import { IQuotasIssuingPermitsResource } from '../resources'
// import { IThirdPartyBankAccounts } from '../resources/ThirdParty'

export interface IPaymentInstructionsFilters {
  'filter[business_from]': string
  'filter[business_to]': string
  'filter[request_from]': string
  'filter[request_to]': string
  'filter[instruction_date_from]': string
  'filter[instruction_date_to]': string
  'filter[status_id]': string
}

export interface IPaymentInstructionsItem {
  id?: number | null
  payment_request_id: number | null
  payment_type: string | null
  payment_type_label: string | null
  payment_source: string | null
  payment_source_label: string | null
  payment_method_id: number | null
  fund_or_bank_id: number | null
  plan_or_account_id: number | null
  instruction_date: string | null
  base_value: string | null
  tax_discount: string | null
  net_value: string | null
  observation: string | null
  authorized_doc_type_id: number | null
  authorized_doc_number: string | null
  authorized_full_name: string | null
  gmf_value: string | null
  gmf_tariff: string | null
  provision_value: string | null
  currency_id: string | null
  trm_day: string | null
  trm_final: string | null
  final_value_pesos: string | null
  final_value_foreign: string | null
  details: IPaymentInstructionsItemDetail[]
  status_id: number | null
  payment_request: IPaymentInstructionsHeaderForm
  created_at: string | null
  updated_at: string | null
}

export interface IPaymentInstructionsItemDetail {
  id?: number | null
  payment_instruction_id: number | null
  instruction_number: number | null
  payment_method_id: number | null
  beneficiary_id: number | null
  beneficiary_name: string | null
  beneficiary_bank_account_id: number | null
  pay_value: string | null
  created_at: string | null
  updated_at: string | null
}

export interface IPaymentInstructionsHeaderForm {
  id?: number | null
  office_id?: number | null
  office_label?: string | null
  business_id?: number | null
  business_label?: string | null
  process_source?: string | null
  radicated_code?: string | null
  reception_date?: string | null
  prefix?: string | null
  supplier_id?: number | null
  supplier_label?: string | null
  invoice_number?: string | null
  invoice_issue_date?: string | null
  invoice_due_date?: string | null
  total_value?: string | null
  iva_value?: string | null
  status_id?: number | null
  created_at?: string | null
  updated_at?: string | null
  request_number?: string | null
  advance_number?: string | null
  payment_request_id?: number | null
  payment_request_label?: string | null
  document_type_id?: number | null
  payment_structure_id?: number | null
  internal_code?: string | null
  client_code?: string | null
  order_number?: string | null
  other_reference?: string | null
  legalization_date?: string | null
  due_date?: string | null
  movement_code_id?: number | null
  movement_date?: string | null
  city_id?: number | null
  contract_id?: number | null
  milestone_id?: number | null
  validity_year?: number | null
  budget_document_type_id?: number | null
  budget_document_number_id?: number | null
  budget_validity_year?: number | null
  observation?: string | null
  deleted_at?: string | null
  business_code?: string | null
  instruction_id?: number | null
  detail?: {
    business_id?: number | null
    business_code?: number | null
    payment_request_id?: number | null
  }
}

export interface IPaymentInstructionsForm {
  id?: number | null
  payment_type: string
  payment_source: string
  payment_method_id: number | null
  payment_method_label?: string
  fund_or_bank_id: number | null
  fund_or_bank_label?: string
  plan_or_account_id: number | null
  plan_or_account_label?: string
  instruction_date: string
  base_value: string | number | null
  tax_discount: string | number | null
  net_value: string | number | null
  observation: string
  authorized_doc_type_id: number | null
  authorized_doc_type_label?: string
  authorized_doc_number: string
  authorized_full_name: string
  details: IPaymentInstructionsDetailsForm[]
  payment_request: IPaymentInstructionsHeaderForm
  payment_type_label?: string
  payment_source_label?: string
  provision_value?: string | number | null
  currency_id?: string | number | null
  trm_day?: string | number | null
  trm_final?: string | number | null
  final_value_pesos?: string | number | null
  final_value_foreign?: string | number | null
}

export interface IPaymentInstructionsDetailsForm {
  id?: number | null
  instruction_number: number
  payment_method_id: number | null
  payment_method_label?: string
  beneficiary_id: number | null
  beneficiary_doc?: string
  beneficiary_name: string
  beneficiary_bank_account_id: string | number | null
  beneficiary_bank_account_label?: string
  // account_selector: IThirdPartyBankAccounts[]
  account_selector: IQuotasIssuingPermitsResource[]
  pay_value: string | number
  new?: boolean | null
}

export interface IPaymentInstructionsForeignCurrencyForm {
  provision_value: string | number | null
  currency_id: string | number | null
  trm_day: string | number | null
  trm_final: string | number | null
  final_value_pesos: string | number | null
  final_value_foreign: string | number | null
  net_value: string | number | null
}

export interface IPaymentInstructionsPayload {
  payment_type: string
  payment_source: string
  payment_method_id: number | null
  fund_or_bank_id: number | null
  plan_or_account_id: number | null
  instruction_date: string
  observation: string | null
  authorized_doc_type_id: number | null
  authorized_doc_number: string | null
  authorized_full_name: string | null

  details: IPaymentInstructionDetailPayload[]

  currency_id: string | null
  trm_day: string | number | null
  trm_final: string | number | null
  net_value: string | number | null
}

export interface IPaymentInstructionDetailPayload {
  id: number
  instruction_number: number
  payment_method_id: number | null
  beneficiary_id: number | null
  beneficiary_name: string
  beneficiary_bank_account_id: number | null
  pay_value: string | number
}
