export interface IOrpaFulfillmentCancelationNonTreasuryListItem {
  id: number
  orpa_number: number
  created_at: string
  proveedor: string
  beneficiario: string
  total_amount: string
  observations: string
  legalization_account: string
  status: number
}

export interface IOrpaFulfillDataForm {
  legalization_account: number | null
  voucher_type_id: number | null
  subtype_voucher_id: number | null
  date: string | null
  observation: string
}

export interface IOrpaCancelDataForm {
  reason: number | null
  date: string | null
  observations: string
}

export interface IOrpaFulfillPayload extends IOrpaFulfillDataForm {
  orpa_ids: number[]
}

export interface IOrpaCancelPayload extends IOrpaCancelDataForm {
  orpa_ids: number[]
}
