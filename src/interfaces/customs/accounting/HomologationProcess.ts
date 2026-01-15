export interface IHomologationProcess {
  id: number
  business: string
  period: string
  receipt: string
  sub_receipt: string
  consecutive: number
  source_structure: string
  destination_structure: string
  status: string
  message: string
  date: string
  original_voucher_id: number
  new_voucher_id: number | null
}

export interface IHomologationProcessView {
  id: number
  process_name: string
  period: string
  source_structure: {
    id: number
    code: string
    purpose: string
  }
  destination_structure: {
    id: number
    code: string
    purpose: string
  }
  status: string
  created_at: string
}

export interface IHomologationProcessItem {
  id: number
  process_name: string
  period: string
  source_structure: {
    id: number
    code: string
    purpose: string
  }
  destination_structure: {
    id: number
    code: string
    purpose: string
  }
  status: string
  created_at: string
}

export interface IBulkHomologationPayload {
  process_type: number
  source_structure_id: number
  period: string
  type: string
  destination_structure_id: number
  business_trust_start_id: number
  business_trust_end_id: number
  homologation_date?: string
}

export interface IBulkHomologationModel {
  process_type: number | null
  source_structure_id: number | null
  period: string | null
  type: string | null
  destination_structure_id: number | null
  business_trust_start_id: number | null
  business_trust_end_id: number | null
  homologation_date?: string | null
}

export interface IHomologationPayload {
  process_type: number | null
  source_structure_id: number | null
  period: string | null
  destination_structure_id: number | null
  business_trust_start_id: number | null
  voucher_ids: number[]
}

export interface IHomologationModel {
  process_type: number | null
  source_structure_id: number | null
  period: string | null
  destination_structure_id: number | null
  business_trust_start_id: number | null
  receipt_type_id: number | null
  sub_receipt_type_id: number | null
  voucher_ids: number[]
}

export interface IFilterableVoucher {
  id: number
  registration_date: string
  receipt_type: {
    id: number
    code: number
    name: string
  }
  sub_receipt_type: {
    id: number
    code: number
    name: string
  }
  code: number
  source_structure: number
  destination_structure: number
  status: {
    id: number
    name: string
  }
  disabled?: boolean
}

export interface IHomologationDownloadPayload {
  process_type: number
  results: IHomologationProcess[]
}

export interface IHomologationProcessView {
  id: number
  process_name: string
  period: string
  source_structure: {
    id: number
    code: string
    purpose: string
  }
  destination_structure: {
    id: number
    code: string
    purpose: string
  }
  status: string
  created_at: string
}

export interface IHomologationProcessVoucher {
  id: number
  business: string
  period: string
  receipt: string
  sub_receipt: string
  consecutive: number
  source_structure: string
  destination_structure: string
  status: string
  message: string
  date: string
  original_voucher_id: number
  original_voucher: {}
  new_voucher_id: number
  new_voucher: {}
}

export interface IHomologationProcessHistory {
  process: IHomologationProcessView
  logs: IHomologationProcessVoucher[]
}
