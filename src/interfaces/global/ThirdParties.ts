import { Role } from '@/interfaces/customs/Clients'
import { IBank } from '../customs/BankAccountGenerator'
import { IPhoneNumber } from '../customs/phoneNumberGenerator'

export interface IThirdParties {
  id: number | string
  classification: string
  nature: string
  document: string
  document_type: {
    id: string
    name: string
  }
  validator_digit: string
  name: string
  status: {
    id: number
    status: string
  }
  brach: {
    id: string
    name: string
  }
  user_modification: User
  user_creation: User
  created_at: string
  updated_at: string
}

export interface IGeneralDataForm {
  classification?: string | null
  nature?: string | null
  document_type_id?: string | null
  document?: string | null
  branch_id?: string | null
  name?: string | null
  tax_regime?: string | null
  tax_manager?: string | null
  commercial_registration?: string | null
  validator_digit?: string | null
  ips_code?: string | null
  ciiu_id?: string | null

  email?: string | null
  phone?: string | null
  department_id?: string | null
  city_id?: string | null
  address?: string | null
  contact_name?: string | null
  contact_phone?: string | null

  //V2
  third_party_classification?: string | null
  organ?: string | null
  jurisdiction?: string | null
  manage_withholdings?: boolean | null
  observations?: string | null
}

// Actividad economica
export interface IBasicDataForm {
  id?: number | null
  creation_date?: string
  created_by?: string
  person_type_id?: number | string | null
  document_type_id?: number | string
  document_number?: number | string
  first_name?: string
  check_digit: string | number | null
  social_reason: string | null
  initials: string | null
  second_name?: string
  first_last_name?: string
  second_last_name?: string
  third_type_id?: number | string
  tax_manager_id?: number | string
  iva_manager_id?: number | string
  profession_id?: number | string
  identity_type_id?: number | null
}

// Direcciones
export interface ILocation {
  id?: number | string
  country?: {
    id: number | null
    name?: string
  }
  department?: {
    id: number
    name?: string
  }
  city?: {
    id: number
    name?: string
  }
  address: string
}

export interface ILocationData extends ILocation {
  isMain: boolean
}

export interface IAddressLocationForm {
  locations: ILocationData[]
  other: string
}

// Actividad economica
export interface IEconActivity {
  id?: number | string
  ciiu?: {
    id: number
    name: string
    code: string
  }
  city?: {
    id: number
    name: string
  }
}

export interface IEconActivityData extends IEconActivity {
  isMain: boolean
}

export interface IEconActivityForm {
  econActivities: IEconActivityData[]
}

// Números de telefono
export interface IPhoneNumberData extends IPhoneNumber {
  isMain: boolean
}

export interface IPhoneNumberForm {
  phoneNumbers: IPhoneNumberData[]
}

// Correos
export interface IEmail {
  id?: number | string
  email?: string
}

export interface IEmailData extends IEmail {
  isMain: boolean
}

export interface IEmailForm {
  emails: IEmailData[]
}

// Cuentas bancarias
export interface IBankData extends IBank {
  isMain: boolean
}

export interface IBankForm2 {
  banks: IBankData[]
}

// v1
export interface IBankForm {
  bank_id?: string | null
  account?: string | null
  type?: string | null
}

export interface IRetentionForm {
  name: string | null
  account: string | null
  type?: string | null
  percentage: string | null
  retentions: (number | string)[]
}

export interface IRetentionsList {
  id: number | string
  name: string
  type?: string | undefined
  type_label?: string
  code?: string | undefined
  percentage?: string
  percentage_formatted?: string
  status_id?: number | string | undefined
  status?: {
    id: number
    name: string
  }
  account_chart?: {
    id: number
    name: string
    full_hiberrachy: string
    parent: null
  }
  account?: {
    id: number
    name: string
  }
  third_party?: {
    id: number
    name: string
    descripction?: string
    nit?: null
  }
}

export interface ICreateUpdateThirdParty extends IGeneralDataForm {
  bank: IBankForm
  locations?: IAddressLocationForm
  retentions: (number | string)[]
}

export interface IEditThirdParty extends IGeneralDataForm {
  id: string
  ciiu: {
    id: string
    description: string
  }
  branch: {
    id: string
    name: string
    status_id: number
  }
  document_type: {
    id: string
    name: string
    abbreviation: string
  }
  department: {
    id: string
    name: string
  }
  city: {
    id: string
    name: string
  }
  bank: {
    account: string
    type: string
    bank: {
      id: string
      description: string
      status_id: number
    }
  }
  retentions: IRetentionsList
}

