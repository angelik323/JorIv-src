type IdType = string | number | null

export interface IOperationAuthorization {
  operation_type: 'operation' | 'transfer'
  id: number
  budget_document_type?: {
    id: IdType
    code: string | null
    description: string | null
    requires_authorization?: boolean | null
  } | null
  addition?: boolean | null
  addition_number?: IdType
  date?: IdType
  rejection_reason?: IdType
  resolution_number?: IdType
  total_amount?: IdType
  third_party_beneficiary?: Array<{
    id: IdType
    document: IdType
    legal_person?: {
      business_name: string | null
    } | null
    natural_person?: {
      full_name: string | null
    } | null
  }> | null
  total_value?: IdType
  details?: Array<{ nature?: IdType }> | null
}

export interface ISelectedOperationItem {
  id: string | number
  type: 'operation' | 'transfer'
}

export interface IOperationAuthorizationReject {
  action: 'reject'
  rejection_reason: string
  operations: ISelectedOperationItem[]
}

export interface IOperationAuthorizationApprove {
  action: 'authorize'
  operations: ISelectedOperationItem[]
}

export interface IOperationAuthorizationRow {
  id?: IdType
  operation_type?: 'operation' | 'transfer' | null
  business_id: IdType
  business_code?: IdType
  business_description?: IdType
  validity: IdType
  document_type_id: IdType
  document_type_code?: IdType
  document_type_description?: IdType
  document_number?: IdType
  transfer_number?: IdType
  nature?: IdType
  addition_number?: IdType
  operation_date?: IdType
  value?: IdType
  third_party_id?: IdType
  third_party_name?: IdType
  rejection_reason?: IdType
  status?: IdType
}

export interface IOperationAuthorizationFormEdit {
  id?: number | null
  type?: 'DESTINO' | 'ORIGEN' | null
  validity?: IdType
  month: IdType
  day?: IdType
  business_trust_id?: IdType
  business_trust_id_description?: IdType
  third_party_id?: IdType
  third_party_description?: IdType
  area_id: IdType
  area_description?: IdType
  movement_code_id?: IdType
  budget_item_id?: IdType
  budget_item_description?: IdType
  resource_id?: IdType
  resource_description?: IdType
  value: IdType
  adjusted_value?: IdType
  actions?: IdType
}

export interface ITransferFormData {
  originRows: IOperationAuthorizationFormEdit[]
  destinationRows: IOperationAuthorizationFormEdit[]
}

// Filas para formulario de traslados (origen/destino)
export interface ITransferDetailRow {
  id?: number
  month: number | null
  area_id: number | null
  area_code?: string
  area_description?: string
  budget_item_id: number | null
  budget_item_code?: string
  budget_item_description?: string
  resource_id: number | null
  resource_code?: string
  resource_description?: string
  value: number | null
}

// Backend: detalle de bitácora de operación (show)
export interface IOperationLogDetailBackend {
  id: number
  year: number
  month: number
  day: string | null
  areas_responsibility?: { id: number; code: string; description: string }
  code_movement?: {
    id: number
    movement_code: string
    movement_description: string
  }
  budget_item?: { id: number; code: string; description: string }
  budget_resource?: { id: number; code: string; description: string }
  value: IdType
  adjusted_value?: IdType
}

// Backend: Respuesta para operación estándar (_getByOperationId)
export interface IOperationStandardResponseBackend {
  id: number
  operation_log_details: IOperationLogDetailBackend[]
}

// Backend: Estructura de fila de traslado (origen/destino) en respuesta del backend
export interface ITransferRowBackend {
  id: number
  type: 'ORIGEN' | 'DESTINO'
  business_trust: {
    id: number
    code: string
    name: string
  } | null
  budget_item: {
    id: number
    code: string
    description: string
  }
  budget_resource: {
    id: number
    code: string
    description: string
  }
  responsibility_area: {
    id: number
    code: string
    description: string
  }
  third_party: {
    id: number
    name: string
    legal_person?: {
      business_name: string
    }
    natural_person?: {
      full_name: string
    }
  } | null
  month: number
  amount: IdType
}

// Backend: Respuesta para traslado (_getByOperationId)
export interface IOperationTransferResponseBackend {
  transfer_id: number
  origin: ITransferRowBackend[]
  destination: ITransferRowBackend[]
}

export interface IOperationAuthorizationResponse {
  operation?: IOperationStandardResponseBackend
  transfer?: IOperationTransferResponseBackend
}

// Interfaces para actualización de operaciones
export interface IOperationUpdateDetail {
  id?: number
  year: IdType
  month: IdType
  day: IdType
  areas_responsibility_id: number | null
  code_movements_source_destination_id: number | null
  budget_item_id: number | null
  budget_resource_id: number | null
  value: string | number
  adjusted_value?: IdType
}

export interface IOperationUpdatePayload {
  type: 'operation'
  id: string | number
  details: IOperationUpdateDetail[]
}

// Interfaces para actualización de traslados
export interface ITransferUpdateDetail {
  id?: number
  type?: 'DESTINO' | 'ORIGEN' | null
  month: number
  responsibility_area_id: number | null
  budget_item_id: number | null
  budget_resource_id: number | null
  third_party_id?: number | null
  business_trust_id?: number | null
  amount: string | number
}

export interface ITransferUpdatePayload {
  type: 'transfer'
  id: string | number
  details: ITransferUpdateDetail[]
}

// Union type para el payload de actualización
export type IOperationAuthorizationUpdatePayload =
  | IOperationUpdatePayload
  | ITransferUpdatePayload
