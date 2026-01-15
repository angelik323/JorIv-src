import { IUploadedFile } from '@/interfaces/global'
import { IGenericResource } from '../resources'

export interface ICodeDescriptionEntity {
  id: number
  code: string
  description: string
}

export interface IBudgetItemDetail extends ICodeDescriptionEntity {
  type: string
  nature: string
  status_id: number
}

export interface IBudgetResourceDetail extends ICodeDescriptionEntity {
  type: string
  status_id: number
}

export interface IAreaResponsibilityDetail extends ICodeDescriptionEntity {
  type: string
}

export interface IBudgetItem extends ICodeDescriptionEntity {
  type: string
  nature: string
  status_id: number
}

export interface IBudgetResource extends ICodeDescriptionEntity {
  type: string
  status_id: number
}

export interface IAreaResponsibility extends ICodeDescriptionEntity {
  type: string
}

export interface ICodeMovementSourceDestination {
  id: number
  movement_code: string
  movement_description: string
  validity: string
}

export interface IThirdPartyWrapper {
  type: string
  data: {
    id: number
    document: string
    third_party_category: string
    commercial_registration: string | null
    status: string | null
    full_name: string | null
    name: string | null
  }
}

export interface IDocumentContract {
  id?: number | string | null
  file?: IUploadedFile
  temporal_path?: string
  is_new_document?: boolean
  original_name?: string
  file_name?: string
  creation_data?: string
  annex_document_id?: number
  file_path?: string
  size?: number
  is_validated?: boolean
  document_id?: number | null
  status_id?: string | number
}

export interface IContractRegistrationItem {
  id: number
  business: {
    business_code: string
    name: string
  }
  contractor: {
    data: {
      document: string
      full_name: string
    }
  }
  type_contractual_document: string
  contract_number: string
  contractor_identification_number: string
  contractor_name: string
  subscription_date: string
  contract_value: number
  status: number | boolean
}

export interface IContractRegistrationList
  extends Array<IContractRegistrationItem> {}

export interface IContractRegistrationContract {
  business_trusts_id: number | null
  contract_document_structure_id: number | null
  status_id?: string | number | null
  stage?: string | null
  stage_id?: string | number | null
  registration_date: string | null
  internal_number: string | null
  contract_number: string | null
  name: string | null
  object: string | null
  subscription_date: string | null
  duration: number | null
  periodicity: string | null
  execution_start_date: string | null
  execution_end_date: string | null
  currency_id: string | null
  contract_value: string | null
  amount: number | null
  trm_value?: string | null
  has_stamp_tax: boolean | null
  requires_publication: boolean | null
  project_id: number | null
  work_plan_id: number | null
  work_plan_structure_id: number | null
  work_plan_structure?: string | null
  work_plan_code: string | number | null
  contractor_id: number | null
  supervision_role: string | null
  supervisor_id: number | null
  other_supervision_role: string | null
  supervisor2_id: number | null
  execution_city_id: number | null
  internal_notes: string | null
}

export interface IContractRegistrationMilestones {
  id?: number | null
  milestone?: string | null
  payment_type_id?: number | string | null
  payment_type_name?: string | null
  scheduled_date?: string | null
  foreign_amount?: string | null
  local_amount?: string | null
  applies_budget?: boolean
  is_new_milestone?: boolean
  assigned_value?: string | null
  future_coverage_amount?: number | string | null
  payment_milestone?: number
  is_used?: boolean
  amount_value?: number | string | null
}

export interface IContractRegistrationResourcesAssociatedBudget {
  id?: number | null
  fiscal_year: string | number
  budget_resource_id: number | string
  budget_resource?: string
  budget_area_id: number | string
  budget_area?: string | number
  budget_item_id: number | string
  budget_item?: string | number
  committed_future_value: number | string
  projected_value?: number | string
  is_new_future_validity?: boolean
  milestones?: IContractRegistrationMilestones[]
}

