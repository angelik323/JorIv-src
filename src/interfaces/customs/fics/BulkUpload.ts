import { IGenericResource } from '../resources/Common'
export interface IBulkUploadHistoryTable {
  id: number
  code: string
  name: string | null

  bank: {
    id: number
    code: string
    name: string | null
  }
  bank_id?: number
  bank_name?: string | null

  bank_account: {
    id: number
    account_number: string
    account_name: string
  }
  account_name: string
  account_number: string
  bank_account_id?: number
  bank_account_name?: string | null

  beneficiary?: {
    id?: number
    identification_number?: string | null
    name: string | null
    business_name?: string | null
    nit?: string
  }

  business: {
    id: number
    code: string | null
    name: string
  }
  business_name: string | null
  business_trust_id?: number

  cash_flow?: {
    id?: number
    code: string
    name: string
  }

  cost_center?: {
    id: number
    code: string
    name: string
  }

  concept?: string

  movement?: {
    id: number
    code: string
    description: string
    nature: string
  }
  movement_code?: {
    code: string
    name: string
  }

  type_receive?: {
    id?: number
    type_receive?: string
    description?: string
    name?: string | null
  }

  check_info?: {
    check_number: string
    check_bank: string | null
  }

  investment_plan_id?: number

  values?: {
    value: string
    value_formatted: string
    foreign_currency_value: string
    foreign_currency_value_formatted: string
    trm?: string
    trm_formatted?: string
  }
  value?: {
    local_currency: number
    foreign_currency: number
  }

  status: {
    id: number
    status: string
    comments?: string | null
  }

  record_data?: {
    type: string
    business: {
      id: number
      code: string | null
      name: string
    }
  }
  recordable_id?: number
  recordable_type?: string

  row_number?: number
  bulk_upload_id?: number
  load_number?: string

  can_be_deleted?: boolean
  has_errors?: boolean

  created_at: string
  created_at_formatted?: string
  created_by?: {
    id: number
    name: string
    email: string
  }
  updated_at?: string
  updated_at_formatted?: string
  updated_by?: {
    id: number
    name: string
    email: string
  }

  date?: string
  date_formatted?: string
  effective_date?: string

  error_records?: number
  successful_records?: number
  total_records?: number
  total_value?: string
  total_value_formatted?: string
  filename?: string

  office_id?: number
  office_name?: string

  operation_type?: string
  operation_type_label?: string
  nature?: string

  accounting?: {
    comprobante: string
    subcomprobante: string
    cost_center: {
      code: string
      name: string
    }
  }

  currency?: {
    foreign_currency_value: {
      amount: string
      formatted: string | null
    }
    trm: {
      value: number
      formatted: string
    }
    currency_type: string
  }

  check?: {
    number: number
    bank: {
      code: string
      name: string
    }
  }

  fund?: {
    code: {
      value: string | null
      display_value: string
    }
    investment_plan: {
      code: string | null
      name: string | null
      display_value: string
    }
  }

  additional_info?: {
    created_at: string
    created_at_formatted: string
    updated_at: string
    updated_at_formatted: string
    has_errors: boolean
    error_message: string | null
    validation_errors: string[]
  }
}
export interface IBulkUploadTableUpload {
  id?: number | null
  file_name?: string
  total_lines?: string
  status?: {
    id?: number | null
  }
}
export interface IBulkUploadValidOperations {
  id?: number | null
  investment_plan?: {
    name?: string
  }
  operation?: string
  value?: string
  status?: {
    status?: string
  }
}

export interface IBulkUploadList {
  id?: number | null
  operation?: string
  manual?: string
  template_id?: string
  investment_fund_id?: string
  office_id?: string
  bank_id?: string
  transaction_method_id?: string
  file?: File
  business_code?: string
  transaction_method_description?: string
  account_balance?: string
  bank_description?: string
  office_description?: string
  operation_date?: string
  cancelation_date?: string
  business_fund?: string
  investment_fund_description?: string
  template_description?: string
  updated_at?: string
  number_masive?: number | null
  created_at?: string
  manual_ids?: number[]
  transaction_method?: {
    id?: number | null
    account_number?: string
    account_name?: string
    last_balance?: {
      final_balance_local?: string
    }
  }[]
  row?: Record<string, unknown>
  fund?: {
    id?: number | null
    fund_code?: string
    fund_name?: string
    fund_type_id?: number | null
    business_trust?: {
      id?: number | null
      business_code?: string
      name?: string
    }
    fic_rating?: string
    status_id?: number | null
    has_participation_types?: boolean
    is_fund_validated?: boolean
    last_closing_date?: string
  }
  operation_description?: string
  template?: {
    id?: number | null
    description?: string
    operation?: string
    code?: string
  }
  office?: {
    id?: number | null
    office_code?: string
    office_description?: string
    office_schedule_start?: string
    office_schedule_end?: string
    extended_schedule_start?: string | null
    extended_schedule_end?: string | null
    status_id?: number | null
    created_at?: string
    updated_at?: string
  }
  bank?: {
    id?: number | null
    description?: string
    bank_code?: string
  }
  payment_method?: {
    name?: string
    description?: string
    /*saldo */
  }
  status?: {
    id?: number | null
    status?: string
    comments?: string | null
  }
}

