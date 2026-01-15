export interface IThirdPartyBillingListV2 {
  id: number
  business_code_snapshot: string
  business_name_snapshot: string
  third_party_id: number
  created_date: string
  third_party_email: string
  third_party_address: string
  snapshotted_at: string
  created_by: number
  updated_by: number
  comission_settlement_statuses_id: number
  third_party_document_type_id: number
  third_party_document_type: string
  third_party_document: string
  third_party_name: string
  third_party_phone: string
  comission_settlement_statuses: {
    id: number
    name: string
  }
}

export interface IThirdPartyBillingResponseV2 {
  id: number
  business_trust_id: number
  business_code_snapshot: string
  business_name_snapshot: string

  third_party_address: string
  third_party_document: string
  third_party_document_type: string
  third_party_document_type_id: number
  third_party_email: string
  third_party_id: number
  third_party_name: string
  third_party_phone: string

  created_date: string
  address: IAddressV2[]
  email: IEmailV2[]
  phones: IPhoneV2[]
  comission_settlement_statuses: {
    id: number
    name: string
  }
}

export interface IThirdPartyBillingFormV2 {
  business_code_snapshot: string | null
  business_trust_name?: string | null
  third_party_id: number | null
  third_party_name?: string | null
  created_date: string | null
  emails: IEmailV2[]
  phones: IPhoneV2[]
  addresses: IAddressV2[]

  status?: string | null
}

export interface IEmailV2 {
  id: number
  email_address: string | null
  is_main: boolean
}

export interface IPhoneV2 {
  id?: number | null
  phone_type?: string | null
  phone_number?: string | null
  is_main?: boolean
}

export interface IAddressV2 {
  id?: number | null
  country_id?: number | null
  department_id?: number | null
  city_id?: number | null
  address?: string | null
  is_main?: boolean
  phone?: string | null
  phone_extra?: string | null
  postal_code?: string | null
  address_type?: string | null
  country?: {
    id: number
    name: string
  }
  city?: {
    id: number
    name: string
  }
  department?: {
    id: number
    name: string
  }
}
