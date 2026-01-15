import { IActions } from '@/interfaces/global'
export interface ICenterCostList {
  id: number
  name: string
  description: string
  code: string
  dependency_code: string
  status: IActions
  status_id: number
}

export interface ICostCenter {
  id: number | string
  name: string
  code: null
  description: string
  status_id: string
  status: { id: string | number; status: IActions }
}

export interface ICenterCostViewInfoV2 {
  name: string
  description: string
  status: string
  status_id: string
  asset_group: string
  asset_group_id: string
  asset_group_role: string | null
  asset_group_role_id: string | null
  branch: string | null
  branch_id: string | null
  section: string
  section_id: string
  dependency: string | null
  dependency_id: string | null
  dependency_code: string
  code: string
}

export interface IChartAccountsInfoV2 {
  label: string
  description: string
}

export type INumberString = number | string | undefined
