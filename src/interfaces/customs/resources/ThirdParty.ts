import {
  IAddresses,
  IContact,
  IFundingSourceLegalPerson,
} from '../IThirdParties'
import { IGenericResource } from './Common'

export interface IThirdPartyResource {
  id: number
  legal_person: ILegalPerson
  natural_person: INaturalPerson
  document_type: IThirdPartiesTypeDocument
  document: string
}

export interface IThirdPartyBankAccounts {
  value: number | string
  label: string
  account_holder: string
  account_number: string
  account_type: string
  bank_branch_id: number
  bank_id: number
  created_at: string
  document_bre_b: string | number | null
  email_bre_b: string | number | null
  has_active_payments: true
  id: number
  is_main: true
  key_bre_b: string | number | null
  mobile_bre_b: string | number | null
  password_bre_b: string | number | null
  status_id: number
  third_party_id: number
  updated_at: string
}

export interface IThirdPartyResourceGeneric extends IGenericResource {
  id?: number
  document_type?: IThirdPartiesTypeDocument
  document?: string | number | null
  addresses?: IAddresses[]
  contacts?: IContact[]
  bank_accounts?: IThirdPartyBankAccounts[]
  legal_person?: ILegalPerson
  natural_person?: INaturalPerson
  fundingSourceLegalPerson?: IFundingSourceLegalPerson
  financial_info?: {
    id?: number
    third_party_id?: number | null
    total_operational_income?: string
    total_non_operational_income?: string
    total_expenses?: string
    other_income_concept?: string
    other_non_operational_income_concept?: string
    assets?: string
    liabilities?: string
    cutoff_date?: string
    bank_holder_id?: number | null
    bank_account_number_holder?: string
    account_type_holder?: string
    account_type_beneficiary?: string
    beneficiary_name?: string
    beneficiary_document_number?: string
    created_at?: string
    updated_at?: string
    deleted_at?: string
    bank_account_number_beneficiary?: string
    bank_beneficiary_id?: string
    declares_income?: boolean
    funding_source?: string
    address?: string
    is_registered_in_national_emission_registery?: boolean
    describe_funding_source?: string
    support_document_numbering_issuer_delegate_id?: number | null
  }
  estate?: {
    id?: number
    resource_to_deliver?: string
    estate_identification?: string
    total_value_to_delivered?: string
    is_contributor_different_trustor?: boolean
    source_of_goods?: string
    other_source_of_goods?: string
    contractual_relationship?: string
    third_party_id?: number | null
    created_at?: string
    updated_at?: string
  }
  economic_activities?: [
    {
      id: number
      third_party_id: number
      activity_description: string
      is_main: boolean
      created_at: string
      updated_at: string
      ciiu_id: number
      city_id: number
      city?: {
        id: number
        name: string
        code: string
        department_id: number
      }
    }
  ]
  support_document_numbering_issuer_delegate_id?: number | null
  third_party_category?: string
}

export interface IThirdPartiesTypeDocument {
  id: number
  name: string
  abbreviation: string
}

export interface ILegalPerson {
  id: number
  third_party_id: number
  business_name: string
  trade_name: string | null
  country_id: number | null
  created_at: string
  updated_at: string
  entity_type_id: number | null
  constitution_date: string
  nature: string
  classification_company: string
  sending_correspondence: string
  department_id: number | null
  city_id: number | null
}

export interface INaturalPerson {
  id: number
  name: string
  middle_name: string | null
  last_name: string
  second_last_name: string | null
  birth_date: string
  issue_date: string
  third_party_id: number
  created_at: string
  updated_at: string
  occupation_id: number
  sending_correspondence: string
  birth_country_id: number | null
  document_issuance_country_id: number | null
  full_name: string
}
