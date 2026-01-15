import { IFiduciaryInvestmentPlansAccountList } from './FiduciaryInvestmentPlans'

export interface IInvestmentPlanOperationPayload {
  type: 'retiro' | 'aporte'
  subtype: 'transaccional'
  value: number
  operation_office_id: number
  fiduciary_investment_plan_id: number
  collective_investment_fund_id: number
  state_id: number
}

export interface IInvestmentPlanOperationDetailPayload {
  operation_investment_plan_id: number
  treasury_collection_form_id: number
  total_operation: number
  value: number
  check: number
  check_bank_id: number
  observation: string
  treasury_collection_bank_id: number
  fic_account_bank_id: number
  account_bank_id: number
  state_id: number
}

export interface IContributionOperationDetailModel {
  id?: number
  collection_type_id?: null | number
  collection_type_code?: string
  collection_type_description?: string
  is_check?: boolean
  value?: null | number
  check?: null | number
  check_bank_id?: null | number
  check_bank_description?: string
  treasury_collection_bank_id: null | number
  treasury_collection_bank_description?: null | string
  fic_account_bank_id?: null | number
  fic_account_bank_description: null | string
  account_bank_id?: null | number
  account_bank_description?: null | string
  observations?: string
  disabled?: boolean
  selected?: boolean
}
export interface IContributionOperationModel {
  treasury_collection_bank_id: number | null
  treasury_collection_bank_description: string | null
  account_bank_id: number | null
  account_bank_description: string | null
  observations: string | null
}

export interface IWithdrawalOperationDetailModel {
  id: number
  means_of_payment_id: number | null
  means_of_payment_description: string | null
  value: null | number
  has_registered_accounts: boolean
  adjustment: boolean

  //NOTE: Origin info
  treasury_collection_bank_id: null | number
  treasury_collection_bank_description: null | string
  fic_account_bank_id: null | number
  fic_account_bank_description: null | string
  fic_account_bank_balance?: number | null
  fic_account_bank_type?: string | null
  check?: null | number
  check_bank_id: number | null
  observations: string

  is_registered: boolean

  bank_or_fund_id: null | number
  destination_account_number: null | number
  destination_plan_id: null | number

  disabled: boolean
  selected: boolean
}

export interface IInvestmentPlanOperationDetail {
  account_bank_id: number
  check: number
  check_bank: string
  collection_bank: string
  collection_bank_id: number
  collection_form: string
  fic_account: string
  fic_account_bank_id: number
  id: number
  observation: string
  treasury_collection_form_id: number
  value: number
  selected?: boolean
}

export type IWithdrawalOperationDetailAccount =
  IFiduciaryInvestmentPlansAccountList & {
    register?: boolean
    selected?: boolean
  }

export type IWithdrawalOperationDetailAccountCreate = {
  bank_or_fund_id: number | null
  account_type: string | null

  account_number: number | null
  plan_id: number | null

  document_type: string | null
  holder_document: string | null
  holder_name: string | null
  register?: boolean
  selected?: boolean
  id?: number
}

export interface IInvestmentPlanOperationItem {
  id: number
  fiduciary_investment_plan_id: number
  collective_investment_fund_id: number
  operation_number: number
  operation_request: number
  created_at: string
  operation_date: string
  value: string
  type: string
  office_id: number
  state_id: number
  due_date: string
  balance: null
  investment_plan: {
    id: number
    code: string
    collective_investment_fund_id: number
    operation_office_id: number
    user_created_id: number
    status_id: number
    created_at: string
    updated_at: string
    blocking_reason: null
    status_observation: null
    plan_balance: null
  }
  collective_investment_fund: {
    id: number
    fund_code: string
    fund_name: string
    business_trust_id: number
    consolidation_option_id: number
    fic_rating: string
    has_participation_types: false
    is_fund_validated: true
    status_id: number
    fund_type_id: number
    last_closing_date: null
  }
  status: {
    id: number
    status: string
  }
}

