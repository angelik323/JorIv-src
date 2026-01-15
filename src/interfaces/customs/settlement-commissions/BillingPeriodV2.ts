export interface IBillingPeriodResponse {
  id: number
  business_id: number
  business_code_snapshot: string
  business_name_snapshot: string
  snapshotted_at: string
  start_date: string
  end_date: string
  periodicity: string
  other: string | null
  code: string
}

export interface IBillingPeriodList {
  id: number
  start_date: string
  end_date: string
  periodicity: string
  business_id: number
  other: null
  business_code_snapshot: string
  business_name_snapshot: string
  snapshotted_at: string
  code: string
}

export interface IBillingPeriodInformationForm {
  business_code: string | number | null
  start_date: string | null
  end_date: string | null
  periodicity: string | null
  other?: string | null

  period_code?: string | null
}
