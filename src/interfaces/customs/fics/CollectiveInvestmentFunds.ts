export interface ICollectiveInvestmentFundResponse {
  id?: number
  fund_code: string
  fund_name: string
  business_trust_id: number
}

export interface ICollectiveInvestmentFundRequest {
  fund_code: string
  fund_name: string
  business_trust_id: number | null
  fund_type_id: number | null
  consolidation_option_id: number | null
  consolidation_option_code: string | null
  last_closing_date?: string
  fic_rating: string
  has_participation_types: boolean
  is_fund_validated: boolean
  status_id: number
  parameters?: IFundParameters
  profiles?: IProfile[]
  business_participation_types?: IBusinessParticipationType[]
  operation_channels?: IOperationChannel[]
  print_groups?: IPrintGroup[]
}

export interface IFundParameters {
  operation_start_date: string
  operation_end_date: string
  operation_control_date: string
  calculation_unit: string | null
  minimun_value: number
  minimun_number_investors: number
  maximun_porcentage_per_investors: number
  minimun_plan_balance: number
  minimun_investment_plan_percentage: number
  fund_permanency_agreement: boolean
  fund_contribution_control: boolean
  extension_deadline: boolean
  permanency_days: number
  term_basis: number | null
  penalty: boolean
  penalty_gmf: boolean
  grace_days: number
  pernalty_percentage: number | null
  minimun_balance: number
  days_without_movement: number
  investment_plan_status_modification_id: number | null
  commission_id: number | null
  commission_assumed: string | null
  gmf_percentage: number
  withholding_percentage: number
  structure: string | null
  office_length: number
  fund_length: number
  consecutive_length: number
  structure_length: string
  example_code_plan: string
  business_type_id: number | null
  business_subtype_id: number | null
  description: string
  fixed_rate_percentage?: number
  variable_rates?: IRawParameters[]
}

export interface IProfile {
  type_user: number
  active_type_user: boolean
  users: IProfileUser[]
}

export interface IProfileUser {
  id?: number
  user?: string
  user_id: number | string | undefined
  description?: string
  is_active?: number
  type_user: number
  active_type_user?: boolean
  status?: {
    id?: number
    status?: string
  }
}

export interface IBusinessParticipationType {
  id?: number | null
  business_line_id: number | null
  business_line?: IBusinessLinesTable
  participation_types: IParticipationType[]
}

export interface IParticipationType {
  id?: number | null
  backend_id?: number | null
  participation_type_id: number | null
  code?: string
  description?: string
  minimun_balance: number
  maximun_balance: number
  term_days: number
  commission_id: number | string | null
  commission_value?: number
}

export interface IOperationChannel {
  id?: number | null
  backend_id?: number | null
  channel?: string
  operation_channel_id: number | null
  operation_channel?: {
    id: number
    name: string
  }
  operation_per_day?: number
  operation_per_month?: number
  minimun_ammount: number
  maximun_ammount: number
  bank_accounts: IBankAccountChannel[]
}

export interface IBankAccountChannel {
  id?: number | null
  backend_id?: number | null
  bank?: string
  bank_id: number | null
  has_gmf: boolean
  has_gmf_text?: string
  channel?: string
  account?: string
  description?: string
  bank_account_id: number | null
  is_preferred_account: boolean
  is_preferred_account_text?: string
}

export interface IPrintGroup {
  id?: number | null
  backend_id?: number | null
  code: number
  description: string
  send_type: string
}

export interface IBusinessLinesTable {
  id?: number | null
  backend_id?: number | null
  code: string
  description: string
  business_line_id: number
}

export interface IRawParameters {
  id: number
  initial_balance: string
  final_balance: string
  rate_percentage: string
}

export interface IRawParticipationType {
  id?: number | null
  minimun_balance?: number
  maximun_balance?: number
  term_days?: number
  commission?: {
    id: number
    code: string
  }
  participation_type?: {
    id: number
    code: string
    description: string
  }
}

export interface IConsultPercentageSummary {
  fund_id: number
  fund_code: string
  fund_name: string
  business_trust: {
    id: number
    business_code: string
    name: string
  }
  created_at: string
  last_closing_date: string | null
  max_participation_percentage: number
  max_participation_balance: number
  total_fund_value: number
}

export interface IConsultPercentageList {
  holder_identification: string
  total_balance: number
  participation_percentage: number
  plan_code: string
  plan_id: number
  status: number
  created_at: string
  plan_balance: number
}

export interface IConsultProfitabilityList {
  participation_type_code: string
  participation_type_description: string
  return_day: number
  return_7_days: number
  return_last_month: number
  return_week_days: number
  return_last_semester: number
  return_last_year: number
  return_last_2_years: number
  return_last_3_years: number
}

export interface IConsultTransmissionList {
  id: number
  fund_id: number
  created_at: string
  updated_at: string
  business_line: {
    id: number
    code: string
    description: string
  }
  initial_balance: string
}

export interface IConsultTransmissionDetailList {
  column: string
  name: string
  value: string
}

export interface IParticipationTypeSequences {
  assigned_sequence: number | null
  business_code: string
  commsion_code: string
  commsion_percentage: number
  commsion_type: string
  participation_description: string
  participation_type_code: string
  participation_type_id: number
  registration_code_id: number | null
  status: string
}

export interface IParticipationTypeSequencesRequest {
  participation_types: {
    participation_type_id: number
    assigned_sequence: string | number | null
    registration_code_id: number | null
  }[]
}
