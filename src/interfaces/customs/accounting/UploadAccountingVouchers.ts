export interface IUploadAccountingVoucherOriginalData {
  consecutivo_de_registros: number
  codigo_de_negocios: string
  codigo_de_estructura_contable: string
  fecha_de_registro: string
  codigo_de_comprobante: string
  codigo_subtipo_de_comprobante: string
  naturaleza: string
  codigo_de_cuenta: string
  codigo_de_auxiliar: string
  codigo_de_centro_de_costos: string
  detalle: string
  valor: number
  valor_moneda_extranjera: number
}

export interface IUploadAccountingVoucherFailure {
  index: number
  receipt_type: string
  errors: string[]
}

export interface IUploadAccountingVouchersTempData {
  [x: string]: unknown
  index?: number
  job_id?: string
  consecutivo_de_registros?: number
  codigo_de_comprobante?: string
  campo_error?: string
  queue_id?: string
  errors?: string
  file_name?: string
  uploaded_at?: string
  valid_count?: number
  failed_count?: number
  total_count?: number
  status_id?: number
  failures?: IUploadAccountingVoucherFailure[]
  validated_vouchers?: IValidVouchersData[]
}

export interface IValidVouchersData {
  business_trust_id: number
  business_trust_name?: string
  receipt_type_code?: string
  sub_receipt_type_code?: string
  registration_date: string
  registration_day: number
  receipt_type_id: number
  sub_receipt_type_id: number
  total_amount_debits: string
  total_amount_credits: string
  difference_amount: string
  voucher_data: {
    nature: string
    account_id: number
    cost_center_id: number | null
    register_detail: string
    foreign_currency: string
    third_party_id: number
    debit: string
  }[]
}

export interface IUploadAccountingVoucherCreator {
  id: number
  full_name: string
}

export interface IUploadAccountingVoucherList {
  download_url: string
  file_name: string
  uploaded_at: string
  creator: IUploadAccountingVoucherCreator
  total_count: string
  status: string
}

export interface IUploadAccountingVouchersProcess {
  file_name: string
  uploaded_at: string
  creator: IUploadAccountingVoucherCreator
  total_count: number
  created_vouchers: {
    id: number
    registration_date: string
    registration_day: number
    business_trust: {
      id: number
      business_code: string
      name: string
      account: {
        id: number
        current_period: string
        account_structure: {
          id: number
          code: string
          purpose: string
        }
      }
    }
    status: {
      id: number
      status: string
    }
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
    code: string
    total_amount_debits: string
    total_amount_credits: string
    difference_amount: string
  }[]
}

export interface IUploadAccountingVouchersProcessTableRows {
  id: number
  business_code: string
  business_name: string
  registration_date: string
  receipt_type_id: string
  sub_receipt_type_id: string
  registration_day?: number
  consecutive?: string
}

interface IBusinessTrust {
  id: number
  business_code: string
  name: string
  account: {
    id: number
    current_period: string
    account_structure: {
      id: number
      code: string
      purpose: string
    }
  }
}

export interface IUploadAccountingVoucherView {
  id: number
  nature: string
  account: {
    id: number
    code: string
    name: string
    account_structure: {
      id: number
      code: string
      purpose: string
    }
  }
  third_party: {
    id: number
    document: string
    commercial_registration: string | null
  }
  cost_center: {
    id: number
    code: string
    name: string
  }
  register_detail: string
  debit: string
  credit: string | null
  foreign_currency: string
}
export interface IViewUploadAccountingVouchers {
  id: number
  registration_date: string
  registration_day: number
  business_trust: IBusinessTrust
  status: {
    id: number
    status: string
  }
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
  total_amount_debits: string
  total_amount_credits: string
  difference_amount: string
  voucher_data: IUploadAccountingVoucherView[]
}

export type QueueJobPayload = {
  file_name?: string
  uploaded_at?: string
  total_count?: number
  status_id?: number
  valid_vouchers?: unknown[]
  failed_vouchers?: unknown[]
  errors?: unknown[]
}

export type QueueJobStatus = {
  status?: string
  data?: QueueJobPayload
  queue_id?: number
}

export interface QueueJobStatusV2 {
  queue_id: number
  status_id: number
  status_name: string
  is_finished: boolean
  has_errors: boolean
  report_url: string | null
  file_name: string
  valid_records_count: number | null
  total_records_count: number | null
}

export interface IUploadVoucherError {
  id: number
  index: number
  field: string
  message: string
  created_at?: string
}

export type UploadVoucherErrorRow = {
  index: number
  consecutivo_de_registros: number | string
  codigo_de_comprobante: string
  errors: string
}
