export interface IChangeTrustStatus {
  id?: number
  business_code: string
  name: string
  register_type?: null
  start_date: string
  business_type_id: number
  business_subtype_id: number
  status_id: number
  status?: IStatusTrust
  status_histories?: IStatusHistory
}

export interface IStatusTrust {
  id: number
  status: string
}

export interface IStatusHistory {
  id: number
  business_trust_id: number
  previous_status_id: number
  observation: string
  previous_status: string
}

export interface IChangeTrustStatusRequest {
  id_business_trust?: number
  id_status_history?: number
  business_code: string
  name: string
  status_id: number
  status: string
  observation: string
  previous_status_id?: number
  previous_status?: null
  created_at?: null
}
