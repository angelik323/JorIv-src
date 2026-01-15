export interface IInvestmentFundItem {
  id: number
  fund_code: string
  fund_name: string
  last_closing_date: string | null
  business_trust?: {
    id: number
    business_code: string
    name: string
  } | null
  participation_types?: Array<{
    id: number
    code: string
    description: string
    business_line?: {
      id: number
      code: string
      description: string
    }
  }>
  consolidation_option?: {
    id: number
    code: string
    description: string
    name?: string
  }
  has_participation_types?: boolean
  status: {
    id: number
    status: string
    comments: string | null
  }
}

export interface IInvestmentFundValidationItem {
  id: number
  fund: {
    id: number
    code: string
    description: string
  }
  participation_type: {
    id: number
    code: string
    description: string
    name?: string
  }
  business_trust: {
    id: number
    code: string
    description: string
  }
  participation_type_id?: number
  last_closing_date?: string | null
  details?: IInvestmentFundValidationDetail[]
}

export interface IInvestmentFundValidationDetail {
  validator?: string
  validator_type?: string
  status: {
    id: number
    status: string
    comments: string | null
  }
}

export interface IFundValidationResponse {
  id: number
  fund_code: string
  fund_name: string
  last_closing_date?: string | null
  participation_types: IParticipationTypeValidation[]
}

export interface IParticipationTypeValidation {
  participation_type_id: number
  participation_type_description: string
  validations: IInvestmentFundValidationDetail[]
}

export interface IMovementProcessReviewItem {
  id: number
  movement_code: string
  movement_group: string
  value: string
  user: string
  module: string
}

export interface ICapitalProcessReviewItem {
  id: number
  movement_code: string
  movement_class: string
  nature: string
  value: string
  user: string
  currency_operation_code: string
  investment_plan_code: string
}
export interface IFundValidation {
  id: number
  fund_code: string
  fund_name: string
  business_trust: string | null
  has_participation_types: boolean
  last_closing_date: string | null
  consolidation_option: {
    id: number
    code: string
    description: string
    name?: string
    status_id: number
    created_at: string
    updated_at: string
  } | null
  participation_types: IFundParticipationType[]
  status: {
    id: number
    status: string
    comments: string | null
  }
}

export interface IFundParticipationType {
  id: number
  fund_id: number
  business_line_id: number
  created_at: string
  updated_at: string
  deleted_at: string | null
  business_line: IFundBusinessLine
  participation_types_balance: number
}

export interface IFundBusinessLine {
  id: number
  code: string
  description: string
  status_id: number
  created_at: string
  updated_at: string
  cancellation_reason: string | null
  type: number
  deleted_at: string | null
  consolidated_participation_type: null
}

export interface IFundMovementDetail {
  id: number
  code: string
  description: string
  movement_type_id: number
  movement_type_code: string
  movement_type_description: string
  movement_class_id: number
  movement_class_code: string
  movement_class_description: string
  movement_nature_id: number
  movement_nature_code: string
  movement_nature_description: string
  movement_group_id: number
  movement_group_code: string
  movement_group_description: string
  annulment_movement: string | null
  real_estate_movement: string
  generate_accounting: boolean
  operation_class: string
  origin_module_id: number
  origin_module_code: string
  origin_module_description: string
  consolidated_code: string | null
  distribution_code: string | null
  withholding_base: string
  created_at: string
  updated_at: string
  user?: string
}

export interface ICreatedByUser {
  id: number
  document: string
  document_type_id: number
  email: string
  last_name: string
  name: string
  phone: string
  profile_type: string
  second_last_name: string | null
  second_name: string | null
  status_id: number
  user_code: string
  user_type: string
}

export interface IDetailedMovement {
  id: number
  value: string
  movement: IFundMovementDetail
  created_by?: ICreatedByUser
}

export interface IDetailedMovementsResponse {
  success: boolean
  message: string
  data: IDetailedMovement[]
}
export interface IDetailedMovementParticipation {
  id: number
  code: string
  movement_code: {
    id: number
    code: string
    description: string
    process_type_id: number
    process_nature_id: number
    process_class_id: number
    movement_code_id: number
    created_at: string
    updated_at: string
  }
  fund: {
    id: number
    code: string
    name: string
  }
  plan: {
    id: number
    code: string
  }
  operationType: {
    id: number | null
    description: string | null
  }
  user: string
  balance: number
  value: string
  created_at: string
}
