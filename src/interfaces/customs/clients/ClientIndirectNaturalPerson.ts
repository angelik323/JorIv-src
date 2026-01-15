import { ClientPersonType } from '@/interfaces/global/Clients'
import {
  IClientsAddresses,
  IClientsContacts,
  IClientsEmployment,
  INaturalClientFinanceForm,
  INaturalClientInformationFormNaturalPerson,
  ThirdParty,
} from '../Clients'
import { IGenericResource } from '../resources'
import { IBasicForm } from './Clients'

// --- Info Basic Tab (v2) ---
export interface IClientNaturalPersonIndirectRequest {
  person_type: ClientPersonType

  request_type: string | null
  document: string | null
  document_type_id: number | string | null
  vat_responsibility: string | null
  fiscal_responsibility: string | null

  natural_person: {
    name: string | null
    middle_name: string | null
    last_name: string | null
    second_last_name: string | null
    birth_date: string | null
    birth_country_id: number | null
    location_country_id: number | null
    sending_correspondence: string | null
    issue_date: string | null
  }

  contacts: Array<{
    contact_type: string | number | null
    contact_value: string | null
    is_main: boolean
  }>

  addresses: Array<{
    country_id: number | null
    department_id: number | null
    city_id: number | null
    address: string | null
    is_main: boolean
    branch_address: string | null
  }>

  employment_info: Record<string, unknown>

  tax_info: Record<string, unknown>

  financial_info: Record<string, unknown>

  pep_info: Record<string, unknown>
  pep_info_relative?: Record<string, unknown>

  investor?: Record<string, unknown>
}


// --- Tributary Tab (v2) ---
export interface IClientIndirectTaxInfo {
  tax_obligations: string | number | null
  declares_tax: boolean
  responsible_iva: boolean
  files_tax_return: boolean
  has_different_nationality?: boolean
  vat_responsibility: string | null
  has_tax_responsibility_outside_colombia: boolean
  foreign_phone: string | null
  address: IAddress
}

// --- Tributary Tab (v2) ---
export interface INationality {
  nationality: string | number | null
  has_different_nationality: boolean
}

// --- Tributary Tab (v2) ---
export interface ILiquidationParams {
  thirdparty: string | number | null
  iva_percentage: string | number | null
  iva_name_concept: string | number | null
  reteiva_percentage: string | number | null
  reteiva_name_concept: string | number | null
  tax_obligations: string | number | null
  iva_responsible: string | number | null
}

// --- Tributary Tab (v2) ---
export interface ITributaryForm {
  tax_info: IClientIndirectTaxInfo
  nationality: INationality
  address: IAddress
  details: IDetails
  liquidation_params: ILiquidationParams
  settlement_formulas: ILiquidationParamRow[]
}

// --- Tributary Tab (v2) ---
export interface IAddress {
  id?: number | null
  country?: string | number | null
  department?: string | number | null
  city?: string | number | null
  postal_address?: string | number | null | undefined
  has_notary_power_abroad?: boolean
  taxable_country?: string | number | null
  country_id?: string | number | null
  branch_address?: string | null
  postal_code?: string | null
  address?: string | null
}

// --- Tributary Tab (v2) ---
export interface IDetails {
  phone_code: string | number | null
  tin_status: string | number | null
  tin: string | number | null
}

// --- Tributary Tab (v2) ---
export interface ICountry extends IGenericResource {
  id: number
  name: string
  nationality: string
}

// --- Tributary Tab (v2) ---
export interface ITributaryParamRow {
  id: number
  tributary_param: string | number
  liquidation_param_name: string
  iva: string | number | null
  retelca: string | number | null
  retefuente: string | number | null
  multiretelca: string | number | null
  impuestos_municipales: string | number | null
  
}

// --- Tributary Tab (v2) ---
export interface ILiquidationParamRow extends ITributaryParamRow {
  principal: boolean
  selected_ui: boolean
}

// --- Tributary Tab (v2) ---
export interface IClientIndirectNaturalBasicForm extends IBasicForm {
  natural_person: INaturalClientInformationFormNaturalPerson
  nacionality: string | null | number
  contacts: IClientsContacts[]
  sending_correspondence: string | null
  addresses: IClientsAddresses
  employment_info: IClientsEmployment
  third_party?: ThirdParty
  client_type_id?: number | null
  fiscal_responsibility?: string | null
  request_type?: string | null
}

