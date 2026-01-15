import { ITypeCoin } from '../treasury'
import { IGenericResource, ISelectorResourceResource } from './Common'
export interface IAccountingBlockCollectionChartResource {
  accounting_structure: { accounts_chart: [] }
  cost_center_structure: { cost_centers: [] }
}

export interface ITreasuryClosing {
  id: number
  business_trust_id: number
  bank_account_id: number
  status_id: number
  closure_type: string
  initial_balance: string
  income_local: string
  expense_local: string
  income_foreign: string
  expense_foreign: string
  final_balance_local: string
  final_balance_foreign: string
  reexpression_difference: string
  applied_performance: boolean
  performance_rate: number
  performance_value: string
  created_by: number
  created_at: string
  updated_at: string
  treasury_closing_id: number
}

export interface IAccountClosingParameterThirdPartyResource
  extends IGenericResource {
  id: number
  document: string
  name: string
  business_name: string
  last_name: string
}

export interface IMeanOfPaymentResource extends IGenericResource {
  id: number
  code: string
  type_mean_of_payments: string
}

export interface ILetterFormatCodeOption {
  code: string
  name: string
  label: string
  value: string
}

export interface ILetterFormatStatus {
  value: number
  label: string
}
export interface IBalancesOriginAndDestiny {
  closure_type: string
  id: number
  income_local: string
  expense_local: string
  initial_balance: string
  final_balance_local: string
  final_balance_foreing: string
}
export interface IBusinessBankAccounts extends IGenericResource {
  payload: {
    id: number
    account_name: string
    account_number: string
    bank_id: number
    coin_type: ITypeCoin
    coin: number
    TRM: number
    bank: {
      id: number
      description: string
      bank_code: string | null
    }
    balances?: IBalancesOriginAndDestiny[]
  }
}

export interface IBankAccountResource {
  label: string
  value: number
  account_name: string
  account_id: number
  account_number: number | string
  TRM: number
  coin_type: ITypeCoin
}

export interface IBankAndAccountsResource
  extends Omit<IGenericResource, 'value'> {
  payload: {
    bank: {
      bank_name: string
      bank_description: string
      bank_code: string
      bank_id: number
      code?: string
    }
    account: IBankAccountResource[]
  }
  value?: number | string
}

export interface ICheckbookResource {
  id: number
  code: string
}

export interface ICheckDataResource {
  id: number
  consecutive: number
  office: {
    id: number
    name: string
    code: string | null
  }
  business: {
    business_code: string
    name: string
  }
  beneficiary: {
    id: number
    document: string
    document_type: {
      name: string
      abbreviation: string
    }
    name: string
    natural_person: string[]
    contacts: string[]
    addresses: string[]
    financialInfo: string | null
    fundingSourceLegalPerson: string | null
    fundingSourceNaturalPerson: string | null
  }
  bank_account: string
  created_at: string
  checkbook: string
}

export interface IBankListResource {
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
  gmf_rate: string | null
  gmf_business_accounting_account_id: number | null
  cost_center_gmf_id: number | null
  gmf_fund_accounting_account_id: number | null
  gmf_decimals: string | null
  coin_type: ITypeCoin
  handles_checkbook: boolean
  format: string | null
  bank_branch_id: number
  opening_date: string
  treasury_concillation_closing_date: string | null
  treasury_closing_date: string | null
  status_id: number
  deleted_at: string | null
  created_at: string
  updated_at: string
  gmf_movements: number | null
  coin: number
  blocking_reasons: string | null
  cancellation_date: string | null
  cancellation_reasons: string | null
  bank: {
    id: number
    description: string
    type: string
    accounting_account: string | null
    status_id: number
    code: string
    bank_code: string | null
    third_party_id: number | null
    has_movements: boolean
  }
  balances: ITreasuryClosing[]
}

export interface IBulkUploadResouce extends IGenericResource {
  account_name: string
  account_number: string
  bank: {
    id: number
    description: string
    bank_code: string
  }
  bank_id: string
  bank_code: string
  description: string
  id: number
  coin: number
  coin_type: string
}

export interface IBankTrasladeResource {
  id: number
  code: string
  name: string
}

