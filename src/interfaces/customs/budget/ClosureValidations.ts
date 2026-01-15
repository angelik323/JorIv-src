export interface IClosureValidation {
  id?: string | number | null
  level?: {
    id: string | number | null
    name: string | null
    description: string | null
  }
  cancellation_code?: {
    id: string | number | null
    code: string | null
    description: string | null
  }
  constitution_code?: {
    id: string | number | null
    code: string | null
    description: string | null
  }
}

export interface IClosureValidationForm {
  id?: string | number | null
  level_id: string | number | null
  level_code?: string | null
  level_description?: string | null
  cancellation_code_id: string | number | null
  cancellation_movement_code?: string | null
  cancellation_movement_description?: string | null
  constitution_code_id: string | number | null
  constitution_movement_code?: string | null
  constitution_movement_description?: string | null
}

export interface IClosureValidationFilters {
  level_id?: string | number | null
  cancellation_code_id?: string | number | null
  constitution_code_id?: string | number | null
}


