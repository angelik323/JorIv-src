export interface IRecordIndividualIncomeFilterForm {
  id?: number | null
  income_record_id?: number | null
  office_id: number | null
  name_office: string | null
  business_trust_id: number | null
  name_business: string | null
  date: string | null
  movement_id: number | null
  voucher: string | null
  sub_voucher: string | null
}

export interface IRecordIndividualIncomeDetailForm {
  nit_third_party_id: number | null
  type_receive_id: number | string | null
  cost_center_id: number | null
  cash_flow_id: number | null
  concept: string | null
  bank_id: number | null
  bank_account_id: number | null
  foreign_currency_value: number | null
  coin: string | null
  trm: number | null
  value: number | null
  checkbook: string | null
  bank_checkbook_id: number | null
  effective_date: string | null
  investment_plans_id: number | null
}

export interface IRecordIndividualIncomeDetailView {
  id: number | null
  third_party: {
    id: number | null
    document?: string | null
    name: string | null
  }
  type_receive: {
    id: number | string | null
    code: string | null
    description: string | null
    type_receive: string | null
  }
  cost_center: {
    id: number | null
    code: string | null
    name: string | null
  }
  cash_flow: {
    id: number | null
    code: string | null
    name: string | null
  }
  concept: string | null
  bank: {
    id: number | null
    description: string | null
    bank_code: string | null
  }
  bank_account: {
    id: number | null
    account_name: string | null
    account_number: string | null
  }
  foreign_currency_value: number | null
  coin: string | null
  trm: number | null
  value: number | null
  checkbook: string | null
  bank_checkbook: {
    id: number | null
    description: string | null
    bank_code: string | null
  }
  effective_date: string | null
  investment_plans: {
    id: number | null
    description: string | null
  }
}

export interface IRecordIndividualIncomeResponse {
  id?: number | null
  foreign_currency_value_total?: number | null
  local_currency_value_total?: number | null
  calculated_foreign_total: number | null
  calculated_local_total: number | null
  state: string | null
  details: IRecordIndividualIncomeDetailView[]
}

export interface IRecordIndividualIncomeDetailList
  extends Array<IRecordIndividualIncomeDetailView> {}

export interface IRecordIndividualIncomeToCreate
  extends Partial<IRecordIndividualIncomeFilterForm> {
  details: IRecordIndividualIncomeDetailForm[]
}

export interface IRecordIndividualIncomeToEdit
  extends Partial<IRecordIndividualIncomeDetailForm> {}

export interface IRecordIndividualIncomeToConfirm
  extends Partial<IRecordIndividualIncomeFilterForm> {
  business_id?: number | null
  foreign_currency_value_total?: number | null
  local_currency_value_total?: number | null
  state?: string | null
}
