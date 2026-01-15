import { Ref } from 'vue'

// list
export interface ITrustBusinessItemList {
  id: number | null
  business_code: string | null
  name: string | null
  start_date: string | null
  business_type_id: number | null
  business_subtype_id: number | null
  status_id: number | null
  type: ITrustBusinessDefaultData | null
  sub_type: ITrustBusinessDefaultData | null
  status: ITrustBusinessDefaultData | null
}

export interface IDownloadData {
  label?: string
  id: number
  value?: boolean
}

export interface ITrustBusinessDefaultData {
  id: number | null
  name?: string | null
  status?: string | null
  purpose?: string
  code?: string
}

// information form
export type BusinessType = 'Sociedad' | 'Fideicomiso'
export type RegisterKey =
  | 'accounting'
  | 'treasury'
  | 'cxp'
  | 'regulation'
  | 'billing'
  | 'derived_contracting'
  | 'budget'
  | 'fiduciary_fee'

export type ModelsMapType = {
  accounting: Ref<IBusinessAccounting | null>
  treasury: Ref<IBusinessTreasury | null>
  cxp: Ref<IBusinessCxPTrustBusiness | null>
  regulation: Ref<IRegulationTrustBusiness[] | null>
  billing: Ref<IBillingCollect[] | null>
  derived_contracting: Ref<IBusinessDerivedContracting | null>
  budget: Ref<IBusinessBudget | null>
  fiduciary_fee: Ref<null>
}

export interface ITrustBusinessBusinessType {
  register_type: BusinessType | null
}

export interface ITrustBusinessGeneralInformation {
  business_code: string | null
  name: string | null
  business_type_id: number | string | null
  business_subtype_id: number | string | null
  business_mod: string | null
  classification: string | null
  office_id: number | string | null
  object: string | null
}

export interface ITrustBusinessGeneralDates {
  filing_date_sfc: string | null
  start_date: string | null
  end_date: string | null
  start_date_commission: string | null
  has_extend: boolean | null
  extend_date: string | null
}

export interface ITrustBusinessAdditionalInformation {
  accountability_period: string | null
  business_manager_id: number | string | null
  business_accountant_id: number | string | null
  consortium: boolean | null
  manage_budget: boolean | null
  derivate_contracting: boolean | null
  has_accounts_payable: boolean | null
  has_billing: boolean | null
  has_assets: boolean | null
  has_policy: boolean | null
  has_guarantee: boolean | null
  has_real_estate_project: boolean | null
  has_secured_creditor: boolean | null
  has_normative: boolean | null
  has_budget: boolean | null
}

export interface ITrustBusinessRegisters {
  business_resources?: ITrustBusinessRegisterThird[] | null
  business_accounting?: IBusinessAccounting | null
  business_treasurie?: IBusinessTreasury | null
  business_account_payable?: IBusinessCxPTrustBusiness | null
  business_normative?: IRegulationTrustBusiness[] | null
  business_billing?: IBillingCollect[] | null
  business_derivate_contrating?: IBusinessDerivedContracting | null
  business_budget?: IBusinessBudget | null
}

export interface IBusinessAccounting {
  address: string | null
  auxiliary_nit: string | null | number
  identification_tax: string | null
  has_cost_center: boolean | null
  cost_center_structure_id: number | null
  functional_currency_id?: string | number | null
  has_consolidator: boolean | null
  can_foreign_currency: boolean | null
  has_fiscal_responsibility: string | null
  has_responsibility_iva: boolean | null
  can_retains_ica: boolean | null
  retains_differential_ica: boolean | null
  last_restatement_foreign_currency?: string | null
  status_id: number | null
  retaining_agent_id: number | null
  department_id?: number | null
  city?: ITrustBusinessDefaultData
  city_id?: number | null
  country_id: number | string | null
  department?: ITrustBusinessDefaultData
  departament?: ITrustBusinessDefaultData
  country?: ITrustBusinessDefaultData
  retaining_agent?: IRetainingAgent | null
  nit_auxiliary?: IRetainingAgent | null
  tax_identification?: IRetainingAgent | null
  has_tax_structure?: boolean | null
  has_equivalent_structure?: boolean | null
  status?: ITrustBusinessDefaultData
  accounting_structure?: ITrustBusinessDefaultData
  principal_account: IStructuresAccounting | null
  equivalent_account: IStructuresAccounting | null
  fiscal_account: IStructuresAccounting | null
}

export type StructureType = 'Principal' | 'Equivalente' | 'Fiscal'

interface IStructuresAccounting {
  id?: number
  account_structure_id?: number
  type: StructureType
  startup_period: string | null
  current_period: string | null
  last_closing: string | null
  last_closing_daily: string | null
  last_closing_day: string | null
  daily_closing: boolean | null
  account_structure?: IAccountStructure
}

interface IAccountStructure {
  id: number
  purpose: string
  code: string
  type: string
}

export interface IBusinessTreasury {
  closing: string | null
  last_close_date: string | null
  has_cash_flow: boolean | null
  can_bank_reconciliation: boolean | null
  cash_flow_structure_id: number | null
  last_conciliation_date: string | null
  has_collection_structure: boolean | null
  has_box_structure: boolean | null
  collection_structure_id: number | null | string
  box_structure_id: number | null | string
}

export interface IBusinessCxPTrustBusiness {
  closing: string | null
  last_closing_date: string | null
  validity: string | null
  account_structure_id: number | string | null
  account_structure_purpose: number | string | null
}

export interface IRegulationTrustBusiness {
  id?: number
  document_name: string | null
  description: string | null
}

