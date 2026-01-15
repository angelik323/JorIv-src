import { IResource } from '../global'

export interface IThirdPartiesTable {
  id: number
  is_main: boolean
  ciiu_id: number | null
  ciiu_code: string | null
  ciiu_name: string | null
  city_code: string | null
  city_name: string | null
  city_id: number | null
  saved?: boolean
}

export interface IThirdPartyResource extends IResource {
  id: number
  document: string
  commercial_registration?: string
  business_code: string
  natural_person?: INaturalPerson
  legal_person?: ILegalPerson
  document_type?: IDocumentType
  addresses?: IAddresses[]
  fundingSourceLegalPerson?: IFundingSourceLegalPerson
  fundingSourceNaturalPerson?: IFundingSourceNaturalPerson
  contacts?: IContact[]
}

export interface IDocumentType {
  id: number
  name: string
  abbreviation: string
}

export interface IFundingSourceLegalPerson {
  id: number
  third_party_id: number
  funding_source: string
}

export interface IFundingSourceNaturalPerson {
  id: number
  third_party_id: number
  contractual_relationship: string
  other_source_of_goods: string
  source_of_goods: string
}

export interface IAddresses {
  id?: number | null
  third_party_id?: number | null
  address?: string
  is_main?: boolean
  city_id?: number | null
}

export interface INaturalPerson {
  full_name: string
  id: number
  last_name: string
  middle_name: string
  name: string
  second_last_name: string
  third_party_id: number
}

export interface ILegalPerson {
  business_name: string
  id: number
  third_party_id: string
  trade_name?: string
}

export interface IContact {
  id: number
  third_party_id: number
  contact_type: string
  is_main: boolean
  contact_value: string
}
