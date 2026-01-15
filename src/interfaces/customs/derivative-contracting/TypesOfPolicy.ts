import { IRiskDefinitionResponse } from '@/interfaces/customs/derivative-contracting/RiskDefinition'

export interface ITypeOfPolicyStatus {
  id: number
  name: string
}

export interface ITypeOfPolicy {
  id: number
  code: string
  name: string
  stage: string
  status_id: number
  status: ITypeOfPolicyStatus
  risks: IRiskDefinitionResponse[]
  created_at: string
  updated_at: string
}

export interface ITypeOfPolicyForm {
  name: string
  stage: string
  status_id?: number
  risk_ids?: number[]
  risks?: IRiskDefinitionResponse[]   
}

export interface ITypeOfPolicyTable {
  id: number
  risk_id: string
  min: string
  max: string
  status: boolean
  actions: string
}

export interface IListResponse<T> {
  success: boolean
  data: T
  message: string
}
export interface ISelectOptionPolicy {
  value: number | string
  label: string
}

