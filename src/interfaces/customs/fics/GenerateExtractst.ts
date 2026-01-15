export interface IFicsExtractGeneration {
  id: number
  business_code: string
  extract_type: string
  file_name: string | null
  fund_code: string
  investment_plan_code: string | null
  period_from: string
  period_to: string
  registration_date: string
  status_id: number
  details: string
}

export interface IFicsExtractGenerationRequest {
  extract_type: 'txt' | 'pdf' | 'csv' | ''
  generation_type: 'individual' | 'masivo'
  identification_id?: number | null
  identification?: string | null
  initial_fund_id?: number | null
  initial_fund?: string | null
  final_fund_id?: number | null
  final_fund?: string | null
  fiduciary_investment_plan_id?: number | null
  business_trust_id?: number | null
  period_from: string
  period_to: string
}
