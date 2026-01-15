export interface IResource {
  document?: string
  id?: number
  business_code_name?: string
  label: string
  value: number | string
  department_id?: number
  description?: string
  code?: string
  name?: string
  years?: string
  status_id?: string | number
  active?: boolean
  nature?: string
  useful_life_in_years?: number
  entry_date?: string
  adquisition_value?: string
  asset_group_role?: string
  section_id?: string
  plate_code?: string
  type?: string
  parent_branch_id?: number | null
  nit?: string
  initial_date?: string | null
  start_date?: string | null
  end_date?: string | null
  classification?: string
  purpose?: string
  structure?: string
  business_code?: string
  handles_accounting_offset?: boolean
  has_cost_center?: boolean
  payment_instructions?: string
  type_mean_of_payments?: string
  request_bank_withdrawal?: boolean
  business_description?: string
  accounting_structure?: string
  accounting_structure_id?: number
  code_purpose?: string
  code_name?: string
  current_period?: string
  nameOffice?: string
  months?: number | null
  office_description?: string
  document_code?: string
  document_description?: string
  characteristic_code?: string
  last_name?: string
  guarantee_type?: string
  policy_number?: string
  policy_type?: string
  is_obligatory?: boolean
  created_at?: string
  business?: string
  business_type_id?: number | null
  movement?: string
  document_third?: string
  movement_code?: string
  movement_description?: string
  category_type?: {
    id: number
    name: string
  } | null
  has_iva?: boolean | null
  percentage_iva?: number | null
  receipt_type_id?: number | null
  minimum_percentage?: string | null
  maximum_percentage?: string | null
  clausule?: string | null
  structure_code?: string | null
  has_ganerate_accounting?: boolean | null
  category_name?: string | null
  numbering_type_name?: string | null
}

export interface IBranchOptions {
  value?: number
  label?: string
  status_id?: number
  type?: string | null
  parent_branch_id?: string | null
  child_branches?: {
    id?: number
    status_id?: number
    name?: string
    description?: string
    type?: string
    parent_branch_id?: string
  }[]
  bank_id?: number
  city?: {
    code: string
    id: number
    name: string
  }
  bank?: {
    accounting_account: string
    id: number
    description: string
  }
}

export interface IResourceCustom extends Omit<IResource, 'value'> {
  value: boolean
}
