import { ICollectionAccountingBlocksResponse } from './CollectionAccountingBlocks'

interface IBankStatus {
  id: number
  name: string
}

interface IBankNit {
  id: number
  nit: string
}

interface IBank {
  id: number
  description: string
  type: string
  accounting_account: string | null
  status: IBankStatus
  code: string
  bank_code: string
  nit: IBankNit
  has_movements: boolean
}

interface ITreasuryMovementCode {
  id: number
  code: string
  description: string
  nature: string
  operation: string
  generate_special_contribution: boolean
  handles_accounting_offset: boolean
  conciliation_movement: boolean
  transfer_investments: boolean
  transfer_accounts: boolean
  receipt_types_id: number
  sub_receipt_types_id: number
  move_override: number | null
}

export interface IBankingEntitiesAccountingParametersCommissions {
  id: number
  bank: IBank | null
  accounting_blocks_collection: ICollectionAccountingBlocksResponse
  description: string
  treasury_movement_code: ITreasuryMovementCode | null
  treasury_movement_code_id: ITreasuryMovementCode | null
  validates_collection_method: boolean
  commission_rate: string
  commission_percentage: string
  fixed_value: number | null
  observations: string
  created_by: number
  updated_by: number | null
}
export interface ICreateBankingEntitiesAccountingParametersCommissions {
  bank_id: number | null
  description: string
  accounting_blocks_collection_id: number
  treasury_movement_code_id: number | null
  validates_collection_method: boolean
  commission_rate: string
  commission_percentage: number | null
  fixed_value: number | null
  observations: string
}
