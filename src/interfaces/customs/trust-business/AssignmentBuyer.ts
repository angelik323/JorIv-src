export interface IAssignmentBuyerList {
  id: number
  business_trust_property_id: number
  status_id: number
  created_at: string
  updated_at: string
  business_trust_property: IBusinessTrustProperty
  status: IStatus
}

interface IBusinessTrustProperty {
  id: number
  nomenclature: string
  status_id: number
  business_trust_real_estate_project_stage_id: number
  total_paid: number
  balance_due: number
  order_number: string
  date_vinculation: string
  date_registration: string
  business_trust_real_estate_project_stages: IBusinessTrustRealEstateProjectStages
}

interface IBusinessTrustRealEstateProjectStages {
  id: number
  stage_number: number
  business_trust_real_estate_project_id: number
  business_trust_real_estate_project: IBusinessTrustRealEstateProject
}

interface IBusinessTrustRealEstateProject {
  id: number
  business_trust_id: number
  business_trust: IBusinessTrust
}

interface IBusinessTrust {
  id: number
  name: string
  business_code: string
  status_name: null
  status: null
}

export interface IAssignmentBuyer {
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
  payment_plans?: IAssignmentBuyersExtraDataPaymentPlan[]
  assignees?: IAssignmentBuyerAssignee[]
  cedents?: IAssignmentBuyerAssignee[]
  observations?: string
}
export interface IAssignmentBuyerCreate {
  id?: number
  business_trust_property_id: number
  assignees?: IAssignmentBuyerAssignee[]
  cedents: IAssignmentBuyerAssignee[]
}

interface IAssignmentBuyerAssignee {
  third_party_id: number
}

export interface IAssignmentBuyerExtraDataResponse {
  buyers: IAssignmentBuyerExtraDataOwner[]
  payment_plans: IAssignmentBuyersExtraDataPaymentPlan[]
}

export interface IAssignmentBuyersExtraDataPaymentPlan {
  id?: number
  installment_number: string
  initial_balance: string
  total_value: string
  late_interest: string
  capital_fee: string
  final_balance: string
  payment_date: string
  total_fee: string
  status?: IStatus
  status_id?: number
}

export interface IAssignmentBuyerExtraDataOwner {
  id: number
  third_party_id: number
  buyer: IBuyer
  name: string
  third_party: IThirdParty
}

export interface IAssignmentBuyerExtraDataOwnerList {
  id: number | null
  status_id: number
  status?: IStatus
  document_type_id: number
  document_type?: IDocumentType
  document_number?: string
  email: string
  phone: string
  address: string
  document: string
  name: string
  type: string
}

interface IBuyer {
  id: number
  status_id: number
  status: IStatus
  document_type_id: number
  document_type: IDocumentType
  email: string
  phone: string
  address: string
  document: string
  name: string
  type: string
}

interface IThirdParty {
  id: number
  document_number: string
  document_type: string
  email: string
}

interface IStatus {
  id: number
  name: string
}

interface IDocumentType {
  id: number
  name: string
  abbreviation: string
}

export interface IAssignmentBuyerResponse {
  id: number
  business_trust_property_id: number
  business_trust: IBusinessTrust
  project: IProject
  project_stage: IProjectStage
  property: IProperty
  status_id: IStatus
  cedents: IAssigneeCedents[]
  assignees: IAssigneeCedents[]
  final_transfer: IAssigneeCedents[]
  payment_plan: IPaymentPlanAssignmentBuyer[]
  created_at: string
  updated_at: string
  attachments?: IResponseDocuments[]
  observations?: string
}

interface IResponseDocuments {
  id: number
  name: string
  is_validated: boolean
  document_type: string
  path: string
  upload_url: string
}

export interface IAssigneeCedents {
  id: number
  status_id: number
  status: IProject
  document_type_id: number
  document_type: IDocumentType
  email: string
  phone: string
  address: string
  document: string
  name: string
  type: string
  is_cedent: boolean
}

interface IProject {
  id: number
  name: string
}

export interface IPaymentPlanAssignmentBuyer {
  id: number
  installment_number: string
  initial_balance: string
  total_value: string
  late_interest: string
  capital_fee: string
  final_balance: string
  payment_date: string
  total_fee: string
  status?: IStatus
  status_id?: number
}

interface IProjectStage {
  id: number
  stage_number: number
}

interface IProperty {
  id: number
  nomenclature: string
  type: string
}
