import { IShareholder as IShareholderV1 } from '@/interfaces/customs/Clients'
import { PersonType } from '@/interfaces/global/Clients'

export interface IGeneratePresignedUrlClient {
  document_type: string | null
  third_party_category: string | null
  name: string | null
}

export interface IClientDocumentType {
  id: number
  name: string
  abbreviation: string
  model: string
  status_id: number
}

export interface IClientAddress {
  address: string | null
  country_id: number | null
  department_id?: number | null
  city_id?: number | null
  postal_code?: string | null
}

// Client item list main view
export interface IClientItem {
  id: number
  name_or_razon_social: string
  third_party_category: string
  type_person: string
  type_client: string
  document: string
  document_type_id: number
  document_type: IClientDocumentType
  status: {
    id: number
    status: string
  }
}

export type IClientList = IClientItem[]

// Legal person
export interface ILegalPerson {
  business_name: string | null
  nature: string | null
  constitution_date: string | null
  country_id: number | null
  country?: string | null
  trade_name?: string | null
  classification_company?: string | null
  sending_correspondence?: string | null
}

// Natural person
export interface INaturalPerson {
  name: string | null
  middle_name?: string | null
  last_name: string | null
  second_last_name?: string | null
  birth_country_id?: number | null
  birth_date?: string | null
  issue_date?: string | null
  document_issuance_country_id?: number | null
}

// Pep info
export interface IPepInfo {
  is_pep: boolean
  is_politician: boolean
  is_pep_international: boolean
  is_international_pep?: boolean
  has_pep_relatives: boolean
  position?: string | null
  entity?: string | null
  date_entry?: string | null
  date_exit?: string | null
  pep_type_id?: number | null
  relatives?: IPepInfoRelative | null
}

// Pep info relatives
export interface IPepInfoRelative {
  id?: number | null
  full_name: string | null
  relationship: string | null
  position: string | null
  entity?: string | null
}

// Common third party info
export interface ICommonThirdParty {
  document_type_id: number | null
  document: string | null
  issue_date?: string | null
  third_party_category: string | null
  natural_person: INaturalPerson | null
  pep_info: IPepInfo | null
  pep_info_relative?: IPepInfoRelative | null
}

export interface IRepresentative extends ICommonThirdParty {
  position?: string | null
}

// Tax info
export interface ITaxInfo {
  has_different_nationality: boolean
  country_id: number | null
  nationality_id: number | null
  foreign_responsibility: boolean
  branch_address: string | null
  branch_country_id?: number | null
  tin: string | null
}

export interface IBaseTaxInfo extends Omit<ITaxInfo, 'tin'> {
  taxpayer_type: number | null
  files_tax_return: boolean
  files_foreign_taxes: boolean
  giin_code?: string | null
  is_branches?: boolean
  description_economic_activity?: string | null
  branch_country_id?: number | null
}

// --- Legal person base request (v2) ---
export interface IClientLegalPersonBaseRequest {
  document_type_id: number | null
  document: string | null
  request_type: string | null
  status_id: number | null

  legal_person: ILegalPerson

  email: string | null
  phone: string | null

  address: string | null
  address_type: string | null
  country_id: number | null
  city_id: number | null
  postal_code: string | null

  ciiu_id: string | number | null
  activity_description: string | null

  tax_info: IBaseTaxInfo
  financial_info: IBaseCorporateForm

  legal_representatives: IRepresentative[]
  board_members: IRepresentative[]
  shareholders: IBaseShareholdersRequest[]
}

export interface IClientLegalPersonBaseResponse
  extends IClientLegalPersonBaseRequest {}

// --- Natural person basic form tab (v2) ---
export interface IBasicForm {
  created_at?: string
  creation_date: string | null
  created_by?: string
  updated_date?: string
  updated_by?: string
  updated_at?: string
  application_type?: string | null
  document_type_id: string | null | number
  document_type: string | null
  document?: string | null
  request_type?: string | null
}

export interface ITypeWithIdName {
  id: number | null
  name: string | null
}

export interface INaturalPersonToLegalPerson extends INaturalPerson {
  occupation_id: number | null
  occupation: string | null
}

// --- Legal Representation Tab (v2) ---
export interface IBaseLegalRepresentationResponse {
  id: number | null
  third_party_id: number | null
  document: string | null
  third_party_category: string | null
  natural_person: INaturalPersonToLegalPerson
  address: string | null
  country_id: number | null
  department_id: number | null
  city_id: number | null
  postal_code: string | null
  tax_info: ITaxInfo | null
  pep_info: IPepInfo
}

// Form
export interface IBaseLegalRepresentationItem {
  id?: number | null
  representative_type_id?: number | null
  third_party_id?: number | null
  third_party_category: string | null
  document_type_id: number | null
  document: string | null
  natural_person: INaturalPerson
  address: string | null
  country_id: number | null
  department_id: number | null
  city_id: number | null
  postal_code: string | null
  tax_info: ITaxInfo
  pep_info: IPepInfo
  has_beneficiary_treatment?: boolean
  beneficiary_date?: string | null
  status_id?: number | null
  is_new?: boolean | null
}

// --- Corporate Tab (v2) ---
export interface IBaseCorporateForm {
  total_monthly_operational_income: string | null
  total_monthly_non_operational_income: string | null
  other_non_operational_income_concept: string | null
  total_monthly_expenses: string | null
  total_assets: string | null
  total_liabilities: string | null
  financial_information_cutoff_date: string | null
  source_of_funds: string | null
  another_source_of_funds: string | null
  is_registered_issuer_subject_to_disclosure: boolean
}

