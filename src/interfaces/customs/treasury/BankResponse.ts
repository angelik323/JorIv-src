export interface IBankResponseFilterForm {
  bank_id: number | null
  bank_name: string | null
  file_type: string | null
  bank_structure_id: number | null
  description_format: string | null
  dispersal_date: string | null
  dispersion_group_id: number | null
}

export interface IBankResponseFilterFormResponse {
  file_name: string
  total_registers: number
  filters: {
    with_answer: Record<string, string> | Array<{ id: string }>
    without_answer: Record<string, string> | Array<{ id: string }>
  }
  date: string
  errors: string[]
}

export interface IBankResponseValidateApiResponse {
  success: boolean
  message: string
  data: IBankResponseFilterFormResponse
}

export interface IBankResponseDocument {
  id?: number | null
  is_new: boolean
  url: string | null
  name: string | null
  size: number | null
  file: File | null
}

export interface IBankResponsePayment {
  id: number
  consecutive: number
  movement_status: {
    id: number
    status: string
    comments: string | null
  }
  business: {
    id: number
    business_code: string
    name: string
    status: {
      id: number
      status: string
      comments: string | null
    }
  }
  value: string
  voucher: {
    id: number
    code: number
    name: string
    status: {
      id: number
      status: string
      comments: string | null
    }
  }
  third_party: {
    id: number
    document: string
  }
  bank_response_status?: {
    id: number
    status?: string
    comments?: string | null
  }
  cancellation_code?: {
    cancellation_code: string
    description: string
  }
  reason_for_return: string
  dispersion_group: {
    id: number
    dispersion_date: string
    validity: string
    value: string
    status: {
      id: number
      status: string
      comments: string | null
    }
  }
  bank: {
    id: number
    code: string
    description: string
    status: {
      id: number
      status: string
      comments: string | null
    }
  }
  bank_account: {
    id: number
    account_name: string
    account_number: string
    status: {
      id: number
      status: string
      comments: string | null
    }
  }
  check?: boolean
  check_reject?: boolean
  check_apply?: boolean
  check_debit?: boolean
}

export interface IBankResponseAssignForm {
  status: number | null
  reason_id: number | null
  reason_label: string | null
  observations: string | null
}

export interface IBankResponseDescriptionForm {
  id?: number | null
  business?: {
    id: number
    business_code: string
    name: string
  } | null
  dispersion_group?: {
    id: number
    dispersion_date: string
    validity: string
    value: string
    status: {
      id: number
      status: string
      comments: string | null
    }
  } | null
  bank?: {
    id: number
    code: string
    description: string
    status: {
      id: number
      status: string
      comments: string | null
    }
  } | null
  bank_account?: {
    id: number
    account_name: string
    account_number: string
    status: {
      id: number
      status: string
      comments: string | null
    }
  } | null
  third_party?: {
    id: number
    document: string
  } | null
}

export interface IBankResponseDetailRejectForm {
  date: string | null
  bank_structure_id: number | null
  observations: string | null
  ids: {
    [key: string]: {
      code: string | null
      status_id: number | null
    }
  }
}

export interface IBankResponsePaymentList extends Array<IBankResponsePayment> {}

export interface IBankResponsePaymentPages {
  currentPage: number
  lastPage: number
  total_items: number | null
  per_page: number | null
}

type CloseModalEmit = {
  (e: 'close:modal'): void
}

export interface IBankResponseFilterEmits {
  (e: 'update:processType', value: string): void
  (e: 'search'): void
}

export interface IBankResponseAssignEmits extends CloseModalEmit {
  (e: 'update:table-status'): void
}

export interface IBankResponseValidateForm {
  (e: 'validate-upload-file'): void
}

export interface IBankResponseError {
  business_code: number
  detail: number
  field: string
  message: string
}

export interface IBankResponseRejectResponse {
  errors: IBankResponseError[]
}
