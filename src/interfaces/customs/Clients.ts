import { BankAccount } from "../global/ThirdParties"

/* eslint-disable*/
export interface INaturalGeneral {
  creation_date: string
  application_type: string | null
  document_type_id: string | null
  document: string | null
  natural_person: INaturalClientInformationFormNaturalPerson
  nacionality: string | null
  contacts: IClientsContacts[]
  sending_correspondence: string | null
  addresses: IClientsAddresses
  employment_info: IClientsEmployment
  tax_info: {
    taxpayer_type: string | null
    withholding_tax: boolean | undefined
    has_different_nationality: boolean | undefined
    foreign_responsibility: boolean | undefined
    tin_option_id: string | null
    country_id: string | null
    foreign_phone: string | null
    address: string | null
    granted_power_attorney: boolean | undefined
  }
  financial_info: {
    report_income: boolean | undefined
    total_operational_income: string | number | null
    total_expenses: string | number | null
    total_non_operational_income: string | number | null
    other_non_operational_income_concept: string | number | null
    assets: string | number | null
    liabilities: string | number | null
    cutoff_date: string | null
    bank_holder_id: string | null
    bank_account_number_holder: string | null
    account_type_holder_id: string | null
    beneficiary_document_number: string | null
    bank_beneficiary_id: string | null
    bank_account_number_beneficiary: string | null
    beneficiary_name: string | null
    account_type_beneficiary_id: string | null
  }
  is_pep: boolean | undefined
  pep_info: {
    is_politician: boolean | undefined
    legal_representative: boolean | undefined
    is_pep_international: boolean | undefined
    position: string | null
    date_entry: string | null
    date_exit: string | null
  }
  pep_info_relative: {
    familiar_politician: boolean | undefined
    full_name: string | null
    relationship: string | null
    position?: string | null
  }
  files: IClientsDocuments[]
}

export interface IClientList {
  id: number
  name_or_razon_social: string
  third_party_category: string
  type_person: string
  type_client: string
  document: string
  document_type_id: number
  document_type: IDocumentType
  status: {
    id: number
    status: string
  }
}

// -----------------------------

export interface ThirdParty {
  id: number
  created_by: CreatedBy
  document_type_id: number
  status_id: number
  third_party_category: null
  document: string
  commercial_registration: null
  validator_digit: null
  created_at: string
  updated_at: string
  observations: null
  updated_by: CreatedBy
  is_customer: boolean
  third_party_type: null
  birth_date: null
  issue_date: null
  fiscal_responsibility: null
  vat_responsibility: null
  identity_type_id: null
  documents: Document[]
  document_type: IDocumentType
  customer: IClientNaturalPersonRequest
  natural_person: NaturalPerson
  contacts: Contact[]
  addresses: Address[]
  employment_info: EmploymentInfo
  tax_info: TaxInfo
  financial_info: FinancialInfo
  pep_info: PepInfo
}

export interface CreatedBy {
  id: number
  name: string
  last_name: string
  status: null
  document_type: null
  documents: any[]
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
  created_at: Date
  updated_at: Date
}

export interface IClientNaturalPersonRequest {
  id: number
  third_party_id: number
  customer_category: string
  status_id: number
  request_type: string
  third_party?: ThirdParty
  created_at: string
  created_by?: {
    name: string
    last_name: string
  }
  updated_at: string
  updated_by?: {
    name: string
    last_name: string
  }
}

export interface IGeneratePresignedUrlClient {
  document_type: string
  third_party_category: string
  name: string
}

export interface Address {
  id: number
  third_party_id: number
  address_type: null
  address: string
  postal_code: null
  is_main: boolean
  created_at: string
  updated_at: string
  country_id: number
  department_id: number
  city_id: number
  country: Country
  department: City
  city: City
}

export interface City {
  id: number
  name: string
  code: string
  department_id?: number
}

export interface Department {
  id: number
  name: string
  code: string
  country_id: number
}

export interface Country {
  id: number
  name: string
  code: string
  status_id: number
  created_at: null
  updated_at: null
}

export interface Contact {
  id: number
  third_party_id: number
  contact_type: string
  contact_value: string
  is_main: boolean
  created_at: string
  updated_at: string
}

export interface IDocumentType {
  id: number
  name: string
  abbreviation: string
  model: string
  status_id: number
}

export interface Document {
  id: number
  document_type: string
  file_path: string
  is_required: null
  is_validated: null
  validation_date: null
  third_party_id: number
  created_at: string
  updated_at: string
  validated_by: number
  file_url: string
  original_name: string
}

