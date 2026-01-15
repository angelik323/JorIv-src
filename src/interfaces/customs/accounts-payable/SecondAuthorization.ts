import { ITrustBusinessItemList } from '@/interfaces/customs/trust-business/v2/TrustBusinessManagement'
import {
  ISupportDocumentNumberingItemDocumentType,
  ISupportDocumentNumberingItemLegalPerson,
  ISupportDocumentNumberingItemNaturalPerson,
} from './SupportDocumentNumbering'
import { IGenericResource } from '../resources'

export interface ISecondAuthorizationListItem {
  id: number
  office: {
    id: number
    office_code: string
    office_description: string
  }
  business_trust: ITrustBusinessItemList | null
  from_payment_request_id: number | null
  to_payment_request_id: number | null
  orpa_number: number | null
  has_instructions: string
  request_number: string
  status: {
    id: number
    name: string
    description: string
  }
  first_authorization_tax_settlement_generation_status: {
    id: number
    name: string
    description: string
  } | null
  orpa_status: {
    id: number
    name: string
    description: string
  } | null
  cancellation_rejection_reason: {
    description: string
  } | null
  value: number
  milestone_id: number
}

export interface ISecondAuthorizationActionsPayload {
  payment_request_ids: number[]
}

export interface ISecondAuthorizationShowResponse {
  id: number
  business_trust: ITrustBusinessItemList | null
  reception_date: string | null
  upload_number: string | null
  asset_number_id: number | null
  internal_code: string | null
  client_code: string | null
  supplier: ISecondAuthorizationSupplier
  payment_type: IGenericResource | null
  voucher_id: number | null
  status: {
    id: number
    name: string
    description: string
  } | null
  first_authorization_tax_settlement_generation_status: {
    id: number
    name: string
    description: string
  } | null
  orpa_status: {
    id: number
    name: string
    description: string
  } | null
  observation: string
  orpa_number: number | null
  orpa_value: string | null
  orpa_validity: number | null
  instructions: ISecondAuthorizationInstructionsItem[]
  beneficiaries: ISecondAuthorizationBeneficiariesItem[]
  authorizers: ISecondAuthorizationAuthorizer
  payments: ISecondAuthorizationPaymentOrderItem[]
  foreign_currency: ISecondAuthorizationForeignCurrency
}

export interface ISecondAuthorizationSupplier {
  id: number
  document: string
  validator_digit: string | null
  document_type_id: number
  support_document_numbering_issuer_status_id: number | null
  support_document_numbering_issuer_delegate_id: null
  legal_person: ISupportDocumentNumberingItemLegalPerson | null
  natural_person: ISupportDocumentNumberingItemNaturalPerson | null
  document_type: ISupportDocumentNumberingItemDocumentType | null
}

export interface ISecondAuthorizationInstructionsItem {
  instruction_number: number
  payment_request_id: number
  payment_source: IGenericResource
  payment_method: IGenericResource
  plan_or_account: {
    account_name: string
  }
  instruction_date: string
  base_value: string
  tax_discount: string
  net_value: string
  pay_value: string
}

export interface ISecondAuthorizationBeneficiariesItem {
  payment_method_id: IGenericResource
  beneficiary_id: number
  beneficiary_name: string
  beneficiary_bank_account: {
    account_name: string
    account_number: string
  }
  pay_value: string
  beneficiary: ISecondAuthorizationSupplier
}

export interface ISecondAuthorizationAuthorizer {
  authorized_doc_type: {
    id: number
    name: string
  }
  authorized_doc_number: string
  authorized_full_name: string
}

export interface ISecondAuthorizationPaymentOrderItem {
  id: number
  instruction_number: string
  contract_number: string
  asset_number: string
  movement_code: string
  voucher_type: string
  voucher_number: string
  budget_document_number: string
  tax_obligation_number: number
  value: string
}

export interface ISecondAuthorizationForeignCurrency {
  initial_value_pesos: string
  initial_trm: string
  final_value_pesos: string
  final_trm: string
  final_value_foreign_currency: string
}

export interface ISecondAuthorizationDataAuthorization {
  id?: number
  business_trust: ITrustBusinessItemList | null
  reception_date: string | null
  orpa_number: number | null
  orpa_validity: number | null
  orpa_value: string | null
  upload_number: string | null
  asset_number_id: number | null
  internal_code: string | null
  client_code: string | null
  supplier: ISecondAuthorizationSupplier | null
  payment_type: IGenericResource | null
  observation: string | null
  status: {
    id: number
    name: string
    description: string
  } | null
  first_authorization_tax_settlement_generation_status?: {
    id: number
    name: string
    description: string
  } | null
  orpa_status?: {
    id: number
    name: string
    description: string
  } | null
}

export interface ISecondAuthorizationBasicDataForm {
  instructions: ISecondAuthorizationInstructionsItem[]
  beneficiaries: ISecondAuthorizationBeneficiariesItem[]
  authorizer: ISecondAuthorizationAuthorizer | null
}

export interface ISecondAuthorizationPaymentOrderForm {
  foreign_currency: ISecondAuthorizationForeignCurrency | null
  payments: ISecondAuthorizationPaymentOrderItem[]
}
