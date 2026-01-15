export interface ITreasuryRecordsConsultationList {
  id: number
  date: string
  office: string
  business: string
  record: string
  record_status: string | null
  upload: string
  status: string
  movement_code: string
  operation_type: string
  description: string | null
  collection_payment_method: string | null
  amount: number
  bank: {
    code: string
    description: string
  }
  account_type: string
  bank_account: {
    account_number: string
  }
  investment_plan: {
    code: string
  }
  origin_business: string | null
  third_party: {
    document: string
    name: string
    id: number
  }
  third_party_bank: {
    account_number: string
    account_name: string
  }
  beneficiary_bank: {
    code: string
    description: string
    id: number
  }
  beneficiary_bank_account: string | null
  collection_check: string | null
  check_bank: string | null
  branch: string
  payment_authorized: string | null
  instructions: string | null
  check_generated: string | null
  foreign_currency_amount: number
  tmr: number
  effective_date: string | null
  cost_center: {
    code: string
  }
  cash_flow: {
    code: string
  }
  created_by: string
  creation_date: string
  authorized_by: string | null
  authorization_date: string | null
  voucher_type: string | null
  treasury_voucher_number: string | null
  rejection_reasons: string | null
  register: number
  payer_bank_account: string | null
  type_receive_name: string | null
  generated_check: string | null
  origin_bank_code: string | null
  origin_bank_name: string | null
  destination_bank_code: string | null
  destination_bank_name: string | null
  destination_business_code: string | null
  destination_business_name: string | null
  origin_business_code: string | null
  origin_business_name: string | null
  origin_bank_account_name: string | null
  accounting_consecutive: string | null
  treasury_error: string | null
  authorizer_movement_name: string | null
  status_id: number
  receipt_type_code: number
  method_payment_code: string | null
  method_payment_description: string | null
  cost_center_code: string
  cost_center_name: string
  cash_flow_code: string
  cash_flow_name: string
  foreign_currency_value: string
  trm: string
  created_at: string
  authorizer_name: string | null
  authorization_instructions: string | null
  value: string
  bank_code: string
  bank_description: string
  branch_code: string
  investment_plans_id: string | null
  third_party_document: string
  load: string
  type_movement_code: string
  type_operation: string
  business_code: string
  business_name: string
  name_office: string
  office_id: number
  business_trust: {
    business_code: string
    id: number
    name: string
  }
  movement: {
    code: string
    receipt_types: {
      id: number
    }
    sub_receipt_types: {
      id: number
    }
    description: string
  }
  method_payment: {
    code: string
    description: string
  }
  treasury_movement: {
    period: string | null
  }
  authorization_by: {
    name: string
    last_name: string
  }
  authorized_identification: {
    document: string
    name: string
  }
  record_id: number | null

  authorization: {
    voucher_id: number | null
    accounting_consecutive: string | null
  }
  origin_detail: {
    business_trust: {
      business_code: string
      id: number
      name: string
    }
  }
}
