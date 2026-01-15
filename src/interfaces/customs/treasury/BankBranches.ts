export interface IBankBranchesList {
  id: number
  bank_id: number
  city_id: number
  name: string
  status_id: number
  code: string
  address: string | null
}

export interface BasicBankBranch {
  code: string
  name: string
  address: string
  city_id: string
  status_id: string
  bank_id?: number
}

export interface IBankBranchesRequest {
  id: number
  bank_id: number
  city_id: number
  name: string
  status_id: number
  code: string
  address: string | null
}
