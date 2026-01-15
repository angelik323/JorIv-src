export interface IExpenseChecksList {}

export type ICheckFilterType = 'office_id' | 'business_code' | 'bank_account'

export interface IExpenseCheckItem {
  id: number
  officeName: string
  business: string
  businessName: string
  registerDate: string
  checks: string
}

export interface IExpenseCheckSendFilters {
  'filter[office_id]'?: string
  'filter[business_id]'?: string
  'filter[bank_account_id]'?: string
  'filter[start_date]'?: string
  'filter[end_date]'?: string
  'filter[checkbooks_id]'?: string
  'filter[from_check_id]'?: string
  'filter[to_check_id]'?: string
}

export interface IExpenseCheckFilters extends IExpenseCheckSendFilters {
  'filter[office_name]'?: string
  'filter[business_name]'?: string
}

export interface IExpensesCheckInfo {
  id: number
  beneficiary: {
    id: number
    name: string
  }
  value: string
  valueLetter: string
  date: string
  message: string
}

export interface IExpenseCheckList {
  id: number
  office: {
    id: number
    name: string
    code: string | null
  }
  business: {
    business_code: string
    name: string
  }
  bank_account: string
  created_at: string
  checkbook: string
}

export interface IExpenseCheckDetailList {
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
    type: string
    contacts: string[]
    addresses: string[]
    financialInfo: string | null
    fundingSourceLegalPerson: string | null
    fundingSourceNaturalPerson: string | null
  }
  bank_account: {
    account_number: string
  }
  created_at: string
  checkbook: string
}

export interface IExpenseCheckDetailInfo {
  id: number
  consecutive: number
  value: string
  valueLetters: string
  date: string
  message: string
  bank: {
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
    type: string
    contacts: string[]
    addresses: string[]
    financialInfo: string | null
    fundingSourceLegalPerson: string | null
    fundingSourceNaturalPerson: string | null
  }
}
