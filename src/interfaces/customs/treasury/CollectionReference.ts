export interface ICollectionReference {
  id: number | null
  accounting_block_collection: {
    id: number | null,
    code: string | null,
  }
  accounting_parameters_collection: {
    id: number | null,
    code: string | null,
  }
  origin: {
    id: number | null
    name?: string | ''
  }
  bank_reference: string | ''
  bar_code: string | ''
}

export interface ICollectionReferenceForm {
  accounting_blocks_collection_id: number | null
  accounting_parameters_collection_id: number | null
  origin_id: number | null
  bank_reference: string | ''
  bar_code: string | ''
  info_param_code?: string | null
  info_block_code?: string | null
}

export interface ICollectionReferenceEmits {
  (e: 'close-modal'): void
  (e: 'update-fetch-table'): void
}

export interface ICollectionReferenceList extends Array<ICollectionReference> {}
