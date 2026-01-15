export interface IOperatingAccountList {
  id: number
  code: string
  name: string
  type: string
  nature: string
  has_cost_center: boolean
  is_currency_reexpressed: boolean
  status: {
    id: number
    status: string
  }
}

export interface IAccountingRestatementPayload {
  account_id: number | string
  cost_center_structure_id: number | string
  cost_center_id: number | string
  third_party_id: number | string
  income_fund_tpmv?: number | null
  expense_fund_tpmv?: number | null
  difference: string
  date_from?: string
  date_to?: string
  from_business_id?: number
  to_business_id?: number
}

export interface IAccountRestatementPending {
  code: string
  name: string
  detail: string
}

//V2

// Tables for Exchange Difference Restatement Module
export interface IExchangeDifferenceRestatementListProcessItem {
  id?: number | string
  proceso?: string
  fecha_proceso?: string
  periodo?: string
  estructura_contable?: string
  desde_negocio?: string
  hasta_negocio?: string
  estado?: string
  Es_proceso_de_deshacer?: boolean
}

export interface IExchangeDifferenceRestatementListDetailsItem {
  negocio?: string
  fecha_proceso?: string
  novedad?: string
}

export interface IExchangeDifferenceRestatementListCalculationsItem {
  id: number
  novedad?: string
  negocio?: string
  periodo?: string
  fecha?: string
  cuenta_contable?: string
  tercero?: string
  saldo_moneda_extranjera?: string | number
  moneda?: string
  saldo_moneda_local?: string | number
  trm_dia?: string | number
  saldo_reexpresado?: string | number
  diferencia?: string | number
  estado?: {
    id: number
    status: string
  }
  novedades?: []
}

export interface IExchangeDifferenceRestatementListItemChildrenVoucher {
  id: number
  negocio?: string
  tipo_comprobante?: string
  consecutivo?: number
  estado?: string
}

export interface IExchangeDifferenceRestatementListUndoItem {
  id: number
  negocio?: string
  periodo?: string
  fecha?: string
  cuenta_contable?: string
  tercero?: string
  saldo_moneda_extranjera?: string | number
  moneda?: string
  saldo_moneda_local?: string | number
  trm_dia?: string | number
  saldo_reexpresado?: string | number
  diferencia?: string | number
  estado?: {
    id: number
    status: string
  }
  novedades?: []
}

export interface IExchangeDifferenceRestatementListItem {
  id: number
  process?: string
  period?: string
  structure?: string
  from_business?: string
  to_business?: string
  status?: {
    id: number
    status: string
  }
}

// Request for Exchange Difference Restatement Module
export interface IExchangeDifferenceRestatementRequest {
  process_info?: {
    name?: string
    status?: string
    date?: string
    structure?: string
  }
  restatement_detail?: {
    id?: number
    negocio?: string
    periodo?: string
    fecha?: string
    cuenta_contable?: string
    tercero?: string
    saldo_moneda_extranjera?: string
    moneda?: string
    saldo_moneda_local?: string
    trm_dia?: string
    saldo_reexpresado?: string
    diferencia?: string
    estado?: string
    novedades?: string[]
  }
  related_records?: Array<{
    negocio?: string
    fecha_proceso?: string
    novedad?: string
  }>
}

// Structure for Exchange Difference Restatement Module
export interface IExchangeDifferenceRestatementUndoProcess {
  id?: number | null
  ids: number[]
  filter?: {
    period?: string
    structure_id?: number
    from_business?: string
    to_business?: string
    undo_date?: string
    closing_type?: string
  }
  process_id?: number
}

// Voucher Process for Exchange Difference Restatement Module
export interface IExchangeDifferenceRestatementVoucherProcess {
  restatement_ids: number[]
  sub_receipt_type_id: number
}

export interface IExchangedDifferenceRestatementDataForm {
  voucher_data?: IExchangeDifferenceRestatementVoucherProcess
  undo_data?: IExchangeDifferenceRestatementUndoProcess
  view_data?: IExchangeDifferenceRestatementRequest
  process_data?: IExchangeDifferenceRestatementListProcessItem
  process?: Record<string, unknown>
}

export interface IExchangeDifferenceRestatementFiltersVoucher {
  period?: string
  accounting_structure_id?: number | string | null
  from_business_code?: string | number
  to_business_code?: string | number
  generation_date?: string
  closing_type?: string
}
