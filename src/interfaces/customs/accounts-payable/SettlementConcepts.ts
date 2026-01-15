export interface ISettlementConceptsFilters {
  'filter[structure_id]': string
  'filter[settlement_concept]': string
  'filter[search]': string
}

export interface ISettlementConceptItem {
  id: number
  structure_id: number
  structure_label?: string | null
  concept_code: string
  concept_label?: string | null
  description: string
  type: string
  type_label?: string | null
  apply_iva: boolean
  class: string
  class_label?: string | null
  percentage: number
  has_minimum_uvt: boolean 
  min_withholding_uvt: number
  min_withholding_iva_uvt: number
  min_withholding_pesos: number
  min_withholding_iva_pesos: number
  plan_account_id?: number | null
  plan_account_label?: string | null
  liability_account_id?: number | null
  liability_account_label?: string | null
  expense_account_id: number
  expense_account_label?: string | null
  fiscal_charge_id: number
  fiscal_charge_label?: string | null
  credit_notes_account_id: number
  credit_notes_account_label?: string | null
  status: {
    id: number
    name?: string
    description?: string
  }
  created_at?: string | null
  updated_at?: string | null
}

export interface ISettlementConceptsForm {
  id?: number | null
  structure_id: number | string | null
  structure_label?: string | null
  concept_code: string | null
  description: string | null
  type: string | null
  apply_iva: boolean
  class: string | null
  class_label?: string | null
  percentage: number | string | null
  has_minimum_uvt: boolean 
  min_withholding_uvt: number | string | null
  min_withholding_iva_uvt: number | string | null
  min_withholding_pesos: number | string | null
  min_withholding_iva_pesos: number | string | null
  plan_account_id: number | string | null
  plan_account_label?: string | null
  liability_account_id: number | string | null
  liability_account_label?: string | null
  expense_account_id: number | string | null
  expense_account_label?: string | null
  fiscal_charge_id: number | string | null
  fiscal_charge_label?: string | null
  credit_notes_account_id: number | string | null
  credit_notes_account_label?: string | null
  status_id?: number | null
  created_at?: string | null
  updated_at?: string | null
}

export interface ISettlementConceptsCreatePayload {
  structure_id: number
  concept_code: string
  description: string
  type: string
  apply_iva: boolean
  class: string
  percentage: number
  has_minimum_uvt: boolean 
  min_withholding_uvt?: number | null 
  min_withholding_iva_uvt?: number | null 
  min_withholding_pesos?: number | null 
  min_withholding_iva_pesos?: number | null
  plan_account_id?: number | null
  liability_account_id?: number | null
  expense_account_id: number | null
  fiscal_charge_id: number
  credit_notes_account_id: number | null
}

export interface ISettlementConceptsUpdatePayload {
  structure_id: number
  description: string
  percentage: number
  apply_iva?: boolean 
  has_minimum_uvt: boolean
  min_withholding_uvt?: number | null
  min_withholding_iva_uvt?: number | null
  min_withholding_pesos?: number | null
  min_withholding_iva_pesos?: number | null
  plan_account_id?: number | null
  liability_account_id?: number | null
  expense_account_id?: number | null
  fiscal_charge_id: number
  credit_notes_account_id?: number | null
  status_id: number
}

export interface ISettlementConceptTableRow extends ISettlementConceptItem {
  structure?: string | null
  concept?: string | null
  liability_account?: string | null
  fiscal_charge?: string | null
  expense_account?: string | null
}

// Interfaz para la respuesta del backend (GET show)
export interface IBackendSettlementConcept {
  id: number
  structure?: {
    id: number
    code: string
    structure: string
  }
  concept?: string
  concept_description?: string
  type?: string
  apply_iva?: boolean
  class?: string
  percentage?: string | number
  has_minimum_uvt?: boolean
  min_withholding_uvt?: number | null
  min_withholding_iva_uvt?: number | null
  min_withholding_pesos?: number | null
  min_withholding_iva_pesos?: number | null
  plan_account?: {
    id: number
    code: string
    description?: string
    name?: string
  }
  liability_account?: {
    id: number
    code: string
    name?: string
  }
  expense_account?: {
    id: number
    code: string
    name?: string
  }
  fiscal_charge?: {
    id: number
    code: string
    name?: string
  }
  credit_notes_account?: {
    id: number
    code: string
    name?: string
  }
  status?: {
    id: number
    name: string
  }
  created_at?: string
  updated_at?: string
}