export interface EmploymentInfo {
  id: number
  third_party_id: number
  occupation_id: string
  ciiu_code: null
  company: string
  address: string
  phone: string
  profession_id: string
  created_at: string
  updated_at: string
  deleted_at: null
  city_id: null
  occupation: Occupation
  profession_info: ProfessionInfo
  country_id: number
  department_id: number
  ciiu: {
    id: number
    code: string
    description: string
  }
  country: {
    id: number
    name: string
    code: string
    status_id: number
    created_at: string | null
    updated_at: string
    nationality: string
  }
  department: {
    id: number
    name: string
    code: string
  }
  city: {
    id: number
    name: string
    code: string
    department_id: number
  }
}

export interface Occupation {
  id: number
  type_id: number
  name: string
  created_at: string
  updated_at: string
}

export interface ProfessionInfo {
  id: number
  occupation: string
  code: string
}

export interface FinancialInfo {
  id: number
  third_party_id: number
  total_operational_income: string
  total_non_operational_income: string
  total_expenses: string
  other_income_concept: null
  other_non_operational_income_concept: string
  assets: string
  liabilities: string
  cutoff_date: string
  bank_holder_id: number
  bank_account_number_holder: string
  account_type_holder: string
  account_type_beneficiary: string
  beneficiary_name: string
  beneficiary_document_number: string
  created_at: string
  updated_at: string
  deleted_at: null
  bank_account_number_beneficiary: string
  bank_beneficiary_id: string
  declares_income: null
  funding_source: null
  bank: Bank
  bank_beneficiary: Bank
  is_registered_in_national_emission_registery?: boolean
}

export interface Bank {
  id: number
  code: string
  description: string
}

export interface NaturalPerson {
  id: number
  name: string
  middle_name: string
  last_name: string
  second_last_name: string
  birth_date: string
  issue_date: null
  birth_country_id?: number
  third_party_id: number
  applicant_type: null
  created_at: string
  updated_at: string
  deleted_at: null
  occupation_id: null
  sending_correspondence: null
  full_name: string
  birth_country?: string | null
}

export interface PepInfo {
  id: number
  third_party_id: number
  position: null
  entity: null
  date_entry: null
  date_exit: null
  pep_type_id: null
  created_at: string
  updated_at: string
  deleted_at: null
  is_pep: boolean
  is_politician: boolean
  is_pep_international: boolean
  has_pep_relatives: boolean
  is_international_pep: boolean
  relatives: { full_name: string; relationship: string; position?: string }[]
}

export interface TaxInfo {
  id: number
  nationality: Nationality
  third_party_id: number
  taxpayer_type: TaxPayerType
  giin_code: string
  is_branches: null
  description_economic_activity: null
  branch_country_id: null
  branch_address: null
  has_different_nationality: boolean
  foreign_responsibility: boolean
  country_id: null
  foreign_phone: string
  created_at: string
  updated_at: string
  deleted_at: null
  has_notarial_power: boolean
  is_withholding_subject: boolean
  postal_address: string
  files_tax_return: null
  files_foreign_taxes: null
  nationality_id: null
  tin_option?: string
  tin: string
}

export interface TaxPayerType {
  id: number
  name: string
}

export interface Nationality {
  id: number
  code: string
  name: string
}

// -----------------------------

export interface INaturalClientInformationForm {
  creation_date: string
  application_type: string | null
  document_type_id: string | null | number
  document: string | null
  natural_person: INaturalClientInformationFormNaturalPerson
  nacionality: string | null | number
  contacts: IClientsContacts[]
  sending_correspondence: string | null
  addresses: IClientsAddresses
  employment_info: IClientsEmployment
}

export interface INaturalClientInformationFormNaturalPerson {
  name: string | null
  middle_name: string | null
  last_name: string | null
  second_last_name: string | null
  birth_date: string | null
  issue_date: string | null
  applicat_type: string | null
  occupation_id: string | null
  birth_country?: string | null
  document_issuance_country?: string | null
  expedition_date?: string | null
  location_country?: string | null
  birth_country_id?: number | null
  location_country_id?: number | null
}

export interface IClientsContacts {
  contact_type: string | null
  contact_value: string | null
  is_main?: string | null
}

export interface IClientsEmployment {
  occupation_id: string | null | number
  ciiu_code: string | null | number
  ciiu_id?: string | null | number
  company: string | null
  address: string | null
  country_id: string | null | number
  department_id: string | null | number
  city_id: string | null | number
  phone: string | null
  profession_id: string | null | number
}

