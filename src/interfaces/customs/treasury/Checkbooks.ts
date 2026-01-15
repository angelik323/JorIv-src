export interface ICheckbookResponse {
  id: number
  code: number
  business_trust_id: number
  bank_id: number
  bank_account_id: number
  range_from: string
  range_to: string
  assignment_date: string
  next_consecutive: number
  status_id: number
}

export interface ICheckbookInformationForm {
  business_trust_id: number | null
  bank_id: number | null
  bank_account_id: number | null
  range_from: string | number | null
  range_to: string | number | null
  assignment_date: string | null
  status_id: number | null
  code: number | null
}

export interface ICheckbookToCreate
  extends Partial<ICheckbookInformationForm> {}

export interface ICheckbookToEdit extends Partial<ICheckbookInformationForm> {}
