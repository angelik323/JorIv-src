export interface IThirdPartyBillingList {
  id: number
  code: number
  description: string
  status_id: number
  created_by: number
  updated_by: number | null
  created_at: string
  updated_at: string
}

export interface IThirdPartyBillingResponse {
  id: number
  third_party_id: number | null
  third_party_name: string | null
  created_date: string | null
  address: IAddress[]
  email: IEmail[]
  phones: IPhone[]
}

export interface IThirdPartyBillingForm {
  third_party_id: number | null
  third_party_name?: string | null
  created_date: string | null
  emails: IEmail[]
  phones: IPhone[]
  addresses: IAddress[]
}

export interface IThirdPartyBillingChangeStatus {
  status_id: number | null
}

export interface IEmail {
  id: number
  email_address: string | null
  is_main: boolean
}

interface IPhone {
  id?: number | null
  phone_type?: string | null
  phone_number?: string | null
  is_main?: boolean
}

export interface IAddress {
  id?: number | null
  country_id?: number | null
  department_id?: number | null
  city_id?: number | null
  address?: string | null
  is_main?: boolean
  phone?: string | null
  phone_extra?: string | null
}