// --- Tributary Tab (v2) ---
export interface IFormulaTax {
  id: number
  settlement_formula_id: number
  tax_type: string
  tax_type_label: string
  is_applicable: boolean
  settlement_concept_id: number | null
  concept_description: string | null
  created_at: string
  updated_at: string
  concept: ITaxConcept | null
}

// --- Tributary Tab (v2) ---
export interface ISettlementFormulaTributary {
  id: number
  code: number
  person_type: string
  person_type_label: string
  fiscal_responsibility: string
  fiscal_responsibility_label: string
  name: string
  status_id: number
  taxes: IFormulaTax[]
}

// --- Tributary Tab (v2) ---
export interface ITaxConcept {
  id: number;
  description: string;
  percentage: string | number;
}

// --- Tributary Tab (v2) ---
export interface SettlementParametersResult {
  iva_concept: string;
  iva_tarifa: number;
  reteiva_concept: string;
  reteiva_tarifa: number;
}

// --- Finance Tab (v2) ---
export interface IBankAccountRow {
  account_bank: string
  account_type: string
  account_number: string
  branch_name: string
  status: string | number
  bank_branch_id: string | number | null
  bank_name: string
  principal: boolean
}

// --- Finance Tab (v2) ---
export interface INaturalClientFinanceFormExtended extends Omit<INaturalClientFinanceForm, 'financial_info'> {
  financial_info: INaturalClientFinanceForm['financial_info'] & {
    bank_branch_id: string | number | null;
    bank_status: string | number | null;
    bank_name: string | null;
    principal: boolean;
    legal_people_found_source_id: number | string | null;
    other_legal_people_found_source?: string | null;
    funding_source?: string | null;
    bank_accounts: IBankAccountForm[];
  };
}

// --- Finance Tab (v2) ---
export interface IBankAccountForm {
  bank_id: number;
  bank_branch_id: number | null;
  account_type: string;
  account_number: string;
  is_main: boolean;
}

export type BankAccountModalMode = 'create' | 'edit'

export interface IBankAccountRowUI extends IBankAccountRow {
  id?: number
  bank_id: number
  bank_branch_id: number | null
  status_id: string | number | null
  account_type_id: number | string | null
  is_main: boolean
}

export interface IBankAccountModalModel {
  id?: number
  bank_id: number | null
  bank_branch_id: number | null
  status_id: string | number | null
  account_type_id: number | string | null
  account_number: string
  is_main: boolean
}


// --- PEP Tab (v2) ---
export interface IClientIndirectNaturalPepForm {
  pep_info: {
    is_pep: boolean | undefined,
    is_politician: boolean | undefined,
    legal_representative: boolean | undefined,
    is_pep_international: boolean | undefined,
    position: string | null,
    date_entry: string | null,
    date_exit: string | null,
    entity: string | null,
    has_pep_relatives?: boolean | undefined,
  }
  pep_info_relative?: IPepRelativeInfo | null
  relatives?: IPepRelativeInfoBackend | null
}

// --- PEP Tab (v2) ---
export interface IPepRelativeInfo {
  familiar_politician: boolean
  full_name: string | null
  relationship: string | null
  position: string | null
  entity: string | null
}


// --- Investor Tab (v2) ---
export interface IClientIndirectNaturalInvestorForm {
  investor: {
    investor_rating: string | null
    quantitative_risk_rating: string | null
    qualitative_risk_rating: string | null
  }
}

// --- Documents Tab (v2) ---
export interface IClientIndirectNaturalDocuments {
  document_type: string | null
  file_path?: File | string | null
  file_url?: File | string | null
  is_required: boolean | null
  is_validated?: boolean | null
  id?: number | null | string
  name?: string | null
}

// ===============================
// SHOW RESPONSE
// ===============================

export interface ClientIndirectNaturalShowResponse {
  success: boolean
  data: ClientIndirectNaturalData
  message: string
}

