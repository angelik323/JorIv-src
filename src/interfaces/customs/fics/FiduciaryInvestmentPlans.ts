import { ActionType } from '@/interfaces/global'
import { IAddresses, IContact } from '../IThirdParties'

export interface IFiduciaryInvestmentPlanItem {
  id: number
  code: number
  collective_investment_fund_id: number
  fund_code: string
  fund_name: string
  business_trust: BusinessTrust
  operation_office_id: number
  office_code: string
  office_description: string
  status_id: number
  status: string
  created_at: string
  updated_at: string
  user_created_id: number
  titular: Titular
}

export interface BusinessTrust {
  id: number
  business_code: string
  name: string
}

export interface Titular {
  id: number
  document: string
  name: string
  type: string
}

export interface IFiduciaryInvestmentPlansItemList {
  id: number
  investment_plan: string
  investment_fund: string
  business: string
  holder_identification: string
  status: string
}

export interface IFiduciaryInvestmentPlansNaturalPerson {
  name: string
  middle_name: string
  last_name: string
  second_last_name: string
}

export interface IFiduciaryInvestmentPlansHolderIdentification {
  id?: number
  holder_id?: number | null
  fic_print_group_id?: number | null
  holder?: {
    id: number | null
    document: string | number | null
    check_digit: string | number | null
    document_type: {
      name: string
      abbreviation: string
    }
    name: string
    natural_person: IFiduciaryInvestmentPlansNaturalPerson
    type?: string
    contacts: IContact[]
    addresses: IAddresses[]
    financialInfo: {
      id: number | null
      third_party_id: number | null
      funding_source: string
    }
    fundingSourceNaturalPerson?: {
      id: number | null
      third_party_id: number | null
      source_of_goods: string
    } | null
    fundingSourceLegalPerson?: {
      id: number | null
      third_party_id: number | null
      funding_source: string
    } | null
  }
  fic_print_group?: {
    id: number
    code: number
    description: string
    send_type: string
  }
  funding_source: string
  residential_address?: string
  email_address?: string
  city?: {
    id: number | null
    name: string
    code: string
  }
  city_id?: number | null
  city_description?: string
  phone?: string | number
  funding_source_id?: number | string
  main_holder?: boolean
}

export interface IFiduciaryInvestmentPlansParameters {
  id?: number
  fic_manager_user?: IFiduciaryInvestmentPlansUser
  fic_advisor_user?: IFiduciaryInvestmentPlansUser
  fic_business_line?: IFiduciaryInvestmentPlansBusinessLine
  fic_participation_type?: IFiduciaryInvestmentPlansParticipationType
  business_trust?: IFiduciaryInvestmentPlansBusinessTrust
  fic_manager_user_id?: number | null
  fic_advisor_user_id?: number | null
  fic_manager_user_name?: string | null
  fic_advisor_user_name?: string | null
  has_web_operations?: boolean
  contribution_operations_per_day?: number
  contribution_operations_per_month?: number
  withdrawal_operations_per_day?: number
  withdrawal_operations_per_month?: number
  fic_business_line_id?: number
  fic_participation_type_id?: number
  penalty?: boolean
  percentage?: number | string
  has_trust_management?: boolean
  business_trust_id?: number
  opening_amount?: string | number
  plan_balance?: string | number
}

export interface IFiduciaryInvestmentPlansBusinessTrust {
  id: number
  business_code: string
  name: string
}

export interface IFiduciaryInvestmentPlansBusinessLine {
  id: number
  business_line_id: number
  code: string
  description: string
}

export interface IFiduciaryInvestmentPlansParticipationType {
  id: number
  participation_type_id: number
  code: string
  description: string
}

export interface IFiduciaryInvestmentPlansUser {
  id: number
  name: string
  last_name: string
  fic_profile_manager_id?: number
  fic_profile_advisor_id?: number
}

export interface IFiduciaryInvestmentPlansOperationOffice {
  id: number
  office_code: string
  office_description: string
}

