import { QTable } from 'quasar'

export interface IAccountingReport {
  id: number
  code: string
  name: string
  type: string
  estructura: string
  purpose: string
  code_structure?: string
  status: IAccountingReportStatus | string
  status_id?: number
  account_structure_id?: number
  account_chart_id?: number
  cost_center_type?: string
  period?: string
  business_trust?: string
  accounting_structure?: string
  title?: string
  business?: string
  // data?: {
  //   data: any[]
  // }[]
}

export interface IAccountingReportItem {
  code: string
  id: number
  name: string
  purpose: string
  status_id: number
  status?: IAccountingReportStatus
  structure: string
  type: string
}

export interface IAccountingReportStatus {
  id: number
  name?: string
}

export interface IAccountingReportModel {
  report_template_id: string
  level: number | string
  from_account: string
  to_account: string
  business_id: number
  account_structure_id: number | string
  structure_by_business: number
  amount_type: string
  from_period: string
  to_period: string
}

// Reporte Estado financiero comparativo

export interface IComparativeStatementModel {
  report_template_id: string
  level: number | string
  from_account: string
  to_account: string
  business_id: number | string
  account_structure_id: number | string
  structure_by_business: number | string
  amount_type: string
  period: string
  last_period: string
}

export interface IAccountingReportCatalog {
  id?: number
  code: string
  name: string
  type: string
}

export interface IAccountingReportCreatePayload {
  accounting_structure_id: number
  from_business_id: number
  to_business_id: number
  leave_in_period: string
  current_period: string
  accounts_chart_id: number
  business_ids: number[]
}

export interface IAccountingReportResponse {
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
  data: {
    successful: []
    pending: []
  }
}

// Reporte balance general de prueba otras monedas

export interface IGBTOtherCurrenciesModel {
  report_template_id: string
  business_trust_id: number
  account_structure_id: number | string
  level: number | string
  from_period: string
  to_period: string
  from_account_id: number
  to_account_id: number
  show_auxiliaries: boolean
  from_auxiliaries_id: number | null
  to_auxiliaries_id: number | null
  rate_code: string
  rate: string
}

export interface IOtherCurrenciesItem {
  account: string
  auxiliary: string
  name: string
  initial_balance: number
  debit: number
  credit: number
  final_balance: number
}

export interface IOtherCurrenciesTableRow {
  account_code: string
  auxiliary_name: string
  account_name: string
  initial_balance: number
  debit: number
  credit: number
  final_balance: number
}

type SectionRowTuple = [string, string, number, number, number]
export interface SectionDTO {
  title: string
  rows: SectionRowTuple[]
  total: [number, number, number]
}
export interface OpeningRow {
  id?: string
  code: string
  name: string
  current_period: number
  previous_period: number
  variation: number
}

// Reporte Centros de costo

export interface ICostCenterReportModel {
  report_template_id: string
  level: number | string
  from_account: string
  to_account: string
  business_id: number
  account_structure_id: number
  structure_by_business: number
  amount_type: string
  period: string
  last_period: string
  from_cost_center_id: string
  to_cost_center_id: string
}

// Reporte estado de cambios en el patrimonio

export interface ILegacyReportModel {
  report_template_id: string
  level: number | string
  business_id: number
  account_structure_id: number | string
  structure_by_business: number
  from_period: string
  to_period: string
  comparative_from: string
  comparative_to: string
}

export interface OpeningLegacyRow {
  id?: string
  code: string
  name: string
  period: number
  comparative: number
}

export type ApiRow = {
  code: string
  name: string
  period: string
  comparative: string
  level?: number
}

// Reporte estado de general de resultados

export interface IGeneralReportModel {
  report_template_id: string
  level: number | string
  business_id: number
  account_structure_id: number
  from_period: string
  to_period: string
}

export interface OpeningGeneralRow {
  id?: string
  code: string
  name: string
  period: number
  comparative: number
  variation: number
}

export type ApiRowInOut = {
  code: string
  name: string
  saldo_periodo?: unknown
  saldo_comparativo?: unknown
  variacion?: unknown
  period?: unknown
  comparative?: unknown
  variation?: unknown
}

