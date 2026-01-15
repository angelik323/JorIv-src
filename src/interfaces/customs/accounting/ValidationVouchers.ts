export interface IVouncherValidationModel {
  id?: number
  period_date?: string
  structure?: any
  from_business_trust_id?: IBusinessTrustVoucher
  to_business_trust_id?: IBusinessTrustVoucher
  vouchers_ids?: number[]
  status?: any
}

export interface IVoucherErrorItem {
  business_code: string
  business_name: string
  voucher_type: number
  voucher_sub_type: number
  voucher_code: number
  errors: string[]
}

export interface IVoucherErrorResponse {
  data: IVoucherErrorItem[]
}
export interface IBusinessTrustVoucher {
  id: number
  business_code: string
  business_name: string
}

export interface IValidateVouchersForm {
  period_date: string
  structure: string | number
  structure_name?: string
  from_business_trust_id?: string | number
  from_business_trust_name?: string
  to_business_trust_id?: string | number
  to_business_trust_name?: string
  from_update: boolean
  daily_closing: boolean
  update: string
  day_to_update: string
  needs_voucher: boolean
}

export interface IValidateVouchersResponseItem {
  id: number
  vouchers: number[]
}

export type IValidateVouchersResponse = Array<IValidateVouchersResponseItem>

export interface IUpdateVouchersForm extends IValidateVouchersForm {
  status?: string | null
  receipt_type_id?: number | null
  sub_receipt_type_id?: number | null
  businesses?: IValidateVouchersResponse
}

export interface IValidationVouchersView {
  id?: number | null
  period_date: string
  structure: string
  structure_name: string
  from_business_trust_id: {
    id: number | null
    business_code: string | null
    business_name: string | null
  }
  to_business_trust_id: {
    id: number | null
    business_code: string | null
    business_name: string | null
  }
  daily_closing: boolean
  update: string
  day_to_update: string
  needs_voucher: boolean
  receipt_type_id: {
    id: number | null
    code: number | null
    name: string
  }
  sub_receipt_type_id: {
    id: number | null
    code: number | null
    name: string
  }
  status: {
    id: number | null
    status: string
  }
}
