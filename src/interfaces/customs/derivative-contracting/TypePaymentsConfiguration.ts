import { StatusID } from "@/interfaces/global"

export interface ITypesPaymentConfigurationStatus {
  id: StatusID
  name: string
}

export interface ITypesPaymentConfigurationResponse {
  id?: number
  code?: string
  name?: string
  status?: ITypesPaymentConfigurationStatus,
  payment_type: string | number               
  require_authorization?: boolean | number
  referential_information?: boolean
  created_at?: string                   
  updated_at?: string                   
  inactivated_at?: string | null
  creator?: string
  updater?: string
  inactivator?: string
}

export interface ITypePaymentConfigurationForm {
  id?: number
  name: string
  payment_type: string | number
  require_authorization: boolean | number
}