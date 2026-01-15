export interface IResourceBudgetForm {
  id?: number
  status_id: number | null

  structure_resource: string | null // ID de la estructura de recurso seleccionada

  code: string // Código del recurso presupuestal
  description: string // Descripción en mayúsculas
  type: 'totalizador' | 'operativo' | '' // Tipo del recurso
  resource_type_id?: number | null // ID del tipo de recurso (relación con otra tabla)
  resource_type_description?: string | null // Descripción del tipo de recurso

  has_bank_account: boolean // ¿Maneja cuenta bancaria?
}
export interface IResourceBankAccountForm {
  bank_id: number | null
  bank_code?: string
  bank_name: string
  city_id?: number | null
  city_name?: string | null
  branch_id?: number | null
  branch_name?: string | null
  account_type: string
  account_number: string
}

export interface IResourceBudgetPayload {
  id?: number
  code: string
  description: string
  type: string
  code_type_id: number | null
  budget_structure_id: number | null
  manage_bank_account: 1 | 0
  bank_id?: number | null
  city_id?: number | null
  branch_id?: number | null
  type_account?: string
  number_account?: string
  status_id?: number | null
}
export interface IResourceBudget {
  id: number | null
  structure: {
    code: string | null
    purpose: string | null
  }
  code: string | null
  description: string | null
  type: string | null
  resource_type: {
    id: number | null
    description: string | null
  }
  manage_bank_account: 'Si' | 'No' | null
  status_id: number | null
  bank_account: {
    bank: {
      id: number | null
      name: string | null
      code: string | null
    } | null
    bank_name: string | null
    city: {
      id: number | null
      name: string | null
    } | null
    branch: {
      id: number | null
      name: string | null
    } | null
    account: {
      type: string | null
      number: string | null
    } | null
    account_number: string | null
  } | null
}

export interface IBudgetResourceType {
  id: number | null
  code: string | null
  description: string | null
}
export interface ResourceBudgetState {
  resource: IResourceBudget | null
  typeResource: IBudgetResourceType | null
  resources: IResourceBudget[]
  typeResources: IBudgetResourceType[]
  isLoading: boolean
  error: string | null
}
