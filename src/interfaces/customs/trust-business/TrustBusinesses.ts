/*eslint-disable*/

import { IFileField, IResource } from '@/interfaces/global'
export interface ITrustBusinessResponse {
  id: number
  register_type: string
  business_code: string
  name: string
  business_mod: string
  classification: string
  filing_date_sfc: string
  start_date: string
  end_date: string
  start_date_commission: string
  has_extend: boolean
  extend_date: string | null
  accountability_period: string
  consortium: boolean
  manage_budget: boolean
  derivate_contracting: boolean
  has_policy: boolean
  has_guarantee: boolean
  has_real_estate_project: boolean
  observations: string | null
  status: {
    id: number
    name: string
  }
  created_at: string
  updated_at: string
  business_manager: {
    id: number
    full_name: string
  }
  business_type: {
    id: number
    name: string
    code: string | number
  }
  business_subtype: {
    id: number
    name: string
    code: string | number
  }
  resources: Array<{
    id: number
    type_resource: string
    percentage_participation: string
  }>
  accounting: {
    id: number
    address: string
    auxiliary_nit: string
    identification_tax: string
    has_cost_center: boolean
    functional_business_currency: string
    has_consolidator: boolean
    can_foreign_currency: boolean
    has_fiscal_responsibility: string
    has_responsibility_iva: boolean
    can_retains_ica: boolean
    retains_differential_ica: boolean
    startup_period: string
    current_period: string
    last_closing: string
    last_closing_daily: string
    last_closing_day: string
    daily_closing: boolean
    last_restatement_foreign_currency: string
    accounting_structure: {
      id: number
      name: string
    }
    cost_center_structure: {
      id: number
      name: string
    }
    status: {
      id: number
      name: string
    }
    retaining_agent: {
      id: number
      // @TODO: Corregir el tipado

      [key: string]: any
    }
    departament: {
      id: number
      name: string
    }
    city: {
      id: number
      name: string
    }
    contry: {
      // debería ser "country" en el response
      id: number
      name: string
    }
    nit_auxiliary?: {
      id: number | string
      abbreviation: string
      document_number: string
      document_type: number
      name: string
    }
    tax_identification?: {
      id: number | string
      abbreviation: string
      document_number: string
      document_type: number
      name: string
    }
    business_account_structures: IBusinessAccountingStructures[]
    has_tax_structure?: boolean | null
    has_equivalent_structure?: boolean | null
  }
  treasurie: null | {
    // @TODO: Corregir el tipado
    [key: string]: any
  }
  accounts_payable: IBusinessCxPTrustBusinessResponse | null
  normative: IRegulationTrustBusiness[] | null
  billing_collect: IBillingCollect[] | null
  files: IUploadedDocumentFile[]
  business_derivate_contrating: null | IBusinessDerivedContracting
  derivate_contrating: null | IBusinessDerivedContracting
  budget: null | IBusinessBudget
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
  status: IStatus
}

