export interface IChartAccountsListCustom {
  id: string
  name: string
  code: string
  group: string
  status: number
}

export interface IAccountInfoCreate {
  nature: string
  third_party: boolean
  transactions: boolean
  code: string
  name: string
}
