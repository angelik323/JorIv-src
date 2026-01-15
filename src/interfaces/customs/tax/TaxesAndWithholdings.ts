export interface ITaxesAndWithholdingsList {
  id: number
  name: string
  dian_type: string
  tax_type: string
  usage: string
  ambit: string
  manage_periods: boolean
  status: string
}

export interface ITaxesAndWithholdingsForm {
  name?: string | null
  tax_type_id?: number | null
  dian_tax_type_id?: number | null
  jurisdiction_id?: number | null
  ambit?: string | null
  dian_tax_base?: string | null
  calculation?: string | null
  rate_percentage?: number | null
  base_value?: number | null
  rounding_step?: number | null
  rounding_mode?: string | null
  currency_code?: string | null
  legal_notes?: string | null
  invoice_label?: string | null
  observations?: string | null
  manage_periods?: boolean | null
  valid_from?: string | null
  valid_to?: string | null
  fixed_amount?: number | null

  tax_sign?: string | null
  tax_scope?: string | null
  tax_usage?: string | null
}

export interface ITaxesAndWithholdingsValidities {
  validities: Validity[]
}

export interface Validity {
  id?: number | null
  calculation?: string | null
  valid_from?: string | null
  valid_to?: string | null
  rate_percentage?: number | null
  is_active: boolean
  tax_id?: number | null
}
