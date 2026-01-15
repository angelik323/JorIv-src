export interface IAuthorizationTreasuryItemList {
  id: number
  type: string
  record: IAuthorizationRecord
  total_amount: number
  office_id: number
  office_name: string
  business_id: number
  business_name: string
  date: string
  voucher: string
  sub_voucher: string
}

export interface IAuthorizationRecord {
  id: number
  authorization_type: string
  authorization_type_label: string
  office_id: number
  office_name: string
  business_trust_id: number
  business_trust_name: string
  bank_id: number
  bank_name: string
  bank_account_id: number
  bank_account_name: string
  status: IStatus
  authorization_date: string | null
  rejection_reason: string | null
  authorized_by: string | null
  created_by: ICreatedOrUpdatedBy
  updated_by: ICreatedOrUpdatedBy
  bank: IBank
  bank_account: IBankAccount
  expense_details: IExpenseDetails
  expense_items: IExpenseItem[]
  created_at: string
  updated_at: string
}

export interface ICreatedOrUpdatedBy {
  id: number | null
  name: string
}

export interface IBank {
  id: number
  name?: string
  code: string
  description?: string
}

export interface IBankAccount {
  id: number
  account_number: string
  account_name: string
  handles_checkbook?: boolean
  account_type?: string
}

export interface IExpenseDetails {
  date: string
  voucher: string
  sub_voucher: string
  movement: IMovement
  business: IBusiness
  total_amount: number
  details_count: number
}

export interface IMovement {
  id: number
  code: string
  description: string
}

export interface IBusiness {
  id: number
  name: string
  code: string
}

export interface IExpenseItem {
  id: number
  effective_date: string
  concept: string
  value: string
  foreign_currency_value: string
  local_currency_value_total: string
  coin: string
  trm: string
  instructions: string
  payment_method: IPaymentMethod
  third_party: IThirdParty
  cash_flow: ICashFlow
  cost_center: ICostCenter
  bank: IBank
  bank_account: IBankAccount
  beneficiary_bank: IBeneficiaryBank
  beneficiary_bank_account: number
  beneficiary_account_type: string
  bank_branch: IBankBranch
  authorized_document: IAuthorizedDocument
  status: string
  check_info: unknown
}

export interface IAuthorizedDocument {
  id: number
  type: string
  identification: string
}

export interface IBeneficiaryBank {
  id: number
  name: string
}

export interface IBankBranch {
  id: number
  name: string
}

export interface ICashFlow {
  id: number
  name: string
}

export interface ICostCenter {
  id: number
  name: string
}

export interface IThirdParty {
  id: number
  name: string
  identification_number?: string
  document: string
  person_type: string
}

export interface IPaymentMethod {
  id: number
  description: string
  type: string
}

export interface IAuthorizationTreasuryDetail {
  id: number
  business: IBusiness
  authorization_type: string
  authorization_type_label: string
  office_id: number
  office_name: string
  business_trust_id: number
  business_trust_name: string
  bank_id: number
  bank_name: string
  bank_account_id: number
  bank_account_name: string
  status: IStatus
  authorization_date: string | null
  rejection_reason: string | null
  authorized_by: string | null
  created_by: ICreatedBy
  updated_by: IUpdatedBy
  bank: IBankDetail
  bank_account: IBankAccountDetail
  expense_details?: IExpenseDetails
  income_details?: IIncomeDetail[]
  origin_detail?: ITransferDetail
  destination_detail?: ITransferDetail
  expense_items: IExpenseItem[]
  created_at: string
  updated_at: string
}

export interface ITransferDetail {
  business_trust_id: number
  business_trust_name: string
  found_id: number
  fund: string
  movement: {
    code: string
    description: string
  }
  bank: {
    code: string
    name: string
  }
  cost_center: {
    id: number
    name: string
  }
  cash_flow: {
    id: number
    name: string
  }
}

export interface ITypeReceive {
  id: number
  code: string
  description: string
}

export interface IIncomeDetail {
  id: number
  type_receive: ITypeReceive
  bank: IBank
  cash_flow: ICashFlow
  cost_center: ICostCenter
  third_party: IThirdParty
  bank_account: IBankAccount
  date: string
  voucher: string
  sub_voucher: string
  movement: IMovement
  business: IBusiness
  total_amount: number
  details_count: number
  created_by: ICreatedOrUpdatedBy
  updated_by: ICreatedOrUpdatedBy
  created_at: string
  updated_at: string
}

export interface IAuthorizationIncomeDetail {
  type_receive?: { description?: string; code: string }
  bank?: { name?: string; code: string }
  cash_flow?: { name?: string; code: string }
  cost_center?: { name?: string }
  third_party?: { name?: string; document?: string }
}

export interface IBankAccountDetail {
  id: number
  account_number: string
  account_name: string
}

export interface IBankDetail {
  id: number
  code: string
  description: string
}

export interface ICreatedBy {
  id: number
  name: string
}

export interface IUpdatedBy {
  id: number | null
  name: string
}

export interface IBulkUploadsAuthorization {
  date: string
  id: number
  load_number: string
  name: string
  status: IStatus
}

export interface IStatus {
  id: number
  name: string
}

export interface IAuthorizationTreasuryFilters {
  'filter[authorization_type]': string
  'filter[office_id]': string
  'filter[office_name]': string
  'filter[business_from_id]': string
  'filter[business_from_name]': string
  'filter[business_to_id]': string
  'filter[business_to_name]': string
  'filter[load_id]': string
  'filter[load_name]': string
  'filter[load_status]': string
  'filter[load_date]': string
  'filter[bank_id]': string
  'filter[bank_name]': string
  'filter[bank_account_id]': string
  'filter[bank_account_name]': string
}

export interface IAuthorizationPayload {
  record_ids: number[]
  record_type: string
  rejection_reason?: string
  observations?: string
}

export interface IAuthorizationCustomTable {
  business_trust_name: string
  bank: IBank
  bank_account: IBankAccount
  third_party: IThirdParty
  fund: string
  investment_plan: string
  trm: string
  foreign_currency_value: string | number
  cost_center: ICostCenter
  value: string | number
  cash_flow: ICashFlow
}
