import { IFileField } from '@/interfaces/global'
import { IUploadedDocumentFile } from './TrustBusinesses'

export interface IBalancePointList {
  id: number
  business_name: string
  project_name: string
  stage: number
  registration_date: string
  business_status: string
  project_status: string
  equilibrium_status: string
}

export interface IBalancePointBasicDataForm {
  business_trust_id: number | null
  business_status: string | null
  project_id: number | null
  project_status: string | null
  registration_date: string | null
  break_even_status: string | null
  document_code_id: number | null
  characteristics: IBalancePointCharacteristic[]
  documents: IBalancePointDocumentRow[]
}

export interface IBalancePointMandateForm {
  stage_id: number | null
  stage_name: string
  general_mandate_name: string | null
  general_mandate_id: number | null
  mandates: IBalancePointStageMandateList[]
  total_general_order: number
}

export interface IBalancePointCreatePayload {
  business_trust_id: number | null
  business_trust_real_estate_project_stage_id: number
  business_trust_general_order_id: number
  total_general_order: number
  characteristics: IBalancePointCharacteristic[]
  mandates: IBalancePointMandate[]
}

interface IBalancePointCharacteristic {
  characteristic_document_detail_id: number
  information_detail: string
}

interface IBalancePointMandate {
  fiduciary_mandate_id: number | string
}

export interface IBalancePointCharacteristicsDetails {
  id: number
  order: number
  business_trust_document_structure: {
    id: number
    description: string
    characteristic_code: string
    type_data: string
    is_obligatory: boolean
    alert: boolean
  }
}

export interface IBalancePointStageMandateList {
  id: string
  name: string
  fund_name: string
  fund_code: string
  total_investment_balance: number
  yields: number
  net_with_tax: number
  net_without_tax: number
}

export interface IBalancePointResponse {
  id: number
  status: string
  total_general_order: number
  business_trust: IBalancePointBusinessTrust
  project: IBalancePointProject
  document: IBalancePointDocument
  characteristic_document: IBalancePointCharacteristicDocument[]
  stage: IBalancePointStage
  mandate_details: IBalancePointStageMandateList[]
  general_order: IBalancePointGeneralOrder
  attachments: IBalancePointAttachment[]
  observation: string | null
  registration_date: string
}

interface IBalancePointBusinessTrust {
  id: number
  name: string
  status: string
}

interface IBalancePointProject {
  id: number
  name: string
  status: string
}

interface IBalancePointDocument {
  id: number
  document_code: string
  document_description: string
}

interface IBalancePointCharacteristicDocument {
  id: number
  characteristic_type: string
  characteristic_code: string
  characteristic_detail_id: number
  information_detail: string
}

interface IBalancePointStage {
  id: number
  observations: string
  stage_number: number
}

interface IBalancePointGeneralOrder {
  id: number
  name: string
}

export interface IAuthorizationForm {
  observation: string | null
}

export interface IBalancePointDocumentRow {
  id: string | number
  name: string
  type?: string
  filePath?: string
  isNew: boolean
  raw?: IUploadedDocumentFile | IFileField
  status_id?: number
  upload_date?: string | null
  size?: number
}

interface IBalancePointAttachment {
  id: number
  original_name: string
  is_validated: boolean
  created_at: string
  s3_file_path: string
}
