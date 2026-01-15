export interface IAccountingParametersMovementsForm {
  accounting_block_id: number | null
  movement_code_id: number | null
  fund_type_id: number | null
  departure_nature: string | null
  departure_account_chart_id: number | null
  departure_auxiliar_id: number | null
  departure_third_party_id: number | null
  departure_cost_center_id: number | null
  counterpart_type: string | null
  counterpart_nature: string | null
  counterpart_account_chart_id: number | null
  counterpart_auxiliar_id: number | null
  counterpart_third_party_id: number | null
  counterpart_cost_center_id: number | null
  receipt_type_id: number | null
  sub_receipt_type_id: number | null
}

export interface IAccountingParametersMovements {
  id: number
  accounting_block_id: number | null
  movement_code: {
    id: number
    code: string | ''
    description: string | ''
  }
  fund_type: {
    id: number
    code: string | ''
    description: string | ''
    abbreviation: string | ''
  }
  departure_nature: string | ''
  departure_account_chart: {
    id: number
    code: string | ''
    name: string | ''
  }
  departure_auxiliar: {
    id: number
    abbreviation: string | ''
    description: string | ''
  }
  departure_third_party: {
    id: number
    document: string | ''
  }
  departure_cost_center: {
    id: number
    code: string | ''
    name: string | ''
  }
  counterpart_type: string | ''
  counterpart_nature: string | ''
  counterpart_account_chart?: {
    id: number
    code: string | ''
    name: string | ''
  }
  counterpart_auxiliar: {
    id: number
    abbreviation: string | ''
    description: string | ''
  }
  counterpart_third_party: {
    id: number
    document: string | ''
  }
  counterpart_cost_center: {
    id: number
    code: string | ''
    name: string | ''
  }
  receipt_type: {
    id: number
    code: string | ''
    description: string | ''
    value: number
    label: string | ''
  }
  sub_receipt_type: {
    id: number
    code: string | ''
    description: string | ''
    value: number
    label: string | ''
  }
}

export interface IAccountingParametersMovementsView
  extends IAccountingParametersMovements {}

export type IAccountingParametersMovementsList =
  IAccountingParametersMovements[]
