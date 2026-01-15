// Interfaces para Cierre de Vigencia
export interface IClosureVigency {
  id?: string | number | null
  action_type?: 'close' | 'undo' | null // close = Crear cierre, undo = Deshacer cierre
  close_by?: 'document' | 'business' | null // document = Documento, business = Negocio
  document_type_id?: string | number | null
  document_type?: {
    id: string | number | null
    code: string | null
    name: string | null
  } | null
  vigency?: number | null
  business_from_id?: string | number | null
  business_from?: {
    id: string | number | null
    code: string | null
    name: string | null
  } | null
  business_to_id?: string | number | null
  business_to?: {
    id: string | number | null
    code: string | null
    name: string | null
  } | null
  document_number_id?: string | number | null
  document_number?: string | null
  status?: 'Exitoso' | 'Con error' | 'Pendiente' | null
  error_message?: string | null
  error_report?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface IClosureVigencyRow {
  _row_number?: number
  id?: number | null
  process_number?: string | number | null
  action_type?: 'close' | 'undo' | null
  close_by?: 'document' | 'business' | null
  document_type_id?: number | null
  document_type_code?: string | null
  document_type_name?: string | null
  document_number_id?: number | null
  document_number?: string | null
  year?: number | null
  vigency?: number | null
  process_date?: string | null // Formato: AAAA/MM/DD
  process_time?: string | null // Formato: hh:mm am/pm
  user_name?: string | null
  business_from_id?: number | null
  business_from_code?: string | null
  business_from_name?: string | null
  business_to_id?: number | null
  business_to_code?: string | null
  business_to_name?: string | null
  status?: 'Exitoso' | 'Con error' | 'Pendiente' | 'Procesando' | null
  error_message?: string | null
}

// Interface para el listado de negocios en el formulario de crear
export interface IBusinessForClosure {
  id?: number | null
  code?: string | null
  name?: string | null
  closure_type?: 'Diario' | 'Mensual' | null
  document_type_code?: string | null
  document_type_name?: string | null
  document_number?: string | null
  last_closed_vigency?: number | null
  selected?: boolean
}

// Interface para los datos que vienen del API de list-business-trust-in-range
export interface IBusinessForClosureAPIResponse {
  '#': number
  business_trust: string
  closing_type: 'daily' | 'monthly' | null
  document_type: string | null
  document_number: string | number | null
  last_closing_date: string
}

export interface IClosureVigencyFilters {
  business_from_id?: string | number | null
  business_to_id?: string | number | null
  status?: 'Todos' | 'Exitoso' | 'Con error' | 'Pendiente' | null
  vigency_from?: string | null
  vigency_to?: string | null
}

export interface IClosureVigencyCreatePayload {
  action_type: 'close' | 'undo' // Crear cierre o Deshacer cierre
  close_by: 'document' | 'business' // Por documento o por negocio
  vigency: number
  business_trusts: number[] // IDs de los negocios seleccionados
}

export interface IBusinessListFilters {
  action_type: 'close' | 'undo'
  close_by: 'document' | 'business'
  document_type_id?: string | number | null
  vigency: number
  business_from_id: string | number
  business_to_id: string | number
  document_number_id?: string | number | null
}

// Interface para el detalle de cada registro en la ejecución
export interface IClosureVigencyExecutionDetail {
  id: string | number
  business_code: string
  business_name: string
  closure_type: 'Diario' | 'Mensual'
  document_type_code?: string | null
  document_type_name?: string | null
  document_number?: string | null
  level?: string | null
  budget_item_code?: string | null
  budget_item_name?: string | null
  resource_code?: string | null
  resource_name?: string | null
  area_code?: string | null
  area_name?: string | null
  value: number
  adjusted_value: number
  available_balance: number
  closure_vigency: number
  last_closed_vigency: number
  status: 'Exitoso' | 'Con error' | 'Procesando'
  error_message?: string | null
}

// Interface para el resultado de la ejecución
export interface IClosureVigencyExecutionResult {
  execution_id: string | number
  action_type: 'close' | 'undo'
  close_by: 'document' | 'business'
  document_type_id?: string | number | null
  document_type_code?: string | null
  document_type_name?: string | null
  vigency: number
  business_from_id: string | number
  business_from_code: string
  business_from_name: string
  business_to_id: string | number
  business_to_code: string
  business_to_name: string
  document_number_id?: string | number | null
  document_number?: string | null
  has_errors: boolean
  details: IClosureVigencyExecutionDetail[]
  created_at?: string | null
}

// Interface para confirmar el proceso
export interface IClosureVigencyConfirmPayload {
  execution_id: string | number
  process_partial: boolean // true si acepta procesar parcialmente cuando hay errores
}

// Interface para opciones de select genéricas
export interface ISelectOption {
  label: string
  value: string | number
  code?: string
  vigency?: number
}

// Interface para el item de document type del selector API
export interface IDocumentTypeSelectorItem {
  id: string | number
  code: string
  description?: string
  name?: string
}

// Interface para el item de business del API
export interface IBusinessSelectorItem {
  id: string | number
  code: string
  name: string
  vigency?: number
}

// Interface para filtros de números de documento
export interface IDocumentNumberFilters {
  document_type_id?: string | number | null
  vigency: number
  business_from_id: string | number
  business_to_id: string | number
}

// Interface para el item de document number del API
export interface IDocumentNumberItem {
  id: string | number
  document_number: string
}

// Interface para la vista de detalle del proceso (View)
export interface IClosureVigencyDetail {
  id: string | number
  process_number: string | number
  action_type: 'close' | 'undo'
  user_name: string
  status: 'Pendiente' | 'Procesando' | 'Con error' | 'Exitoso'
  vigency: number
  process_date: string // Formato: AAAA-MM-DD HH:MM:SS AM/PM
  has_errors: boolean
}

// Interface para el listado de negocios procesados (View)
export interface IProcessedBusiness {
  _row_number?: number
  id: string | number
  code: string
  name: string
  closure_type: 'Diario' | 'Mensual'
  last_closed_vigency: number | null
  status: 'Con error' | 'Exitoso'
  selected?: boolean
}

// Interface para el listado de documentos del negocio (View)
export interface IBusinessDocument {
  _row_number?: number
  id: string | number
  document_type_code: string
  document_type_name: string
  document_number: string
  new_document_type_code?: string | null
  new_document_type_name?: string | null
  new_document_number?: string | null
  last_closed_vigency: number | null
  level_code?: string | null
  level_name?: string | null
  budget_item_code?: string | null
  budget_item_name?: string | null
  resource_code?: string | null
  resource_name?: string | null
  area_code?: string | null
  area_name?: string | null
  balance: number
  value: number
  status: 'Con error' | 'Exitoso'
}