export interface IClientsAddresses {
  address: string | null
  country_id: string | null | number
  department_id: string | null | number
  department?: string | null
  city_id: string | null | number
  city?: string | null
  address_type?: string | null
  postal_code?: string | null
  is_main?: string | null
  country?: string | null | number
  postal_address?: string | null
  branch_address?: string | null
}

export interface INaturalClientTributaryForm {
  tax_info: {
    taxpayer_type: string | null | number
    withholding_tax: boolean | undefined
    has_different_nationality: boolean | undefined
    foreign_responsibility: boolean | undefined
    tin_option_id: string | null
    tin_number: string | null | number
    country_id: string | null | number
    foreign_phone: string | null
    address: string | null
    granted_power_attorney: boolean | undefined
  }
}

export interface INaturalClientFinanceForm {
  financial_info: {
    report_income: boolean | undefined
    total_operational_income: string | number | null
    total_expenses: string | number | null
    total_non_operational_income: string | number | null
    other_non_operational_income_concept: string | number | null
    assets: string | number | null
    liabilities: string | number | null
    cutoff_date: string | null
    bank_holder_id: string | null | number
    bank_account_number_holder: string | null
    account_type_holder_id: string | null | number
    beneficiary_document_number: string | null
    bank_beneficiary_id: string | null | number
    bank_account_number_beneficiary: string | null
    beneficiary_name: string | null
    account_type_beneficiary_id: string | null | number
    legal_people_found_source_id?: number | string | null
    funding_source?: number | string | null
    bank_accounts?: BankAccount[]
  }
}

export interface INaturalClientPepForm {
  is_pep: boolean | undefined
  pep_info: {
    is_politician: boolean | undefined
    legal_representative: boolean | undefined
    is_pep_international: boolean | undefined
    position: string | null
    date_entry: string | null
    date_exit: string | null
    entity?: string | null
  }
  pep_info_relative: {
    familiar_politician: boolean | undefined
    full_name: string | null
    relationship: string | null
    position: string | null
    entity?: string | null
  }
}

export interface INaturalClientEstate {
  resource_type: string
  asset_identification: string
  asset_value: string | number
  different_contributor: boolean
  asset_source: string
  other_asset_source: string
  purpose: string
}

export interface INaturalClientInvestor {}

export interface INaturalClientDocument {
  files: IClientsDocuments[]
}

export interface IClientsDocuments {
  document_type: string | null
  file_path?: File | string | null
  file_url?: File | string | null
  is_required: boolean | null
  is_validated?: boolean | null
  id?: number | null | string
  name?: string | null
  original_name?: string | null
}

export interface documentType {
  id: number
  abbreviation: string
  model: string
  name: string
  status_id: number
}

export interface ILegalClientInformation {
  creation_date: string | null
  created_by: string | null
  updated_date: string | null
  updated_by: string | null
  date_incorporation: string | null
  application_type: string | null
  document_type: string | number | null
  document_number: string | null
  email: string | null
  phone: string | null
  sending_correspondence: string | null
  name: string | null
  nature: string | null
  constitution_country: string | null | number
  country: string | number | null
  department: string | number | null
  city: string | number | null
  address: string | null
  created_at?: string | null
  customer?: IClientNaturalPersonRequest
  // document_type?: documentType
  document?: string | null
  contacts?: IClientsContacts[]
  legal_person?: ILegalRepresentationClient
  addresses?: IClientsAddresses[]
  third_party?: ThirdParty
}

export interface ILegalRepresentationClient {
  first_name_representation: string | null
  second_name_representation: string | null
  first_lastname_representation: string | null
  second_lastname_representation: string | null
  document_type_representation: string | number | null
  document_number_representation: string | null
  date_issue_representation: string | null
  country_birth_representation: string | number | null
  different_nactionality_representation: boolean | undefined
  different_tax_liability_representation: boolean | undefined
  country_representation: string | number | null
  department_representation: string | number | null
  city_representation: string | number | null
  nacionality_representation: string | number | null
  address_representation: string | null
  nit_taxpayer_representation: string | null
  is_pep: boolean | undefined
  is_politician_representation: boolean | undefined
  is_international_entity_representation: boolean | undefined
  is_international_pep_representation: boolean | undefined
  position_entity_representation: string | null
  date_entry_position_representation: string | null
  date_retirement_position_representation: string | null
  family_member_second_degree_representation: boolean | undefined
  name_family_representation: string | null
  relationship_family_representation: string | null
  position_family_representation: string | null
  business_name?: string | null
  nature?: string | null
  country?: string | null
  country_id?: string | number | null
  legal_representatives?: Representative[]
  constitution_date?: string | null
  tax_info?: tax_info
  sending_correspondence?: string | null
}

