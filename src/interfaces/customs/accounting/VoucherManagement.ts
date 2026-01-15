export interface IVoucherManagementList {
  data: IVoucherManagementListItem[]
  pages: {
    currentPage: number
    lastPage: number
  }
}

export interface IVoucherManagementListItem {
  id: number
  period_date: string
  structure: string
  from_business_trust_id: {
    business_name: string
  }
  to_business_trust_id: {
    business_name: string
  }
  status: {
    id: string
    status: string
  }
  process_result: string | null
}

export interface IVoucherManagementValidationForm {
  period_date: string | null
  structure: string | null
  from_business_trust_id: string | number | null
  to_business_trust_id: string | number | null
  from_business_trust_code?: string | null
  to_business_trust_code?: string | null
}

export interface IVoucherManagementUpdateForm
  extends IVoucherManagementValidationForm {
  daily_closing: boolean | null
  update: string
  day_to_update: string | null
  needs_voucher: boolean | null
  from_update: boolean
  update_custom_label?: string | null
}

export interface ICreateValidatePayload
  extends IVoucherManagementValidationForm {
  vouchers_ids?: number[]
}

export interface IUpdateVoucherPayload {}

export interface IErrorsOnValidate {
  id: number
  business_code: string
  business_name: string
  voucher_type: number | string
  voucher_type_name: string
  voucher_sub_type: number | string
  voucher_sub_type_name: string
  voucher_code: number | string
  voucher_id: number
  errors: string[]
  index: number
}

export interface IVoucherManagementView {
  id: number
  period_date: string
  structure: string
  structure_levels?: string
  from_business_trust_id: {
    id: number
    business_code: string
    business_name: string
  }
  to_business_trust_id: {
    id: number
    business_code: string
    business_name: string
  }
  daily_closing: boolean
  update: string
  day_to_update: string
  needs_voucher: boolean
  receipt_type_id: null
  sub_receipt_type_id: null
  status: {
    id: number
    status: string
  }
  alerts: IErrorsOnValidate[]
}

export interface IValidateVoucherResponse {
  data: IErrorsOnValidate[] | number[][]
  success: boolean
}
