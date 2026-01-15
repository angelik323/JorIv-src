export interface ITreasureReadjustmentForm {
  from_business_id: number | null
  to_business_id: number | null
  from_bank_id: number | null
  to_bank_id: number | null
  from_account_id: number | null
  to_account_id: number | null
  start_date: string
  end_date: string
}