// --- Shareholders Tab (v2) ---
export interface IBaseShareholdersForm {
  has_shareholders: boolean
  shareholders: IShareholderV1[]
}

export type IBaseShareholdersRequest = {
  document_type_id?: number
  document?: string
  third_party_category?: PersonType.NATURAL | PersonType.LEGAL

  shareholder_info?: {
    shareholder_type_id?: string | number
    participating_percentage?: string
    beneficiary_ownership?: string
    beneficiary_benefits?: string
    control_over_legal_person?: 'Si' | 'No'
    giin_code?: string
    nationality_id?: number
    address?: string
    country_id?: number
    department_id?: number
    city_id?: number
    beneficiary_date?: string
    different_nationality?: 'Si' | 'No'
  }

  contact_info?: {
    email?: string
    phone?: string
    postal_code?: string
  }

  natural_person?: {
    name?: string
    middle_name?: string
    last_name?: string
    second_last_name?: string
    birth_country_id?: number
    birth_date?: string
    issue_date?: string
    document_issuance_country_id?: number
  }

  legal_person?: {
    business_name?: string
    country_id?: number
  }

  tax_info?: {
    foreign_responsibility?: 1 | boolean
    has_tax_responsibility_outside_colombia?: 1
    country_id?: number
    nationality_id?: number
    tin?: string
    branch_address?: string
    giin_code?: string
  }

  pep_info?: {
    is_pep?: 1
    is_politician?: 1
    is_pep_international?: 1
    has_pep_relatives?: 1
    is_international_pep?: 1
  }

  pep_info_relative?: {
    full_name?: string
    relationship?: string
    position?: string
  }
}

// --- Tributary Tab (v2) ---
// Form
export interface IBaseTributaryForm {
  taxpayer_type?: string | null
  files_tax_return: boolean
  files_foreign_taxes: boolean
  country_id: number | null
  giin_code: string | null
  is_branches: boolean
  description_economic_activity: string | null
  branch_address: string | null
  branch_country_id: number | null
}

// Settlement formula response request
export interface ISettlementFormula {
  id?: number
  settlement_formula_id: number | null
  is_main: boolean
}

// Settlement Formula list response
export interface ISettlementFormulaTax {
  id: number
  tax_type: string
  is_applicable: boolean
  settlement_concept_id: number | null
  concept_description: string | null
  concept: {
    description: string | null
    class: string | null
    percentage?: string | null
  }
}

// Settlement Formula list items
export interface ISettlementFormulaItem {
  id: number
  code: number
  person_type: string
  fiscal_responsibility: string
  name: string
  status_id: number
  status: {
    id: number
    name: string
  }
  taxes: ISettlementFormulaTax[]
  iva?: string
  rete_iva?: string
  rete_ica?: string
  rete_fuente?: string
  municipal_taxes?: string
  is_main?: boolean
  applies_withholding_tax: boolean
  withholding_tax_liquidation_concept: string
  applies_vat: boolean
  vat_liquidation_concept: string
  applies_vat_withholding: boolean
  vat_withholding_liquidation_concept: string
  applies_ica_withholding: boolean
  applies_territorial_taxes: boolean
  territorial_taxes_liquidation_concept: string
  created_at: string
  updated_at: string
}

// assign modal
export interface IAssignSettlementParametersForm {
  third_party: string | null
  fiscal_responsibility: string | null
  vat_responsibility: boolean
  reteiva_concept: string | null
  reteiva_concept_tax_rate: string | null
  iva_concept: string | null
  iva_concept_tax_rate: string | null
}

// Person legal request
export interface IBaseTributaryPersonLegalRequest {
  taxpayer_type?: number | null
  files_tax_return: boolean
  files_foreign_taxes: boolean
  giin_code: string | null
  is_branches: boolean
  description_economic_activity: string | null
  branch_country_id: number | null
  foreign_responsibility: boolean
  has_different_nationality: boolean
  country_id: number | null
  nationality_id: number | null
  branch_address: string | null
  settlement_formulas: ISettlementFormula[]
}

// --- Documents Tab (v2) ---
export interface ISaveClientDocumentRequest {
  name: string
  document_type: string
  third_party_category: string
}

export interface ISaveClientDocumentResponse {
  document_id: number
  upload_url: string
  file_path: string
}

export interface ISaveClientDocumentRequest {
  name: string
  document_type: string
  third_party_category: string
}

export interface ISaveClientDocumentResponse {
  document_id: number
  upload_url: string
  file_path: string
}

export interface IClientDocumentItem {
  id: number
  document_type: string
  original_name: string
  file_url: string | File
  is_required: boolean
  is_validated: boolean
}

export interface IClientsDocuments {
  id: number | null
  document_type: string
  file_url: string | File
  is_required: boolean
  is_validated: boolean
  name?: string
}

export interface IClientsDocumentsWrapper {
  files: IClientsDocuments[]
}

// --- Manager Tab (v2) ---
export interface IManagerBasicDataForm {
  document_type_id: number | null
  document: string | null
  natural_person: INaturalPerson | null
  legal_person: Partial<ILegalPerson> | null
  position: string | null
  date_exit: string | null
  country_id: number | null
  department_id: number | null
  city_id: number | null
  address: string | null
  email: string | null
  phone: string | null
  beneficiary_date: string | null
  status_id: number | null
}

export interface IManagerPEPForm extends IPepInfo {}

export interface IManager
  extends Partial<IManagerBasicDataForm>,
    Partial<IPepInfo> {
  id?: number
  person_type?: string | null
  third_party_category?: string | null
}

export interface ILegalClientManager {
  board_directors: boolean
  managers: IManager[]
  board_members?: IManager[]
}
