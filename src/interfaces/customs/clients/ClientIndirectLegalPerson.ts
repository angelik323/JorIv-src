import {
  IClientLegalPersonBaseRequest,
  IClientLegalPersonBaseResponse,
  IBaseTaxInfo,
  ILegalPerson,
  IPepInfo,
  ITypeWithIdName,
  IBaseCorporateForm,
  IBaseTributaryForm,
  ISettlementFormula,
  IClientsDocuments,
  IManagerBasicDataForm,
  IClientAddress,
  ITaxInfo,
  INaturalPerson,
  IPepInfoRelative,
  IBaseShareholdersRequest,
} from './Clients'

type NullableNumberString = number | string | null

// Tipos específicos para cliente indirecto
export interface IIndirectTaxInfo extends IBaseTaxInfo {
  settlement_formulas?: Array<{
    settlement_formula_id: number | null
    is_main: boolean
  }>
}

// --- Legal person Response (v2) ---
export interface IClientLegalPersonIndirectResponse
  extends IClientLegalPersonBaseResponse {}

export interface IPepInfoToIndirect extends IPepInfo {
  pep_type_id?: number | null
}

export interface ITaxInfoToLegalRepresentationIndirect extends ITaxInfo {
  address: IClientAddress
}

// --- Legal representation Tab (v2) ---
export interface ILegalRepresentationIndirectResponse {
  id?: number | null
  representative_type?: ITypeWithIdName
  document_type: ITypeWithIdName
  document: string | null
  third_party_id?: number | null
  third_party_category: string | null
  natural_person: INaturalPerson
  address: IClientAddress
  pep_info: IPepInfoToIndirect
  pep_info_relative: IPepInfoRelative
  tax_info: ITaxInfoToLegalRepresentationIndirect
  has_beneficiary_treatment: boolean
  beneficiary_date: string | null
  status_id?: number | null
  is_new?: boolean | null
}

export interface ILegalRepresentationIndirectRequest
  extends Omit<ILegalRepresentationIndirectResponse, 'document_type'> {
  document_type_id: number | null
  issue_date: string | null
}

// --- Información básica Tab (v2) ---
export interface IClientIndirectBasicForm {
  creation_date: string
  type_client: string | null
  request_type: string | null
  document_type: string | number | null
  document_number: string | null
  name: string | null
  created_by: string | null
  updated_date: string | null
  updated_by: string | null
  check_digit: string | null
  classification_company: string | number | null
  nature_third_party: string | number | null
  constitution_country: string | number | null
  date_incorporation: string | null
  country: number | null
  department: number | null
  city: number | null
  address: string | null
  email: string | null
  mobile: string | null
  phone: string | null
  sending_correspondence: string | null
  status_id: string | number | null
}
export interface IClientBasicRequest
  extends Partial<IClientLegalPersonBaseRequest> {
  document_type_id: number
  document: string
  request_type: string
  status_id: number
  validator_digit: string | null

  email: string
  phone: string
  mobile: string
  address: string
  country_id: number | null
  city_id: number | null
  department_id: number | null

  legal_person: ILegalPerson & {
    sending_correspondence?: string
  }
}
export interface IUserInfoRequest {
  id: number
  name: string
  last_name: string
  status: string | null
  document_type: string | null
}
export interface IAddressRequest {
  id: number
  address: string
  address_type: string
  city: string
  city_id: number
  country: string
  country_id: number
  department: string | null
  department_id: number | null
  is_main: boolean
  postal_code: string
}
export interface IContactRequest {
  contact_type: string
  contact_value: string
}
export interface ICustomerRequest {
  id: number
  created_at: string
  created_by: IUserInfoRequest
  customer_category: string
  request_type: string
  status: string | null
  status_id: number
  updated_at: string | null
  updated_by: IUserInfoRequest | null
}
export interface IThirdPartyRequest {
  id: number
  document_type_id: number
  document_type: string
  document: string
  third_party_category: string
  validator_digit: string | null
}

// --- Corporate Tab (v2) ---
export interface IEconomicActivityCorporateForm {
  id?: number | null
  economic_activity: NullableNumberString
  economic_activity_code: string | null
  economic_activity_desc: string | null
  status: NullableNumberString
  is_ciiu_primary: boolean
}

export interface IBankAccountCorporateForm {
  id?: number | null
  is_breb_key: boolean
  email: string | null
  identification_number: string | null
  mobile_number: string | null
  breb_key: string | null
  breb_keyword: string | null
  bank: NullableNumberString
  bank_name: string | null
  account_type: NullableNumberString
  bank_account_number: string | null
  branch: NullableNumberString
  branch_name: string | null
  status: NullableNumberString
  is_bank_account_primary: boolean
}

export interface IIndirectCorporateForm extends IBaseCorporateForm {
  economic_activities: IEconomicActivityCorporateForm[]
  bank_accounts: IBankAccountCorporateForm[]
}

// --- Corporate Tab Request (v2) ---
export interface IEconomicActivityCorporateRequest {
  ciiu_id: string
  is_main: boolean
  status_id: number
}

