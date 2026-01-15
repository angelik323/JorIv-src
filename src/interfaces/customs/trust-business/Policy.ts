import { IFileTableRecordTransfer } from './RecordTransfers'

export interface IPolicyList {
  id: number
  business_trust: IBusinessTrust
  policy_number: string
  insurer: IInsurer
  insured_value: string
  record_status: IStatus
  policy_status?: IStatus
  is_authorized: boolean
  can_be_authorized: boolean
}

interface IBusinessTrust {
  id: number
  name: string
  code: string
}

interface IInsurer {
  id: number
  name: string
  document: string
  document_type: string
}

interface IStatus {
  id: number
  status: string
}
export interface IPolicyCreate {
  id?: number
  business_trust_id: number | null
  business_trust_name?: string | null
  policy_type: string | null
  policy_number: string | null
  insurer_id: number | null
  insurer_name?: string | null
  policy_holder_id: number | null
  policy_holder_name?: string | null
  beneficiary_id: number | null
  beneficiary_name?: string | null
  currency_id: number | null
  currency_name?: string | null
  insured_value: string | null
  issue_date: string | null
  effective_start_date: string | null
  effective_end_date: string | null
  premium?: string | null
  payment_method: string | null
  associated_contract: string | null
  associated_asset?: string | null
  observations: string | null
  documents?: IFileTableRecordTransfer[]
  attachments?: IAttachments[]
  record_status_id?: string | number | null
  policy_status_id?: string | number | null
  created_date?: string
}

interface IAttachments {
  id: number | string
  is_validated: boolean
}

export interface IPolicyResponse {
  id?: number
  policy_number: string | null
  policy_type: string | null
  insured_value: string | null
  premium: string | null
  issue_date: string | null
  effective_start_date: string | null
  effective_end_date: string | null
  payment_method: string | null
  payment_method_name: string | null
  associated_contract: string | null
  associated_asset: string | null
  observations: string | null
  currency_id: number | null
  business_trust: IBusinessTrust | null
  insurer_id: number | null
  policy_holder_id: number | null
  beneficiary_id: number | null
  record_status: IStatus | null
  policy_status?: IStatus | null
  is_expired: boolean | null
  is_expiring_soon: boolean | null
  days_until_expiry: number | null
  is_authorized: boolean | null
  can_be_authorized: boolean | null
  created_at?: string | null
  attachments?: IPolicyDocumentsResponse[]
  record_status_message?: string
  insurer?: IThirdResponse
  policy_holder?: IThirdResponse
  beneficiary?: IThirdResponse
  currency?: IThirdResponse
}

interface IPolicyDocumentsResponse {
  id: number
  original_name: string
  is_validated: boolean
  created_at: string
  s3_file_path: string
}

export interface IThirdResponse {
  id: number
  name: string
  code?: string
  description?: string
}