export interface IContractRegistrationBudgetDocuments {
  id?: number | null
  action?: string
  validity?: string | null
  budget_document_type_id: number | null
  budget_document_type_name?: string | null
  budget_document_id: number | null
  document_name?: string | null
  committed_balance?: string | null
  document_date?: string | null
  available_balance: string | null
  value_document?: string | null
  committed_value?: string | null
  operation_log_details?: IOperationLogDetail[]
}

export interface IOperationLogsAuthorizedContract extends IGenericResource {
  observations: string
  total_value: number
  date: string
  budget_document_type_id: number
  budget_document_type: {
    id: number
    code: string | null
    description: string | null
  }
  operation_log_details: IOperationLogDetail[]
  operation_label: string
}

export interface IOperationLogDetail {
  id: number
  operation_log_id: number
  year: number
  month: number
  day: number
  areas_responsibility_id: number
  code_movements_source_destination_id: number
  budget_item_id: number
  budget_resource_id: number
  value: string
  created_by_id: number
  updated_by_id: number
  created_at: string
  updated_at: string
  adjusted_value: string
  budget_item: IBudgetItem
  budget_resource: IBudgetResource
  area_resposability: IAreaResponsibility
  code_movements_source_destination: ICodeMovementSourceDestination
  committed_value?: string
  budget_records?: IContractRegistrationMilestones[]
}

export interface IContractRegistrationPoliciesForm {
  id?: number | null
  action?: string
  policie_id: number | null
  policie?: string | null
  insurer_id: number | null
  insurance?: string | null
  beneficiary_id: number | null
  beneficiary?: string | null
  policy_number: string | null
  insured_value: number | string | null
  start_date: string | null
  end_date: string | null
  status_id: number | null
  is_new_policy?: boolean
  coverages: IContractRegistrationCoverage[]
  attachments: IDocumentContract[]
}

export interface IDocumentContract {
  id?: number | string | null
  file?: IUploadedFile
  temporal_path?: string
  is_new_document?: boolean
  original_name?: string
  file_name?: string
  creation_data?: string
  annex_document_id?: number
  file_path?: string
  size?: number
  is_validated?: boolean
  document_id?: number | null

  status_id?: string | number
}

export interface IContractRegistrationCoverage {
  id?: number
  risk_id: number | null
  risk_name?: string
  minimum_percentage?: number
  coverage_percentage?: number
  maximum_coverage_value: number | string | null
}

export interface IContractRegistrationFormToSend {
  contract: IContractRegistrationContract
  milestones: IContractRegistrationMilestones[] | []
  future_validities: IContractRegistrationResourcesAssociatedBudget[]
  budget_documents: IContractRegistrationBudgetDocuments[] | []
  contract_policies: IContractRegistrationPoliciesForm[] | []
  annex_documents: IDocumentContract[] | []
  clauses: IContractRegistrationClauses[] | []
}

export interface IContractRegistrationClauses {
  id?: number | null
  order: number | null
  clause_type_id: string | number | null
  clause_type?: string | null
  name: string | null
  contract_clause_id: number | null
  description: string | null
  clausule: string | null
  is_new_clause?: boolean
}