export interface IThirdPartiesList {
  id: number
  name: string
  document_type: string
  document: string
  person_type: string
  third_party_type: string
  status: Status
  created_at: string
}

export interface Status {
  id: number
  name: string
}

interface User {
  id: string
  name: string
  last_name: string
}

// NEW INTERFACES FIDUPREVISORA
export interface IThirdParty {
  id: number
  created_by: CreatedBy
  updated_by: CreatedBy
  document_type_id: number
  status_id: number
  third_party_category: string
  document: string
  commercial_registration: null
  validator_digit: string
  created_at: string
  updated_at: string
  observations: null
  is_customer: boolean
  third_party_type: string
  birth_date: null
  constitution_date: string
  nationality: null
  issue_date: null
  is_pep: boolean
  fiscal_responsibility: string
  vat_responsibility: string
  is_fideicomiso: boolean
  document_type: DocumentType
  status: Status
  natural_person?: NaturalPerson
  legal_person?: LegalPerson
  economic_activities: EconomicActivity[]
  addresses: Address[]
  bank_accounts: BankAccount[]
  emails: Email[]
  phones: Phone[]
  person_type: string
  identity_type_id: number | null
  identity_type: IdentityType
  employment_info?: IEmploymentInfo | null
}

export interface IEmploymentInfo {
  id: number
  third_party_id: number
  occupation_id: string
  ciiu_code: null
  company: string
  address: string
  phone: string
  profession_id: string
  created_at: Date
  updated_at: Date
  deleted_at: null
  city_id: number
  ciiu_id: number
}

export interface Address {
  id: number
  third_party_id: number
  country_id: number
  department_id: number
  city_id: number
  address_type: string
  address: string
  postal_code: string
  is_main: boolean
  created_at: string
  updated_at: string
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

export interface Country {
  id: number
  name: string
  code: string
  status_id: number
  created_at: null
  updated_at: null
}

export interface BankAccount {
  id: number
  third_party_id: number
  bank_id: number
  account_number: string
  account_type: string
  created_at: string
  updated_at: string
  account_holder: null
  is_main: boolean
  has_active_payments: boolean
  bank_branch_id: number
  bank: Bank
  bank_branch: BankBranch
  status: string
}

export interface Bank {
  id: number
  description: string
  type: string
  accounting_account: string
  status_id: number
  code: string
}

export interface BankBranch {
  id: number
  bank_id: number
  city_id: number
  name: string
  status_id: number
  code: string
  city: City
}

export interface CreatedBy {
  id: number
  name: string
  last_name: string
  status: null
  document_type: null
  documents: Document[]
  roles: Role[]
}

export interface DocumentType {
  id: number
  name: string
  abbreviation: string
  model: string
  status_id: number
}

export interface EconomicActivity {
  id: number
  third_party_id: number
  ciiu_code: string
  ciiu_id: number
  activity_description: string
  city_id: number
  is_main: boolean
  created_at: string
  updated_at: string
  city: City
}

export interface Email {
  id: number
  email_address: string
  is_main: boolean
}

export interface IdentityType {
  id: number
  identity_type: string | null
}

export interface LegalPerson {
  id: number
  third_party_id: number
  business_name: string
  trade_name: string
  nature_id: number
  constitution_code: string
  country_id: number
  classification_company: string
  applicant_type: string
  created_by: number
  updated_by: number
  created_at: string
  updated_at: string
  deleted_at: null
  acronym: string
  entity_type_id: number
  business_type?: {
    id: number
    code: string | null
    name: string
  } | null
  sending_correspondence?: string
  nature?: string
}

export interface NaturalPerson {
  id: number
  name: string
  middle_name: string
  last_name: string
  second_last_name: string
  birth_date: string
  issue_date: string
  third_party_id: number
  applicant_type: number
  occupation: number
  created_by: number
  updated_by: number
  created_at: string
  updated_at: string
  deleted_at: null
  occupation_category: OccupationCategory
  sending_correspondence?: string
  nature?: string
  birth_country_id?: number | null
  birth_country?: string | null
  location_country_id?: number | null
  location_country?: string | null
}

export interface OccupationCategory {
  id: number
  type_id: number
  occupation: string
  created_at: Date
  updated_at: Date
}

export interface Phone {
  id: number
  phone_type: string
  phone_number: string
  is_main: boolean
}

export interface Status {
  id: number
  status: string
}

export interface IdentityType {
  id: number
  identity_type: string | null
}
