type NullableNumberString = number | string | null
type FileOrNull = File | null | undefined

export interface ICertifiedParametersListItem {
  index: number
  id: number
  code: number
  certificate_type: string
  name: string
  person_type: string
  generation_date: string
}

export interface ICertifiedParametersInformationForm {
  code?: number
  certificate_type_id: NullableNumberString
  certificate_type?: string | null
  name: NullableNumberString
  person_type_id: NullableNumberString
  html_header?: string | null
  html_body?: string | null
  html_footer?: string | null
  html_content?: string | null
  logo?: FileOrNull
  firma?: FileOrNull
  marca_agua?: FileOrNull
  generation_date?: string | null
}

export interface ICertifiedParametersResponse {
  code: number
  certificate_type_id: number
  certificate_type?: string | null
  name: string
  person_type_id: number
  person_type?: {
    id: number
    name: string
  }
  html_header?: string
  html_body?: string
  html_footer?: string
  created_at?: string
  updated_at?: string
  generation_date?: string | null
}

export interface ICertifiedParametersToCreate {
  certificate_type_id: number
  name: string
  person_type_id: number
  html_header?: string
  html_body?: string
  html_footer?: string
  assets?: {
    logo?: FileOrNull
    firma?: FileOrNull
    marca_agua?: FileOrNull
  }
}

export interface ICertifiedParametersToEdit {
  certificate_type_id?: number
  name?: string
  person_type_id?: number
  html_header?: string
  html_body?: string
  html_footer?: string
  assets?: {
    logo?: FileOrNull
    firma?: FileOrNull
    marca_agua?: FileOrNull
  }
}

export interface IVariableUpload {
  signature: FileOrNull
  watermark: FileOrNull
  logo: FileOrNull
}

export interface ICertifiedParametersView {
  id?: number
  certificate_type?: string | null
  generation_date?: string | null
}

export interface IFixedVariable {
  id: number
  name: string
}

export interface UseFixedVariablesFormOptions {
  onAddVariable?: (variable: { code: string; name: string }) => void
}
