export interface ITypesCollectionList {
  id?: number
  code?: string
  description: string
  type_receive: string
  redemption_days: number | string
  status?: string
}

export interface ITreasuryTypeReceiveItem {
  label: string
  value: string
}

export type ITreasuryTypeReceiveList = ITreasuryTypeReceiveItem[]
