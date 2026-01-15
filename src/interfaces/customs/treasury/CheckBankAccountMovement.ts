export type FilterSourceItem = {
  value: string | number
  name?: string
  label?: string
}

export interface IFilterMappingConfig {
  source: { value: FilterSourceItem[] }
  targetField: string
  property: string
}

export interface ICheckBankAccountMovementItem {
  id: number
  date: string
  concept: string
  nature: string
  value: number
  coin: string
  trm: number
  foreign_currency_value: number
  voucher: string | null
  number_voucher?: string
  initial_balance: number | null
  final_balance: number | null
  total_incomes: number | null
  total_expenses: number | null
  business: {
    name: string | null
  }
  bank: {
    description: string | null
  }
  bank_account: {
    account_number: string | null
    account_name: string | null
  }
  third_party: {
    document: string | null
  }
}

export interface ICheckBankAccountMovementRequest {
  id: number
  total_period_incomes: number
  total_period_expenses: string | number
  voucher: {
    id: number
    code: number
  }
  initial_balance: number | null
  final_balance: number | null
  total_expenses: number | null
  total_incomes: number | null
  business_trust: {
    id: number
    name: string
    business_code: string
  }
  bank: {
    id: number
    description: string
    type: string
    accounting_account: string
    status_id: number
    code: string
    bank_code: string
    third_party_id: number
    has_movements: boolean
  }
  third_party: {
    id: number
    document: string
    name: string
  }
  treasury_movement: {
    office_id: number
    date: string
    periodo: string
    receipt_types: {
      id: number
    }
    sub_receipt_types: {
      id: number
    }
    voucher: {
      accounting_consecutive: string
    }
  }
  bank_account: {
    id: number
    account_name: string
    account_number: string
  }
  accounting_balance: number
}
