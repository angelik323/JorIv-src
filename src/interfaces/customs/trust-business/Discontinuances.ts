import { IDocumentRealStateProject } from './RealStateProject'

export interface IDiscontinuancesList {
  id: number
  business_trust_name: string
  project_name: string
  project_stage: number
  property_nomenclature: string
  registration_date: string
  withdrawal_status: IStatus
  observations: string
  status_id: number
}

export interface IDiscontinuances {
  id?: number
  business_trust_id: number | null
  business_trust_name?: string
  real_estate_project_id: number | null
  real_estate_project_name?: string
  project_stage_id: number | null
  project_stage_name?: string
  business_trust_property_id: number | null
  business_trust_property_name?: string
  status_id?: number | null
  date_register?: string
  date_vinculation?: string
  property_value?: string | number
  total_paid?: string | number
  balance_due?: string | number
  order_number?: string | number
  refund_amount: string | null
  retention_amount: number | null
  penalty_amount: number | null
  net_refund_amount: number | null
  refund_method?: IRefundMethod
  refund_method_id: number | null
  refund_method_name?: string | null
  bank_id: number | null
  bank_name?: string
  bank_account_number: string | null
  bank_account_number_name?: string
  trust_account_number: string | null
  support_bank_account?: ISupport | null
  support_id_copy?: ISupport | null
  support_withdrawal_instruction?: ISupport | null
  documents?: IDocumentRealStateProject[]
  observations?: string
}

interface IRefundMethod {
  id: number
  description: string
  type_mean_of_payments: string
}
interface ISupport {
  id: number
  is_validated: boolean
}

export interface IDiscontinuancesExtraDataResponse {
  owner: IDiscontinuancesExtraDataOwner
  payment_plans: IDiscontinuancesExtraDataPaymentPlan[]
}

export interface IDiscontinuancesExtraDataOwner {
  id: number
  status_id: number
  status?: IStatus
  document_type_id: number
  document_type?: IDocumentType
  email: string
  phone: string
  address: string
  document: string
  name: string
  type: string
}

interface IDocumentType {
  id: number
  name: string
  abbreviation: string
}

interface IStatus {
  id: number
  name: string
}

export interface IDiscontinuancesExtraDataPaymentPlan {
  id?: number
  installment_number: string
  initial_balance: string
  total_value: string
  late_interest: string
  capital_fee: string
  final_balance: string
  payment_date: string
  status_id: number
}

// respose

export interface IDiscontinuancesResponse {
  id: number
  business_trust: IBusinessTrust
  real_estate_project: IBusinessTrust
  property_nomenclature: IPropertyNomenclature
  registration_date: string
  status_id: number
  withdrawal_status: IStatus
  date_vinculation: string
  property_value: number
  total_paid: number
  balance_due: number
  order_number: string
  payment_plans: IDiscontinuancesExtraDataPaymentPlan[]
  main_owner: IMainOwner
  order_of_payment: IOrderOfPayment
  attachments_table: IAttachmentTableDiscontinuances[]
  project_stage: IProjectStage
  observations?: string
}

export interface IAttachmentTableDiscontinuances {
  id: number
  item: string
  name: string
  total_records: number
  upload_status: boolean
  upload_date: Date
  actions: IActions
  original_name_file?: string
}

interface IActions {
  download_url: string
}

interface IBusinessTrust {
  id: number
  name: string
}

interface IMainOwner {
  id: number
  status_id: number
  status: IBusinessTrust
  document_type_id: number
  document_type: IDocumentType
  email: string
  phone: string
  address: string
  document: string
  name: string
  type: string
}

interface IOrderOfPayment {
  total_paid: string
  refund_amount: string
  retention_amount: string
  penalty_amount: string
  net_refund_amount: string
  refund_method?: IRefundMethod
  bank: IBank
  bank_account_number: string
  trust_account_number: null
}

interface IBank {
  id: number
  code: string
  description: string
}

interface IPropertyNomenclature {
  id: number
  nomenclature: string
}

interface IProjectStage {
  id: number
  stage_number: number
  observations: string
  associated_financing: string
  development_type: number
}
