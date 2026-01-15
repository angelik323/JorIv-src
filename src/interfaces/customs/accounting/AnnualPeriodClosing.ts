export interface IAnnualPeriodClosingModel {
  accounting_structure_id?: number
  from_account_code?: string | null
  to_account_code?: string | null
  from_business_trust_id?: IBusinessTrusts | string | null
  to_business_trust_id?: IBusinessTrusts | string | null
  from_business_trust?: IBusinessTrusts | null
  to_business_trust?: IBusinessTrusts | null
  from_third_party_id?: number | null
  to_third_party_id?: number | null
  accounting_structure?: string
  executed_at?: string
}

export interface IBusinessTrusts {
  id?: number
  label: string
  value: string
  business_code?: string
  business_name?: string
  description?: string
}
