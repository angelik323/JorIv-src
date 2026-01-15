import { IQuotasIssuingPermitsResource } from '@/interfaces/customs'
// import { IThirdPartyBankAccounts } from '../resources/ThirdParty'

export interface IPaymentRequestsFilters {
  'filter[business_from]': string
  'filter[business_to]': string
  'filter[status_id]': string
  'filter[request_number]': string
  'filter[request_from]': string
  'filter[request_to]': string
  'filter[date_from]': string
  'filter[date_to]': string
}

export interface IPaymentRequestItem {
  id?: number | null
  request_number: string
  supplier_id: number | null
  supplier_name: number | null
  total_value: string | number | null
  status_id: number | null
  status: string | null
  detail: {
    business_id?: number | null
    business_label?: number | null
    movement_date: string
  }
}

export interface IPaymentRequestView {
  office_id: number | null
  office_label?: string | null
  process_source: string
  radicated_code: string
  reception_date: string
  prefix: string
  supplier_id: number | null
  supplier_label: string
  invoice_number: string
  invoice_issue_date: string
  invoice_due_date: string
  total_value: string
  iva_value: string
  process_source_label?: string
  document_type?: {
    code: string
    name: string
  }
  detail?: {
    id: number | null
    payment_request_id: number | null
    document_type_id: number | null
    document_type_label: string
    document_type: {
      id: number | null
      name: string
      code: string
    }
    business_id: number | null
    business_label?: string
    payment_structure_id: number | null
    payment_structure_label: string
    internal_code: string
    client_code: string
    order_number: string
    other_reference: string
    legalization_date: string
    due_date: string
    movement_code_id: number | null
    movement_code: {
      id: number | null
      name: string
      code: string
    }
    movement_date: string
    city_id: number | null
    city_label?: string | null
    contract_id: number | null
    contract_label?: string
    milestone_id: number | null
    milestone_label: string
    validity_year: number | null
    budget_document_type_id: number | null
    budget_document_type_label: string
    budget_document_number_id: number | null
    budget_document_number_label: string
    budget_validity_year: number | null
    observation: string
    created_at: string
    updated_at: string
  }
  concepts: IPaymentRequestConceptsListForm[]
  instructions: IPaymentRequestInstructionsForm[]
  assets: IPaymentRequestAssociatedDataAssetsForm[]
  financial_obligations: IPaymentRequestAssociatedDataFinancialObligationsForm[]
  advances: IPaymentRequestAssociatedDataAdvancesForm[]
  table: IPaymentRequestAssociatedDataAdvancesForm[]
}

export interface IPaymentRequestBasicDataForm {
  office_id: number | null
  process_source: string
  radicated_code: string
  reception_date: string
  prefix: string
  supplier_id: number | null
  invoice_number: string
  invoice_issue_date: string
  invoice_due_date: string
  total_value: string
  iva_value: string
}

export interface IPaymentRequestMainInformationForm {
  document_type_id: number | null
  business_id: number | null
  business_code: string | null
  payment_structure_id: number | null
  internal_code: string
  client_code: string
  order_number: string
  other_reference: string
  legalization_date: string
  due_date: string
  movement_code_id: number | null
  movement_date: string
  city_id: number | null
  contract_id: number | null
  milestone_id: number | null
  validity_year: number | null
  budget_document_type_id: number | null
  budget_document_number_id: number | null
  budget_validity_year: number | null
  observation: string
  payment_structure_label: string
  city_label: string
}

export interface IPaymentRequestConceptsForm {
  concepts: IPaymentRequestConceptsListForm[]
}

export interface IPaymentRequestConceptsListForm {
  id?: number | null
  payment_concept_id: number | null
  concept_value: string | number | null
  budget_effect: string | number | null
  budgets: IPaymentBlockConceptsBudgetsListForm[]
  payment_concept?: {
    id: number
    name: string
    code: string
  }
}

export interface IPaymentBlockConceptsBudgetsListForm {
  id?: number | null
  resource_id: number | null
  resource_label?: string
  area_id: number | null
  area_label?: string
  budget_item_id: number | null
  budget_item_label?: string
  budget_value: string | number
}

export interface IPaymentRequestInstructionsForm {
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
  base_value: number | null
  tax_discount: number | null
  net_value: number | null
  observation: string
  authorized_doc_type_id: number | null
  authorized_doc_type_label?: string
  authorized_doc_number: string
  authorized_full_name: string
  details: IPaymentRequestInstructionsDetailsForm[]
  payment_type_label?: string
  payment_source_label?: string
}

export interface IPaymentRequestInstructionsDetailsForm {
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
}

export interface IPaymentRequestAssociatedDataForm {
  assets: IPaymentRequestAssociatedDataAssetsForm[]
  financial_obligations: IPaymentRequestAssociatedDataFinancialObligationsForm[]
  advances: IPaymentRequestAssociatedDataAdvancesForm[]
  table: IPaymentRequestAssociatedDataAdvancesForm[]
}

export interface IPaymentRequestAssociatedDataAssetsForm {
  asset_source: string
  asset_type_id: number | null
  asset_type_label?: string
  asset_number_id: number | null
  asset_number_label?: string
  plate_or_register: string
  asset_source_label?: string
}

export interface IPaymentRequestAssociatedDataFinancialObligationsForm {
  financial_obligation_id: number | null
  financial_obligation_label?: string
  installment_number: string | number | null
  capital_value: string | number | null
  interest_value: string | number | null
  total_installment_value: string | number | null
}

export interface IPaymentRequestAssociatedDataAdvancesForm {
  id?: number | null
  business_id?: number | null
  business_label?: string
  payment_request_id?: number | null
  advance_request_id: number | null
  advance_number: string | number | null
  advance_value: string | number | null
  amortization_type: string
  amortization_percentage: string | number | null
  accumulated_amortization: string | number | null
  balance_to_amortize: string | number | null
  amortize_value: string | number | null
  amortization_type_label?: string | null
  request_number?: string | null
}

export interface IPaymentRequestTaxLiquidation {
  applies: boolean
  concepts: IPaymentRequestTaxLiquidationConcept[]
  tax_discount: number
  base_value: number
  message: string
}

export interface IPaymentRequestTaxLiquidationConcept {
  type: string
  fiscal_charge: string
  fiscal_charge_id: number
  concept: string
  concept_id: number
  base: number
  percentage: number
  value: number
  new_liquidation_value: number
}

export interface IPaymentRequestValidate {
  hasHandleBudgetBusiness: boolean
  hasDerivateContracting: boolean
  movementHasContractExecution: boolean
  hasInternalConsecutive: boolean
  hasClientConsecutive: boolean
  hasOrder: boolean
  hasOtherReferences: boolean
  hasLegalizationDate: boolean
  hasExpirationDate: boolean
}
