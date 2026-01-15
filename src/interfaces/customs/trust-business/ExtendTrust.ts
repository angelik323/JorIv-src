export interface IExtendTrustInterface {
  id?: number
  business_code?: string
  name?: string
  start_date: string
  end_date: string
  status_id?: number
  status?: IStatus
  last_extension?: ILastExtension
}

export interface IExtendTrustCreate {
  id?: number
  extension_date: string
  observation?: string
}

export interface IExtendTrustResponse {
  id?: number
  code?: string
  name: string
  start_date: string
  end_date: string
  extension_date: string
  new_extension_date?: string
  observation: string
}

interface ILastExtension {
  id?: number
  business_trust_id?: number
  extension_date?: string
  observation?: string
}

interface IStatus {
  id: number
  status: string
}
