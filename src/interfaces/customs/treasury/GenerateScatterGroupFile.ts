export interface IGenerateScatterGroupFileDetail {
  id: number
  group_id: number
  validity: string
  business: string
  bank: string
  bank_account: string
  dispersion_group: string
  turns: number
  status: string
  status_shipping: string
  bank_response: string
  group?: string | number
  bank_id?: number
}

export interface IGenerateScatterGroupFileBreakdown {
  id: number
  business: string
  means_of_payment: string
  bank: string
  bank_account: string
  found: string
  plain_investment: string
  order_payment: string
  operation_coin: string
  validity: string
  third_type_document: string
  third_party_document: string
  beneficiary_bank_id: string
  beneficiary_bank_account: string
  bank_branch: string
  value: number
  gmf: string
}

export interface IGenerateScatterGroupFileCreate {
  structure_bank_id?: number
  group_id?: number
  date_generate?: string
  route?: string
}

export interface IGenerateScatterGroupFileAuthorization {
  group_id: number
  action: string
  motives: string
}
