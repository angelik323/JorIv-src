export interface IPendingVoucherItem {
  id: number
  registration_date: string
  business_trust: {
    business_code: string
    name: string
  }
  receipt_type: {
    code: string
    name: string
  }
  code: string
  amount: string
  user: {
    id: number
    name: string
  }
  load: string
  status: { status: string; id: number }
}

export interface IVoucherAuthorizationPayload {
  action: 'approve' | 'reject'
  voucher_ids: string[] | number[]
  authorization_notes: string
}