export interface ClientIndirectNaturalData {
  id: number
  third_party_id: number
  customer_category: string
  status_id: number
  created_at: string
  updated_at: string
  request_type: string
  created_by: CreatedBy
  updated_by: UpdatedBy | null
  status: Status
  third_party: ThirdPartyShow
}


// Investor Tab (v2)
export interface InvestorShow {
  investor_rating: string | null
  quantitative_risk_rating: string | null
  qualitative_risk_rating: string | null
}

export interface CreatedBy {
  id: number
  name: string
  last_name: string
  status: string | null
  document_type: string | null
  documents: unknown[]
  roles: Role[]
}

export interface Role {
  id: number
  name: string
  pivot: Pivot
}

export interface Pivot {
  model_type: string
  model_id: number
  role_id: number
  created_at: string
  updated_at: string
}

export type UpdatedBy = null

export interface Status {
  id: number
  status: string
  comments: string | null
}

export interface ThirdPartySettlementFormula {
  id: number
  third_party_id: number
  settlement_formula_id: number
  is_main: boolean
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

export interface ThirdPartyShow {
  id: number
  created_by: number
  document_type_id: number
  status_id: number
  third_party_category: string
  document: string
  commercial_registration: string | null
  validator_digit: string | null
  created_at: string
  updated_at: string
  observations: string | null
  updated_by: number
  is_customer: boolean
  third_party_type: string
  birth_date: string | null
  issue_date: string | null
  fiscal_responsibility: string | null
  vat_responsibility: string | null
  identity_type_id: number | null
  business_trust_id: number | null
  support_document_numbering_issuer_delegate_id: number | null
  support_document_numbering_issuer_status_id: number
  is_fideicomiso: boolean

  document_type: DocumentType
  identity_type: null
  natural_person: NaturalPerson | null
  estate: null
  foreign_phone: string | null

  contacts: ThirdPartyShowContact[]
  addresses: ThirdPartyShowAddress[]
  employment_info: EmploymentInfo | null
  tax_info: ThirdPartyShowTaxInfo | null
  financial_info: FinancialInfo | null
  pep_info: PepInfo | null
  documents: ThirdPartyShowDocument[]
  investor: InvestorShow
  settlement_formulas: ThirdPartySettlementFormula[]
}

export interface DocumentType {
  id: number
  name: string
  abbreviation: string
  model: string
  status_id: number
}

export interface NaturalPerson {
  id: number
  name: string
  middle_name: string | null
  last_name: string
  second_last_name: string | null
  birth_date: string | null
  issue_date: string | null
  third_party_id: number
  created_at: string
  updated_at: string
  deleted_at: string | null
  occupation_id: number | null
  sending_correspondence: string | null
  birth_country_id: number | string | null
  birth_country: string | null
  document_issuance_country_id: number | null
  applicant_type: string | null
  location_country_id: number | null
  full_name: string
  expedition_date: string | null
}

export interface ThirdPartyShowContact {
  id: number
  third_party_id: number
  contact_type: string
  contact_value: string
  is_main: boolean
  created_at: string
  updated_at: string
}

export interface ThirdPartyShowAddress {
  id: number
  third_party_id: number
  address_type: string | null
  address: string
  postal_address: string | null
  is_main: boolean
  created_at: string
  updated_at: string
  country_id: number
  department_id: number
  city_id: number
  country: Country
  department: Department
  city: City
  postal_code: string | null
}

export interface Country {
  id: number
  name: string
  code: string
  status_id: number
  nationality: string
  code_iso3: string | null
}

export interface Department {
  id: number
  name: string
  code: string
  country_id: number
}

export interface City {
  id: number
  name: string
  code: string
  department_id: number
}

export interface EmploymentInfo {
  id: number
  third_party_id: number
  occupation_id: number
  ciiu_code: string | null
  company: string | null
  address: string | null
  phone: string | null
  profession_id: number | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  city_id: number | null
  ciiu_id: number | null
  country_id: number | null
  department_id: number | null

