import { IClientsContacts } from '../Clients'

export interface IBankingEntitiesList {
  id: number
  description: string
  type: string
  accounting_account?: string | null
  status: IStatus
  code?: string
  bank_code: string
  nit: INit
  has_movements?: boolean
  created_at: string
  created_by: string
  updated_at?: string | null
  updated_by?: string | null
}

export interface IStatus {
  id: number
  name: string
}

export interface INit {
  id: number
  nit: string
}

export interface IResourceThirdParty {
  id: number
  value?: number
  label?: string
  business_name: string
  third_party_id: number
  third_party: {
    id: number
    document: string
    document_type_id: number
    document_type: {
      id: number
      name: string
    }
  }
}

export interface IResponseData {
  third_party_nit: IResourceThirdParty[]
}

export interface IBankingEntitiesItem {
  label: string
  value: number
}

export interface IBankEntity {
  description: string
  nit: number | null
  bank_code: string
  status: number
  code: string
  full_name?: string | null
  contacts?: IClientsContacts[]
  job_title?: string | null
  area?: string | null
  landline_phone?: number | null
  created_at?: string | null
  created_by?: string | null
  updated_at?: string | null
  updated_by?: string | null
}
