export interface ICausationWithoutPaymentInstructionsListItem {
  id: number
  request_number: number
  internal_code: number
  client_code: number
  date: string
  supplier_id: string
  base_value: string
  discounts: string
  net_value: string
}

export interface ICausationWithoutPaymentInstructionsForm {
  tax_provision: boolean | null
  resource_source: string | null
  fund_or_bank_id: number | null
  plan_or_account_id: number | null
}

export interface ICausationWithoutPaymentInstructionsPayload
  extends ICausationWithoutPaymentInstructionsForm {
  payment_request_ids: number[]
}
