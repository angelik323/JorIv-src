export enum NatureOperation {
  INCOME = 'Ingreso',
  EXPENSE = 'Egreso',
}

export enum BankSlot {
  ORIGIN = 'origen',
  DESTINY = 'destino',
  FULFILLMENT = 'cumplimiento',
}

export type BankSlotKey = keyof typeof BankSlot
export type BankSlotValue = `${BankSlot}`

export interface IGenerateBallot {
  investment_portfolio_id: string
  operation_type_id: string
  instruction_slip_type_id: string
  operation_date: string
  issuers_counterparty_id: string
  titles: {
    title_id: number
  }[]
  treasury_instructions: {
    treasury_means_of_payment_id: string | number
    account_types: {
      account_type: string
      bank_id: number
      bank_account_number: string
      value: number
    }[]
  }[]
}

export interface IGenerateBallotFormDetail {
  operation_value: number
  titleOperation: number
  typeOperation: number
  ValueOperation: number
  titles: {
    title?: string
    title_id: number
    operation_type: string
    operation_value?: number
    payment_or_collection_method_id?: string | number
    origin_currency_value?: string
    origin_currency_operation_value?: string
    local_currency_operation_value?: string
    beneficiary?: string
    placement_date?: string
    fulfillment_date?: string
    bank_origin_id?: number | null
    bank_destiny_id?: number | null
    bank_fulfillment_id?: number | null
    account_origin_id?: number | null
    account_destiny_id?: number | null
    account_fulfillment_id?: number | null
    id?: number
    currency?: string | null
    operation_value_origin_currency?: string | number | null
    operation_value_local_currency?: string | number | null
    resource_placement_date?: string | null
    compliance_date?: string | null
    operation_origin_currency_value?: string
    local_currency_transaction_value?: string
  }[]
  nitBenefit?: string
}
export interface IGenerateBankRows {
  id: string
  value: string
  rowIndex: number
  elementIndex: number
  manual_options: []
}

export interface IGenerateBallotMenu {
  investment_portfolio_id: string
  operation_type_id: string
  instruction_slip_type_id: string
  operation_date: string
}

export interface IGenericBallotTableRows {
  _originalIndex?: number
  account_type: string[]
  banks: {
    id: string
    value: string | number
  }[]
  account_numbers: {
    id: string
    value: string
  }[]
  values: {
    id: string
    value: number
  }[]
}

export interface ISelectionMenuPayload {
  instruction_slip_type_id: number
  investment_portfolio_id: number
  operation_date: string
  operation_type_id: number
}

export interface IBallotTitle {
  title_id: number
  payment_or_collection_method_id?: string | number
  origin_bank_id: number | null
  origin_bank_account_id: number | null
  destiny_bank_id: number | null
  destiny_bank_account_id: number | null
  compliance_bank_id: number | null
  compliance_bank_account_id: number | null
  operation_value: number
  benefit_id: number
  id: number
}

export interface ICreateBallotPayload {
  investment_portfolio_id: string
  operation_type_id: string
  instruction_slip_type_id: string
  operation_date: string
  issuers_counterparty_id: string
  titles: IBallotTitle[]
  treasury_instructions: {
    treasury_means_of_payment_id: string | number
    account_types: {
      account_type: string
      bank_id: number
      bank_account_number: string
      value: number
    }[]
  }[]
}

export interface IGenerateBallotSubmit extends IGenerateBallotFormDetail {
  valueTypePayment: string | number
  selectedBanks: Record<string, number | null>
  selectedAccounts: Record<string, number | null>
}

export interface IInfoFormRefType {
  onSubmit: () => void
  models: IGenerateBallotFormDetail
}
