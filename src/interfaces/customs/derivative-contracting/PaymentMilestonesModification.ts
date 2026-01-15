export interface IPaymentMilestonesModificationStatus {
  id: number
  name?: string
  label?: string
}

export interface IPaymentMilestonesModificationList {
  id: number
  business_trust: {
    id: number
    name: string
    business_code: string
  }
  document_type: {
    document_name: string
    category: string
    modality: string
    contract_type: string
  }
  contract: {
    id: number
    number: string
    status_id: number
    stage: {
      id: number
      name: string
      description: string
      created_at: string
      updated_at: string
      deleted_at: string | null
    }
    subscription_date: string
  }
  contractor: {
    name: string | null
    business_name: string | null
    document: string
    trade_name: string | null
  } | null
  addition_id: number | null
  modification_type: string | null
}

export interface IPaymentMilestonesModificationList2
  extends Omit<IPaymentMilestonesModificationList, 'id'> {
  id?: number
  contract_id: number
  milestone_number: string
  payment_type_id: number
  date: Date
  orden_pago_asociada: string
  estado_orden_pago: string
  foreign_amount: string
  local_amount: string
  applies_budget: boolean
  currency: string
}

export interface ITotales {
  total_foreign_amount: number
  total_local_amount: number
}

export interface IContractMilestoneModification {
  id?: number
  milestones: IPaymentMilestonesModificationList2[]
  local_amount_total: number
  foreign_amount_totales: ITotales
}

export interface IPaymentMilestonesModificationForm {
  code: string
  name: string
  stage: string
}

export interface IPaymentMilestoneForm {
  C_number: string
  BT_name: string
  DT_contract_type: string
  C_stage: string
  C_subscription_date: string
  contractor: string
  currency: string
  DT_Modality: string
  milestone: string
  payment_type: string
  date: string
  foreign_amount: string
  cop_value: string
}

export interface IPaymentMilestoneTableItem {
  contract_id: number
  milestone_number: string
  payment_type_id: number
  payment_type_name: string
  date: string
  foreign_amount: number
  local_amount: number
  apply_budget: boolean
  actions?: string
}

export interface INewPaymentMilestoneDistribution {
  contract_id: number
  fiscal_year: number
  budget_resource_id: number
  budget_area_id: number
  budget_item_id: number
  projected_value: number
  new_distribution: number
  committed_future_value: number
  actions?: string
}

export interface IMilestoneDetail {
  id: number
  contract_id: number
  milestone_number: string
  scheduled_date: string
  payment_type_id: number
  foreign_amount: number | null
  local_amount: string
  applies_budget: boolean
  actions?: string
}

export interface INewMilestoneFormState {
  milestone_number: string
  payment_type_id: number | null
  payment_type_name: string
  date: string
  apply_budget: boolean
  foreign_amount: string
  local_amount: string
}

export interface IContractMilestoneModificationByIdResponse {
  id: number
  milestones: IMilestoneDetail[]
  local_amount_total: number
  foreign_amount_total: number
}

export interface IBudgetResource {
  id: number
  code: string
  description: string
}

export interface IBudgetArea {
  id: number
  code: string
  description: string
  label: string
}

export interface IBudgetItem {
  id: number
  description: string
  code: string
  label: string
}

export interface IFutureValidity {
  id: number
  contract_id: number | null
  fiscal_year: string
  budget_resource_id: number
  budget_resource: IBudgetResource
  budget_area_id: number
  budget_area: IBudgetArea
  budget_item_id: number
  budget_item: IBudgetItem
  projected_value: string
  committed_future_value: string
  created_at: string | null
  updated_at: string | null
  creator: string
  updater: string
}

export interface IFutureValiditySimple {
  id: number
  fiscal_year: string
  budget_resource_id: number
  budget_area_id: number
  budget_item_id: number
  projected_value: string
  committed_future_value: string
}

export interface IContractFutureValidityMilestone {
  id: number
  contract_future_validity_id: number
  payment_milestone_id: number
  futureValidity: IFutureValidity
  future_validity: IFutureValiditySimple
}

