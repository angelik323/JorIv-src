export interface ICheckBankTransferDetailOrigin {
  id: number
  business_trust: {
    id: number
    business_code: string
    name: string
  }
  movement: {
    id: number
    code: string
    description: string
    nature: string
    operation: string
    generate_special_contribution: boolean
    handles_accounting_offset: boolean
    conciliation_movement: boolean
    transfer_investments: boolean
    transfer_accounts: boolean
    receipt_types_id: number
    sub_receipt_types_id: number
    receipt_types_status: {
      status: string
    }
    move_override: number | string | null
  }
  bank: {
    id: number
    description: string
    type: string
    accounting_account: string
    status: {
      id: number
      name: string
    }
    code: string
    bank_code: string | null
    nit: {
      id: number | null
      nit: string | null
    }
    has_movements: boolean
  }
  bank_account: {
    id: number
    account_name: string
    account_bank: string
    account_number: string
    operation_type: string
    account_type: string
  }
  found_id: number | null
  investment_plans_id: number | null
  method_payment: {
    id: number
    code: string
    description: string
    type_mean_of_payments: string
    dispersion_type: string
    transaction_type: string
    type_funds_transfer: string | null
    request_registration_beneficiary: boolean
    type_registrations: string | null
    payment_instructions: boolean
    authorized_payment: boolean
    crossed_check: boolean
    message_check: string | null
    request_bank_withdrawal: boolean
    status_id: number
  }
  foreign_currency_value: string
  coin: string
  trm: string
  value: string
  cost_center: {
    id: number
    code: string
    name: string
  } | null
  cash_flow: {
    id: number
    code: string
    structure_code: string
    type: string
    name: string
    nature: string
    activity_group: string
  } | null
  type: string
  created_by: number
}

export interface ICheckBankTransferDetailDestination {
  id: number
  business_trust: {
    id: number
    business_code: string
    name: string
  }
  movement: {
    id: number
    code: string
    description: string
    nature: string
    operation: string
    generate_special_contribution: boolean
    handles_accounting_offset: boolean
    conciliation_movement: boolean
    transfer_investments: boolean
    transfer_accounts: boolean
    receipt_types_id: number
    sub_receipt_types_id: number
    move_override: number | string | null
  }
  bank: {
    id: number
    description: string
    type: string
    accounting_account: string
    status: {
      id: number
      name: string
    }
    code: string
    bank_code: string | null
    nit: {
      id: number | null
      nit: string | null
    }
    has_movements: boolean
  }
  bank_account: {
    id: number
    account_name: string
    account_bank: string
    account_number: string
    operation_type: string
    account_type: string
  }
  found_id: number | null
  investment_plans_id: number | null
  method_payment: {
    id: number
    code: string
    description: string
    type_mean_of_payments: string
    dispersion_type: string
    transaction_type: string
    type_funds_transfer: string | null
    request_registration_beneficiary: boolean
    type_registrations: string | null
    payment_instructions: boolean
    authorized_payment: boolean
    crossed_check: boolean
    message_check: string | null
    request_bank_withdrawal: boolean
    status_id: number
  }
  foreign_currency_value: string | null
  coin: string
  trm: string | null
  value: string
  cost_center: {
    id: number
    code: string
    name: string
  } | null
  cash_flow: {
    id: number
    code: string
    structure_code: string
    type: string
    name: string
    nature: string
    activity_group: string
  } | null
  type: string
  created_by: number
  created_at: string | null
  updated_at: string | null
}

export interface ICheckBankTransfer {
  id: number
  date: string
  office_id: number
  name_office: string
  observations: string
  origin_details: ICheckBankTransferDetailOrigin
  destination_details: ICheckBankTransferDetailDestination
  voucher_id?: number | null
  treasury_movement: {
    accounting_consecutive: string
    period: string
    voucher_id: number
  }
}