// Reporte auxiliar acumulado

export interface IAccumulatedAuxiliaryModel {
  report_template_id: string
  level: number | string
  business_id: number
  account_structure_id: number
  structure_by_business: number
  from_period: string
  to_period: string
  from_account: string
  to_account: string
}

export type MovementRow = {
  id: string
  registration_date: string
  receipt_type: number
  sub_receipt_type: number
  consecutive: number
  detail: string
  debit: number
  credit: number
  foreign_currency_movement: number
}

export type AccumulatedAccount = {
  account_code: string
  account_name: string
  initial_balance: string
  debit: string
  credit: string
  final_balance: string
  initial_foreign_balance: string
  final_foreign_balance: string
  movements: Array<{
    registration_date: string
    receipt_type: number
    sub_receipt_type: number
    consecutive: number
    detail: string
    debit: string
    credit: string
    foreign_currency_movement: string
  }>
}

export type PaginatedAccumulated = {
  current_page: number
  last_page: number
  data: AccumulatedAccount[]
  reportables?: { report_pdf_url?: string; report_excel_url?: string }
}

export type AccountSection = {
  title: string
  header: {
    initial_balance: number
    final_balance: number
    initial_foreign_balance: number
    final_foreign_balance: number
    debit: number
    credit: number
  }
  columns: QTable['columns']
  rows: MovementRow[]
}

// Reporte periodo financiero

export interface IPeriodStatementModel {
  report_template_id: number | string
  business_trrust_id: number
  level: number | string
  from_period: string
  to_period: string
  from_account: string
  to_account: string
  from_third_party: string
  to_third_party: string
  amount_type: string
  from_cost_center: string
  to_cost_center: string
  account_structures_id: number | string
}

// Reporte Libro diario

export interface IDiaryBookModel {
  report_template_id: string
  business_id: number
  account_structure_id: number | string
  from_period: string
  to_period: string
  from_receipt_types_id: string
  to_receipt_types_id: string
}

export interface IReceiptTypeOption {
  label: string
  id: number
  code: number
  name: string
}

// Reporte Libro mayor

export interface IGeneralLedgerReportModel {
  report_template_id: number | string
  business_trust_id: number
  from_period: string
  to_period: string
  accounting_structure_id: number | string
  from_account?: string
  to_account?: string
  paginate?: number
}

type MovementGeneral = {
  account_name?: string
  account_code?: string
  date: string
  receipt_type_code: number | string
  sub_receipt_type_code: number | string
  consecutive: number | string
  register_detail: string
  debit: string | number
  credit: string | number
  foreign_currency?: string | number
}

export type AccountBlockGeneral = {
  account_code?: string
  account_name?: string
  initial_balance: string | number
  initial_foreign_currency: string | number
  final_balance: string | number
  final_foreign_currency: string | number
  movements: MovementGeneral[]
}

// Reporte Balance diario

export interface IDailyBalanceModel {
  report_template_id: number
  business_trust_id: number
  accounting_structure_id: number | string
  date_to: string
  from_account: string
  to_account: string
  level: number | string
  from_third_party: string
  from_cost_center: string
  to_third_party?: string
  to_cost_center?: string
  amount_type: string
}

// Types reportes contables

// Valores permitidos en queries; incluye arrays si necesitas filtros múltiples
type QueryPrimitive = string | number | boolean | null | undefined
export type QueryParams = Partial<
  Record<string, QueryPrimitive | QueryPrimitive[]>
>

// Enlaces comunes de reportes (extensible)
export type Reportables = {
  report_excel_url?: string
  report_pdf_url?: string
}

// Contenedor estándar de paginación (genérico)
export type Paginated<T, R extends object = Reportables> = {
  data: T[]
  current_page: number
  last_page: number
  reportables?: R
}

// Contenedor estándar por secciones (genérico)
export type WithSections<T, R extends object = Reportables> = {
  sections: T[]
  reportables?: R
}

export type DropdownOption = {
  label: string
  icon?: string
  routeName?: string
  action?: () => void
}
export type ApiResponse = { success: boolean; message: string; data: unknown }
