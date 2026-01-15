import { IDocumentRealStateProject } from './RealStateProject'

// list
export interface ISaleRealEstateList {
  id: number
  real_estate_project_id: number
  real_estate_project_nomenclature_id: number
  real_estate_project_stage_id: number
  status_id: number
  fiduciary_mandate: IFiduciaryMandate
  real_estate_project: IRealEstateProject
  real_estate_project_nomenclature: IRealEstateProjectNomenclature
  real_estate_project_stage: IRealEstateProjectStage
  status: IStatus
  buyers: IBuyerResponse[]
  financial_obligation: string
}

export interface IBuyerResponse {
  id: number
  third_party_id: number
  business_trust_property_sale_id: number
  created_at: Date
  updated_at: Date
  deleted_at: null
  name: string
  third_party: IBuyerThirdParty
}

export interface IBuyerThirdParty {
  id: number
  status_id: number
  document_type_id: number
  document: string
  legal_person: ILegalPerson
}

interface ILegalPerson {
  id: number
  third_party_id: number
  business_name: string
  trade_name: null
  country_id: number
  applicant_type: null
  created_at: string
  updated_at: string
  deleted_at: null
  acronym: string
  entity_type_id: null
  constitution_date: null
  nature: null
  entity_type: null
  has_board_of_directors_or_advisory_board: null
  classification_company: null
  sending_correspondence: null
  department_id: null
  city_id: null
  third_party: ILegalPersonThirdParty
}

interface ILegalPersonThirdParty {
  id: number
  created_by: number
  document_type_id: number
  status_id: number
  third_party_category: string
  document: string
  commercial_registration: null
  validator_digit: string
  created_at: string
  updated_at: string
  observations: null
  updated_by: null
  is_customer: boolean
  third_party_type: string
  birth_date: null
  issue_date: null
  fiscal_responsibility: string
  vat_responsibility: string
  identity_type_id: number
}

interface IFiduciaryMandate {
  id: number
  fiduciary_mandate_value: string
}

interface IRealEstateProject {
  id: number
  project_name: string
}

interface IRealEstateProjectNomenclature {
  id: number
  nomenclature: string
  area: number
  value: number
}

interface IRealEstateProjectStage {
  id: number
  stage_number: number
  development_type: string
  start_end: Date
}

interface IStatus {
  id: number
  status: string
}

// create
export interface ISaleRealEstate {
  id?: number
  creation_date?: string
  status_id: number | null
  buyers?: IBuyer[]
  real_estate_project_id: number | null
  real_estate_project_name?: string
  real_estate_project_stage_id: number | null
  real_estate_project_stage_name?: string
  real_estate_project_nomenclature_id: number | null
  real_estate_project_nomenclature_name?: string
  type?: string
  area?: string
  value?: string
  date?: string
  has_extraordinary_paymentes: boolean | null
  has_extraordinary_payment?: boolean | null
  fiduciary_mandate_id: number | null
  fiduciary_mandate?: number | null
  fiduciary_mandate_name?: string
  extraordinaryPayment?: IExtraordinaryPaymentValue[]
  documents?: IDocumentRealStateProject[]
  financial_obligation?: IFinancialObligation
  payment_plan_list?: null | IPaymentList[]
}

export interface IPaymentList {
  id: null | string | number
  final_balance: null | string | number
  initial_balance: null | string | number
  installment_number: null | string | number
  late_interest: null | string | number
  payment_date: null | string | number
  capital_fee: null | string | number
  status: null | string | number
  total_value: null | string | number
}

interface IBuyer {
  buyer_id: number | string
}

export interface ITableColumnBuyers {
  buyer_id: number
  name: string
  email: string
  phone: string
  address: string
  document?: string
  document_type?: string
}

export interface IExtraordinaryPaymentValue {
  id?: number
  extraordinary_payment_value: string | null
  concept: string
}

// response
export interface ISaleRealEstateResponse {
  id: number
  created_at: string
  status: IStatus
  status_id: number
  buyers: Buyer[]
  project_name: string
  project_id: number
  project_stage: number
  project_stage_id: number
  type_property: number
  type_property_text: string
  property_detail: PropertyDetail
  payment_plan: PaymentPlan
  payment_plan_list: PaymentPlanList[]
  has_extraordinary_payment: boolean
  extraordinary_payments: ExtraordinaryPayment[]
  attachments: IAttachments
}

interface IAttachments {
  sale_promise: IAttachmentDetail[]
  fiduciary_attachment: IAttachmentDetail[]
  preapproval_credit_letter: IAttachmentDetail[]
  assignment_letter: IAttachmentDetail[]
  adhesion_contract: IAttachmentDetail[]
}
interface IAttachmentDetail {
  id: number
  original_name: string
  is_validated: boolean
  created_at: Date
  s3_file_path: string
  document_type: string
  attachable_id: number
  attachable_type: string
}

interface Buyer {
  id: number
  third_party_id: number
  name: string
  third_party: ThirdParty
}

interface ThirdParty {
  id: number
  document_number: string
  document_type: string
  email: null
}

interface ExtraordinaryPayment {
  id: number
  concept: string
  amount: string
}

interface PaymentPlan {
  fiduciary_mandate_id?: number
  fiduciary_mandate: string
  financial_obligation?: IFinancialObligation
  financed_value: string
  deadlines: string
}

export interface IFinancialObligation {
  id: number | null
  obligation_number: string | null
  business_trust_id: number | null
  amount: string | null
  quotas: number | null
  interest_rate: string | null
  periodicity_type: string | null
}

export interface PaymentPlanList {
  id: null
  installment_number: null
  initial_balance: null
  total_value: null
  late_interest: null
  capital_fee: null
  final_balance: null
  payment_date: null
  status: string
}

interface PropertyDetail {
  id: number
  nomenclature: string
  area: string
  value: string
  start_end: string
}
