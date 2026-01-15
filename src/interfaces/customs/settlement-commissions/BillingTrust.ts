export interface IBillingTrustResponse {
  id: number
  business_code_snapshot: number
  business_name_snapshot: string
  start_date: string
  end_date: string
  periodicity: string
  other: string | null
}

export interface IBillingTrustList {
  selected: boolean
  id: number
  business_code_snapshot: number
  business_name_snapshot: string
  accounting_parameters: {
    id: number
  }
}

export interface IBillingTrustForm {
  business_code: number | null
  business_name: string | null
  start_date: string | null
  end_date: string | null
  periodicity: string | null
  other: string | null
}

export interface IAccountingParametersResponse {
  id: number
  business_code_snapshot: number
  business_name_snapshot: string
  who_pays: string
  accounts: string
  generates_iva: string
  iva: number
}

export interface IAccountingParametersForm {
  business_code: number | null
  business_name: string | null
  who_pays: string | null
  accounts: string | null
  generates_iva: string | null
  iva: number | null
}
