import { IGenericResource } from './Common'

export interface ICollectiveInvestmentFunds extends IGenericResource {
  fixed_rate_percentage?: string
  type?: number
  variable_rates?: [{ rate_percentage?: number }]
}

export interface IFundResource extends IGenericResource {
  id: number
  fund_code?: string
  code_name?: string
  fund_name?: string
  description?: string
  business_trust_id?: number
  consolidation_option_id?: number
  created_at?: string
  fic_rating?: string
  fund_type_id?: number
  has_participation_types?: boolean
  is_fund_validated?: boolean
  last_closing_date?: null | string
  status_id?: number
  updated_at?: string
  fic_parameters?: {
    permanency_days?: number | null
    withholding_percentage?: string | number | null
    gmf_percentage?: string | number | null
    operation_start_date?: string | null
  }[]
  business_trust?: {
    id: number
    name: string
    business_code: string
  }
}

export interface IFiduciaryInvestmentPlanResource extends IGenericResource {
  id: number
  code: string
  code_name: string
  collective_investment_fund_id: number
  operation_office_id: number
  status_id: number
  blocking_reason: string | null
  fip_holder_identifications: {
    id: number
    plan_id: number
    holder_id: number
    fic_print_group_id: number
    residential_address: string
    email_address: string
    city_id: number
    phone: number
    funding_source_id: number
    created_at: string
    updated_at: string
  }
  fip_parameters: {
    id: number
    plan_id: number
    fic_manager_user_id: number
    fic_advisor_user_id: number
    has_web_operations: boolean
    contribution_operations_per_day: number
    contribution_operations_per_month: number
    withdrawal_operations_per_day: number
    withdrawal_operations_per_month: number
    fic_business_line_id: null | number
    fic_participation_type_id: null | number
    penalty: boolean
    percentage: string
    has_trust_management: boolean
    business_trust_id: number
    opening_amount: null | string | number
    plan_balance: null | string | number
    created_at: string
    updated_at: string
    available_balance: string
    fic_participation_type?: {
      participation_type?: {
        description: string
      }
    }
  }
  status: {
    id: 1
    status: string
    comments: null | string
  }
  operation_office: {
    id: number
    regional_id: number
    office_code: string
    office_description: string
    office_schedule_start: string
    office_schedule_end: string
    extended_schedule_start: string
    extended_schedule_end: string
    status_id: number
    created_at: string
    updated_at: string
  }
  collective_investment_fund: IFundResource | null
  fundId?: number
  business_trust?: {
    business_code?: string
    name?: string
  }
}
export interface IRegionalResource extends IGenericResource {
  id: number
  regional_code: string
  regional_description: string
}
export interface IFicsFundResource extends IGenericResource {
  fund_code?: string
  fund_name?: string
  last_closing_date?: string | null
  created_at?: string | null
  business_trust?: {
    business_code: string
    name: string
  }
  fic_parameters?: {
    permanency_days?: number | null
    withholding_percentage: string | number | null
    gmf_percentage: string | number | null
    operation_start_date?: string | null
    fund_permanency_agreement?: boolean
    penalty?: boolean | null
    pernalty_percentage?: string | number | null
  }[]
  business_trust_id?: number | null
  has_participation_types?: boolean
}

export interface IFicsPrintGroupResource extends IGenericResource {
  fund_id?: number
  description?: string
  send_type?: string
}

export interface IUserBasicData extends IGenericResource {
  id: number
  name: string
  last_name: string
  document: string
  profile_type: string
  email: string
}

export interface IPrintGroupResource extends IGenericResource {
  fund_id?: number
  description?: string
  send_type?: string
}

export interface IFicGenericInvestmentPlan extends IGenericResource {
  id: number
  code: string
  fip_holder_identifications?: {
    holder_id: number
    city_id?: number
    created_at?: string
    deleted_at?: string | null
    email_address?: string | null
    fic_print_group_id?: number
    funding_source?: string
  }
  fip_parameters?: {
    fic_participation_type?: {
      participation_type?: {
        description: string
      }
    }
  }
}

export interface IFreezeResourcesGeneric extends IGenericResource {
  collective_investment_fund?: {
    fund_code?: string
    fund_name?: string
  }
  balance?: number
  freeze_balance?: number
  unfreeze_balance?: number
  status?: {
    status: string
    status_id: number
  }
}
export interface IFicBulkUploadOptions extends IGenericResource {
  fund_name?: string
  created_at?: string
  office_description?: string
  account_name?: string
  last_balance?: {
    final_balance_local?: string
  }
}

export interface IInfoCollectiveInvestmentFunds extends IGenericResource {
  fund_code?: string
  fund_name?: string
}
