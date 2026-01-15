export interface IOpeningRecordStatus {
  id: number
  name?: string
}

export interface IOpeningRecord {
  index?: number
  id: number
  code: string
  name: string
  type: string
  estructura: string
  purpose: string
  code_structure?: string
  status: IOpeningRecordStatus | string
  status_id?: number
  account_structure_id?: number
  account_chart_id?: number
  cost_center_type?: string
  debit?: string | number
  credit?: string | number
  initial_balance?: string | number
  current_period?: string | number
  previous_period?: string | number

  final_period?: string
  initial_period?: string
  business_trust?: string
  account_structure?: string

  afecta_consolidacion?: string
  periodo_actual?: string
  negocio?: string
  id_negocio?: string
}

export interface IOpeningRecordItem {
  code: string
  id: number
  name: string
  purpose: string
  status_id: number
  status?: IOpeningRecordStatus
  structure: string
  type: string
}

export interface IOpeningRecordModel {
  opening_reason?: string
  final_period?: string
  initial_period?: string
  to_business?: number
  from_business?: number
  accounting_structure_id?: number

  id?: number
  structure_id?: number
  from_business_id?: number
  to_business_id?: number
  leave_in_period?: string
  current_period?: null | string
  accounts_chart_id?: number

  business_ids: (number | { id_negocio: number })[]
}

export interface IOpeningRecordCatalog {
  id?: number
  code: string
  name: string
  type: string
}

// =======================
// Payload para crear apertura
// =======================

export interface IOpeningRecordCreatePayload {
  // en v1 algunos tests no mandan todo ⇒ opcionales
  accounting_structure_id?: number
  from_business?: number
  to_business?: number
  business_ids: number[]
  from_business_id?: number | null
  to_business_id?: number | null

  initial_period?: string
  final_period?: string
  opening_reason?: string
  accounts_chart_id?: number
}

export interface IProcessReportRow {
  id: number | string
  code: string
  name: string
  detail: string
}

export interface IProcessReportData {
  processId?: number
  successful?: IProcessReportRow[]
  pending?: IProcessReportRow[]
}

export interface ISuccessRow {
  business_code: string
  business_name: string
  affects_consolidation?: boolean
  afecta_consolidacion?: boolean
  initial_period: string
  final_period: string
  index?: number
}

export interface IPendingRow {
  business_code: string
  business_name: string
  detail: string[] | string
  index?: number
}

export interface IOpeningRecordProcessReportData {
  processId: number
  successful?: ISuccessRow[]
  pending?: IPendingRow[]
}

// =======================
// Respuesta API apertura
// =======================

export interface IOpeningRecordResponseData {
  id: number
  successful: ISuccessRow[]
  pending: IPendingRow[]
}

export interface IOpeningRecordResponse {
  message: string
  success: boolean
  structure: {
    id: number
    structure: string
    purpose: string
    type: string
  }
  chart: {
    id: number
    structure: string
    purpose: string
    type: string
  }
  data: IOpeningRecordResponseData
}

export interface OpeningRecordFormExpose {
  validate: () => Promise<boolean>
  getFormData: () => IOpeningRecordModel
}

export type ProcessModalExpose = {
  openModal?: () => void
  open?: () => void
  closeModal?: () => void
  close?: () => void
}
