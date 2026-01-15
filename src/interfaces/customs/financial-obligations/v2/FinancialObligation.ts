// ============ Types ============

export type PaymentPlanItemStatus = 'PENDIENTE' | 'PAGADA' | 'EN_MORA'

// ============ Form Data Interfaces ============

export interface IFinancialObligationBasicData {
  business_trust_id: number | null
  business_trust_code: string | null
  business_trust_name: string | null
  obligation_number: string | null
  titular_id: number | null
  titular_name: string | null
  titular_nit: string | null
  bank_id: number | null
  bank_name: string | null
  credit_type_id: number | null
  amount: number | null
  interest_rate: number | null
  factor_id: number | null
  periodicity_id: number | null
  quotas: number | null
  payment_day: number | null
  alert_days: number | null
}

export interface IFinancialObligationCalculations {
  calculation_method_id: number | null
  calculation_base_id: number | null
  quota_type_id: number | null
  amortization_type_id: number | null
}

export interface IFinancialObligationPaymentPlan {
  start_date: string | null
  end_date: string | null
  initial_balance: number | null
  capital_quota: number | null
}

export interface IFinancialObligationFormV2
  extends IFinancialObligationBasicData,
    IFinancialObligationCalculations,
    IFinancialObligationPaymentPlan {
  documents?: IFinancialObligationDocument[]
}

// ============ Payment Plan Interfaces ============

export interface IFinancialObligationPaymentPlanItem {
  obligation_id: number
  number_quota: number
  initial_balance: string
  interest_quota: string
  capital_quota: string
  total_quota: string
  final_balance: string
  payment_date: string
  status_quota_id: number
  status_quota: string
  created_at: string
  updated_at: string
}

export interface IPaymentPlanCalculateRequest {
  amount: number
  interest_rate: number
  quotas: number
  factor_id: number
  periodicity_id: number
  calculation_method: string
  calculation_base: number
  quota_type: string
  amortization_type: string
  start_date: string
}

export interface IPaymentPlanCalculateQuota {
  number_quota: number
  payment_date: string
  capital: number
  interest: number
  quota: number
  balance: number
}

export interface IPaymentPlanCalculateBasicData {
  amount: number
  interest_rate: number
  quotas: number
  periodicity_id: number
  calculation_method: string
  calculation_base: number
  quota_type: string
  amortization_type: string
  start_date: string
}

export interface IPaymentPlanCalculateResponse {
  success: boolean
  basic_data: IPaymentPlanCalculateBasicData | null
  quotas: IPaymentPlanCalculateQuota[]
}

export interface IAttachmentUploadTempResponse {
  success: boolean
  attachments_cache_key: string | null
  files_count: number
  expires_at: string | null
}

// ============ Document Interface ============

export type DocumentUploadStatus = 'loading' | 'success' | 'error'

export interface IFinancialObligationDocument {
  id?: number
  document_type: string | null
  name: string | null
  upload_date: string | null
  s3_file_path?: string | null
  original_name?: string | null
  file?: File
  is_new: boolean
  to_delete: boolean
  upload_status?: DocumentUploadStatus
  is_saved?: boolean
}

// ============ API Interfaces ============

export interface IPaymentPlanConfiguration {
  calculation_method: string
  calculation_base: number
  quota_type: string
  amortization_type: string
  start_date: string
}

export interface IFinancialObligationCreateV2 {
  obligation_number: string
  business_trust_id: number
  business_trust_name: string
  business_trust_code: string
  titular_id: number
  titular_name: string
  titular_nit: string
  bank_id: number
  bank_name: string
  credit_type_id: number
  amount: number
  interest_rate: number
  factor_id: number
  periodicity_id: number
  quotas: number
  payment_day: number
  alert_days: number
  payment_plan_configuration: IPaymentPlanConfiguration
  attachments_cache_key?: string
}

export interface IFinancialObligationListItemV2 {
  id: number
  authorize_status: string | null
  business_trust: {
    id: number
    name: string
    code: string
  } | null
  obligation_number: string | null
  bank: {
    id: number
    name: string
  } | null
  credit_type: {
    id: number
    name: string
  } | null
  amount: string | null
  balance: string | null
  obligation_status: {
    id: number
    name: string
  } | null
}

export interface ISarlaftValidationResponse {
  success: boolean
  is_valid: boolean
  message: string | null
}

// ============ Edit/Detail Interfaces ============

export interface IFinancialObligationAuditInfo {
  status_id: number | null
  status_name: string | null
  created_at: string | null
  created_by: string | null
  updated_at: string | null
  updated_by: string | null
}

export interface IFinancialObligationAuthorizationObservation {
  id: number
  observation: string | null
  user_name: string | null
  decision_date: string | null
  status_name: string | null
}

export interface IFinancialObligationDetailV2 {
  basic_data: {
    id: number
    authorize_status: string | null
    business_trust: {
      id: number
      name: string
      code: string
    } | null
    obligation_number: string | null
    obligation_status: {
      id: number
      name: string
    } | null
    titular: {
      id: number
      name: string
      nit: number
    } | null
    bank: {
      id: number
      description: string
    } | null
    credit_type: {
      id: number
      name: string
    } | null
    amount: string | null
    balance: string | null
    interest_rate: string | null
    factor: {
      id: number
      code: string
      name: string
    } | null
    periodicity: {
      id: number
      name: string
    } | null
    quotas: number | null
    payment_day: number | null
    alert_days: number | null
    payment_plan_configuration?: IPaymentPlanConfiguration | null
    creation: {
      created_at: string | null
      created_by:
        | string
        | {
            id?: number
            name?: string
            last_name?: string
            document?: string
            profile_type?: string
            email?: string
          }
        | null
    } | null
  }
  payment_plan: {
    quotas: IFinancialObligationPaymentPlanItem[]
  }
  attachments: IFinancialObligationDocument[]
  authorizations: {
    logs: IFinancialObligationAuthorizationObservation[]
  }
}

export interface IFinancialObligationUpdateV2 {
  obligation_number: string
  business_trust_id: number
  business_trust_name: string
  business_trust_code: string
  titular_id: number
  titular_name: string
  titular_nit: string
  bank_id: number
  credit_type_id: number
  amount: number
  interest_rate: number
  factor_id: number
  periodicity_id: number
  quotas: number
  payment_day: number
  alert_days: number
  payment_plan_configuration: IPaymentPlanConfiguration
}
