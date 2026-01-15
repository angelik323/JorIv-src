export interface IImpairmentsListCustom {
  id: string | number
  description: string
  active: string,
  impairmentsAmount: string
  recoverableAmount: string
  requestedBy:string
  generationDate: string
  status: string | number
}

export interface IImpairmentsInfoCreate {
  nature: string
  third_party: boolean
  transactions: boolean
  code: string
  name: string
}


export type IChangeStatusImpairments =  'activate' | 'reversion'

