import { IUploadedFile } from '@/interfaces/global'

export interface IAutomaticDebitSettingsList {
  id: number
  business_trust_id: number
  business_trust_code: string
  business_trust_name: string
  automatic_debit: boolean
  collective_investment_fund_id: number | null
  investment_plan_id: number | null
  account_bank_id: number | null
  account_id: number | null
  balance: number | null
  is_active: boolean
  created_by: number
  created_at: string
  updated_at: string

  collective_investment_fund_data: {
    id: number
    fund_code: string
    fund_name: string
  } | null

  investment_plan_data: {
    id: number
    code: string
    collective_investment_fund_id: number
  } | null

  bank_data: {
    id: number
    description: string
    bank_code: string
  } | null

  account_bank_data: {
    id: number
    bank_id: number
    account_name: string
    account_number: string
    operation_type: string
    account_type: string
  } | null

  source: {
    value: string
    label: string
  }
}

export interface IAutomaticDebitSettingsForm {
  business_trust_id: number | null
  automatic_debit: boolean | string | number | null
  source: string | null
  document: IUploadedFile | null
  business_code_snapshot: string | null
  business_name_snapshot: string | null

  collective_investment_fund_id: number | null
  investment_plan_id: number | null
  account_bank_id: number | null
  account_id: number | null

  updated_at?: string | null
  is_active?: string | number | null
  list_documents?: IDocument[]

  account_bank_name?: string | null
  account_name?: string | null

  fund_name?: string | null
  plans_name?: string | null

  is_new_document?: boolean
}

export interface IDocument {
  id: number | string
  file?: IUploadedFile
  description: string
  upload_date: string
  temporal_path?: string
  is_new_document?: boolean
  original_name?: string
}

export interface IAutomaticDebitSettingsResponse {
  id: number
  automatic_debit: boolean
  updated_at: string
  business_trust_id: number
  collective_investment_fund_id: number | null
  investment_plan_id: number | null
  account_bank_id: null | number
  account_id: null | number
  source: string
  business_code_snapshot: string
  business_name_snapshot: string
  is_active: boolean

  collective_investment_fund_data: {
    id: number
    fund_code: string
    fund_name: string
  } | null

  investment_plan_data: {
    id: number
    code: string
    collective_investment_fund_id: number
  } | null

  bank_data: {
    id: number
    description: string
    bank_code: string
  }

  account_bank_data: {
    id: number
    bank_id: number
    account_name: string
    account_number: string
    operation_type: string
    account_type: string
  }

  account_balance: null | number

  plan_balance: {
    plan_balance: null | number
  }

  document_data: {
    id: number
    original_name: string
    random_name: string
    path: string
    temporal_path: string
    extension: string
    size: number
    mime_type: string
    created_by: null | number
    updated_by: null | number
    created_at: string
  }
}
