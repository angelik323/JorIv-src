import { IAccountStructureResource } from '@/interfaces/customs'

export interface IPeriodClosureParameter {
  structure: IAccountStructureResource
  parameters: [
    IAccountingClosingParameterModel,
    IAccountingClosingParameterModel
  ]
}

export interface IPeriodClosureParameterModelV2 {
  structure_id: number
  parameters: {
    daily_parameters: IAccountingDailyClosingParameterModel[]
    monthly_parameters: IAccountingDailyClosingParameterModel[]
    yearly_parameters: IAccountingDailyClosingParameterModel[]
  }
}

export interface IAccountingClosingParameterModel {
  id?: number
  event: 'Utilidad' | 'Pérdida'
  structure_id: number
  nature: 'D' | 'C' | ''
  chart_id: number | null
  third_party_id: number
  cost_center_id?: number
  counterpart_chart_id: number
  counterpart_nature: 'D' | 'C' | ''
  counterpart_third_party_id: number
  counterpart_cost_center_id?: number
  chart?: IAccountingClosingChart
  cost_center?: IAccountingClosingCostCenter
  third_party?: IAccountingClosingThirdParty
  counterpart_chart?: IAccountingClosingChart
  counterpart_cost_center?: IAccountingClosingCostCenter
  counterpart_third_party?: IAccountingClosingThirdParty
}

export interface IAccountingDailyClosingParameterModel {
  id?: number
  event: string | null
  nature: string | null
  accounts_chart_id: number | null
  third_party_type: string | null
  third_party_id: number | null
  sub_receipt_type_id: number | null
  counterpart_accounts_chart_id: number | null
  counterpart_third_party_type: string | null
  counterpart_third_party_id: number | null
  account?: {
    id: number
    label: string
  }
  third_party?: {
    id: number
    label: string
  }
  sub_receipt_type?: {
    id: number
    label: string
  }
  counterpart_account?: {
    id: number
    label: string
  }
  counterpart_nature?: string
  counterpart_third_party?: {
    id: number
    label: string
  }
}

export interface IAccountingClosingParamsResponse {
  structure: {
    id: number
    code: string
    purpose: string
    structure: string
  }
  parameters: {
    daily_parameters: IAccountingDailyClosingParameterModel[]
    monthly_parameters: IAccountingDailyClosingParameterModel[]
    yearly_parameters: IAccountingDailyClosingParameterModel[]
  }
}

interface IAccountingClosingChart {
  id: number
  name: string
  code: string
}

interface IAccountingClosingThirdParty {
  id: number
  document: string
  name: string
}

interface IAccountingClosingCostCenter {
  id: number
  name: string
}

export interface IAccountingClosingParameterItem {
  id: number
  code: string
  purpose: string
  structure: string
}

export interface IPeriodClosureParameterModel {
  id?: number
}