interface Representative {
  id: number
  third_party_id: number
  legal_person_id: number
  representative_type_id: number
  created_at: string
  updated_at: string
  deleted_at: string | null
  third_party: ThirdParty
  natural_person: NaturalPerson
  document_type?: string | null
  document_type_id?: string | null | number
  document?: string | null
  pep_info?: PepInfo
  tax_info?: tax_info
}

export interface ILegalClientCorporative {
  company_classification_corporative: string | null
  ciiu_code_corporative: string | null
  is_registered_national_registry_corporative: boolean | undefined
  total_monthly_operating_income_corporative: string | number | null
  total_monthly_not_operating_income_corporative: string | number | null
  total_monthly_expenses_corporative: string | number | null
  item_other_monthly_income_corporative: string | number | null
  assets_corporative: string | number | null
  total_liabilities_corporative: string | number | null
  cutoff_date_financial_information_corporative: string | null
  bank_entity_corporative: string | null | number
  type_account_holder_corporative: string | null
  holder_account_number_corporative: string | null
  origin_funds_corporative: string | null
  other_origin_funds_corporative: string | null
  total_assets_corporative: string | number | null
  financial_info: FinancialInfoLC | null
  economic_activities?: EconomicActivity[]
  legal_person?: legal_person
  bank_holder_id?: string | number | null
}

export interface legal_person {
  acronym: string | null
  applicant_type: string | null
  business_name: string
  classification_company: string
  constitution_date: string | null
  country: string
  country_id: number
  entity_type_id: number | null
  id: number
  nature: string
  trade_name: string
}

export interface EconomicActivity {
  id: number
  activity_description: string
  ciiu_id: string | null
  city: string
  city_id: number
  is_main: boolean
  ciiu: Ciiu
}

export interface Ciiu {
  id: number
  code: string
  description: string
}

export interface FinancialInfoLC {
  total_operational_income?: string | number | null
  total_non_operational_income?: string | number | null
  total_expenses?: string | number | null
  other_non_operational_income_concept?: string | number | null
  assets?: string | number | null
  liabilities?: string | number | null
  cutoff_date?: string | null
  account_type_beneficiary?: string | null
  bank_account_number_holder?: string | null
  account_type_holder?: string | null
  bank_holder?: string | null
  funding_source?: string | null
  describe_funding_source?: string | null
  is_registered_in_national_emission_registery?: boolean | null
  bank_holder_id?: string | number | null
}

export interface ILegalClientTributary {
  declare_income_tributary: boolean | undefined
  declare_taxes_another_country_tributary: boolean | undefined
  country_tributary: string | null | number
  ciiu_code_tributary: string | null
  branches_other_countries_tributary: boolean | undefined
  economic_activity_branches_tributary: string | null
  address_tributary: string | null
  country_address_tributary: string | number | null
  department_tributary: string | number | null
  city_tributary: string | number | null
  tax_info?: tax_info
  financial_info?: FinancialInfo
}

export interface tax_info {
  has_different_nationality?: boolean
  giin_code?: string | null
  description_economic_activity?: string | null
  postal_address?: string | null
  foreign_responsibility?: boolean
  nationality_id?: number
  country?: string | null
  country_id?: string | number | null
  nationality?: string | null
  tin?: string | null
  files_tax_return?: boolean
  files_foreign_taxes?: boolean
  is_branches?: boolean
  branch_address?: string | null
  branch_country?: string | null
  branch_country_id?: string | number | null
}

//Directivos
export interface IManagerInfoForm {
  document?: string | null
  document_type: number | null
  document_number: number | null
  first_name: string | null
  second_name: string | null
  first_lastname: string | null
  second_lastname: string | null
  business_name: string | null
  third_party_category?: string | null
  natural_person?: INaturalClientInformationFormNaturalPerson
  pep_info?: IManagerPEPForm
}

export interface IManagerPEPForm {
  is_pep?: boolean
  political_decree_830_2021?: boolean
  is_representative_intl_org?: boolean
  is_pep_international?: boolean
  has_pep_relative?: boolean
  related_pep_full_name: string | null
  pep_relationship: string | null
  position_held: string | null
  is_politician?: boolean
  has_pep_relatives?: boolean
  relatives?: {
    full_name: string | null
    relationship: string | null
    position: string | null
  }[]
}

export interface IManager
  extends Partial<IManagerInfoForm>,
    Partial<IManagerPEPForm> {
  id?: number
  person_type: string | null
}