export interface IBankAccountRegularRequest {
  bank_id: number
  bank_branch_id: number
  account_type: string
  account_number: string
  is_main: boolean
}

export interface IBankAccountBREBRequest {
  account_type: 'bre_b'
  email_bre_b: string
  document_bre_b: string
  mobile_bre_b: string
  key_bre_b: string
  password_bre_b: string
}

export type IBankAccountCorporateRequest =
  | IBankAccountRegularRequest
  | IBankAccountBREBRequest

export interface IIndirectCorporateRequest {
  is_registered_in_national_emission_registery: boolean
  total_operational_income: string
  total_non_operational_income: string
  total_expenses: string
  other_non_operational_income_concept: string
  assets: string
  liabilities: string
  cutoff_date: string
  funding_source: string
  describe_funding_source: string
  economic_activities: IEconomicActivityCorporateRequest[]
  bank_accounts: IBankAccountCorporateRequest[]
}

// --- Corporate Tab Response (v2) ---
export interface IIndirectEconomicActivityCorporateResponse {
  id?: number | null
  ciiu_id?: number | string | null
  ciiu?: {
    id?: number | null
    code?: string | null
    description?: string | null
  } | null
  activity_description?: string | null
  city_id?: number | null
  city?: string | null
  is_main?: boolean | null
  status?: {
    id: number | null
    name: string | null
  }
}

export interface IIndirectBankAccountCorporateResponse {
  id?: number | null
  bank_id?: number | null
  bank?: string | null
  bank_branch_id?: number | null
  bank_branch?: string | null
  account_type?: string | null
  account_number?: string | null
  account_holder?: string | null
  is_main?: boolean | null
  has_active_payments?: boolean | null
  email_bre_b?: string | null
  document_bre_b?: string | null
  mobile_bre_b?: string | null
  key_bre_b?: string | null
  password_bre_b?: string | null
  status?: {
    id: number | null
    name: string | null
  }
}

export interface IIndirectCorporateResponse {
  id?: number | null
  declares_income?: boolean | null
  total_operational_income?: string | null
  total_non_operational_income?: string | null
  total_expenses?: string | null
  other_income_concept?: string | null
  other_non_operational_income_concept?: string | null
  assets?: string | null
  liabilities?: string | null
  cutoff_date?: string | null
  funding_source?: string | null
  describe_funding_source?: string | null
  is_registered_in_national_emission_registery?: boolean | null
  economic_activities?: IIndirectEconomicActivityCorporateResponse[] | null
  bank_accounts?: IIndirectBankAccountCorporateResponse[] | null
}

// --- Tributary Tab (v2) ---
export interface IClientLegalPersonIndirectTributaryForm
  extends IBaseTributaryForm {
  tax_obligations?: number | null
  fiscal_responsibility?: string | null
  vat_responsibility?: boolean
  vat_responsible?: boolean
  settlement_formulas?: ISettlementFormula[]
}

export interface IClientLegalPersonIndirectTributaryRequest
  extends IClientLegalPersonIndirectTributaryForm {}

export interface IClientLegalPersonIndirectTributaryResponse
  extends IClientLegalPersonIndirectTributaryForm {
  country: {
    id: number | null
  }
  branch_country: {
    id: number | null
  }
}

// --- Investor Tab (v2) ---
export interface IInvestorForm {
  investor_rating: string | null
  quantitative_risk_rating: string | null
  qualitative_risk_rating: string | null
}

export interface IClientInversorRequest extends IInvestorForm {}

// --- Document Tab (v2) ---
export interface IDocumentIndirectForm {
  documents: IClientsDocuments[]
}

// --- Manager Tab Request (v2) ---
export interface IManagerIndirectRequest
  extends Omit<Partial<IManagerBasicDataForm>, 'address'>,
    Partial<IPepInfo> {
  id?: number
  person_type?: string | null
  third_party_category?: string | null
  contact_info: {
    email: string | null
    phone: string | null
  }
  address: {
    address: string | null
    country_id: number | null
    department_id: number | null
    city_id: number | null
  }
}

export interface IManagerIndirectResponse extends IManagerIndirectRequest {
  document_type: {
    id: number | null
  }
  pep_info?: IPepInfo
}

// --- Legal person Request (v2) ---
export interface IClientLegalPersonIndirectRequest
  extends Omit<
    IClientLegalPersonBaseRequest,
    'tax_info' | 'financial_info' | 'legal_representatives' | 'board_members'
  > {
  validator_digit?: string | null
  mobile?: string | null
  vat_responsibility?: string | null
  fiscal_responsibility?: string | null
  legal_representatives: ILegalRepresentationIndirectRequest[]
  tax_info: IIndirectTaxInfo
  financial_info: IIndirectCorporateRequest
  board_members: IManagerIndirectRequest
  shareholders: IBaseShareholdersRequest[]
}

// export interface IClientLegalPersonIndirectResponse
//   extends ILegalPersonApiResponse {}
