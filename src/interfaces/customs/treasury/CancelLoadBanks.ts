export interface IBankingNetworkUpload {
  id: number
  uploaded_at: string
  request_type: string
  office: IOffice
  business_trust: IBankingNetworkUploadData
  bank: IBankingNetworkUploadData
  bank_account: IBankingNetworkUploadData
  total_count: string
  status: IBankingNetworkUploadData
  file_name: string
  format_type: IBankingNetworkUploadData
  created_at: string
  updated_at: string
}

export interface IBankingNetworkUploadData {
  id?: number
  name?: string
  code?: string
  description?: string
  account_number?: string
  account_type?: string
  status?: string
  comments?: string
}

export interface IBankingNetworkUploadRecord {
  id: number
  date: string
  movement: {
    id: number
    name: string
    code: string
  }
  status: {
    id: number
    status: string
    comments: string
  }
  banking_network_upload_status: {
    id: number
    status: string
    comments: string
  }
  details: Details[]
  is_annulated: boolean
  annulation_info: string
  sub_voucher: string
  voucher: string
  created_at: string
  updated_at: string
  authorization?: {
    authorization_date: string
    authorization_type: string
    id: number
    status_id: number
    voucher: { id: number; code: number }
  }
}

export interface IBankingNetworkUploadAnnulate {
  income_record_ids: number[]
  annulate_date: string
  annulate_period: string
  vigency?: string
  annulate_observations: string
  annulate_code_id: number
}

export interface IBankingNetworkUploadAnnulateFailure {
  row: number
  business_name: string
  business_code: string
  record_number: number
  error: string
}

export interface ICancelLoadBanksDetailView {
  business: string
  business_name: string
  bank: string
  bank_name: string
  format: string
  format_name: string
  closing_date: string
  upload_date: string
  bank_account: string
  bank_account_name: string
  upload_status: string
  upload_number: string
  office: string
  office_name: string
}

interface IOffice {
  created_at: string
  extended_schedule_end: string
  extended_schedule_start: string
  id: number
  office_code: string
  office_description: string
  office_schedule_end: string
  office_schedule_start: string
  status_id: number
  updated_at: string
}

interface Details {
  id: number
  income_record_id: number
  nit_third_party_id: number
  type_receive_id: number
  cost_center_id: number
  cash_flow_id: number
  concept: string
  bank_id: number
  bank_account_id: number
  foreign_currency_value: number
  coin: string
  trm: string
  value: string
  bank_checkbook_id: number
  effective_date: string
  investment_plans_id: number
  checkbook: string
  bank_account: BankAccount
  bank: Bank
}

interface BankAccount {
  id: number
  business_id: number
  bank_id: number
  account_name: string
  account_bank: string
  account_number: string
  responsible_owner_id: number
  operation_type: string
  account_type: string
  accounting_account_id: number
  cost_center_id: number
  control_balance: boolean
  product_type: string
  taxed_withholding: boolean
  taxed_gmf: boolean
  gmf_rate: string
  gmf_business_accounting_account_id: number
  cost_center_gmf_id: number
  gmf_fund_accounting_account_id: number
  gmf_decimals: string
  coin_type: string
  handles_checkbook: boolean
  format: string
  bank_branch_id: number
  opening_date: string
  treasury_concillation_closing_date: string
  treasury_closing_date: string
  status_id: number
  deleted_at: string
  created_at: string
  updated_at: string
  gmf_movements: number
  coin: number
  blocking_reasons: string
  cancellation_date: string
  cancellation_reasons: string
}

interface Bank {
  id: number
  description: string
  type: string
  accounting_account: string
  status_id: number
  code: string
  bank_code: string
  has_movements: boolean
}
