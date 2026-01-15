export interface IMovementCodesItemList {
  id: number
  code: string
  description: string
  movement_type: number
  movement_type_description: string
  movement_class: number
  movement_class_description: string
  movement_natura: number
  movement_nature_description: string
}

export interface IMovementCodesResponse {
  id: number
  code: string
  description: string
  movement_type_id: number | string | null
  movement_type_description: string | null
  movement_class_id: number | string | null
  movement_class_description: string | null
  movement_nature_id: number | string | null
  movement_nature_id_number: number | string | null
  movement_nature_description: string | null
  movement_group_id: number | string | null
  movement_group_description: string | null
  annulment_movement: number | string | null
  real_estate_movement: number | string | null
  generate_accounting: boolean
  operation_class: string | null
  origin_module_id: number | string | null
  origin_module_description: string | null
  consolidated_code: string
  distribution_code: string
  withholding_base: string
}

export interface IMovementCodesInformationForm {
  code: string
  description: string
  movement_type_id: number | string | null
  movement_type_description: string | null
  movement_class_id: number | string | null
  movement_class_description: string | null
  movement_nature_id: number | string | null
  movement_nature_id_number?: number | string | null
  movement_nature_description: string | null
  movement_group_id: number | string | null
  movement_group_description: string | null
  annulment_movement: number | string | null
  real_estate_movement?: number | string | null
  generate_accounting: boolean
  operation_class: string | null
  origin_module_id: number | string | null
  origin_module_description: string | null
  consolidated_code: string
  distribution_code: string
  withholding_base: string
}

export type PropsInformationForm = {
  action: 'create' | 'view' | 'edit'
  data?: IMovementCodesResponse | null
}
