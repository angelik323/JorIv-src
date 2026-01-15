export interface IBulkUploadPayload {
  operation_type: string
  office_id: number | null
  office_name: string
  business_trust_id: number | null
  bank_id: number | null
  bank_account_id: number | null
  date: string
  file: File
}

export interface IBulkUploadForm {
  bulk_upload_id: number
  type: string
  id_office: number | null
  name_office: string
  id_business: number | null
  name_business: string
  id_bank: number | null
  name_bank: string
  id_bank_account: number | null
  name_bank_account: string
  date: string
  load_number: string
  status: string
  total_records: number | null
  total_value: string
  file: string
}

export interface IBulkUploadHistory {
  id: number
  code: string
  name: string | null
  basic_data?: {
    business: {
      code: string
      name: string
    }
    bank: {
      code: string
      name: string
    }
    bank_account: {
      id: number
      account_bank: string
      account_name: string
    }
    beneficiary: {
      nit: string
      name: string
    }
    type_receive: {
      name: string
    }
    value: {
      local_currency: string
      foreign_currency: string
    }
    date: string
    effective_date: string
    status: {
      id: number
      name: string
    }
    concept: string
    cash_flow: {
      code: string | null
      name: string | null
    }
    movement_code: {
      code: string
      name: string
    }
    nature: string
    origin?: {
      bank: {
        id: number
        code: string
        name: string
      }
      bank_account: {
        id: number
        account_number: string
        account_name: string
      }
      values: {
        value: string
        value_formatted: string
        foreign_currency_value: string
        foreign_currency_value_formatted: string
      }
      movement: {
        id: number
        code: string
        description: string
        nature: string
      }
      beneficiary: {
        id: number
        name: string
        identification_number: string
      }
    }
    destination?: {
      bank: {
        id: number
        code: string
        name: string
      }
      bank_account: {
        id: number
        account_number: string
        account_name: string
      }
      values: {
        value: string
        value_formatted: string
        foreign_currency_value: string
        foreign_currency_value_formatted: string
      }
      movement: {
        id: number
        code: string
        description: string
        nature: string
      }
      beneficiary: {
        id: number
        name: string
        identification_number: string
      }
    }
  }
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