export interface IFiduciaryInvestmentPlansForm {
  id?: number
  code?: string | number
  collective_investment_fund_id?: number | null
  user_created?: {
    document: string
    name: string
    second_name: string
    last_name: string
    second_last_name: string
  }
  operation_office?: {
    id: number
    office_code: string
    office_description: string
  }
  collective_investment_fund?: {
    fund_id: number
    fund_code: string
    fund_name: string
    last_closing_date: string | null
    parameters: {
      fic_parameter_id: number
      permanency_days: number
      structure: string
      office_length: number
      fund_length: number | null
      consecutive_length: number
      description: string | null
      withholding_percentage: string | number | null
      gmf_percentage: string | number | null
      penalty: boolean
      pernalty_percentage: string
      operation_start_date?: string | null
      fund_permanency_agreement?: boolean
      percentage?: String | number | null
    }[]
  }
  user_created_id?: number
  operation_office_id?: number | IFiduciaryInvestmentPlansOperationOffice | null
  status_id?: number | null
  status?: {
    status_id: number
    status: string
  }
  fund_description?: string
  investment_plan?: string
  operation_date?: string
  expiration_date?: string
  holder_identification: IFiduciaryInvestmentPlansHolderIdentification
  holder_identifications?: IFiduciaryInvestmentPlansHolderIdentification
  holder_identifications_list?:
    | IFiduciaryInvestmentPlansHolderIdentificationItem[]
    | null
  parameters?: IFiduciaryInvestmentPlansParameters
  created_at?: string
  updated_at?: string
  randomCheck?: number | null
  email?: string
  emails?: IFiduciaryInvestmentPlansEmail[] | null
}
export interface IFiduciaryInvestmentPlansResponse {
  id?: number
  code?: string | number
  collective_investment_fund_id?: number | null
  user_created?: {
    document: string
    name: string
    second_name: string
    last_name: string
    second_last_name: string
  }
  operation_office?: {
    id: number
    office_code: string
    office_description: string
  }
  collective_investment_fund?: {
    fund_id: number
    fund_code: string
    fund_name: string
    last_closing_date: string | null
    parameters: {
      fic_parameter_id: number
      permanency_days: number
      structure: string
      office_length: number
      fund_length: number | null
      consecutive_length: number
      description: string | null
      withholding_percentage: string | number | null
      gmf_percentage: string | number | null
      penalty: boolean
      pernalty_percentage: string
      operation_start_date?: string | null
      fund_permanency_agreement?: boolean
      percentage?: String | number | null
    }[]
  }
  user_created_id?: number
  operation_office_id?: number | IFiduciaryInvestmentPlansOperationOffice | null
  status_id?: number | null
  status?: {
    status_id: number
    status: string
  }
  fund_description?: string
  investment_plan?: string
  operation_date?: string
  expiration_date?: string
  holder_identification: IFiduciaryInvestmentPlansHolderIdentification
  holder_identifications?: IFiduciaryInvestmentPlansHolderIdentification
  parameters?: IFiduciaryInvestmentPlansParameters
  created_at?: string
  updated_at?: string
  randomCheck?: number | null
  email?: string
  emails?: IFiduciaryInvestmentPlansEmail[] | null
}

export interface IFiduciaryInvestmentPlansToggleStatus {
  status_id: number | null
  blocking_reason_id: number | null
  status_observation: string | null
}

export interface IFiduciaryInvestmentPlansAccountForm {
  plan_id: string | number
  payment_method_id: number | null
  destination_fund_id: number | null
  destination_plan: string | number | null
  destination_bank_id: number | null
  account_number: string | number | null
  account_type: string
  identification_type: string
  identification_id: number | null
  identification_number: string | number | null
  people_name: string
  operation_count_per_day: number | null
  maximum_value_per_operation: number | null
  total_amount_per_day: number | null
  inscription_status_id: number | null
}

export interface IFiduciaryInvestmentPlansAccountList {
  id: number
  plan_id: number
  payment_method: {
    id: number
    code: string
    type_mean_of_payments: string
  } | null
  destination_fund: {
    fund_id: number
    fund_code: string
    fund_name: string
  } | null
  destination_plan: {
    id: number
    name: string
  } | null
  destination_bank: {
    id: number
    description: string
    bank_code: string | null
  } | null
  account_number: number | null
  account_type: string
  identification: {
    id: number
    name: string
  } | null
  identification_type: string
  identification_number: number | null
  people_name: string
  operation_count_per_day: number | null
  maximum_value_per_operation: string | null
  total_amount_per_day: string | null
  inscription_status: {
    status_id: number
    status: string
  } | null
}

export interface IFiduciaryInvestmentPlanBalanceAdjustmentForm {
  id?: number
  collective_investment_fund_id: number | null
  investment_plan_id: number | null
  registration_date: string
  operation_date: string
  investment_plan_status: string
  fund_code: string
  fund_description: string
  fund_business_id: string
  plan_code: string
  plan_description: string
  plan_business_id: string
  plan_balance: number | null
  capital_balance: number | null
  performance_balance: number | null
  adjustment: string
  adjustment_in: string
  adjustment_type: string
  adjustment_observation: string
  adjustment_class: string
  adjustment_value: string | null
  movement_code: string
  initial_date: string
  final_date: string
  calculation_balance: string | null
  automatic_adjustment_in: string | number | null
}

export interface IFiduciaryInvestmentPlanAdjustmentRequest {
  balance_type: string
  adjustment_nature_id: number
  adjustment_type: string
  adjustment_value: string | null
  adjustment_notes: string
  class_movement_id: number | null
  movement_code_id: number
  collective_investment_fund_id: number | null
  fiduciary_investment_plan_id: number
  calculation_balance?: string | null
  start_date?: string
  end_date?: string
}

export interface IFiduciaryInvestmentPlanAdjustmentDetail {
  id: number
  registration_date: string
  fund_code: string
  fund_name: string
  fund_business_trust: string
  operation_date: string | null
  plan_code: string
  plan_holder: string
  plan_business_trust: string
  status_name: string
  balance: number
  capital: number | null
  returns: number
  collective_investment_fund_id?: number
  investment_plan_id?: number
}

