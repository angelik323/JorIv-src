export interface IRegisterContractsList {
  id: number
  name: string
  description: string
  status: { id: number }
  contract_number: string
  contract_additions: IAdditionalContract[]
}

export interface IAdditionalContract {
  id: number
  contract_id: number
  business_trust_id: number
  business: BasicData
  document_type_id: number
  document_type: DocumentType
  modification_type: BasicData
  additional_number: string
  subscription_date: string
  status_id: number
  status: BasicData
  stage_id: number
  stage: BasicData
  additional_value: string
  created_at: string
  updated_at: string
}

interface BasicData {
  id: number
  code: string
  name: string
  description: string
  type?: string
  data?: {
    document?: string | null
    full_name?: string | null
  }
}

export interface IRegisterAdditionsResponse
  extends Omit<
    IBasicDataFormAdditions &
      ISchedulePaymentsFormAdditions &
      IBudgetFormAdditions &
      IValidityFormAdditions &
      IDocumentsFormAdditions &
      IPoliciesFormAdditions &
      IClausesFormAdditions,
    'status' | 'modification_type'
  > {
  status: BasicData
  business: BasicData
  contract_type: BasicData
  modification_type: BasicData
  internal_contract_number: string
}

export interface IContractData {
  id: number
  business_trusts_id: number | null
  contract_document_structure_id: number | null
  stage: BasicData
  registration_date: string | null // "YYYY-MM-DD"
  internal_number: string | null
  contract_number: string
  object: string | null
  subscription_date: string | null // "YYYY-MM-DD"
  duration: number | null
  periodicity: string | null
  execution_start_date: string | null // "YYYY-MM-DD"
  execution_end_date: string | null // "YYYY-MM-DD"
  currency_id: string | null
  amount: string | null
  trm: string | null
  contract_value: number | null
  has_stamp_tax: boolean
  requires_publication: boolean
  project_id: number | null
  work_plan_id: number | null
  work_plan_structure_id: number | null
  work_plan_code_id: number | null
  internal_notes: string | null
  contractor_id: number | null
  supervision_role: string | null
  supervisor_id: number | null
  other_supervision_role: string | null
  supervisor2_id: number | null
  execution_city_id: number | null
  status: BasicData
  contractor: BasicData
}

export interface IRegisterAdditionsForm
  extends IBasicDataFormAdditions,
    ISchedulePaymentsFormAdditions,
    IBudgetFormAdditions,
    IValidityFormAdditions,
    IDocumentsFormAdditions,
    IPoliciesFormAdditions,
    IClausesFormAdditions {}

export interface IBasicDataFormAdditions {
  contract_id?: number | null
  contract_type_id?: number | string | null
  business_trust_id?: number | string | null
  document_type_id?: number | string | null
  modification_type?: number | string | null
  subscription_date?: string | null // formato "YYYY-MM-DD"
  additional_number?: string | null // si la asignación es manual
  duration?: number | null
  periodicity?: number | null
  application_start_date?: string | null // formato "YYYY-MM-DD"
  contract_end_date?: string | null // formato "YYYY-MM-DD"
  additional_amount?: number | null
  additional_value?: number | null
  justification?: string | null
  contract_object?: string | null
  status?: number | string | null
  internal_number?: string | null
  contractor?: string | null
  has_stamp_tax?: boolean
  contractor_name?: string | null
}

export interface ISchedulePaymentsFormAdditions {
  milestone_payments?: IMilestonePayment[]
  payment_milestones?: IMilestonePayment[]
}

export interface IMilestonePayment {
  select: boolean
  temporal_id: string | null
  payment_type_id?: number | string | null
  date_milestone?: string | null
  foreign_amount?: number | null
  value_milestone?: number | null
  value_assigned?: number | null
  budget_apply?: boolean
  associated_budget_records_id?: number | null

  id?: string
  milestone_date?: string
  payment_type?: BasicData
  milestone_value?: number
}

export interface IBudgetFormAdditions {
  selected?: BudgetAssociation | null
  budgetary_association?: BudgetAssociation[]
  budgetary_associations?: BudgetAssociation[]
}

