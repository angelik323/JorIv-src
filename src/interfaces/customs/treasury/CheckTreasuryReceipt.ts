export interface ICheckTreasuryReceiptList {
  id: number
  number: number
  registry: string
  movement: string
  bank: string
  account: string
  date: string
  nature: string
  amount: {
    raw: string
    formatted: string
  }
}

export interface ICheckTreasuryReceiptResponse {
  id: number
  general_information: {
    voucher_id: string
    voucher_number: string
    registry: number
    movement: {
      id: number
      code: string
      description: string
    }
    bank: {
      id: number
      description: string
      bank_code: string
    } | null
    account: {
      id: number
      account_name: string
      account_number: string
    }
    bank_branch: {
      id: number
      name: string
      code: string
    }
    date: string
    nature: string
    amount: {
      raw: string
      formatted: string
    }
    form: string
    concept: string
    status: {
      id: number
    }
    annulation_reason: string | null
  }
  beneficiary_information: {
    beneficiary: {
      id: number
      document: string
      name: string
    } | null
    beneficiary_bank: {
      id: number
      description: string
      bank_code: string
    } | null
    beneficiary_account: {
      id: number
      account_number: string
      account_name: string
    } | null
  }
  check_information: {
    check_number: string | null
    office: number
    office_name?: string
    dispersal_status: string | null
    effective_date: string
  }
  registry_information: {
    registered_by: {
      id: number
      name: string
      last_name: string
    } | null
    authorized_by: {
      id: number
      name: string
      last_name: string
    } | null
    collection_check: string | null
    check_bank: string | null
  }
}

export interface IAccountingVoucher {
  id: number
  voucher_information: {
    voucher_number: string
    code: string | null
    consecutive: number
    registration_date: string
    registration_day: number
  }
  business: {
    id: number
    name: string
    code: string
  }
  receipt_information: {
    receipt_type: string
    sub_receipt_type: string
  }
  amounts: {
    movement_amount: {
      raw: string
      formatted: string
    }
    total_debits: number
    total_credits: number
    difference: number
  }
  status_information: {
    status: string
    is_annulled: boolean | null
    is_homologated: boolean | null
  }
  accounting_structure: {
    structure_id: number | null
    structure_name: string
  }
  voucher_data_summary: {
    total_entries: number
    has_third_parties: boolean
    has_cost_centers: boolean
    nature_breakdown: [] | null
  }
}
