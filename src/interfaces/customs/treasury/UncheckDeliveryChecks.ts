export interface IUncheckDeliveryChecksInfoView {
  title: string
  description: string | null | number
}
export interface IUncheckDeliveryChecksFilter {
  'filter[business_id]'?: string
  'filter[bank_id]'?: string
  'filter[account]'?: string
}
export interface IUncheckDeliveryChecksList {
  id?: number | null
  consecutive?: number | null
  check_number?: number | null
  isDelivered?: boolean
  created_by?: string
  is_delivered?: boolean
  status?: {
    id?: number | null
    name?: string
  }
  expense_date?: string
  value?: string
  formatted_value?: string
  delivery_date?: string
  authorized_document?: number | null
  authorized_identification?: number | null
  instructions?: string
  generated_date?: string
  payment_method?: {
    id?: number | null
    type?: string
    description?: string
    authorized_payment?: boolean
    payment_instructions?: boolean
  }
  bank?: {
    id?: number | null
    name?: string
    code?: string
  }
  bank_account?: {
    id?: number | null
    account_number?: string
    account_name?: string
  }
  beneficiary?: {
    id?: number | null
    identification?: number | null
    name?: string
    identification_type?: number | null
    nit?: string
    full_name?: string
  }
  authorized_by?: {
    id?: number | null
    name?: string
    document_number?: number | null
    identification?: number | null
  }
  business?: {
    id?: number | null
    name?: string
    code?: string
  }
  movement?: {
    id?: number | null
    code?: string
    description?: string
    nature?: string
  }
  checkbook?: {
    id?: number | null
    name?: string
    consecutive?: number | null
  }
  created_at?: string
  updated_at?: string

  view_mode?: boolean
  can_edit?: boolean
  can_delete?: boolean
  can_unmark?: boolean

  actions?: {
    can_edit?: boolean
    can_view?: boolean
    edit_url?: string
    view_url?: string
    can_unmark?: boolean
    unmark_url?: string
  }
}