export interface BudgetAssociation {
  id: string
  validity: string | null
  type_document_budget_id: string | null
  document_number_id: string | null
  value: string | null
  document_date: string | null
  available_payment: string | null
  document_budget?: BasicData[]

  operation_log_details: OperationDetails[]

  milestone_assigned: MilestoneAssigned[]
  milestone_payments_assigned?: MilestoneAssigned[]
}

export interface OperationDetails {
  id: number
  validity: string | null
  date: string | null
  available_value: string | null
  compromise_value?: string | null
  operation_log_id?: number | null
  areas_responsibility_id?: number | null
  budget_item_id?: number | null
  budget_resource_id?: number | null

  milestone_assigned: MilestoneAssigned[]
}

export interface MilestoneAssigned {
  temporal_id: string | null
  value_assigned?: number | null
  value_milestone?: number | null
  associated_budget_records_id?: number | null
  payment_type_id?: number | string | null
  date_milestone?: string | null

  milestone_payment?: IMilestonePayment
}

export interface IValidityFormAdditions {
  selectedRow?: FutureValidities | null
  future_validities?: FutureValidities[]
}

export interface FutureValidities {
  id: string
  validity: string | null
  resource_id: string | null
  area_id: string | null
  budget_item_id: string | null
  project_value: number | null
  milestone_assigned: MilestoneAssigned[]
  milestone_payments_assigned?: MilestoneAssigned[]
}

export interface IDocumentsFormAdditions {
  attached_documents?: IDataTableDocuments[]
  document_attachments?: IDataTableDocuments[]
}

export interface IPoliciesFormAdditions {
  policies?: Policies[]
}

export interface Policies {
  id: number | null
  type_policy_id: number | null
  insurance_company_id: number | null
  policy_number: string | null
  insured_value: number | null
  beneficiary_id: number | null
  validity_start: string | null // "YYYY-MM-DD"
  validity_end: string | null // "YYYY-MM-DD"
  status_id: number | null
  coverage: Coverage[]
  coverages?: Coverage[]
  attachments: Attachment[]

  start_validity_date?: string
  end_validity_date?: string
}

interface Coverage {
  id: string
  risk_id: number | null
  coverage_max_value: string | null
  coverage_min_value: string | null
  coverage_percent: string | null
  risk?: {
    minimum_percentage: string
    maximum_percentage: string
  }
}
export interface Attachment extends File {
  id: number | null
  date: string | null
  status: string | null
  contract_attachment_id?: string | number | null
  file_id?: number | null

  original_name?: string
  uploload_at?: string
}

export interface IClausesFormAdditions {
  clauses?: Clauses[]
}

export interface Clauses {
  select: boolean
  id: number | null
  order: number | null
  type_clause_id: number | null
  clause_id: number | string | null
  clause_description: string | null

  clause?: BasicData
}

export interface IFilesDocumentAddition {
  document_type: string | null
  file_path?: File | string | null
  file_url?: File | string | null
  is_required: boolean | null
  is_validated?: boolean | null
  id?: number | null | string
  name?: string | null
}

export interface IGeneratePresignedUrlAdditions {
  name: string
  file_type: string
  file_size: number
}

export interface IAttachedDocuments {
  id: number
  mandatory: string | null
  status_id: number | null
  type_attached_document_id: number | null
  annex_document: IAnnexDocument | null
  status: {
    id: number
    name: string
  } | null
}

interface IAnnexDocument {
  id: number
  code: string | null
  name: string | null
  status_id: number | null
  status: {
    id: number
    name: string
  } | null
}

export interface IDataTableDocuments {
  contract_attachment_id?: string | number | null
  attachment_id?: number | null
  file_id?: number | null
  position?: number
  class?: string
  title?: string
  subtitle?: string
  required?: boolean
  file?: IFile | object | null
  id?: number | null | string
  date?: string | null
  status?: string | null

  attachment?: {
    id: number
    original_name: string
    created_at: string
    file_path: string
    full_path: string
    file_type: string
  }
  contract_attachment?: {
    mandatory: string
  }
}

export interface IFile extends File {
  file_type?: string
  url?: string
  contract_attachment_id?: number | null
}
