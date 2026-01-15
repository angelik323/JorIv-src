export interface ITypesOperation {
  code: number
  description: string
  generates_fic_movement: boolean
  fic_movement_code: number | null
  operation_nature: string
  accounting_origin: string
  generates_papeleta: boolean
  operation_type_history?: {
    created_at: string
    creator_data: string
    updated_at: string
    updated_data: string
  }
  inversion_type_id?: number | null
  treasury_movement_code_id?: number | null
  inversion_type_description?: string | null
}
