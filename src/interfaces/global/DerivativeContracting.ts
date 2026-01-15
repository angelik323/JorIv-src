export enum Module {
  NAME = 'DerivativeContracting',
}

export enum TypeAttachedDocument {
  POLICY = 'policy',
  ANNEX_DOCUMENT = 'annex_document',
}

export enum DocumentaryStructureContractQueryParam {
  MANAGES_POLICIES = 'manages_policies',
  FILTER_CONTRACT_DOCUMENT_ID = 'filter[contract_document_id]',
  FILTER_SEARCH = 'filter[search]',
}

export enum ContractTypeStatusBudgetValidity {
  ALLOCATED_BUDGET = 'asignación presupuestal asignada',
  PROJECTED_BUDGET = 'asignación presupuestal proyectada',
}

export enum MaximumAmountAllowed {
  UNDEFINED = 'indefinido',
  LOCAL_CURRENCY = 'moneda local (COP)',
  MINIMUM_WAGES = 'salarios mínimos legales vigentes (SMLV)',
}

export enum NumberingType {
  SEQUENTIAL = 'secuencial',
  SEQUENTIAL_BY_VALIDITY = 'secuencial por vigencia',
  MANUAL = 'manual',
}

export enum ProjectManagementFilter {
  DERIVATE_CONTRACTING = 'derivate_contracting',
  PROJECT_ID = 'project_id',
  FIDUCIARY_BUSINESS_ID = 'fiduciary_business_id',
  BUSINESS_TYPE_ID = 'business_type_id',
  BUSINESS_STATUS_ID = 'business_status_id',
  STATUS = 'status',
  EFFECT = 'effect',
  INDIVIDUAL_ONLY = 'individual_only',
  STATUS_ID = 'status_id',
  FIDUCIARY_SOCIETY_ONLY = 'fiduciary_society_only',
  INCLUDE_CONSOLIDATED = 'include_consolidated',
  BUSINESS_TYPES = 'business_types',
}
