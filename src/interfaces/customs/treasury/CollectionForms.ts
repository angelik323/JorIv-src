import { ICollectionAccountingBlocksResponse } from './CollectionAccountingBlocks'
import { IBankingEntitiesList } from './BankingEntities'

export interface ICollectionFormList {
  accounting_blocks_collection: ICollectionAccountingBlocksResponse
  bank_entity: {
    id: number
    description: string
    bank: IBankingEntitiesList
  }
  commission_percentage: string
  commission_rate: string
  created_by: number
  description: string
  fixed_value: number | null
  id: number
  type_receive: {
    id: number
    description: string
    type_receive: string
  }
  observations: string
  updated_by: number | null
}

export interface CollectionMethodsForm {
  type_receive_id: number
  description: string
  accounting_blocks_collection_id: number
  bank_entity_id: number
  commission_rate: string
  commission_percentage: number
  fixed_value: string
  observations: string
}

export interface IWaysToCollect {
  id: number
  description: string
  type: string
  accounting_account: string | null
  status: IStatus
  code: string
  bank_code: string
  nit: INit
  has_movements: boolean
}

interface IStatus {
  id: number
  name: string
}

interface INit {
  id: number
  nit: string
}
