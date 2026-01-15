export interface IRealStateProject {
  id?: number
  project_name: string | null
  project_type: string | null
  description: string | null
  num_stages: number | null
  status?: IStatus
  stages?: IRealStateProjectStages[]
  business_trust_id: number | null
  business_trust?: IBusinessTrust
  status_id?: number | null
}

interface IBusinessTrust {
  id: number
  name: string
  business_code: string
  start_date: string
  end_date: string
  status_id: number
  type: null
}

interface IStatus {
  id: number
  status: string
  comments?: string
}

export interface IRealStateProjectStages {
  id?: number
  stage_number?: number
  address: string | null
  land_area: number | null
  builder_id: number | null
  builder_name?: string
  technical_supervision_id: number | null
  technical_supervision_name?: string
  property_registration: string | null
  start_date: string | null
  start_end: string | null
  total_value: number | null
  financed_value: number | null
  associated_financing: string | null
  observations: string | null
  development_type: number | null
  block_nomenclature: string | null
  number_of_groups: number | null
  initial_group: number | string | null
  final_group: number | string | null
  total_units_stage: number | null
  property_area_m2: number | null
  property_value_calculation: number | string | null
  property_value: number | null
  department_id: number | null
  department_name?: string | null
  number_of_unit_per_group: number | null
  city_id: number | null
  city_name?: string | null
  policies_id: number | null
  policies_name?: string
  guarantee_id: number | null
  guarantees_name?: string
  financing_bank_id: number | null
  financing_bank_name?: string
  business_trust_project_id: number | null
  business_trust_id: number | null
  base_calculation_property: number | null
  amount_smmlv?: string | null
  year_base_smmlv?: string | null
  estimated_smmlv?: string | null
  nomenclatures?: INomenclatureRealStateProject[]
  documents?: IDocumentRealStateProject[]
  status_id?: number | null
}

export interface INomenclatureRealStateProject {
  id?: number
  index_number?: number
  nomenclature: string
  area: number
  value: number | null
  status_id: number
}
export interface IDocumentRealStateProject {
  file: File
  name: string
  required: boolean
  id: number | null | string
  type?: string
  DbType?: string
}

export interface IResponseRealStateProject {
  id: number
  project_name: string
  project_type: string
  description: string
  num_stages: number
  business_trust: IBusinessTrust
  status: IStatus
  stages: IStage[]
}

export interface IStage {
  id: number
  stage_number: number
  department: ICity
  city: ICity
  address: string
  land_area: number
  property_registration: string
  builder: IBuilder
  technical_supervision: IBuilder
  development_type: number
  number_of_groups: number
  block_nomenclature: string
  number_of_unit_per_group: number
  initial_group: string
  final_group: string
  total_units_stage: number
  property_area_m2: number
  property_value_calculation: string
  amount_smmlv: string
  year_base_smmlv: string
  estimated_smmlv: string
  property_value: number
  nomenclatures: INomenclature[]
  status: IStatus
  observations: string
  start_date: string
  start_end: string
  total_value: number
  financed_value: number
  associated_financing: string
  guarantee: IGuarantee
  policy: IPolicy
  financing_bank: IFinancingBank
  attachments: IAttachment
}

interface IAttachment {
  construction_license: IBuilderCredit[]
  alienation_permit: IBuilderCredit[]
  builder_credit: IBuilderCredit[]
}

interface IBuilderCredit {
  id: number
  original_name: string
  is_validated: boolean
  created_at: Date
  s3_file_path: string
  document_type: string
  attachable_id: number
  attachable_type: string
}

export interface IFinancingBank {
  id: number
  description: string
  type: string
}

interface IBuilder {
  id: number
  document_number: string
  document_type: number
  name: string
  type: string
  abbreviation: string
}

interface ICity {
  id: number
  name: string
  code: string
  department_id?: number
}

interface INomenclature {
  id: number
  index_number: number
  nomenclature: string
  area: number
  value: number
  status: IStatus
}

interface IPolicy {
  id: number
  business_trust_id: number
  policy_type: string
  policy_number: string
  insurer_id: number
  policy_holder_id: number
  beneficiary_id: number
  currency_id: number
  insured_value: string
  issue_date: string
  effective_start_date: string
  effective_end_date: string
  premium: null | string
  payment_method: string
  associated_contract: string
  record_status_id: number
  record_status_message: null | string
  policy_status_id: number | null
  observations: string
  created_at: string
  updated_at: string
  deleted_at: null
}

interface IGuarantee {
  id: number
  registration_date: string
  guarantee_type: string
  specification: string
  description: string
  guaranteed_value: string
  linkage_type: string
  expiration_date: string
  registration_status_id: number
  guarantee_status_id: null
  observations: string
  currency_id: number
  secured_creditor_id: number
  business_trust_id: number
  created_at: string
  updated_at: string
  deleted_at: null
}

export interface IBusinessTrustExtended {
  id: number
  business_code: string
  name: string
  start_date: string
  end_date: string
  has_extend: boolean
  status_id: number
}
