
export interface IGeneralContractInquiryListItem {
  id: number
  business_trust_id?: number | null
  business_trust?: {
    id: number
    name: string
    code?: string
  }
  business_id?: number | null
  business?: {
    id: number
    name: string
    code?: string
  }
  fiscal_year?: string | null
  type_contract?: {
    id: number
    name: string
    code?: string
  }
  contract_type?: {
    id: number
    name: string
    code?: string
  }
  contract_id?: number | null
  addition_id?: number | null
  stage?: string | null
  status?: string | null
  status_id?: number | null
  main_contract_number?: string | null
  addition_contract_number?: string | null
  subscription_date?: string | null
  document_type_id?: number | null
  category?: string | null
  modality?: string | null
  contractor_id?: number | null
  contractor?: {
    id: number
    name: string
    document?: string
  }
  project_id?: number | null
  project?: {
    id: number
    name: string
    code?: string
  }
  work_plan_code?: string | null
  created_at?: string
  updated_at?: string
}

/**
 * Interface para el formulario de consulta general de contratos
 */
export interface IGeneralContractInquiryForm {
  id: number
  consolidator_business?: string | null
  business: string
  category: string
  stage: {
    id: number
    name: string
    description?: string
    created_at?: string
    updated_at?: string
    deleted_at?: string | null
  }
  contract_type: string
  status: {
    id: number
    name: string
  }
  currency: string
  modality: string
  main_contract_number: string
  addition_contract_number?: string | null
  accumulated_contract_value: number
  contractor?: string | null
  created_at: string
  internal_number?: string | null
  contract_name: string
  object: string
  subscription_date: string
  duration: number
  execution_start_date: string
  execution_end_date: string
  foreign_amount: string
  trm: string
  amount: string
  has_stamp_tax: boolean
  requires_publication: boolean
  project: string
  codigo_plan_obra?: string | null
  internal_notes: string
  supervision_role: string
  supervision1?: string | null
  other_supervision_role: string
  supervision2?: string | null
  execution_city_id: string
}

/**
 * Interface para los filtros de consulta general de contratos
 */
export interface IGeneralContractInquiryFilters {
  'filter[business_trusts_id]'?: number | string
  'filter[from_business_id]'?: number | string
  'filter[to_business_id]'?: number | string
  'filter[stage]'?: string
  'filter[document_type_id]'?: number | string
  'filter[category]'?: string
  'filter[modality]'?: string
  'filter[status_id]'?: number | string
  'filter[contractor_id]'?: number | string
  'filter[main_contract_number]'?: string
  'filter[addition_contract_number]'?: string
  'filter[subscription_date_from]'?: string
  'filter[subscription_date_to]'?: string
  'filter[project_id]'?: number | string
  'filter[work_plan_code]'?: string
  page?: number
  rows?: number
  paginate?: number
}

/**
 * Interface para la respuesta de la API de consulta general
 */
export interface IGeneralContractInquiryResponse {
  data: IGeneralContractInquiryListItem[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

/**
 * Interface para el estado agrupado de contratos
 */
export interface IContractStatusGrouped {
  id: number
  code: string
  name: string
  description?: string
  stage_type?: string
  order?: number
  active?: boolean
  created_at?: string
  updated_at?: string
}

/**
 * Interface para el recurso presupuestal de un hito
 */
export interface IBudgetResource {
  id: number
  code: string
  description: string
  type: string
  status_id: number
}

/**
 * Interface para el área de responsabilidad de un hito
 */
export interface IAreaResponsability {
  id: number
  code: string
  description: string
  type: string
}

/**
 * Interface para el ítem presupuestal de un hito
 */
export interface IBudgetItem {
  id: number
  code: string
  description: string
  type: string
  nature: string
  status_id: number
}

/**
 * Interface para el presupuesto asignado a un hito
 */
export interface IMilestoneBudget {
  id: number
  budget_resource: IBudgetResource
  area_resposability: IAreaResponsability
  budget_item: IBudgetItem
  value: string
}

/**
 * Interface para los hitos de pago programados
 */
export interface IScheduledPaymentMilestone {
  id: number
  status: number
  source: string
  payment_type: string | null
  foreign_amount: number
  source_id: number
  contract_number: string
  addition_number: string | null
  milestone: string
  category: string
  milestone_date: string
  milestone_value: string
  applies_budget: boolean
  budget: IMilestoneBudget[]
}

export interface ITypeBudgetDocument {
  id: number
  code: string
  description: string
}

export interface IAssociatedBudget {
  id: number
  source: string
  contract_number: string
  category: string
  validity: number
  type_budget_document: ITypeBudgetDocument
  document_number: string
  date: string
  document_value: string
  contract_assigned_value: string
}

/**
 * Interface para el tipo de documento anexo
 */
export interface IAnnexDocumentType {
  id: number
  name: string
  type: string
}

/**
 * Interface para los documentos anexos del contrato
 */
export interface IAnnexDocument {
  id: number
  contract_number: string
  status: number
  document_name: string
  type: IAnnexDocumentType
  effective_date: string
  expiration_date: string
  source: string
}

/**
 * Interface para el tipo de póliza
 */
export interface IPolicyType {
  id: number
  name: string
  code: string
}

/**
 * Interface para la compañía de seguros
 */
export interface IInsuranceCompany {
  id: number
  name: string | null
}

/**
 * Interface para la relación de documento anexo (póliza)
 */
export interface IAnnexRelation {
  policy_type: IPolicyType
  insurance_company: IInsuranceCompany
  policy_number: string
  beneficiary: string | null
  insured_value: string
  start_validity_date: string | null
  end_validity_date: string | null
}

/**
 * Interface para el tipo de riesgo
 */
export interface IRisk {
  id: number
  name: string
}

/**
 * Interface para los cubrimientos de póliza
 */
export interface IPolicyCoverage {
  id: number
  risk: IRisk
  coverage_percentage: string
  coverage_max_value: string
}

/**
 * Interface para los archivos adjuntos de documentos anexos
 */
export interface IAttachment {
  id: number
  file_id?: number
  document_name: string
  weight: string
  date_loading: string
  user_name: string
  source: string
  source_type: string
}


/**
 * Interface para las clausulas del contrato
 */
export interface IContractClause {
  id: number
  order: number
  clause_type: {
    id: number
    name: string
  }
  name: string | null
  clause: string
}


export interface IDocumentFile {
  file_id: number
  file_name: string
  file_path: string
  presigned_url: string
}
