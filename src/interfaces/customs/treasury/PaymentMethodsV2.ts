export interface IPaymentMethodV2 {
  id?: number
  code?: string
  description?: string | null
  type_mean_of_payments: string
  dispersion_type: string
  transaction_type: string
  type_funds_transfer: string
  request_registration_beneficiary: boolean
  type_registrations: string
  payment_instructions: boolean
  authorized_payment: boolean
  crossed_check: boolean
  message_check: string | null
  request_bank_withdrawal: boolean
  status_id?: number
  exchange_days?: number | null
}