interface IStatus {
  id: number
  name: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface IBusinessCxPTrustBusinessResponse {
  id: number
  closing: string | null
  last_closing_date: string | null
  validity: string | null
  account_structure?: {
    id: number
    purpose: string
  }
}

export interface ITrustBusinessInformationForm {
  register_type: BusinessType | null
  business_code: string | null
  name: string | null
  business_mod: string | null
  classification: string | null
  filing_date_sfc: string | null
  start_date: string | null
  end_date: string | null
  start_date_commission: string | null
  has_extend: boolean | null
  extend_date: string | null
  accountability_period: string | null
  consortium: boolean | null
  manage_budget: boolean | null
  derivate_contracting: boolean | null
  has_policy: boolean | null
  has_guarantee: boolean | null
  has_real_estate_project: boolean | null
  observations: string | null
  status_id: number | null
  business_manager: number | string | null
  business_subtype: number | string | null
  business_type: number | string | null
}

export interface IUploadedDocumentFile {
  id: number
  original_name: string
  document_type: string
  file_path: string
  s3_file_path: string
  uploaded_by_id: number
  uploaded_by: {
    id: number
    name: string
    last_name: string
    document: string
  }
  size?: number
}

export interface ITrustBusinessDocumentsForm {
  documentFiles: IFileField[]
  uploadedDocumentFiles: IUploadedDocumentFile[]
  documentIdsToDelete: string[]
}

export interface ITrustBusinessType {
  id: number | null
  name: string | null
}

export interface ITrustBusinessStatus {
  id: number | null
  status: string | null
}
export interface ITrustBusinessItemList {
  id: number | null
  business_code: string | null
  name: string | null
  start_date: string | null
  business_type_id: number | null
  business_subtype_id: number | null
  status_id: number | null
  type: ITrustBusinessType | null
  sub_type: ITrustBusinessType | null
  status: ITrustBusinessStatus | null
}

export interface ITrustBusinessRequest {
  third_party_id: number | null
  percentage_participation: string | null
  type_resource?: number | null
  third_party?: ThirdParties | null
}

export interface ThirdParties {
  id?: number
  document_type_id?: number
  document_type?: DocumentType
  document?: string
  name?: string
  type?: string
  value?: number
  label?: string
}

export interface DocumentType {
  id?: number
  name?: string
  abbreviation?: string
}

export interface IBusinessAccounting {
  address: string | null
  auxiliary_nit: string | null | number
  identification_tax: string | null
  accounting_structure_id: number | null
  has_cost_center: boolean | null
  cost_center_structure_id: number | null
  functional_business_currency: string | null
  has_consolidator: boolean | null
  can_foreign_currency: boolean | null
  has_fiscal_responsibility: string | null
  has_responsibility_iva: boolean | null
  can_retains_ica: boolean | null
  retains_differential_ica: boolean | null
  startup_period: string | null
  current_period: string | null
  last_closing: string | null
  last_closing_daily: string | null
  last_closing_day: string | null
  daily_closing: boolean | null
  last_restatement_foreign_currency?: string | null
  status_id: number | null
  status_name?: string | null
  status?: {
    id: number
    name: string
  } | null
  retaining_agent_id: number | null
  department_id?: number | null
  city?: string | null
  city_id?: number | null
  country_id: number | null
  department?: string | null
  country?: string | null
  cost_center_structure?: string | null
  retaining_agent?: IRetainingAgent | null
  retaining_agent_view?: string | null
  nit_auxiliary?: IRetainingAgent | null
  nit_auxiliary_view?: string | null
  tax_identification?: IRetainingAgent | null
  tax_identification_view?: string | null
  has_tax_structure?: boolean | null
  has_equivalent_structure?: boolean | null
  business_account_structures: IBusinessAccountingStructures[]
}

export interface IBusinessAccountingV2
  extends Omit<IBusinessAccounting, 'city' | 'cost_center_structure'> {
  contry?: {
    id: number
    name: string
  }
  departament?: {
    id: number
    name: string
  }
  city?: {
    id: number
    name: string
  }
  city_name?: string | null
  status?: {
    id: number
    name: string
  }
  accounting_structure?: {
    id: number
    purpose: string
  }
  cost_center_structure: {
    id: number
    purpose: string
  }
}

export interface IBusinessAccountingStructures {
  id?: number
  accounting_structure: string | null
  type: string | null
  startup_period: string | null
  current_period: string | null
  last_closing: string | null
  daily_closing: boolean
  last_closing_day: string | null
  last_closing_daily: string | null
  account_structure_id?: number
  account_structure?: IAccountStructureResponse
}

interface IAccountStructureResponse {
  id: number
  code: string
  purpose: string
  type: string
}

export interface IBusinessTreasury {
  closing: string | null
  last_close_date: string | null
  has_cash_flow: boolean | null
  can_bank_reconciliation: boolean | null
  cash_flow_structure_id: number | null
  last_conciliation_date: string | null
  cash_flow_structure?: {
    id: number
    purpose: string
  }
  cash_flow_structure_name?: string | null
  has_collection_structure: boolean | null
  has_box_structure: boolean | null
  collection_structure_id: number | null
  box_structure_id: number | null
  box_structure?: {
    id: number
    code: string
    purpose: string
  }
  collection_structure?: {
    id: number
    code: string
    purpose: string
  }
}
export interface IBusinessDerivedContracting {
  has_budget: boolean | null
  has_project: boolean | null
  has_structure_work: boolean | null
  derivate_works_plan: IDerivateWorksPlan[]
  works_plan?: IDerivateWorksPlan[]
}

export interface IDerivateWorksPlan {
  id?: number
  work_plan_id: number | null
}
export interface IRegisterDerivedContracting {
  closing: string | null
}

export interface IBusinessBudget {
  id: number | null
  validity: string | null
  current_month: null | {
    label: string
    value: number
  }
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
  budget_structure?: {
    id: number | null
    code: number | null
    code_name: string | null
    label: string | number | null
  }
  budget_structure_code: string | number | null
}

interface IBudgetExpense {
  document_type: {
    abbreviation?: string
  }