export interface IContractRegistrationResponse {
  contract: {
    id: number
    business_trusts_id: number
    business: {
      id: number
      business_code: string
      name: string
    }
    contract_document_structure_id: number
    stage: {
      id: number
      name: string
    }
    registration_date: string
    internal_number: string
    contract_number: string
    name: string
    object: string
    subscription_date: string
    duration: number
    periodicity: string
    execution_start_date: string
    execution_end_date: string
    currency_id: string
    amount: string
    trm: string
    contract_value: string
    has_stamp_tax: boolean
    requires_publication: boolean
    project_id: number
    project: {
      id: number
      code: string
      name: string
      description: string
    }
    work_plan_id: number
    work_plan: {
      id: number
      structure_plan_code_id: number
      structure_name: string
      purpose: string
      type: string
      code: string
      name: string
    }
    work_plan_structure_id: number | null
    work_plan_code_id: number | null
    internal_notes: string | null
    contractor_id: number
    contractor: IThirdPartyWrapper
    supervision_role: string
    supervisor_id: number
    supervisor: IThirdPartyWrapper
    other_supervision_role: string
    supervisor2_id: number
    supervisor2: IThirdPartyWrapper
    execution_city_id: number
    status: {
      id: number
      name: string
    }
    type_contractual_document: {
      document_code: string
      document_name: string
    }
    execution_city: {
      id: number
      code: string
      name: string
    }
  }
  milestones: Array<{
    id: number
    contract_id: number
    milestone_number: string
    payment_type_id: number
    scheduled_date: string
    foreign_amount: string
    local_amount: string
    applies_budget: boolean
    payment_type: {
      id: number
      name: string
      code: string
    }
  }>
  budgetDocuments: Array<{
    id: number
    contract_id: number
    budget_document_id: number
    created_at: string
    budget_document: Array<{
      id: number
      observations: string
      document_year: number
      date: string
      total_value: string
      areas_responsibility_id: number | null
      budget_document_type_id: number
      operation_label: string
      operation_log_details: Array<{
        id: number
        operation_log_id: number
        year: number
        month: number
        day: number
        areas_responsibility_id: number
        code_movements_source_destination_id: number
        budget_item_id: number
        budget_resource_id: number
        value: string
        created_by_id: number
        updated_by_id: number
        created_at: string
        updated_at: string
        adjusted_value: string
        budget_item: IBudgetItemDetail
        budget_resource: IBudgetResourceDetail
        area_resposability: IAreaResponsibilityDetail
        committed_balance: string
        code_movements_source_destination: {
          id: number
          movement_code: string
          movement_description: string
          validity: string
        }
      }>
      areas_responsibility: IAreaResponsibilityDetail | null
      budget_document_type: ICodeDescriptionEntity
    }>
    budget_document_type_id: number
    budget_document_type: Array<ICodeDescriptionEntity>
    budget_document_number: string
    validity: number
    budget_document_value: string
    available_balance: string
    committed_balance: string
    records: Array<{
      id: number
      contract_id: number
      contract_budget_document_id: number
      contract_budget_document: {
        id: number
        contract_id: number
        budget_document_id: number
        budget_document_type_id: number
        budget_document_number: string
        validity: number
        budget_document_value: string
        available_balance: string
        committed_balance: string
      }
      budget_document_id: number
      budget_document: null
      contract_budget_record_id: number
      budget_record: Array<{
        id: number
        operation_log_id: number
        year: number
        month: number
        day: number
        areas_responsibility_id: number
        code_movements_source_destination_id: number
        budget_item_id: number
        budget_resource_id: number
        value: string
        created_by_id: number
        updated_by_id: number | null
        created_at: string
        updated_at: string
        adjusted_value: string
        area_resposability: IAreaResponsibilityDetail
        code_movements_source_destination: {
          id: number
          movement_code: string
          movement_description: string
          validity: string
        }
        budget_item: IBudgetItemDetail
        budget_resource: IBudgetResourceDetail
        operation_log: {
          id: number
          observations: string
          document_year: number
          date: string
          total_value: string
        }
      }>
      contract_payment_milestone_id: number
      payment_milestone: {
        id: number
        contract_id: number
        milestone_number: string
        payment_type_id: number
        scheduled_date: string
        foreign_amount: string
        local_amount: string
        applies_budget: boolean
        status_id: number
        payment_type: {
          id: number
          code: string
          name: string
        }
        budget_allocated_id: number | null
      }
      assigned_value: string
    }>
  }>
  futureValidities: Array<{
    id: number
    contract_id: number
    fiscal_year: string
    budget_resource_id: number
    budget_resource: {
      id: number
      code: string
      description: string
      label: string
    }
    budget_area_id: number
    budget_area: {
      id: number
      code: string
      description: string
      label: string
    }
    budget_item_id: number
    budget_item: {
      id: number
      code: string
      description: string
      label: string
    }
    projected_value: string
    committed_future_value: string
    milestones: Array<{
      id: number
      milestone_id: number
      milestone: {
        id: number
        contract_id: number
        milestone_number: string
        payment_type_id: number
        scheduled_date: string
        foreign_amount: string
        local_amount: string
        applies_budget: boolean
        payment_type: {
          id: number
          name: string
          code: string
        }
      }
      scheduled_date: string
      milestone_value: string
      future_coverage_amount: string
    }>
  }>
  annexDocuments: Array<{
    id: number
    annex_document: {
      id: number
      name: string
    }
    annex_document_id: number
    created_at: string
    creator: null
    file_name: string
    file_path: string
    size: number
  }>
  clauses: Array<{
    id: number
    contract_id: number
    clause_type_id: number
    order: number
    name: string
    description: string
    clausule: {
      id: number
      clause_type_id: number
      name: string
      description: string
      clausule: string
      status_id: number
      code: string
    }
    clause_type: {
      id: number
      name: string
      slug: string
    }
    contract: {
      id: number
      name: string
      contract_number: string
    }
  }>
  policies: Array<{
    id: number
    contract_id: number
    policie_id: number
    policie: {
      id: number
      code: string
      name: string
      stage: string
      status_id: number
    }
    insurer_id: number
    insurer: {
      data: {
        id: number
        third_party_id: number
        document: string
        name: string | null
      }
    }
    beneficiary_id: {
      data: {
        id: number
        third_party_id: number
        document: string
        name: string | null
      }
    }
    policy_number: string
    insured_value: string
    beneficiary: {
      id: number
      name: string
    }
    start_date: string
    end_date: string
    status: {
      id: number
      name: string
    }
    coverages: Array<{
      id: number
      contract_policy_id: number
      risk_id: number
      maximum_coverage_value: string
      risk: {
        id: number
        name: string
        minimum_percentage: string
        maximum_percentage: string
      }
      contract_policy: {
        id: number
        policy_number: string
      }
    }>
    annex_documents: Array<{
      id: number
      annex_document_id: number
      created_at: string
      file_name: string
      file_path: string
      size: number
    }>
  }>
}

