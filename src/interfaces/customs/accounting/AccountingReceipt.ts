export interface IAccountingReceipt {
  business_trust_id: number
  registration_date: string
  registration_day: number
  receipt_type_id: number
  sub_receipt_type_id: number
  voucher_data: IVoucherAmount[]
  total_amount_credits: number
  total_amount_debits: number
  difference_amount: number
}

export interface IAccountingReceiptItem {
  id: number
  registration_date: string
  business_trust_id: number
  receipt_type_id: number
  status_id: number
  code: string
  business_trust: {
    id: number
    business_code: string
    name: string
    account: {
      cost_center_structure: {
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
    code: string
    name: string
  }
  accounting_structure: {
    id: number
    code: string
    purpose: string
    type: string
  }
  is_annulled?: boolean
  is_annuller?: boolean
  voucher_data: IVoucher[]
  authorization_status?: {
    id?: number
    status?: string
  }
}

interface IVoucher {
  id: number
  voucher_id: number
  account_id: number
  cost_center_id: number
  account: {
    id: number
    code: string
    name: string
    account_structure_id: number
    account_structure: {
      id: number
      code: string
      purpose: string
    }
  }
  cost_center: {
    id: number
    code: string
    name: string
    type: string
  }
}

export interface IVoucherAmount {
  id?: number
  nature: string
  account_id: number
  account?: {
    id: number
    name: string
    code: string
  }
  third_party_id: number
  third_party?: {
    commercial_registration: string
    document: string
    id: number
    natural_person: {
      id: number
      name: string
      middle_name: null | string
      last_name: string
      second_last_name: null | string
    } | null
    legal_person: {
      id: number
      business_name: string
    } | null
    document_type?: {
      id?: number
      name?: string
      abbreviation?: string
    }
  }
  cost_center_id?: number | null
  cost_center?: {
    id: number
    name: string
    code: string
  }
  register_detail: string
  debit?: string
  credit?: string
  foreign_currency: string
  type_foreign_currency?: string
  currency_id?: number | null
  currency?: {
    id: number
    code: string
  }
}

export interface IVoucherStatusResource {
  id: number
  status: string
  comment: string | null
}

export interface IAccountingReceiptFilter {
  'filter[initial_date]': string
  'filter[final_date]': string
  'filter[business_trust_id]': string
  'filter[account_structure_code]': string
  'filter[receipt_type_id]': string
  'filter[code]': string
  'filter[status]': string
}

export interface IBusinessTrustAccountStructure {
  type: string
  account_structure: IAccountReceiptStructure
}

export interface IAccountReceiptStructure {
  id: number
  code: string
  purpose: string
}

export interface IAccountingReceiptCreate {
  id: number
  business_trust_id: string | number
  accounting_structure_id: string | number
  business_trust_account_structure_label: string
  structure_applied_label: string
  sub_receipt_type_label: string
  accounting_structure: {
    id: number
    code: string
    purpose: string
    type: string
  }
  business_trust: {
    id: number
    business_code: string
    name: string
    account: {
      id: number
      current_period: string
      business_trust_account_structure: IBusinessTrustAccountStructure[]
      account_structure: IAccountReceiptStructure
    }
  }
  registration_day: string
  registration_date: string
  receipt_type_id: number
  receipt_type: {
    id: number
    code: string
    name: string
  }
  sub_receipt_type_id: number | string
  sub_receipt_type: {
    id: number
    code: string
    name: string
  }
  code: string
  voucher_data: IVoucherAmount[]
  total_amount_debits: string | number
  total_amount_credits: string | number
  difference_amount: string | number
  status: {
    id: number
    status: string
  }
  created_at?: string
  authorization_status?: AuthorizationStatus
  homologation_process?: HomologationProcess
  is_manual?: boolean
}

export interface IVoucherLines<T> {
  rows: T[] | number
  currentPage: number
  lastPage: number
  total: number
  perPage: number
}

interface AuthorizationStatus {
  id?: number
  status?: string
  created_by?: EdBy
  authorized_at?: string
  authorized_by?: EdBy
  authorization_notes?: string
  anullment_type?: AnullmentType
  reversed_by_voucher_id?: number
}

interface HomologationProcess {
  fiscal?: EquivalentFiscal
  equivalent?: EquivalentFiscal
}

interface EquivalentFiscal {
  homologation_date?: string
  receipt_type?: ReceiptType
  code?: number
  homologated_by?: EdBy
  homologated_voucher?: number
}

interface AnullmentType {
  id?: number
  code?: number
  name?: string
}

interface EdBy {
  id?: number
  name?: string
}

interface ReceiptType {
  id?: number
  code?: number
  name?: string
}
