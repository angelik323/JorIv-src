export interface IGuaranteesResponse {
  id?: number
  guarantee_number: number
  registration_date: string
  guarantee_type: string
  specification: string
  description: string
  guaranteed_value: string
  linkage_type: string
  expiration_date: string
  registration_status: IStatus | null
  guarantee_status: IStatus | null
  observations: string
  currency_id: number | null
  business_trust: { id: number; name?: string } | null
  secured_creditor: { id: number; name?: string; document?: string } | null
  currency?: ICurrency
  attachments?: IDocumentsResponse[]
  registration_status_message?: string
}

interface IDocumentsResponse {
  id: number
  original_name: string
  is_validated: boolean
  created_at: string
  s3_file_path: string
}

interface ICurrency {
  id?: number
  name?: string
  code?: string
  description?: string
}

interface IStatus {
  id?: number
  name?: string
}
export interface IGuaranteesList {
  id: number | null
  guarantee_type: string | null
  guarantee_number: number | null
  registration_date: string | null
  specification: string | null
  description: string | null
  guaranteed_value: string | null
  linkage_type: string | null
  expiration_date: string | null
  observations: string | null
  currency_id: string | null
  secured_creditor: number | null
  registration_status: string | null
  guarantee_status: string | null
  business_trust: string | null
}

export interface IGuaranteesForm {
  id?: number
  business_trust_id: number | null
  business_trust_name?: string | null
  guarantee_type: string | null
  guarantee_number: number | null
  registration_date: string | null
  specification: string | null
  description: string | null
  guaranteed_value: string | null
  linkage_type: string | null
  expiration_date: string | null
  observations: string | null
  currency_id: number | null
  currency_name?: string | null
  secured_creditor_id: number | null
  secured_creditor_name?: string | null
  registration_status: string | number | null
  guarantee_status_id: string | number | null
  attachments?: IAttachments[]
  documents?: IFileTableGuarantee[]
}

interface IAttachments {
  id: number | string
  original_name?: string
  is_validated: boolean
  created_at?: string
  s3_file_path?: string
}

export interface ITableDocumentsCreateGuarantee {
  id?: number
  is_new?: boolean
  name: string
  status_id?: number
  url: string
  size?: number
  created_at?: string
}

export interface IFileTableGuarantee {
  id?: number
  is_new?: boolean
  name: string
  status_id?: number
  url: string
  size?: number
  created_at?: string
  type?: string
}