  document?: number
  name?: string
}

export interface ITrustBusinessToCreate {
  register_type: BusinessType | null
  business_code: string | null
  name: string | null
  business_mod: string | null
  classification: string | null
  filing_date_sfc: string | null
  start_date: string | null
  end_date: string | null
  start_date_commission: string | null
  has_extend: boolean | null
  extend_date: string | null
  accountability_period: string | null
  consortium: boolean | null
  manage_budget: boolean | null
  derivate_contracting: boolean | null
  has_policy: boolean | null
  has_guarantee: boolean | null
  has_real_estate_project: boolean | null
  observations: string | null
  status_id: number | null
  budget: boolean | null
  business_manager_id: number | null
  business_subtype_id: number | null
  business_type_id: number | null
  business_resources?: ITrustBusinessRequest[] | null
  business_accounting?: IBusinessAccounting | null
  business_treasurie?: IBusinessTreasury | null
  business_account_payable?: IBusinessCxPTrustBusiness | null
  business_normative?: IRegulationTrustBusiness[] | null
  business_derivate_contrating?: IBusinessDerivedContracting | null
  business_budget?: IBusinessBudget | null
}

export interface ITrustBusinessToEdit {
  register_type: BusinessType | null
  business_code: string | null
  name: string | null
  business_mod: string | null
  classification: string | null
  filing_date_sfc: string | null
  start_date: string | null
  end_date: string | null
  start_date_commission: string | null
  has_extend: boolean | null
  extend_date: string | null
  accountability_period: string | null
  consortium: boolean | null
  manage_budget: boolean | null
  derivate_contracting: boolean | null
  has_policy: boolean | null
  has_guarantee: boolean | null
  has_real_estate_project: boolean | null
  observations: string | null
  status_id: number | null
  budget: boolean | null
  business_manager_id: number | null
  business_subtype_id: number | null
  business_type_id: number | null
  business_resources?: ITrustBusinessRequest[] | null
  business_accounting?: IBusinessAccounting | null
  business_treasurie?: IBusinessTreasury | null
  business_derivate_contrating?: IBusinessDerivedContracting | null
  business_account_payable?: IBusinessCxPTrustBusiness | null
  business_normative?: IRegulationTrustBusiness[] | null
  business_derived_contracting?: IBusinessDerivedContracting | null
  register_derived_contracting?: IRegisterDerivedContracting | null
  business_budget?: IBusinessBudget | null
}

export interface IDownloadData {
  label?: string
  id: number
  value?: boolean
}

export type BusinessType = 'Sociedad' | 'Fideicomiso'

export interface IResponseDocument {
  id: number
  percentage_participation: string | number
  type_resource: string
}

export interface IBusinessSubTypeResource extends IResource {
  business_type_id: number | null
}

interface IRetainingAgent {
  id: number
  document_number: string
  document_type: number
  name: string
  type: string
  abbreviation: string
}

export interface IDocumentRow {
  id: string | number
  name: string
  type?: string
  filePath?: string
  isNew: boolean
  raw: IUploadedDocumentFile | IFileField
  status_id?: number
}

export interface IBusinessCxPTrustBusiness {
  closing: string | null
  last_closing_date: string | null
  validity: string | null
  account_structure_id: number | string | null
  account_structure_purpose?: number | string | null
}
export interface IRegulationTrustBusiness {
  id?: number
  document_name: string | null
  description: string | null
}
