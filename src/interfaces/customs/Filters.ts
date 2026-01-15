/*eslint-disable*/

import { ComputedRef } from 'vue'

export interface IFieldFilters {
  name: string
  label: string
  type: string

  value: any

  remote?: boolean
  options?: any
  class: string
  icon?: string
  prepend_icon?: string
  disable: boolean | ComputedRef<boolean>
  clean_value: boolean
  autocomplete?: boolean
  multiple?: boolean
  separate_values?: boolean
  max_values?: number
  rules?: ((val: any) => true | string)[] | []
  option_calendar?: (date: string) => boolean
  placeholder?: string
  hide?: boolean
  mask?: string
  isForceValue?: boolean
  calendarId?: number
  radioType?: 'radio' | 'toggle' | 'checkbox'
  onChange?: Function
  readonly?: boolean
  onNavigation?: Function
  navigation_max_year?: string
  navigation_min_year?: string
  hide_bottom_space?: boolean
  display_value?: string
  display_label?: string
  custom_selection_label?: string | Function

  /** List of object property names that can be used to filter the options array. */
  filter_options?: string[]

  onFilter?: (value: string, update: () => void, abort: () => void) => void
}

export interface IFilterProps {
  fields: IFieldFilters[]
  buttons?: string[]
  show_actions?: boolean
  trigger_event_by_field?: boolean
  option_calendar?: ((date: string) => boolean) | undefined
  module_to_get_filters?: string
  filtersLocked?: boolean
}

export interface IFieldFiltersV1 extends Omit<IFieldFilters, 'disable'> {
  disable: boolean
}

export interface ISelectorResources {
  id: number
  name: string
  last_name: string
  label: string
  code: string
  causal_code?: string | null
  description: string
  status_id: number
  operation_number: string
  method: string
  abbreviation: string
  role: string
  type: string
  account_name?: string
  warehouses_count: number
  question: string
  option: string | number
  nameOffice: string
  group_type: { type: string }
  parent_branch_id: number | null
  code_purpose: string
  parent_branch: {
    id: number
    status_id: string
    name: string
    description: string
    type: null | string
    parent_branch_id: null | number | string
  } | null
  classification: { useful_life_in_years: string }
  item: { code: string; name: string; status_id: number }
  nature: string
  asset_group: { classification: { useful_life_in_years: string } }
  entry_date: string
  adquisition_value: string
  asset_group_role: { role: string }
  section_id: string
  plate_code: string
  value: string | number
  nit: string
  percentage: string
  account_chart: {
    id: number
    name: string
  }
  third_party: {
    id: number
    name: string
    document_type?: {
      id: number
      name: string
    }
    document: string
  }
  third_party_id: number
  business_name: string
  formatted_query_initial_date: string
  formatted_query_end_date: string
  third_party_classification: string
  child_branches?: {
    id?: number
    status_id?: number
    name?: string
    description?: string
    type?: string
    parent_branch_id?: string
  }[]
  bank_id: number
  city: {
    code: string
    id: number
    name: string
  }
  bank: {
    accounting_account: string
    id: number
    description: string
    bank_code: string
  }
  identity_type: string
  occupation: string
  status: string
  nationality: string
  business_code: string
  bank_code: string
  purpose: string
  structure: string
  office_code: string
  office_description: string
  type_mean_of_payments: string
  account_number: string
  coin_type: 'Local' | 'Extranjera'
  account: {
    has_cost_center: boolean
    functional_business_currency: string
    functional_currency_id: number
    accounting_structure?: {
      purpose: string
      code: string
    }
  }
  treasurie: {
    has_cash_flow: boolean
    last_close_date?: string
  }
  account_structure: string
  authorized_payment: string
  payment_instructions: string
  request_bank_withdrawal: boolean
  document: string
  receipt_types?: {
    id: number
    name: string
    code: number
  }
  sub_receipt_types?: {
    id: number
    name: string
    code: number
    receipt_type_id?: number
  }
  business_type_id: number
  indice?: string
  document_type: {
    abbreviation: string
  }
  start_date?: string
  end_date?: string
  type_receive?: string
  action_rating: string
  accounting_structure_code: string
  accounting_structure_purpose: string
  full_name_code?: string
  handles_accounting_offset?: boolean
  rating_code?: string
  document_third?: string
  anna_code?: string
  email?: string
  has_cost_center?: boolean
  fund_code?: string
  fund_name?: string
  users?: {
    id: number
    name: string
    last_name: string
  }
  business_line?: {
    code: string
    description: string
  }
  funding_source?: string
  describe_funding_source?: string
  contractual_relationship?: string
  source_of_goods?: string
  disable?: boolean
  accounting_blocks?: {
    movement_funds_processes?: boolean
    account_chart?: {
      has_cost_center?: boolean
    }
  }[]
  business?: string
  commission_class_catalog?: { id: number; name: string }
  commission_type_catalog?: { id: number; name: string }
  business_subtype_id?: number
  benefit_id?: string
  benefit_name?: string
  operation_nature?: string
  total_value?: string
  benefit_nit?: string
  title_id?: number
  operation_type_description?: string
  origin_currency_value?: string
  operation_value_origin_currency?: string
  operation_value_local_currency?: string
  resource_placement_date?: string
  compliance_date?: string
  operation_value?: string
  operation_coverages_types_elements: {
    value: number
    label: string
  }[]
  unit_value?: string
  emitter_id?: number
  currency_id?: string
  third_party_document?: string
  third_party_name?: string
  year?: number
  account_structure_id?: number | null
  file_extension?: {
    name?: string
  }
  path?: string
  category_type?: {
    id: number
    name: string
  } | null
  amount?: number
  currency_conversion?: number
  document_name?: string
  document_code?: string
  third_party_type?: string
  minimum_percentage?: string
  maximum_percentage?: string
  clausule?: string
  concept_code?: string
  structure_id?: number
  account_type?: string
  business_name_snapshot?: string
  business_code_snapshot?: string
  concept_name?: string
  class?: string
  additional_number?: string
  category_name?: string
  numbering_type_name?: string
  has_budget?: boolean
  manage_budget?: boolean
  derivate_contracting?: boolean
  process_code?: string
  user: {
    id?: number | string
    name?: string
  }
  app_name?: string
}

export interface IFilterFundResource {
  id: number
  description: string
  fund_code?: string
  fund_name?: string
  users?: {
    id: number
    name: string
    last_name: string
  }
  business_line?: {
    id: number
    code: string
    description: string
  }
  funding_source?: string
  describe_funding_source?: string
  contractual_relationship?: string
  source_of_goods?: string
}

export interface IBranchV2 {
  id?: number
  name?: string
  status_id?: number
  type?: string | null
  parent_branch_id?: string | null
  parent_branch?: string | null
  child_branches?: {
    id?: number
    status_id?: number
    name?: string
    description?: string
    type?: string
    parent_branch_id?: string
  }[]
}
export interface IFilterData {
  name: string | null
  selector: string | null
  type: string | null
  value: string | null
}

export type LVPrimitive = string | number | boolean | null

export interface ILabeledValue {
  label?: string
  value?: LVPrimitive
}

export type DocTypesApi = Record<string, ILabeledValue[] | undefined>

export type IFiltersFormat = Record<string, string | number | boolean>

export type IPaginatedFiltersFormat = IFiltersFormat & {
  page: number
  rows: number
}

export type INullableFiltersFormat = Record<string, string | number | null>

export type INullablePaginatedFiltersFormat = INullableFiltersFormat & {
  page: number
  rows: number
}
