export interface IAccountingReportListReceiptsForm {
  id?: number | null
  business_trust_id?: number | null
  accounting_structure_id?: number | null
  from_period?: string
  to_period?: string
  from_receipt_types_id?: number | null
  to_receipt_types_id?: number | null
  from_consecutive?: number | null
  to_consecutive?: number | null
  from_account?: number | null
  to_account?: number | null
  report_template_id?: number | null
  user?: string
}
export interface IAccountingReportListReceiptsTable {
  id?: number
  period?: string
  voucher?: number | null
  voucher_subtype?: number | null
  consecutive?: number | null
  register_date?: string
  status?: string
  is_selected?: boolean
}

export interface IAccountingReportListReceiptsCheckbox {
  rows: number
  selected: IAccountingReportListReceiptsTable[]
}

export type TAccountingReportListReceiptsFilters = {
  'filter[accounting_structure_id]': string | number | null | undefined
  'filter[business_trust_id]': string | number | null | undefined
  'filter[from_consecutive]': string | number | null | undefined
  'filter[from_period]': string | number | null | undefined
  'filter[from_receipt_types_id]': string | number | null | undefined
  'filter[to_consecutive]': string | number | null | undefined
  'filter[to_period]': string | number | null | undefined
  'filter[to_receipt_types_id]': string | number | null | undefined
  report_template_id: string | number | null | undefined
  'filter[type]'?: string | number | null | undefined
  file_type: string | undefined
}