export interface ITRMOptions extends ISelectorResourceResource {
  payload: {
    TRM: string
    rate: number
  }
}
export interface ITreasuryClosing {
  expense_local: string
  income_foreign: string
  expense_foreign: string
  final_balance_local: string
  final_balance_foreign: string
  reexpression_difference: string
  applied_performance: boolean
  performance_rate: number
  performance_value: string
  created_by: number
  created_at: string
  updated_at: string
  treasury_closing_id: number
}
export interface IBankListResource {
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
  gmf_rate: string | null
  gmf_business_accounting_account_id: number | null
  cost_center_gmf_id: number | null
  gmf_fund_accounting_account_id: number | null
  gmf_decimals: string | null
  coin_type: ITypeCoin
  handles_checkbook: boolean
  format: string | null
  bank_branch_id: number
  opening_date: string
  treasury_concillation_closing_date: string | null
  treasury_closing_date: string | null
  status_id: number
  deleted_at: string | null
  created_at: string
  updated_at: string
  gmf_movements: number | null
  coin: number
  blocking_reasons: string | null
  cancellation_date: string | null
  cancellation_reasons: string | null
  initial_balances: {
    id: number
    business_id: number
    bank_id: number
    bank_account_id: 12
    initial_balance_local_currency: number
    initial_balance_foreign_currency: number
    initial_balance_date: string
    currency: string
    opening_date: string
    created_at: string
    updated_at: string
    deleted_at: null
  }[]

  bank: {
    id: number
    description: string
    type: string
    accounting_account: string | null
    status_id: number
    code: string
    bank_code: string | null
    third_party_id: number | null
    has_movements: boolean
  }
  balances: ITreasuryClosing[]
}
export interface IBankAccountResource {
  label: string
  value: number
  account_name: string
  account_id: number
  account_number: number | string
  TRM: number
  coin_type: ITypeCoin
  balances: number
  bank_transfer_balance: string | number
}

export interface ILetterFormatVariableItem {
  key: string
  label: string
}
export interface IBulkUploadResouce extends IGenericResource {
  account_name: string
  account_number: string
  bank: {
    id: number
    description: string
    bank_code: string
  }
  bank_id: string
  bank_code: string
  description: string
  id: number
  coin: number
  coin_type: string
}

export interface ITreauryCancellationsResource extends IGenericResource {
  cancellation_code: string
  type: string
  office_code: number | string
  name_office: string
  period: string
}

export interface ITreasuryNumberTransferResource extends IGenericResource {
  observations: string
}

export interface ICheckBookInquiryCheckbookResource {
  id: number
  code: string
  range_from: string
  range_to: string
  assignment_date: string
  next_consecutive: number
  status_id: number
  business_trust_id: number
  bank_id: number
  bank_account_id: number
}

export interface ICheckBookInquiryBusinessResources {
  id: number
  name: string
  business_code: string
}

export interface IBusinessBankAccountResource {
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
}
export interface IVariablesResource extends IGenericResource {
  data_type?: string | null
  alignment?: string | null
}

export interface ICollectionTypeResource extends IGenericResource {
  type_receive: string
}
export interface IDispersionLetterStatus extends IGenericResource {
  id: number
  status: string
}

export interface IDispersionLetterBusiness extends IGenericResource {
  business: string
  business_name: string
  id: number
  type_closing: string
}

export interface IDispersionLetterBanks extends IGenericResource {
  bank_code: string
  description: string
  id: number
}

export interface IGenerateScatterGroupGeneric extends IGenericResource {
  file_extension?: {
    name: string
  }
  path?: string
}

export interface IBankAccountWithCoinResource extends IGenericResource {
  coin: number
  account_number: string
  account_name: string
  account_type: string
  bank_id: number
  coin_type: string
  gmf_rate: boolean
  id: number
  status_id: number
  taxed_gmf: boolean
  last_balance?: number
}

export interface ITreasuryMovementCodeExpenseResource extends IGenericResource {
  id: number
  code: string
  description: string
  generate_special_contribution: boolean
  accounting_blocks?: {
    movement_funds_processes?: boolean
    account_chart?: {
      has_cost_center?: boolean
    }
  }[]
  sub_receipt_types?: {
    id: number
    name: string
    code: number
    receipt_type_id?: number
  }
  receipt_types?: {
    id: number
    name: string
    code: number
  }
}

export interface ITreasuryBulkUploadsResource extends IGenericResource {
  id: number
  load_number: string
  operation_type_label?: string
  total_value_formatted?: string
  status_label?: string
  status_color?: string
  status?: number | null
}

export interface IBankingNetworkUploads extends IGenericResource {
  attachment?: string
  file_name?: string
  file_url?: string
  status?: {
    id: number
    status: string
  }
  status_id?: number
  uploaded_at?: string
}

export interface IBankAccountWithContactsResource
  extends Omit<IBankAccountWithCoinResource, 'last_balance'> {
  last_balance?: {
    final_balance_local?: string | number
    final_balance_foreign?: string | number
  }

  bank?: {
    id: number
    description: string
    bank_code?: string | null
    contacts?: {
      id: number
      full_name: string
      job_title: string
      area?: string | null
      landline_phone?: string | null
      mobile_phone?: string | null
      email?: string | null
      preferred_contact_channel?: string | null
      available_from?: string | null
      available_to?: string | null
      working_days?: string[]
    }[]
  }
}

export interface IPaymentsWithCode extends IGenericResource {
  authorized_payment: boolean
}
