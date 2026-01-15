export interface IAccountingBlockResponse {
  id?: number
  amortizes_funds: boolean
  accounting_account: {
    code: string
    name: string
  }
  code_movement_funds: string | ''
  demand_investment_plan: boolean
  gmf_associate_affects: boolean
  movement_funds_processes: boolean
  movement_nature: string
  structure: string
  movement: string
  third_party: {
    code: string | ''
    name: string | ''
  }
  third_type: string | ''
}

export interface IAccountingBlockInformationForm {
  account_structure_id: number | null
  treasury_movement_code_id: number | null
  movement_name: string
  movement_nature: string
  account_chart_id: number | null
  third_type: string
  third_party_id: number | null
  movement_funds_processes: boolean
  code_movement_funds: number | null
  gmf_associate_affects: boolean
  demand_investment_plan: boolean
  amortizes_funds: boolean
}

export interface IAccountingBlockToCreate
  extends Partial<IAccountingBlockInformationForm> {}

export interface IAccountingBlockToEdit
  extends Partial<IAccountingBlockInformationForm> {}