export interface IContractRegistrationGeneralDataForm {
  // Sección 1: Contrato
  business_trusts_id: number | string | null
  contract_document_structure_id: number | string | null
  status_id: number | string | boolean | null
  stage: string | number | null

  registration_date: string | null
  internal_number: string | null
  contract_number: string | null
  name: string | null
  object: string | null

  subscription_date: string | null
  duration: number | null
  periodicity: string | null
  execution_start_date: string | null

  execution_end_date: string | null

  currency_id: string | null
  contract_value: string | null

  has_stamp_tax: boolean | null
  requires_publication: boolean | null

  project_id: number | null
  project_name?: string | null
  work_plan_id: number | string | null
  work_plan_structure_id: number | null
  work_plan_structure?: string | null
  work_plan_code: string | null

  contractor_id: number | string | null
  supervision_role: string | null
  supervisor_id: number | string | null
  other_supervision_role: string | null
  supervisor2_id: number | string | null
  execution_city_id: number | string | null

  internal_notes: string | null

  amount?: string | null
  trm_value: string | null
  trm_value_raw?: number | null

  is_editable_ppto?: boolean
  show_future_validities?: boolean

  // Hitos de pagos programados
  milestones: IContractRegistrationMilestones[]
  scheduled_foreign_amount?: string | null
  scheduled_local_amount?: string | null
  outstanding_foreign_amount?: string | null
  outstanding_local_amount?: string | null

  // Presupuesto asociado
  total_available_balance: string | null
  total_committed_balance: string | null
  total_outstanding_balance: string | null
  budget_documents: IContractRegistrationAssociatedBudget[]
  models_budget_documents?: IContractRegistrationAssociatedBudget[]

  // Vigencias futuras
  scheduled_milestone_id: number | null
  total_future_coverage?: string | null
  pending_budget_allocation?: string | null
  future_validities: IContractRegistrationResourcesAssociatedBudget[]

  // Polizas
  contract_policies: IContractRegistrationPoliciesForm[]

  // Estructura documental
  annex_documents: IDocumentContract[]

  // Cláusulas
  clauses: IContractRegistrationClauses[]
}

