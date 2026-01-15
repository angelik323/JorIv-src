export interface ITransactionTypesList {
  id: number
  code: string
  name: string
  asset_type: string
  transaction_number: string
  period: string
  status: string
  status_id: string | number
}

export interface ICreateUpdateTransactionTypes {
  name: string | null
  asset_type_id: number | null
  transaction_number: string | null
  period: string | number | null
}

export interface ITransactionTypesData {
  asset_type: string
  asset_type_id: string | number
  id: number
  name: string
  period: string | number
  status: string
  status_id: string | number
  transaction_number: string
}