  occupation: Occupation | null
  profession_info: ProfessionInfo | null
  ciiu: Ciiu | null
  country: Country | null
  city: City | null
  department: Department | null
}

export interface Occupation {
  id: number
  type_id: number
  name: string
  created_at: string
  updated_at: string
  data_type: string | null
  alignment: string | null
  format_type: string | null
}

export interface ProfessionInfo {
  id: number
  occupation: string
  code: string
}

export interface Ciiu {
  id: number
  code: string
  description: string
}

export interface ThirdPartyShowTaxInfo {
  id: number
  third_party_id: number
  taxpayer_type: TaxpayerType
  giin_code: string
  is_branches: boolean | null
  description_economic_activity: string | null
  branch_country_id: number | null
  branch_address: string | null
  has_different_nationality: boolean
  foreign_responsibility: boolean
  country_id: number | null
  tin: string | null
  foreign_phone: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  has_notarial_power: boolean
  is_withholding_subject: boolean
  postal_address: string | null
  files_tax_return: boolean | null
  files_foreign_taxes: boolean | null
  nationality_id: number
  has_tax_responsibility_outside_colombia: boolean | null
  tin_option: string | null
  vat_responsibility: string | null
  nationality: Country
  address: IAddress
}

export interface TaxpayerType {
  id: number
  type_id: number
  name: string
  created_at: string
  updated_at: string
  data_type: string | null
  alignment: string | null
  format_type: string | null
}

export interface FinancialInfo {
  id: number
  third_party_id: number
  total_operational_income: string | null
  total_non_operational_income: string | null
  total_expenses: string | null
  other_income_concept: string | null
  other_non_operational_income_concept: string | null
  assets: string | null
  liabilities: string | null
  cutoff_date: string | null
  bank_holder_id: number | null
  bank_account_number_holder: string | null
  account_type_holder: string | null
  account_type_beneficiary: string | null
  beneficiary_name: string | null
  beneficiary_document_number: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  bank_account_number_beneficiary: string | null
  bank_beneficiary_id: number | null
  declares_income: boolean
  funding_source: string | null
  address: string | null
  is_registered_in_national_emission_registery: boolean
  describe_funding_source: string | null
  is_bre_b_actived: boolean
  email_bre_b: string | null
  document_bre_b: string | null
  mobile_bre_b: string | null
  key_bre_b: string | null
  password_bre_b: string | null

  bank_holder: Bank | null
  bank_beneficiary: Bank | null

  bank_accounts: BankAccount[]
  legal_people_found_source_id: number | string | null
}

export type BankAccountStatus = string | { id: number; name: string } | null

export interface BankAccount {
  id?: number
  bank_id?: number
  bank_branch_id?: number | null
  account_type?: string
  account_number?: string
  is_main?: boolean
  status?: BankAccountStatus
}

export interface Bank {
  id: number
  description: string
  type: string
  accounting_account: string
  status_id: number
  code: string
  bank_code: string | null
  has_movements: boolean
  third_party_id: number | null
}

export interface PepInfo {
  id: number
  third_party_id: number
  position: string | null
  entity: string | null
  date_entry: string | null
  date_exit: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  is_pep: boolean
  is_politician: boolean
  is_pep_international: boolean
  has_pep_relatives: boolean
  is_international_pep: boolean
  relatives?: IPepRelativeInfoBackend
}

export interface IPepRelativeInfoBackend {
  id: number
  full_name: string | null
  relationship: string | null
  position: string | null
  entity: string | null
}


export interface ThirdPartyShowDocument {
  id: number
  document_type: string
  file_path: string
  is_required: boolean | null
  is_validated: boolean
  validation_date: string | null
  third_party_id: number
  created_at: string
  updated_at: string
  validated_by: number
  original_name: string
  file_url: string
}

// ===============================
// END SHOW RESPONSE
// ===============================


// --- Tributary Tab (v2) ---

// ==================================
// TYPES: TRIBUTARY LIQUIDATION TABLE
// ==================================
export type FormulaTaxBase = Pick<
  IFormulaTax,
  'tax_type' | 'is_applicable'
>

export type TaxesUIMap = Pick<
  ILiquidationParamRow,
  | 'iva'
  | 'retelca'
  | 'retefuente'
  | 'multiretelca'
  | 'impuestos_municipales'
>

// ======================================
// END TYPES: TRIBUTARY LIQUIDATION TABLE
// ======================================