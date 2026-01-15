export interface ITrustBusinessMovementCodesCreate {
  code?: string
  description: string
  nature: string
  movement: string
  has_ganerate_accounting: boolean | null
  has_cancellation_movement_code: string | number
  has_cancellation_movement_code_name?: string
  applies_to_goods: boolean | null
  good_type_code: string | number
  good_type_code_name?: string
  has_iva: boolean | null
  percentage_iva: string
  iva_movement_code?: number | string
  iva_movement_code_name?: string
  has_affects_funds: boolean | null
  funds_movement_code?: number | string
  funds_movement_code_name?: string
  collection_shape: string
  has_generate_invoice: boolean | null
  billing_concept: string
}

export interface ITrustBusinessMovementCodes {
  id: number
  code?: string
  movement_code: string
  description: string
  nature: string
  movement: string
  has_ganerate_accounting: boolean
  has_cancellation_movement_code?: ICode
  applies_to_goods: boolean
  good_type_code?: ICode
  has_iva: boolean
  percentage_iva: string
  iva_movement_code?: ICode
  has_affects_funds: boolean
  funds_movement_code?: IFundsMovementCode
  collection_shape: string
  has_generate_invoice: boolean
  billing_concept: string
}

interface IFundsMovementCode {
  id?: number
  code?: string
  description?: string
  nature?: string
  operation?: string
}

interface ICode {
  id?: number
  code?: number
  description?: string
}
