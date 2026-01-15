export interface IFormatDefinitionList {
  id: number
  code: string
  status: INameAndId
  origin: INameAndId
  formatType: INameAndId
}

export interface IRecordTypeList {
  id: number
  order: number
  name: string
  type: INameAndId
  length: number
}

export interface IRecordColumnsList {
  id: number
  variable_field_id: number
  structure_field_name: string
  start_position: number
  dimension: number
  end_position: number
}

interface INameAndId {
  id: number
  name: string
}

export interface IFormatDefinitionForm {
  id?: number | null
  code?: string | null
  status_id?: number | null
  bank_id: number | null
  origin_id: number | null
  description: string | null
  format_type_id: number | null
  validation_type_id: number | null
  generated_file_name: string | null
  dispersal_group: boolean | number | null
  generation_time: boolean | number | null
  date: boolean | 'true' | 'false' | null
  file_extension_id: number | null
  path: string | null
  applies_to_dispersal: boolean | number | null
  equivalence_validation: boolean | number | null
  file_length?: number | null
  file_type_id: number | null
  separator: string | null
  numeric_mask_id: number | null
  value_mask_id: number | null
  date_mask_id: number | null
}

export interface IRecordTypeForm {
  id?: number
  code?: string
  status_id?: number
  bank_structure_id: number | null
  order: number | null
  name: string | null
  record_type_id: number | null
  length?: number | null
}

export interface IRecordColumnsForm {
  id?: number
  code?: string
  status_id?: number
  record_type_id: number | null
  variable_field_id: number | null
  structure_field_name: string
  start_position: number | null
  dimension: number | null
  end_position: number | null
  data_type: string
  justified_id: number | null
  mask_id: number | null
  constant: string
  filler_character: string
  value?: string
}

export interface IMaskCategoryType {
  id: number
  name: string
}

export interface IMaskDetail {
  id: number
  type_id: number
  category_type: IMaskCategoryType
}

export interface IFormatDefinitionMask {
  id: number
  numeric_mask_id: number
  value_mask_id: number
  date_mask_id: number
  numeric_mask: IMaskDetail
  value_mask: IMaskDetail
  date_mask: IMaskDetail
}
