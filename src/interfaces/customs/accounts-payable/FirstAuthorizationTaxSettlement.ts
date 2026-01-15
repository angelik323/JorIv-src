export interface IFirstAuthorizationTaxSettlementFilters {
  'filter[office_id]'?: number
  'filter[from_business_code]'?: number
  'filter[to_business_code]'?: number
  'filter[from_payment_request_id]'?: number
  'filter[to_payment_request_id]'?: number
  'filter[orpa_authorization_status_id]'?: number
}

export interface IFirstAuthorizationTaxSettlementItem {
  id: number
  office: {
    id: number
    office_code: string
    office_description: string
  }
  business_trust: {
    id: number | null
    business_code: string | null
    name: string | null
  } | null
  has_payment_instruction: boolean
  payment_instruction?: string
  payment_instructions?: Array<{
    details: Array<{
      instruction_number: number
    }>
  }>
  request_number: string
  request_status: {
    id: number
    name: string
  }
  authorization_status: {
    id: number
    name: string
  }
  authorizathion_status?:
    | {
        id: number
        name: string
      }
    | string
}

export interface IFirstAuthorizationBasicData {
  office_code: string | null
  office_description: string | null
  from_business: string | null
  from_business_name: string | null
  to_business: string | null
  to_business_name: string | null
  from_request: string | null
  to_request: string | null
  amount_from: string | null
  amount_to: string | null
  request_status: string | null
  request_status_id: number | null
  authorization_status: string | null
  authorization_status_id: number | null
  payment_request_id: number | null
  operation_office_id: number | null
  business_trust_id: number | null
}

// Detalle de pago
export interface IPaymentDetail {
  id: number
  business: string
  instruction_date: string
  reception_date: string
  payment_request_number: string
  upload_number: string | null
  asset_number: string
  internal_consecutive: string | null
  client_consecutive: string | null
  supplier_issuer: string
  has_payment_instruction: boolean
  origin: string
  payment_type: string
  base_value: string
  discount_value: string
  net_value: string
}

// Instrucción de pago
export interface IPaymentInstruction {
  id: number
  instruction_number: number
  payment_form: string
  resource_source: string
  fund: string | null
  investment_plan: string | null
  bank: string | null
  bank_account: string | null
  net_value: string
  instruction_status: string
  instruction_status_id: number
}

// Liquidación
export interface ILiquidation {
  id: number
  type: string
  tax_copy: string
  concept: string
  base: string
  percentage: string
  value: string
}
