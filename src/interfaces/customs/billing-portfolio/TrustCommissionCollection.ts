import Big from 'big.js'

export interface ITrustCommissionCollectionItemList {
  id: number
  business_code: string
  business_name: string
  expire_at: string
  init_date: string
  invoice_number: string
  status: { id: number; name: string; created_by: null }
  status_id: number
  third_party_billing: {
    id: string
    third_party_address: string
    third_party_document: string
    third_party_document_type: string
    third_party_email: string
    third_party_id: string
    third_party_name: string
  }
  total: string
  type_invoice: string
  payment?: {
    total_pay?: number
    total_credited?: number
    total_pending?: number
  }

  payment_number?: string | number | Big
  payment_amount?: number | Big
  amount_credited?: number | Big
  amount_credited_original?: number
  amount_pending?: number | Big
  amount_pending_original?: number | Big
}

export interface IApplyCollection {
  invoices: IInvoicesCollection[]
}

export interface IInvoicesCollection {
  id: number
  payment_number: string | number | Big
  payment_amount: number | Big
  amount_credited: number | Big
  amount_pending: number | Big
  type: string
}
