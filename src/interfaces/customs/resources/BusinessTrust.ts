import { IResource } from '@/interfaces/global'
import { IGenericResource } from './Common'

export interface IBusinessTrustAccountStructureReport {
  id: number
  type: string
  startup_period: string
  current_period: string
  last_closing: string
  daily_closing: boolean
  last_closing_day: string
  business_trust_account_id: number
  account_structure_id: number
  created_at: string | null
  updated_at: string | null
  account_structure: {
    id: number
    code: string
    purpose: string
  }
}

export interface IBusinessTrustResource extends IResource {
  account?: {
    accounting_structure?: IAccountStructureTrust
    accounting_structure_id: number
    account_structures_description: number
    business_trust_id: number
    current_period: string
    id: number
    document?: string
    business_trust_account_structure?: IBusinessTrustAccountStructureReport[]
    can_foreign_currency?: boolean
    cost_center_structure_id: number
    cost_centers_structures_description: number
  }
  business_code?: string
  business_description?: string
  business_type_id?: number
  daily_closing?: boolean
  last_closing_day?: string
  cost_center_structure_id?: number
  accounting_structure_id?: number
  cost_center_structure_direct?: {
    code: string
    id: number
    purpose: string
    type: string
  }
}

export interface IAccountStructureTrust {
  id: number
  code: string
  purpose: string
}

export interface IFiduciaryInvestmentPlans {
  id: number
  code: string
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
    fic_business_line_id: number | null
    fic_participation_type_id: number | null
    penalty: boolean
    percentage: string
    has_trust_management: boolean
    business_trust_id: number
    opening_amount: number | null
    plan_balance: number | null
    created_at: string
    updated_at: string
  }
  status: {
    id: number
    status: string
    comments: string | null
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
  collective_investment_fund?: {
    fund_name?: string
  }
}

export interface IBusinessTrustRealEstateProjectResource
  extends IGenericResource {
  id: number
  project_name: string
  description: string
  num_stages: number
  project_type: string
  status_name: string
  business_trust: {
    id: number
    name: string
    business_code: string
  }
}

export interface IProjectStageResource extends IGenericResource {
  id: number
  stage_number: number
  observations: string | null
  associated_financing: string | null
  development_type: number | null
  business_trust_real_estate_project_id: number
  business_trust_real_estate_project: {
    id: number
    project_name: string
    project_type: string
    description: string | null
    status_name: string | null
    status: string | null
  } | null
}

export interface IBusinessTrustPropertiesResource extends IGenericResource {
  id: number
  nomenclature: string
  area: number | string
  business_trust_real_estate_project_stage_id: number
  status_id: number
  value: number
  total_paid: number
  balance_due: number
  order_number: number | null
  date_vinculation: string | null
  date_registration: string | null
  status: {
    id: number
    status: string
  }
  business_trust_real_estate_project_stages: {
    id: number
    stage_number: number
    start_end: string
  }
  total_value?: string
}

export interface IBusinessTrustMeansPayment extends IGenericResource {
  type_mean_of_payments?: string
  transaction_type?: string
}

export interface IBusinessTrustPropertySaleResource extends IGenericResource {
  id: number
  status_id: number
  has_extraordinary_payment: boolean
  real_estate_project_id: number
  real_estate_project_stage_id: number
  real_estate_project_nomenclature_id: number
  created_at: string
  updated_at: string
  deleted_at: string | null
  fiduciary_mandate_id: number | null
  nomenclature: {
    id: number
    nomenclature: string
    area: number
    value: number
    total_paid: number
    balance_due: number
    order_number: number | null
    date_vinculation: string
    date_registration: string
  }
  real_estate_project: {
    id: number
    project_name: string
    status_name: string | null
    status: string | null
  }
  real_estate_project_stage: {
    id: number
    stage_number: number
    development_type: number
    start_end: string
  }
  buyers: {
    id: number
    third_party_id: number
    business_trust_property_sale_id: number
    third_party: {
      id: number
      status_id: number
      document_type_id: number
      document: string
      document_type: {
        id: number
        name: string
        abbreviation: string
      }
      legal_person: {
        id: number
        third_party_id: number
        business_name: string
      } | null
      natural_person: {
        id: number
        third_party_id: number
        full_name?: string
      } | null
    }
  }[]
}

export interface IFiduciaryMandatesResource extends IGenericResource {
  name: string
  business_trust_id: number
  real_estate_project_id: number
  stage_id: number
  currency: string
  mandate_code?: string
  status_id: number
  investment_fund_id: number
  status: {
    id: number
    status: string
  }
  business_trust: {
    id: number
    business_code: string
    name: string
    status_name: string | null
    status: string | null
  }
}

export interface IMovementsCodesResource extends IGenericResource {
  movement_type: {
    id: number
    code: string
  }
  movement_class: {
    id: number
    code: string
  }
  movement_class_nature: {
    id: number
    code: string
  }
}

export interface IAccountsPayables extends IGenericResource {
  accounting_structure: {
    id: number
    code: string
    purpose: string
  }
}

interface IThirdParty {
  name: string
  document: string
  id: number
}

interface IBusinessTrust {
  id: number
  name: string
  business_code: string

  description?: string
  account?: {
    functional_business_currency?: string | null
  }
}
export interface IBusinessTrustParticipantResource {
  id: number
  business_trust_id: number
  percentage_participation: number
  name: string
  document_number: string
  type_resource: string
  third_party: IThirdParty
  business_trust: IBusinessTrust
}

export interface ICostCenterStructure {
  id: number
  name: string
  description: string | null
  code: string | null
}

export interface IBusinessTrustFixed {
  id: number
  business_trust_id: number
  cost_center_structure: ICostCenterStructure[]
}

export interface IBusinessFixedCurrency {
  id: number
  business_code: string
  name: string
  description?: string
  account?: {
    functional_business_currency?: string | null
  }
}
export interface ISelectorOption {
  id: number
  label: string
  value: number | string
}

export interface IBusinessTrustCurrencyOption extends ISelectorOption {
  name: string
  account?: {
    functional_business_currency?: string | null
  }
}

export interface ICostCenterStructure {
  id: number
  name: string
  description: string | null
  code: string | null
}

export interface IBusinessTrustAccount {
  id: number
  business_trust_id: number
  cost_center_structure: ICostCenterStructure[]
}

export interface ISelectorOption {
  id: number
  label: string
  value: number | string
}

export interface IBusinessTrustCurrencyOption extends ISelectorOption {
  name: string
  account?: {
    functional_business_currency?: string | null
  }
}
