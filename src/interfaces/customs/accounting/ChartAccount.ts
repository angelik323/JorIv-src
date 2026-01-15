export interface IStructureChartAccount {
  id?: number
  structure_id?: number
  purpose?: string
  status_id?: number
  code?: string
  status?: Status
}

export interface IChartAccount {
  id?: number
  code?: string
  name: string
  type: string
  nature: string
  status?: Status
  currency_id?: number
  currency?: { id: number; label: string }
  has_cost_center: boolean
  applies_ica_withholding_income: boolean
  applies_withholding_profits: boolean
  is_currency_reexpressed: boolean
  status_id?: number
  reexpression_settings?: {
    positive?: IChartAccountDifference
    negative?: IChartAccountDifference
  }
}

export interface IChartAccountDifference {
  account_code_id: number | null
  account_code?: {
    id: number
    label: string
  }
  third_party_id: number | null
  third_party?: {
    id: number
    label: string
  }
  fund_movement_id?: number | null
  fund_movement?: {
    id: number
    label: string
  }
  difference?: string
}

export interface IChartAccountCreate {
  account_structure_id?: number | string
  arrAccounts?: IChartAccount[]
  accounts?: IChartAccount[]
  structure?: Structure
  accounts_to_delete?: number[]
}

interface Status {
  id: number
  status: string
}

export interface Structure {
  id: number
  code?: string
  structure?: string
  type?: string
  status?: Status
  purpose?: string
}

export interface IChartAccountResponse {
  structure: Structure
  accounts: IChartAccount[]
}

export interface ITemplateResponse {
  fileName?: string
  total?: number
  file: Blob
}

export interface IAccountChartResource {
  id: number
  name: string
  code: string
  has_cost_center: boolean
  is_currency_reexpressed: boolean
  currency_id?: number | null
}

export interface IErrorFileResponse {
  url: string | null
  name?: string | null
}

export interface IChartAccountParams {
  page: number
  rows: number
  search?: string
}

export interface IChartAccountFileItem {
  id: number
  name: string
  total: number
  status_id: number
}
