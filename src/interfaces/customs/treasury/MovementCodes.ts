export interface IMovementCodes {
  code: number | string
  description: string
  operation: string
  nature: string
  generate_special_contribution?: boolean
  handles_accounting_offset?: boolean
  conciliation_movement?: boolean
  transfer_investments?: boolean
  transfer_accounts?: boolean
  receipt_types_id?: number | null
  sub_receipt_types_id?: number | null
  move_override?: number | null
}