export interface IStoredInvestmentPlanOperationResponse {
  fiduciary_investment_plan_id: number
  collective_investment_fund_id: number
  operation_number: number
  operation_request: number
  value: string
  type: string
  office_id: number
  state_id: number
  due_date: string
  updated_at: string
  created_at: string
  id: number
}

export interface IOperationValuesResponse {
  cancellationControll: number
  available_value_without_taxes_cancellation: number
  available_value_without_taxes_withdrawal: number
  maximumInvestmentBalance: number
}

export interface IInvestmentPlanOperationResponse {
  business_trust_code: string
  business_trust_name: string
  closing_date: null | string
  compliance_date: string
  fund_code: string
  fund_name: string
  holder_identification: string
  holder_name: string
  id: number
  investment_plan: string
  maximum_value: number
  office: string
  office_code: string
  office_id: number
  fund_id?: string | number | null
  operation_number: number
  operation_request: number
  operation_value: number
  plan_balance: string
  plan_business_trust_code: string
  request_date: string
  type: InvestmentPlanOperationTtype
  subtype: InvestmentPlanOperationSubType
  details: IInvestmentPlanOperationDetail[]
  operation_date: string
}

export type InvestmentPlanOperationTtype =
  | null
  | 'aporte'
  | 'retiro'
  | 'cancelacion'

export type InvestmentPlanOperationSubtype = null | 'cancelacion'

export type InvestmentPlanOperationSubType =
  | null
  | 'transaccional'
  | 'parcial'
  | 'cancelacion'

export interface IInvestmentPlanOperationDetailCreatePayload {
  value: number

  // NOTE: Origin info
  treasury_collection_bank_id: number
  treasury_collection_form_id: number
  fic_account_bank_id?: number

  // NOTE: Destination/Target info when we're talking about transfers
  account_bank_id?: number

  // NOTE: Destination/Target info when we're talking about fund transfers
  fiduciary_investment_plan_id?: number
  collective_investment_fund_id?: number

  check?: number
  check_bank_id?: number

  observation: string
}

export interface IInvestmentPlanOperationCreatePayload {
  type: 'aporte' | 'retiro'
  subtype: 'transaccional' | 'parcial' | 'cancelacion' | 'bienes'
  fiduciary_investment_plan_id: number
  collective_investment_fund_id: number
  value: number
  operation_office_id: number
  details: IInvestmentPlanOperationDetailCreatePayload[]
}

export interface IMonetaryOperation {
  id: number
  operation_number: number
  operation_request: number
  operation_value: number
  type: string
  request_date: string
  compliance_date: string
  closing_date: string | null
  investment_plan: string
  plan_balance: string
  maximum_value: number
  business_trust_code: string
  business_trust_name: string
  plan_business_trust_code: string
  fund_code: string
  fund_name: string
  office: string
  office_code: string
  holder_identification: string
  holder_name: string
}

export interface IMonetaryOperationDetail {
  id: number
  check: string | null
  check_bank: string | null
  collection_bank: string
  collection_bank_code?: string
  fic_account_number?: string
  collection_form: string
  fic_account: string
  observation: string
  value: number
  selected?: boolean
}

export type OperationDetail =
  | IContributionOperationDetailModel
  | IWithdrawalOperationDetailModel

export interface IInvestmentPlanOperationsBasicDataForm {
  type: null | 'retiro' | 'aporte'
  subtype: 'transaccional' | 'bienes' | 'parcial' | 'cancelacion'
  collective_investment_fund_id: null | number
  fiduciary_investment_plan_id: null | number
  operation_office_id: null | number
  value: number | null
  state_id: number | null
}

export interface IPlanAccountResource {
  id?: number | string
  label?: string
  value?: number | string
  destination_bank_id?: number
  people_name?: string
  identification_type?: string
  identification_number?: string | number
  account_type?: string
  account_number?: string
  [key: string]: unknown
}
