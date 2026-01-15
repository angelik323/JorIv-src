export interface ICreateUpdateGoodsClass {
  name: string | null
  debit_account_id: number | null
  credit_account_id: number | null
  description: string | null
}

export interface IGoodsClassList {
  name: string
  debit_account: ISelectData
  credit_account: ISelectData
  description: string
  status: IStatus
}

export interface IGoodsClassData {
  name: string
  credit_account_id: number
  debit_account_id: number
  description: string
}

interface ISelectData {
  id: number | string
  name: string
  code: string | number
  status_id: string | number | boolean
}

interface IStatus {
  id: number
  status: string
}
