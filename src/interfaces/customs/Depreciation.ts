export interface IDepreciationList {
  accumulated_depreciation: number
  asset: string
  depreciation_value: number
  id: number
  period: string | Date
  processed_date: null | string | Date
  status_id: number
}

export interface ICreateUpdateDepreciation {
  asset_id: number | null
  period: string | null
  useful_life_months: number | string | null
  useful_life_depreciation: number | string | null
  time_value: number | string | null
  depreciation_value: number | string | null
  accumulated_depreciation: number | string | null
}

export interface IDepreciationData {
  id: number
  asset: IAssetData
  processed_date: string
  period: string
  user_process: string
  created_at: string
  status: IStatus
  //
  accumulated_depreciation: string
  depreciation_value: string
  time_value: string
  useful_life_depreciation: string
  useful_life_months: string
}

export interface IDepreciationHistoryList {
  accumulated_depreciation: string
  asset: string
  depreciation_value: string
  id: number
  process_date: string
  status: IStatus
  time_value: string
  useful_life_depreciation: string
  useful_life_months: string
  reason: string
}

interface IAssetData {
  id: number
  name: string
  useful_life_in_years?: number
  entry_date?: string
  adquisition_value?: string
  status_id?: number
}

interface IStatus {
  id: number
  description: string
}
