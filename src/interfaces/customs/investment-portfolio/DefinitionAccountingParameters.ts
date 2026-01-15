export interface IDefinitionAccountingParameters {
  id: number
  system_code: string
  business_group: number
  accounting_structure: number
  cost_center: string
}

export interface IDefinitionAccountingParametersDetails {
  id?: number | null
  operation_id?: number | null
  operation_code: number | string | null
  paper_type_id?: number | null
  paper_type: number | string | null
  investment_class: string | null
  nature: string | null
  main_match_id?: number | null
  main_match: number | string | null
  auxiliary: string | null
  cost_center_id: number | null
  cost_center?: string | null
  higher_account_receivable_id?: number | null
  higher_account_receivable: number | string | null
  receivable_auxiliary: string | null
  receivable_cost_center_id: number | null
  receivable_cost_center?: string | null
  counterparty_account_id?: number | null
  counterparty_account: number | string | null
  counterparty_auxiliary: string | null
  counterparty_cost_center_id?: number | null
  counterparty_cost_center: number | string | null
  voucher_type_id?: number | null
  voucher_type: number | string | null
  sub_receipt_types_id?: number | null
  sub_receipt_types: number | string | null
  operation_description: string | null
}

export interface IDefinitionAccountingParametersPositions {
  id?: number | null
  operation_code_id?: number | null
  operation_code: number | string | null
  paper_type_id?: number | null
  paper_type: number | string | null
  investment_class: string | null
  position: string | null
  main_match_id?: number | null
  main_match: number | string | null
  auxiliary: string | null
  cost_center_id: number | null
  cost_center?: string | null
  counterparty_account_id?: number | null
  counterparty_account: number | string | null
  nature: string | null
  receivable_cost_center_id: number | null
  receivable_cost_center?: string | null
  counterparty_auxiliary: string | null
  voucher_type_id?: number | null
  voucher_type: number | string | null
  sub_receipt_types_id?: number | null
  sub_receipt_types: number | string | null
  operation_description: string | null
}

export interface IDefinitionAccountingParametersDerivates {
  id?: number | null
  operation_code_id?: number | null
  operation_id?: number | null
  operation_code: number | string | null
  paper_type_id?: number | null
  paper_type: number | string | null
  investment_class: string | null
  objective: string | null
  main_match_id?: number | null
  main_match: number | string | null
  auxiliary: string | null
  cost_center_id: number | null
  cost_center?: string | null
  counterparty_account_id?: number | null
  counterparty_account: number | string | null
  nature: string | null
  counterparty_auxiliary: string | null
  counterparty_cost_center_id?: number | null
  counterparty_cost_center: number | string | null
  voucher_type_id?: number | null
  voucher_type: number | string | null
  sub_receipt_types_id?: number | null
  sub_receipt_types: number | string | null
  operation_description: string | null
}

export interface IDefinitionAccountingParametersForm {
  id?: number | null
  system_code?: string | null
  business_group?: number | string | null
  accounting_structure?: number | string | null
  cost_center?: number | string | null
  company_code?: number | string | null
  bussiness_description?: string | null
  created_by?: number | null
  updated_by?: number | null
  created_at?: string | null
  updated_at?: string | null
  details: IDefinitionAccountingParametersDetails[] | [] | null
  positions?: IDefinitionAccountingParametersPositions[] | [] | null
  derivatives?: IDefinitionAccountingParametersDerivates[] | [] | null
}

export interface IDefinitionAccountingParametersList
  extends Array<IDefinitionAccountingParameters> {}
