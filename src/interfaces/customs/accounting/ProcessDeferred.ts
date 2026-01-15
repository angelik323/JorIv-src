export interface IProcessDeferredPayload {
  account_structure_id: number
  period: string
  from_business_trust_id: number
  to_business_trust_id: number
}

export interface IDeferredVoucher {
  id: number
  registration_date: string
  receipt_type: {
    id: number
    code: number
    name: string
  }
  sub_receipt_type: {
    id: number
    code: number
    name: string
  }
  business_trust: string
  detail: string
  voucher_code: string
  total_debit: string
  total_credit: string
  voucher_details: IVoucherDetail[]
}

export interface IVoucherDetail {
  id: number
  account_chart: {
    id: number
    code: string
    name: string
  }
  cost_center: {
    id: number
    code: string
    name: string
  }
  third_party: {
    id: number
    document: string
    document_type: string
    name: string
  }
  debit: string
  credit: string
  detail: string
}
