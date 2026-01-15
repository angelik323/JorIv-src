export interface IEquivalentVaucherList {
  id: number
  source_voucher_sub_type: ISubtypeVaucher
  equivalent_voucher_sub_type: ISubtypeVaucher
  fiscal_voucher_sub_type: ISubtypeVaucher
  status: {
    id: number
    name: string
  }
}
interface ISubtypeVaucher {
  id: number
  code: string
  name: string
}

export interface IEquivalentVaucher {
  index: number
  source_voucher_sub_type_id: number
  equivalent_voucher_sub_type_id: number
  fiscal_voucher_sub_type_id: number
}

export interface IEquivalentVaucherCreatePayload {
  valid_vouchers: IEquivalentVaucher[]
}

export interface IFileEquivalentVaucher {
  file: File
}

export interface IFailureItem {
  index: number
  source_voucher_sub_type: number
  equivalent_voucher_sub_type: number
  fiscal_voucher_sub_type: number
  errors: string[]
}

export interface IValidVoucherItem {
  index: number
  source_voucher_sub_type_id: number
  equivalent_voucher_sub_type_id: number
  fiscal_voucher_sub_type_id: number
}

export interface TValidateResponseSuccess {
  success: true
  message: string
  data: {
    file_name: string
    uploaded_at: string
    total_count: number
    failed_count: number
    valid_count: number
    validated_vouchers: IValidVoucherItem[]
  }
}

export interface TValidateResponseError {
  success: false
  message: string
  data: {
    file_name: string
    uploaded_at: string
    total_count: number
    valid_count: number
    failed_count: number
    failures: IFailureItem[]
    valid_vouchers: IValidVoucherItem[]
  }
}

export type TValidateResponse =
  | TValidateResponseSuccess
  | TValidateResponseError

export interface IExportFailureItem {
  index: number
  source_voucher_sub_type: number
  equivalent_voucher_sub_type: number
  fiscal_voucher_sub_type: number
  errors: string[]
}

export interface ITableRow {
  subtype_receipt_origin: number | string | null
  equivalent_voucher_subtype: number | string | null
  tax_receipt_subtype: number | string | null
}

export interface ISelectOption {
  value: number | string
  label: string
}

export interface ISelectedSubtypeRow {
  subtype_receipt_origin: number
  equivalent_voucher_subtype: number
  tax_receipt_subtype: number
}

export interface IImportedFileRow {
  id: number
  name: string
  total: number
  status_id: number
  actions: string[]
}
