export interface ITreasureCancellations {
  [key: string]: string | number | undefined | object
  concepto?: string
  valor?: number
  banco?: string
  cuenta_bancaria?: string
  estado?: string
  numero_movimiento?: string
  periodo?: string
  fecha?: string
  codigo_movimiento?: string
  codigo_comprobante?: string
  codigo_subcomprobante?: string
  numero_comprobante?: string
  orden_pago?: string
  vigencia?: string
  numero_cheque?: string
  chequera?: string
  numero_traslado?: string
  codigo_movimiento_origen?: string
  negocio_origen?: string
  banco_origen?: string
  cuenta_origen?: string
  fondo_origen?: string
  plan_inversion?: string
  codigo_movimiento_destino?: string
  negocio_destino?: string
  banco_destino?: string
  cuenta_destino?: string
  fondo_destino?: string
  plan_inversion_destino?: string
  value?: {
    local: string
    foreign: string
  }
  treasury_movement_code?: {
    code: string
    description: string
  }
  business_trust?: {
    code: string
    name: string
  }
  bank?: {
    id: number
    code: string
    description: string
  }
  bank_account?: {
    id: number
    account_name: string
    account_number: string
    account_bank: string
  }
}

export interface ITreasureCancellationsChecks {
  consecutives: number[]
  business_trust_id: number
  bank_id: number
  bank_account_id: number
  checkbook_id: number
  cancellation_code_id: number
}

export interface ITreasureCancellationsAnnulate {
  id: number | string
  annulate_date: string
  period: string
  observations: string
  annulate_code_id: number
  cancellation_code_id: number
  bank_id?: number | string
  bank_account_id?: number | string
}

export interface IFieldConfig {
  key: string
  format?: (val: unknown) => string
}
