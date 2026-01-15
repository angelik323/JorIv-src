export interface ILetterFormat {
  name: string
  id?: number
  bank_id?: number
  definition?: string
  variables?: ILetterFormatVariable[]
  tables?: ILetterFormatTable[]
  creator_data?: string
  update_data?: string
  format_code: string
  bank_code: string
  bank_name: string
  office_code?: string
  office_name?: string
  format?: string
  format_name?: string
  status: {
    id: number
    status: string
  }
  generation_date?: string
  printed?: boolean
  printed_by?: string
  printed_at?: string
  created_by?: string
  created_at?: string
  updated_by?: string
  updated_at?: string
  format_definition?: string
  format_definition_bottom?: string
  table?: string | null
  table_rows?: TableRow[]
  table_columns?: { name: string; label: string; field: string }[]
  table_html?: string
}
export type UpdateLetterFormatPayload = {
  name: string
  bank_id: number
  format_definition: string
  format_definition_bottom?: string
  format_definition_html?: string
  format_definition_bottom_html?: string
  status_id: number
  code?: string
  table?: string | null
  table_html?: string
}

export interface ILetterFormatFilters {
  code: null
  bank: null
  search: string | null
  page: number
  rows: number
  status: null
}

export interface ILetterFormatVariable {
  key: string
  description: string
  section: string
}

export interface ILetterFormatTable {
  id: number
  key: string
  description: string
  section: string
  columns: Array<{
    key: string
    label: string
  }>
  status: number
}

export interface ICatalogRow {
  id: number
  bank: string
  business: string
  section?: string
  date: string
  payment_method: string
  value: string
}

export interface ILetterFormatResponse {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any
  id: number
  format_code: string
  format_name: string
  bank_code: string
  bank_name: string
  definition: string
  variables: ILetterFormatVariable[]
  tables: ILetterFormatTable[]
  history?: {
    created_at: string
    updated_at: string
    creator_data: string
    update_data: string
  }
  name?: string
  code?: string
  bank_id?: string
  bank?: {
    id: number
    bank_code: string
    description: string
  }
  status?: {
    id: number
    status: string
  }
  format_definition?: string
  format_definition_bottom?: string
  created_at?: string
  updated_at?: string
  table?: string
  table_columns?: {
    name: string
    label: string
    field: string
  }[]
  table_rows?: {
    [x: string]: string | number
    id: number
  }[]
}

export interface ILetterFormatViewModel {
  id?: number
  name: string
  format_code: string
  format_name: string
  bank_code: string
  bank_name: string
  format: string
  status: {
    id: number
    status: string
  }
  created_at: string
  updated_at: string
  creator_data: string
  update_data: string
  variables: ILetterFormatVariable[]
  tables: ILetterFormatTable[]
}

export interface ILetterFormatTableSummary {
  id: number
  format_code: string
  name: string
  bank: {
    id: number
    name: string
  }
  created_at: string
  status: number
}

export interface ILetterFormatTablePayload {
  section: string
  items: Array<{
    variable: string
    alias: string
  }>
}
export interface UseListLetterFormatModalOptions {
  onAddVariable?: (row: {
    code: string
    name: string
    type: string
    section?: string
  }) => void

  onAddTable?: (row: ILetterFormatTablePayload) => void

  emit: (
    e: 'update:openVariableModal' | 'update:openTableModal',
    value: boolean
  ) => void
}

export interface ICreateLetterFormatPayload {
  name: string
  bank_id: number
  format_definition: string
  status_id: number
  format_code?: string
  table?: string | null
  table_html?: string
  format_definition_html?: string
  format_definition_bottom?: string
  format_definition_bottom_html?: string
}

export type TableRow = {
  [x: string]: string | number
  id: number
}

export interface ITableItem {
  variable: string
  alias: string
}

export interface ITablesSnapshot {
  items: ITableItem[]
  rows: TableRow[]
}

export type BackendSectionKey = 'general' | 'source_payer' | 'destination'

export interface FlatVarItem {
  key: string
  label: string
}

export type FlatVariables = FlatVarItem[]

export type VariablesResource = Partial<
  Record<BackendSectionKey, Record<string, string>>
>

export interface WrappedVariablesResource {
  letter_format_variables: VariablesResource | FlatVariables
}

export type ModalType = 'variable' | 'table'
export type SectionKey = 'generales' | 'fuente_pagadora' | 'destino'

export type VarOption = { label: string; value: string }

export interface ILetterFormatModalRow {
  id: number
  variable: string
  alias: string
  section: SectionKey
}
