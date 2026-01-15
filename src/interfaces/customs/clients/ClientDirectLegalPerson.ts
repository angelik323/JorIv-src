import {
  IClientLegalPersonBaseResponse,
  IBaseLegalRepresentationResponse,
  ILegalPerson,
  IBaseLegalRepresentationItem,
  IBaseCorporateForm,
  IBaseTributaryForm,
} from './Clients'

type NullableNumberString = number | string | null

export interface IDirectBankInfo {
  bank_holder_id: number | null
  bank_account_number_holder: string | null
  account_type_holder: string | null
}

// --- Legal person Response (v2) ---
export interface IClientLegalPersonDirectResponse
  extends IClientLegalPersonBaseResponse {}

// --- Legal representation tab (v2) ---
export interface ILegalRepresentationDirectResponse
  extends IBaseLegalRepresentationResponse {
  representative_type_id?: number | null
  document_type_id?: number | null
  document_type?: string | null
}

export interface ILegalRepresentationDirectRequest
  extends Omit<
    IBaseLegalRepresentationItem,
    'address' | 'country_id' | 'department_id' | 'city_id' | 'postal_code'
  > {}

// --- Corporate Tab (v2) ---
export interface IDirectCorporateForm extends IBaseCorporateForm {
  company_classification: string | null
  ciiu_code: NullableNumberString
  bank: NullableNumberString
  holder_account_type: string | null
  holder_account_number: string | null
}

export interface IDirectCorporateRequest {
  is_registered_in_national_emission_registery: boolean
  total_operational_income: string
  total_non_operational_income: string
  total_expenses: string
  other_non_operational_income_concept: string
  assets: string
  liabilities: string
  cutoff_date: string
  bank_holder_id: number
  account_type_holder: string
  bank_account_number_holder: string
  funding_source: string
  describe_funding_source: string
}

// --- Tributary Tab (v2) ---
export interface IClientLegalPersonDirectTributaryForm
  extends IBaseTributaryForm {}
export interface IClientDirectBasicForm {
  creation_date: string
  type_client: string | null
  request_type: string | null
  document_type: string | number | null
  document_number: string | null
  name: string | null
  created_by: string | null
  updated_date: string | null
  updated_by: string | null

  nature_third_party: string | number | null
  constitution_country: string | number | null
  date_incorporation: string | null

  country: string | number | null
  department: string | number | null
  city: string | number | null
  address: string | null
  email: string | null
  mobile: string | null
  phone: string | null
  sending_correspondence: string | null
  check_digit: string | null
}

export interface IClientBasicRequestDirect {
  document_type_id: number | null
  document: string | null
  request_type: string | null

  email: string | null
  mobile: string | null
  address: string | null
  address_type?: string | null
  country_id: number | null
  department_id: number | null
  city_id: number | null
  sending_correspondence: string | null

  legal_person: ILegalPerson

  ciiu_id: string | null
}