export interface IPaymentMilestonesFutureValidityData {
  id: number
  contract_future_validity_milestone: IContractFutureValidityMilestone[]
}

// == Interfaces para la vista del editar . campos no editables ===
export interface IPaymentMilestonesModificationResponseData {
  contract: IContractDetail
  milestone_selected: IMilestoneSelected
  business_trust: IBusinessTrustDetail[]
  contractor: Array<{
    document?: string
    natural_person?: {
      full_name?: string
    }
  }>
  totales: ITotalsResponse
}

export interface ITotalsResponse {
  total_programacion_extranjero: number
  total_programacion_cop: number
}

export interface IContractDetail {
  id: number
  business_trusts_id: number
  subscription_date: string
  contract_number: string
  contractor_id: number
  currency_id: string
  contract_document_structure_id: number
  status_id: number
  amount: string
  contract_value: string
  local_amount_total: number
  foreign_amount_total: number
  status: IPaymentMilestonesModificationStatus
  contract_document: IContractDocumentDetail
  milestones: IMilestoneSelected[]
}

export interface IContractDocumentDetail {
  id: number
  type_id: number
  document_type: IDocumentTypeDetail
}

export interface IDocumentTypeDetail {
  id: number
  document_code: string
  document_name: string
  contract_type: number
  modality: number
  status_id: number
  budget_validity: number
  budget_validity_bool: boolean
  modality_name: string
}

export interface IMilestoneSelected {
  id: number
  contract_id: number
  milestone_number: string
  scheduled_date: string
  payment_type_id: number
  foreign_amount: string
  local_amount: string
  applies_budget: boolean
  status_id: number
  payment_type: {
    name?: string
  }
}

export interface IBusinessTrustDetail {
  id: number
  business_code: string
  name: string
  start_date: string
  end_date: string | null
  has_extend: boolean
  has_budget: boolean
  status_id: number
  business_type_id: number
  business_subtype_id: number
  business_mod: unknown | null
  derivate_contracting: boolean
  register_type: string
  status_name: string
  status: {
    id: number
    status: string
  }
  document_type: unknown[]
  budget: unknown | null
  account: {
    id: number
    business_trust_id: number
    functional_business_currency: string
    identification_tax: string
    accounting_structure_id: number | null
  }
  accounts_payable: {
    id: number
    business_trust_id: number
    account_structure_id: number
  }
}

// == Interfaces para el show de Documento presupuestal ===

export interface IContractBudgetDocument {
  id: number
  contract_id: number
  budget_document_id: number
  budget_document_type_id: number
  budget_document_number: string
  validity: number
  budget_document_value: string
  available_balance: string
  committed_balance: string
  created_by: number
  updated_by: number | null
  deleted_by: number | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface IBudgetRecord {
  id: number
  contract_payment_milestone_id: number
  contract_budget_record_id: number
  assigned_value: string
  created_by: number
  updated_by: number | null
  deleted_by: number | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  budget_document_id: number
  contract_id: number
  contract_budget_document_id: number
  contract_budget_document: IContractBudgetDocument
}

export interface IBudgetRecordResponse {
  budget_records: IBudgetRecord[]
}

// == Interfaces para agregar hito de pago distribuido ===
export interface IDistributedMilestoneItem {
  payment_type_id: number
  scheduled_date: string
  foreign_amount: number
  local_amount: number
  applies_budget: boolean
}

export interface IDistributedMilestoneRequest {
  id: number
  milestones: IDistributedMilestoneItem[]
  
}

// == Interfaces para Nueva distribución Presupuestal ==
export interface INewBudgetDistributionItem extends IContractFutureValidityMilestone {
  budget_document_type?: string
  budget_document_number?: string | number
  assigned_amount?: number
}

export interface INewBudgetDistributionResponse {
  id: number
  contract_future_validity_milestone: INewBudgetDistributionItem[]
}

export interface IAllocatedBudgetProps {
  contractSubscriptionDate: string
  isLocalCurrency: boolean
  contractValue: number
  foreignValue: number
  trm: number
  currentTotalLocal: number
  currentTotalForeign: number
  milestoneNumber: string
  milestones_id: number
}







