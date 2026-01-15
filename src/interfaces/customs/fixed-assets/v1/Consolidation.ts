// list
export interface IConsolidationList {
  id: number

  type_source: number
  type_source_label: string

  business_trust_id: number
  business_trust: {
    id: number
    name: string
    business_code: string
    classification: string
    status: {
      id: number
      status: string
    }
  }

  fixed_assets_type: {
    id: number
    code: string
    description: string
  }

  fixed_assets_subtype: {
    id: number
    code: string
    description: string
  }

  consolidated_fixed_asset: {
    id: number
    record_type: string
    reference: string
    date: string
  }

  status: {
    id: number
    name: string
  }

  created_at: string
}

export interface IConsolidationListProcess {
  configuration_type: null | {
    id: number
    code: string
    description: string
  }
  configuration_subtype: null | {
    id: number
    code: string
    description: string
  }
  transaction: null | {
    id: number
    transaction_value: number
  }
  status: null | {
    id: number
    name: string
  }
  selected?: boolean
  reference?: string | number | null
}

export interface IConsolidationListResponse {
  consolidation_list: IConsolidationList[]
  consolidation_pages: {
    currentPage: number
    lastPage: number
  }
}
export interface IProcessListResponse {
  process_list: IConsolidationListProcess[]
  consolidation_pages: {
    currentPage: number
    lastPage: number
  }
}

// information form

export interface IConsolidationInformationForm {
  id?: number | null
  type_source: number | null
  type_source_label?: string | null
  business_trust_id: number | null
  business_trust?: null | {
    business_code: number
    name: string
    account: null | {
      functional_business_currency: string
    }
  }

  fixed_assets_type_id: number | null
  fixed_assets_type: null | {
    code: string
    description: string
  }
  fixed_assets_subtype_id: number | null
  fixed_assets_subtype: null | {
    code: string
    description: string
  }
  new_fixed_assets_type_id: number | null
  new_fixed_assets_subtype_id: number | null
  value_consolidation: number | null
  cost_center_id: number | null
  license_plate: string | null
  responsible_id: number | null
  responsible?: null | {
    document: number | string
    legal_person: number | string
  }
  has_valuation: boolean | null
  has_depreciation: boolean | null
  has_visit: boolean | null
  description: string | null
  fixed_assets_list: number[]
  attached_documents: Array<{
    file_id: number
    is_validated: boolean
  }>
  currency: string | null
  created_at?: string | null
  status?: null | {
    id: number
    name: string
  }
  created_by?: null | {
    id: number
    fullname: string
  }
  updated_by?: null | {
    id: number
    fullname: string
  }
  updated_at?: string | null
}
export interface IFileConsolidation {
  id?: number
  is_new?: boolean
  name: string
  status_id?: number
  url: string
  size?: number
  created_at?: string
  type?: string
  document_type: string | null
  field_name: string | null
  upload_date: string | null
  s3_file_path?: string | null
  original_name?: string | null
  file?: File
  to_delete: boolean
}

export interface IvoucherDoc {
  voucher_id?: number | null
  voucher: {
    id: number | null
    code: string | null
    registration_date: string | null
    status: {
      id: number
      status: string
    } | null
  } | null
}

export interface IConsolidationReadResponse
  extends IConsolidationInformationForm {
  consolidated_fixed_asset?: {
    documents?: IConsolidationDocumentsForm[]
  }
}
export interface IFileTableRecordTransfer {
  id?: number
  is_new?: boolean
  name: string
  status_id?: number
  url: string
  size?: number
  created_at?: string
  type?: string
  file?: File
}

export interface IConsolidationDocumentsForm {
  file_size: number | undefined
  validation_status_id: number
  id?: number
  documentable_id: number | null
  document_type: string | null
  business_document_type: string | null
  business_document_section: string | null
  field_name: string | null
  name: string | null
  upload_date: string | null
  s3_file_path?: string | null
  original_name?: string | null
  file?: File
  is_new: boolean
  to_delete: boolean
  hash_name: string
  created_at: string
  file_path: string
}

// create
export interface IConsolidationCreate extends IConsolidationInformationForm {}
