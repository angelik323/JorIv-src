import { StatusID } from '@/interfaces/global'

export interface ITypesWorkPlanStatus {
  id: StatusID
  name: string
}
export interface ITypesWorkPlanResponse {
  id: number
  structure_plan_code_id: number
  structure_name: string
  purpose: string
  type: string
  code: string
  name: string
  status: ITypesWorkPlanStatus
  created_at: string
  updated_at: string
  creator: string
  updater: string | null
}
export interface ITypeWorkPlanForm {
  id?: number
  structure_plan_code_id: number
  structure_name?: string
  purpose: string
  type: string
  code: string
  name: string
  status_id?: StatusID
  structure?: string
}

export enum WorkPlanType {
  Operativa = 'Operativa',
  Totalizador = 'Totalizador',
}
