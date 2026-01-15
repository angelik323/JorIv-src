export interface ITypesCollectionList {
  id?: number
  code?: string
  description: string | null
  type_receive: string
  redemption_days: number | string
  status_id?: string
}

export interface ITreasuryTypeReceiveItem {
  label: string
  value: string
}

export type ITreasuryTypeReceiveList = ITreasuryTypeReceiveItem[]

export interface ITypesCollectionDetail {
  id?: number | null
  code: string | null
  description: string | null
  type_receive: string | null
  redemption_days: string | null
  status_id: number | string | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
}
