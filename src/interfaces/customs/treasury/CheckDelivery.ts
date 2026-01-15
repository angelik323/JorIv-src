export interface ICheckDeliberyInfoView {
  title: string
  description: string | null | number
}

export interface ICheckDeliveryFilter {
  'filter[business_id]'?: string
  'filter[bank_id]'?: string
  'filter[account]'?: string
}
export interface ICheckDeliveryList {
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
    document?: string
  }
  authorized_by?: {
    id?: number | null
    name?: string
    document_number?: number | null
    identification?: number | null
    document_type?: string
    document?: string
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

  actions?: {
    can_edit?: boolean
    can_view?: boolean
    edit_url?: string
    view_url?: string
  }
  editable_fields?: EditableFields
  field_requirements?: FieldRequirements
}

export interface ITreasutyCheckDeliveryResponse {
  id?: number | null
  consecutive: number
  check_number: number
  status: Status | null
  expense_date: string
  value: string
  formatted_value: string
  delivery_date: string
  authorized_document: AuthorizedDocument
  authorized_identification: string
  instructions: string
  payment_method: PaymentMethod
  bank: AuthorizedDocument
  bank_account: BankAccount
  beneficiary: AuthorizedBy
  authorized_by: AuthorizedBy
  business: AuthorizedDocument
  movement: Movement
  editable_fields: EditableFields
  field_requirements: FieldRequirements
  created_at: string
  updated_at: string
}

interface AuthorizedBy {
  id: number
  document: string
  name: string
  document_type: string
}

interface AuthorizedDocument {
  id: number
  name: string
  code: string
}

interface BankAccount {
  id: number
  account_number: string
  account_name: string
}

interface EditableFields {
  delivery_date: boolean
  authorized_document: boolean
  authorized_identification: boolean
  instructions: boolean
}

interface FieldRequirements {
  authorized_document_required: boolean
  authorized_identification_required: boolean
  instructions_allowed: boolean
}

interface Movement {
  id: number
  code: string
  description: string
  nature: string
}

interface PaymentMethod {
  id: number
  type: string
  description: string
  authorized_payment: boolean
  payment_instructions: boolean
}

interface Status {
  id: number
  name: string
}