export interface ILegalClientManager {
  board_directors: boolean | undefined
  managers: IManager[]
  board_members?: IManager[]
}

// Accionistas
export interface IShareholderInfoForm {
  shareholder_type: string | null
  beneficial_owner_by_ownership: string | null
  beneficial_owner_by_beneficiaries: string | null
  participation_percent: string | null
  has_control_over_legal_entity?: boolean
  document?: string | null
  natural_person?: INaturalClientInformationFormNaturalPerson
  legal_person?: ILegalRepresentationClient
  participating_percentage?: string | null
  beneficiary_ownership?: string | null
  beneficiary_benefits?: string | null
  address?: string | null
  country?: number | null
  giin_code?: string | null
  different_nationality?: string | null
  control_over_legal_person?: string | null
  addresses?: IClientsAddresses[]
  contacts?: IClientsContacts[]
}

export interface IShareholderProfileForm {
  created_by: string | null
  updated_by: string | null
  updated_at: string | null
  document_type_id: number | null
  document_number: string | null
  social_reason: string | null
  first_name: string | null
  second_name: string | null
  first_last_name: string | null
  second_last_name: string | null
  expedition_date: string | null
  birth_country: number | null
  incorporation_country: number | null
  expedition_country: number | null
  birth_date: string | null
  postal_code: string | null
  address: string | null
  country: number | null
  department: number | null
  city: number | null
  email_contact: string | null
  beneficiary_date: string | null
  nationality: number | null
  taxpayer_document_number: string | null
  tax_address: string | null
  tax_country: number | null
  tax_department: number | null
  tax_city: number | null
  legal_phone_number: string | null
  check_digit: string | null
  document_type: string | null
  has_international_tax_responsibility?: boolean
  has_only_foreign_tax_responsibility?: boolean
  shareholder_info?: IShareholderInfoForm
  pep_info?: IShareholderPEPForm
}

export interface IShareholderPEPForm {
  is_pep?: boolean
  political_decree_830_2021?: boolean
  is_representative_intl_org?: boolean
  is_pep_international?: boolean
  has_pep_relative?: boolean
  has_pep_relatives?: boolean
  related_pep_full_name: string | null
  pep_relationship: string | null
  position_held: string | null
  is_politician?: boolean
  relatives?: {
    full_name: string | null
    relationship: string | null
    position: string | null
  }[]
}

export interface IShareholderTributaryForm {
  tributary_has_control_over_legal_entity?: boolean
  tributary_country: number | null
  giin_code: string | null
  third_party_category?: string | null
}

export interface IShareholder
  extends Partial<IShareholderInfoForm>,
    Partial<IShareholderProfileForm>,
    Partial<IShareholderPEPForm>,
    Partial<IShareholderTributaryForm> {
  id?: number
  person_type: string | null
}

export interface ILegalClientShareholder {
  have_shareholder: boolean | undefined
  shareholders: IShareholder[]
}

export interface ILegalClientInvestor {
  investors: any[]
}

export interface ILegalClientDocument {
  files: IClientsDocuments[]
}

export interface ITrustorResponse {
  created_at: string | null
  request_type: string | null
  third_party: {
    id: number
    document_type: documentType
    document_type_id: number
    fideicomiso_person: {
      id: number
      sending_correspondence: string | null
      business_trust: {
        id: number
        business_code: string
        name: string
      }
    }
    addresses: ITrustorClientAddresses[]
    contacts: IClientsContacts[]
  }
}

export interface ITrustorClientAddresses {
  address: string | null
  country_id: string | null | number
  department_id: string | null | number
  department?: Department | null
  city_id: string | null | number
  city?: City | null
  address_type?: string | null
  postal_code?: string | null
  is_main?: string | null
  country?: Country
}

export interface ITrustorClientForm {
  creation_date: string
  request_type: string | null
  document_type_id: string | number | null
  fideicomiso_person: {
    sending_correspondence: string | null
    business_trust_id: number | string | null
  }
  email: string | null
  name: string | null
  phone_number: string | null
  phone_type: string | null
  address: string | null
  address_type: string | null
  country_id: number | string | null
  department_id: number | string | null
  city_id: number | string | null
}

export interface ITrustorClientFinance {
  declares_income: boolean | undefined
  total_operational_income: string | number | null
  total_expenses: string | number | null
  other_non_operational_income_concept: string | number | null
  total_non_operational_income: string | number | null
  assets: string | number | null
  liabilities: string | number | null
}

export interface ITrustorClientInternational {
  can_performs_transactions: boolean | undefined
  transaction_type: null | string
  operation_country_id: null | string
  currency: null | string
}