export interface IBillingCollect {
  invoice_id: string
  invoice_number: string
  created_at: string
  expire_at: string
  third_party_billing_document_snapshot: string
  third_party_billing_name_snapshot: string
  observations: string
  invoice_description: string
  base_amount: string
  iva_amount: string
  total_amount: string
  status_id: number
  method_payment: string
  payday: number
  business_name_snapshot: string
  business_code_snapshot: string
  invoice_type: string
  pdf_signed_url: string
  status: ITrustBusinessDefaultData
}

export interface IBusinessDerivedContracting {
  id: number | null
  has_budget: boolean | null
  has_project: boolean | null
  has_structure_work: boolean | null
  derivate_works_plan: IDerivateWorksPlan[]
  works_plan?: IDerivateWorksPlan[]
}
export interface IDerivateWorksPlan {
  work_plan_id: number
  id: number
}

export interface IBusinessBudget {
  validity: string | null
  current_month: number | null
  last_closing_date: string | null
  closing_type: number | null
  mhcp_section_code: string | number | null
  budget_structure_id: string | number | null
  generic_area_id?: number | null
  expense_authorizer_id: number | null
  current_month_id?: number | null
  mhcp_section_description?: string | null
  generic_area?: string | null
  generic_area_code?: string | null
  expense_authorizer?: null | IBudgetExpense
  budget_structure?: null | IBudgetStructureItem
}

interface IBudgetStructureItem {
  id: number | null
  code: number | null
  code_name: string | null
  label: string | number | null
  budgetItem?: {
    code?: string
    description?: string
  }
  budgetResourceType?: {
    code?: string
    description?: string
  }
  responsabilityArea?: {
    code?: string
    description?: string
  }
}

interface IBudgetExpense {
  document?: number
  name?: string
}

export interface ITrustBusinessInformationForm
  extends ITrustBusinessBusinessType,
    ITrustBusinessGeneralInformation,
    ITrustBusinessGeneralDates,
    ITrustBusinessAdditionalInformation,
    ITrustBusinessRegisters {
  id?: number
  status_id?: number | null
  status_fiduciary_fees_id?: number | null
}

export interface ITrustBusinessRegisterThird {
  third_party_id: number | null
  percentage_participation: string | null
  type_resource?: number | null
  third_party?: IThirdParties | null
}

interface IThirdParties {
  id?: number
  document_type_id?: number
  document_type?: DocumentType
  document?: string
  name?: string
  type?: string
  value?: number
  label?: string
}

export interface IResponseDocument {
  id: number
  percentage_participation: string | number
  type_resource: string
}

export interface IThirdPartyResponse {
  document_number: string
  document_type: number
  name: string
  type: string
  abbreviation: string
}

export interface IMassiveUploadItem {
  id: number | null
  third_party_id: number
  percentage_participation: number | string
  type_resource: string
  third_party?: IThirdPartyResponse
}

interface IRetainingAgent {
  id: number
  document_number: string
  document_type: number
  name: string
  type: string
  abbreviation: string
}

// documernts form

export interface IDocumentsTrustBusiness {
  id?: number
  document_type: string | null
  business_document_type: string | null
  business_document_section: string | null
  field_name: string | null
  name: string | null
  upload_date: string | null
  s3_file_path?: string | null
  original_name?: string | null
  file?: File
  is_new: boolean
  to_delete: boolean
}

// finance form

export interface ITrustBusinessGeneralOrders {
  id: number
  number: string
  name: string
  business_trust: IGenericData
  record_status: IGenericData
  record_status_id: number
  currency: IGenericData
  fund: IFund[]
  project: IGenericData
  stage: IGenericData
  created_at: Date
  updated_at: Date
}

interface IGenericData {
  id: number
  name?: string
  status?: string | null
  code?: string
  description?: string
  type_of_currency?: string
  value?: string
  participation_types_balance?: string
  type?: string
  stage_number?: string
}

interface IFund {
  id: number
  fund_code: string
  fund_name: string
  business_trust: IFundBusinessTrust
  has_participation_types: boolean
  last_closing_date: null
  consolidation_option: IGenericData
}

interface IFundBusinessTrust {
  id: number
  business_code: string
  name: string
  start_date: Date
  end_date: Date
  has_extend: boolean
  has_budget: boolean
  status_id: number
  business_type_id: number
  business_subtype_id: number
  business_mod: string
  derivate_contracting: boolean
  status_name: string
  status: IGenericData
  budget: null
}

export interface IBankAccount {
  id: number
  bank: IGenericData
  account_number: string
  account_type: string
  account_name: string
  status: IGenericData
}

export interface ITrustBusinessFinanceForm {
  business_trust_general_orders: ITrustBusinessGeneralOrders[]
  bank_accounts?: IBankAccount[]
}

// notification form

export type NotificationType = 'Notificación' | 'Autorización'

export interface INotificationAuthorizeTrustBusiness {
  third_party_id: number
  type: NotificationType
  name?: string | null
  email?: string | null
  phone?: string | null
  extension?: string | null
  address?: string | null
  status_id?: number | null
  third_party?: {
    id: number
    status_id: number
    document_type_id: number
    document_type: {
      id: number
      name: string
      abbreviation: string
    }
    email: string
    phone: string
    address: string
    document: string
    name: string
    type: string
    is_cedent: boolean
  }
}

export interface ITrustbusinessNotificationForm {
  business_notifications?: INotificationAuthorizeTrustBusiness[] | null
}

// create
export interface ITrustBusinessCreate
  extends ITrustBusinessInformationForm,
    ITrustbusinessNotificationForm {}