export type IFiduciaryInvestmentPlansPropsForm = {
  action: ActionType
  data?: IFiduciaryInvestmentPlansForm | null
}

export enum AdjustmentType {
  CAPITAL = 'Capital',
  PERFORMANCE = 'Rendimiento',
}

export enum AdjustmentMode {
  MANUAL = 'Manual',
  AUTOMATIC = 'Automático',
}

export enum MovementType {
  INCOME = 'ingreso',
  EXPENSE = 'egreso',
}

export interface IFicProfileUser {
  id?: number
  name?: string
  last_name?: string
  document?: string
  email?: string
  profile_type?: string
}

export interface IFicProfile {
  id?: number
  type_user?: number
  users?: IFicProfileUser[]
}

export interface IFicProfileOption {
  value: string | number
  label: string
  type_user?: number
  profile_id?: number
  user_id?: number
}

export interface IFicProfilesResponse {
  fic_profiles: IFicProfile[]
}

export interface IFicCheckBalancesView {
  available_balance?: string | null
  cancelation_control?: string | null
  clearing_balance?: number | null
  fiduciary_investment_plan?: string | null
  freeze_balance?: string | null
  fund_code?: string | null
  fund_name?: string | null
  operation_start_date?: string | null
  created_at?: string | null
  last_closing_date?: string | null
  plan_balance?: string | null
  reserved_balance?: string | null
  returns?: string | null
  operation_value?: string | null
  returns_bases?: {
    base0?: number | null
    base3?: number | null
    base4?: number | null
    base7?: number | null
    base25?: number | null
  }
  business_trust?: {
    id?: number | null
    business_code?: string | null
    name?: string | null
  }
  taxes?: {
    business_trust?: {
      id?: number | null
      business_code?: string | null
      name?: string | null
    }
    gmf?: number | null
    net_with_tax?: number | null
    net_without_tax?: number | null
    participation_type?: string | null
    penalty?: number | null
    retention?: number | null
  }
  plan_code?: string | null
  holder?: {
    document?: string | null
    name?: string | null
  }
  // utils
  business?: string | null
  participation_type?: string | null
  gmf?: number | null
  retention?: number | null
  penalty?: number | null
  net_with_tax?: number | null
  net_without_tax?: number | null
  account_holder_name?: string | null
  business_plan?: string | null
  participation_type_plan?: string | null
}
export interface IFicCheckBalancesViewReturnsBaseRow {
  description: string
  attach: number | string
}
export type IFicCheckBalancesViewPropsForm = {
  action: ActionType
  data?: IFicCheckBalancesView | null
}

export interface IFicCheckBalancesViewReturnsBaseRow {
  description: string
  attach: number | string
}

export interface IFicCheckBalancesPlansList {
  movement_date?: string | null
  movement_code?: string | null
  movement_description?: string | null
  movement_class?: string | null
  movement_nature?: string | null
  operation?: number | null
}

export type IFicFiduciaryInvestmentPlansReportOptions =
  | 'open_plans'
  | 'canceled_plans'

export interface IFicFiduciaryInvestmentPlansCanceledPlansItemsList {
  fund_code: string
  plan: string
  holder: string
  cancellation_date: string
  cancellation_value: string
}

export interface IIFicFiduciaryInvestmentPlansOpenPlansItemsList {
  fund_code: string
  fund_description: string
  plan_code: string
  holder_identification: string
  opening_date: string
  opening_value: number
  created_by: string
}

export type IFicConsultUnitsViewPropsForm = {
  action: ActionType
  data?: IFicConsultUnitsDataBasicForm | null
}

export interface Holder {
  id: number
  document: string
  name: string
  type: string
}

export interface IFicConsultUnitsDataBasicForm {
  fund_code: string
  fund_name: string
  business_trust: BusinessTrust
  plan_code: string
  holder: Holder
  participation_type: string
  last_closing_date: string | null
  status: {
    id: number
    status: string
  }
}

export interface IFicConsultUnitsInvestmentPlansDetails {
  initial_balance: number[]
  contributions: number[]
  withdrawals: number[]
  adjustments: number[]
  retentions: number[]
  gmf_retentions: number[]
  annulations: number[]
  final_balance: number[]
}

export interface IInvestmentPlanRowData {
  concept: string
  saldo_pesos: number
  saldo_unidades: number
}
export interface IFiduciaryInvestmentPlansHolder {
  id?: number | null
  document?: string
  document_type?: {
    name?: string
  }
  natural_person?: {
    last_name?: string
    middle_name?: string
    name?: string
    second_last_name?: string
  }
  legal_person?: {
    business_name?: string
  }
  main_holder?: boolean
}

export interface IFiduciaryInvestmentPlansEmail {
  id?: number | null
  email?: string
  extracts_excel?: boolean
  extracts_pdf?: boolean
  daily_balances?: boolean
  files_sftp?: boolean
  participation_document?: boolean
  files_multicash?: boolean
}
export interface IFiduciaryInvestmentPlansHolderIdentificationItem {
  id?: number
  holder_id?: number | null
  main_holder?: boolean
}