export interface ITransactionMethod {
  id?: number | null
  account_number?: string
  account_name?: string
  last_balance?: {
    final_balance_local?: string
  }
}
export interface IBulkUploadBasicData {
  id: number
  code: number
  operation: string
  operation_description: string
  template: {
    id: number
    description: string
    operation: string
  }
  fund: {
    id: number
    fund_code: string
    fund_name: string
    fund_type_id: number
    business_trust: {
      id: number
      business_code: string
      name: string
    }
    fic_rating: string
    status_id: number
    has_participation_types: boolean
    is_fund_validated: boolean
    last_closing_date: string | null
  }
  office: {
    id: number
    office_code: string
    office_description: string
    office_schedule_start: string
    office_schedule_end: string
    extended_schedule_start: string | null
    extended_schedule_end: string | null
    status_id: number
    created_at: string
    updated_at: string
  }
  status: {
    id: number
    status: string
    comments: string | null
  }
  bank: {
    id: number
    description: string
    bank_code: string | null
  }
  titles: string[]
  transaction_method_id: number
  created_at: string
  updated_at: string
  transaction_method: [
    {
      id: number
      account_name: string
      account_number: string
      last_balance: {
        final_balance_local: string | number
      }
    }
  ]
  bank_account?: {
    id: number
    account_name: string
    account_number: string
    account_type?: string
    bank_id?: number
    last_balance?: {
      final_balance_local: string | number
    }
  }
}
export interface IBulkUploadValidatedOperationsList {
  status: {
    id: number
    status: string
    comments: string | null
  }
  line_number: number
  pass_fund_limit: boolean
  row: Record<string, unknown>
}

export interface IFicBankAccount extends IGenericResource {
  bank_account?: IFicBankAccountItem | IFicBankAccountItem[]
  bank?: {
    id?: number
    description?: string
    bank_code?: string
  }
  has_gmf?: boolean
  is_preferred_account?: boolean
}

export interface IFicBankAccountItem extends IGenericResource {
  account_number?: string
  account_name?: string
  account_type?: string
  bank_id?: number
}

export interface IBulkUploadBasicData {
  id: number
  code: number
  operation: string
  operation_description: string
  template: {
    id: number
    description: string
    operation: string
  }
  fund: {
    id: number
    fund_code: string
    fund_name: string
    fund_type_id: number
    business_trust: {
      id: number
      business_code: string
      name: string
    }
    fic_rating: string
    status_id: number
    has_participation_types: boolean
    is_fund_validated: boolean
    last_closing_date: string | null
  }
  office: {
    id: number
    office_code: string
    office_description: string
    office_schedule_start: string
    office_schedule_end: string
    extended_schedule_start: string | null
    extended_schedule_end: string | null
    status_id: number
    created_at: string
    updated_at: string
  }
  status: {
    id: number
    status: string
    comments: string | null
  }
  bank: {
    id: number
    description: string
    bank_code: string | null
  }
  titles: string[]
  transaction_method_id: number
  created_at: string
  updated_at: string
  transaction_method: [
    {
      id: number
      account_name: string
      account_number: string
      last_balance: {
        final_balance_local: string | number
      }
    }
  ]
  bank_account?: {
    id: number
    account_name: string
    account_number: string
    account_type?: string
    bank_id?: number
    last_balance?: {
      final_balance_local: string | number
    }
  }
}

export interface IBulkUploadValidatedOperationsList {
  status: {
    id: number
    status: string
    comments: string | null
  }
  line_number: number
  pass_fund_limit: boolean
  row: Record<string, unknown>
}