export interface IContractPolicyAttachment {
  id: number | string
  file_name: string
  total?: number | string
  status_id: string | number
  file?: IUploadedFile
  temporal_path?: string
  file_path?: string
  original_name?: string
  creation_data?: string
  is_new_document?: boolean
  size?: number
  is_validated?: boolean
}

export interface IContractRegistrationAssociatedBudget {
  id: number | null
  validity: string | null
  budget_document_type_name: string | null
  available_balance: string | null
  value_document: string | null
  document_date: string | null
  document_name: string | null
  budget_document_type_id: number | null
  budget_document_id: number | null
  committed_balance?: string | null
  is_new_associated_budget?: boolean
  operation_log_details?: IOperationLogDetail[]
}

export interface IBudgetItem {
  id: number
  code: string
  description: string
  type: string
  nature: string
  status_id: number
}

export interface IBudgetResource {
  id: number
  code: string
  description: string
  type: string
  status_id: number
}

export interface IAreaResponsibility {
  id: number
  code: string
  description: string
  type: string
}

export interface ICodeMovementSourceDestination {
  id: number
  movement_code: string
  movement_description: string
  validity: string
}

export interface IContractRegistrationBudgetRecords {
  id: number
  validity: string
  resource: string
  area: string
  rubric: string
  available_value: string
  committed_value: string
  adjusted_value?: string

  contract_budget_record_id?: number | null
  budget_document_id?: number | null
}
export interface IContractRegistrationScheduledMilestone {
  id?: number | null
  milestone_type?: string | null
  date?: string | null
  milestone_value?: number | null
  milestone_value_assigned_budget?: number | null

  milestone?: string | null
  amount_with_future_coverage?: number | null
  payment_type_id?: number | null
  payment_type_name?: string | null
  scheduled_date?: string | null
  foreign_amount?: number | null
  local_amount?: number | null
  applies_budget?: boolean | null
  future_coverage_amount?: number | null
  is_new_milestone?: boolean
}

export interface IContractRegistrationDocumentStructure {
  id: number | null
  document: string | null
  file_name: string | null
  file_path: string | null
  isNew?: boolean
}

export interface IContractRegistrationPolicies {
  id: number
  policy_number: string
  beneficiary: string
  insured_value: number | null
  start_date: string
  end_date: string
  status_id: number
  insurance: string

  attachments?: IDocumentContract[]
}

export interface IContractRegistrationDocumentPolicies {
  id: number | string
  policie_id: number | string
  policie: string
  insurance_id: number | string
  insurance: string
  policy_number: string
  beneficiary_id: number | string
  beneficiary: string
  insured_value: string
  start_date: string
  end_date: string
  status_id: string | number

  coverages: IContractRegistrationCoverage[]
  documents?: IDocumentContract[]
}

export interface IContractRegistrationClausesForm {
  id: number | null
  action: string

  order: number | null
  clause_type_id: number | null
  clause_type?: string | null
  contract_clause_id: number | null
  name: string | null
  description: string | null
  clausule: string | null
}

export interface IContractRegistrationMilestonesForm {
  id: number | null
  action?: string
  milestone?: string | null
  payment_type_id: number | null
  payment_type_name?: string | null
  scheduled_date: string | null
  foreign_amount: string | null
  local_amount: string | null
  applies_budget: boolean | null
}

export enum EContractRegistrationPeriodicity {
  Días = 'days',
  Meses = 'months',
  Años = 'years',
}

export interface IContractRegistrationFutureValiditiesForm {
  id: number | null
  action: string
  fiscal_year: number | string | null
  budget_resource_id: number | null
  budget_resource: string | null
  budget_area_id: number | null
  budget_area: string | null
  budget_item_id: number | null
  budget_item: string | null
  projected_value: string | null
  committed_future_value: string | null

  milestones?: IContractRegistrationScheduledMilestone[]
}

export interface IGeneratePresignedUrlContractRegistration {
  name: string
  file_type: string
  file_size: number
  annex_document_id: number
}

export interface IContractRegistrationGeneratePDF {
  contract_id: number | null
  clause_type_id: number | null
  order: number | null
  name: string | null
  description: string | null
}
