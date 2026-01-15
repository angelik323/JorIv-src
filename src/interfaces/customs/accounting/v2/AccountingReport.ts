export type TotalFieldType =
  | 'previous_debit'
  | 'previous_credit'
  | 'movement_debit'
  | 'movement_credit'
  | 'current_debit'
  | 'current_credit'

export interface IAccountingReportList {
  id: number
  consecutive: string
  current_period: string
  user_generate: {
    id: number
    complete_name: string
  }
  accounting_structure: {
    id: number
    purpose: string
  }
  from_business: {
    id: number
    code: string
    name: string
  }
  to_business: {
    id: number
    code: string
    name: string
  }
  report: {
    id: number
    name: string
    type: {
      id: number
      name: string
    }
  }
  reports_generated: IReportModel[]
}

export interface IAccountingReportForm {
  // Parameters
  name_report: string
  type_report: string
  report_type_id: number
  report_template_id: number | null
  business_class: string | null
  accounting_structure_id: number | null
  structure_level: number | null
  amount_type: string | null

  // Business
  business_unit?: string | null
  business_type_id?: string | number | null
  use_business_range?: boolean | number
  from_business_trust_code?: string | null
  to_business_trust_code?: string | null

  // Dates
  from_period_date?: string | null
  to_period_date?: string | null
  include_close_voucher?: boolean | number

  // Accounts
  use_account_range?: boolean | number
  from_account_code?: string | null
  to_account_code?: string | null

  // Filters
  filter?: IAccountingReportFilters

  paginate?: number
}

export interface IAccountingReportFilters {
  account_code: string | null
  account_code_text: string | null

  account_name: string | null
  account_name_text: string | null

  nature: string | null
  type: string | null
  group: string | null
}

export interface IAccountingReportGenerate {
  result: {
    data: IGeneralLedgerBusinessTable
  }
  models: IReportModel[]
}

export interface IGeneralLedgerBusinessTable {
  id: number
  code: string
  name: string
  amount_type: string

  business_type: {
    id: number
    name: string
  }

  account_structure: {
    id: number
    code: string
    purpose: string
  }

  details: IGeneralLedgerDetail[]

  total_values: {
    previous_balance: {
      debit: string | number
      credit: string | number
    }
    movements: {
      debit: string | number
      credit: string | number
    }
    current_balance: {
      debit: string | number
      credit: string | number
    }
  }
}

export interface IGeneralLedgerDetail {
  account: {
    id: number
    code: string
    name: string
  }

  previous_balance: {
    debit: string | number
    credit: string | number
  }

  movements: {
    debit: string | number
    credit: string | number
  }

  current_balance: {
    debit: string | number
    credit: string | number
  }
}

export interface IReportModel {
  id: number
  has_ready_to_download: boolean
  url_to_download_for_s3: string | null
  mime_type: {
    id: number
    type: 'PDF' | 'EXCEL'
  }
  report_type: {
    id: number
    description: string
  }
}

export interface IReportFormProps {
  reportResult: {
    list: IGeneralLedgerBusinessTable[]
    pages: {
      currentPage: number
      lastPage: number
    }
  }
  reportModels: IReportModel[]
  filtersFormat: { page: number; rows: number }
  reportFilters: IAccountingReportForm | null
}
