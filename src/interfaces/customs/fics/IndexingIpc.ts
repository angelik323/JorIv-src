export interface IActionProps {
  action: string
}

export interface IIndexingIpcProcessItem {
  investment_plan_id: string
  investment_plan_code: string
  initial_balance: string
  indexation_value: string
  yields: string
  final_balance: string
}

export interface IIndexingIpcItem {
  id_fund: number
  id: number
  fund: string
  business_trust: string
  last_closing_date: number | string
  rate: number | string
}

export interface IIndexingListRequest {
  id: number
  rate: string
  creator: ICreator
  fund: IFund
  business_trust: IBusinessTrust
  created_at: Date
}

interface IBusinessTrust {
  id: number
  business_code: string
  name: string
}

interface ICreator {
  id: number
  document: string
  document_type_id: number
  document_type: IDocumentType
  name: string
  second_name: string
  last_name: string
  second_last_name: string
  phone: string
  email: string
  user_code: string
  user_type: string
  profile_type: string
  status: IStatus
  status_id: number
  created_at: Date
  roles: IRole[]
}

interface IDocumentType {
  id: number
  name: string
  abbreviation: string
  model: string
  status_id: number
}

interface IRole {
  id: number
  name: string
}

interface IStatus {
  id: number
  status: string
  comments: null
}

interface IFund {
  id: number
  fund_code: string
  fund_name: string
  business_trust_id: number
  consolidation_option_id: number
  fic_rating: string
  has_participation_types: boolean
  is_fund_validated: boolean
  status_id: number
  created_at: string
  updated_at: string
  fund_type_id: number
  last_closing_date: null
}

/* Fund Request Squema */

export interface IFundInfoRequest {
  id: number
  fund_code: string
  fund_name: string
  fund_type_id: number
  business_trust: IBusinessTrust
  consolidation_option: IConsolidationOption
  fic_rating: string
  status_id: number
  has_participation_types: boolean
  is_fund_validated: boolean
  last_closing_date: null
  parameters: IParameter[]
  profiles: []
  business_participation_types: IBusinessParticipationType[]
  operation_channels: []
  print_groups: IPrintGroup[]
}

interface IBusinessParticipationType {
  id: number
  business_line: IConsolidationOption
  participation_types: IParticipationType[]
}

interface IConsolidationOption {
  id: number
  code: string
  description: string
}

interface IParticipationType {
  id: number
  participation_type: IConsolidationOption
  minimun_balance: string
  maximun_balance: string
  term_days: number
  commission: IParticipationTypeCommission
}

interface IParticipationTypeCommission {
  id: number
  code: string
}

interface IBusinessTrust {
  id: number
  business_code: string
  name: string
}

interface IParameter {
  id: number
  operation_start_date: Date
  operation_end_date: null
  operation_control_date: Date
  calculation_unit: string
  minimun_value: string
  minimun_number_investors: number
  maximun_porcentage_per_investors: string
  minimun_plan_balance: string
  minimun_investment_plan_percentage: string
  fund_permanency_agreement: boolean
  fund_contribution_control: boolean
  extension_deadline: boolean
  permanency_days: number
  term_basis: number
  penalty: boolean
  penalty_gmf: boolean
  grace_days: number
  pernalty_percentage: string
  minimun_balance: string
  days_without_movement: string
  investment_plan_status_modification_id: number
  commission: IParameterCommission
  commission_assumed: null
  gmf_percentage: string
  withholding_percentage: string
  structure: string
  office_length: number
  fund_length: number
  consecutive_length: number
  structure_length: string
  example_code_plan: string
  business_type_id: number
  business_subtype_id: number
  description: null
}

export interface IParameterCommission {
  id: number
  code: string
  type: number
  fixed_rate_percentage: string
}

export interface IPrintGroup {
  id: number
  code: number
  description: string
  send_type: string
}
