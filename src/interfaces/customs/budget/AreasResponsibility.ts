export interface IAreasResponsibilityBasicDataForm {
  id?: number | null
  code?: string | null
  description?: string | null
  type?: string | null
  structure_cost_center?: {
    code?: number | null
    description?: string | null
  }
  auxiliary_description?: string | null
  structure_area?: {
    code?: number | null
    description?: string | null
  }

  cost_center?: {
    code?: number | null
    description?: string | null
  }
  structure_cost_center_id?: number | null
  structure_area_id?: number | null
  cost_center_id?: number | null
  auxiliary_id?: number | null
}

export interface IAreasResponsibilityBasicDataResponse {
  id?: number | null
  code?: string | null
  description?: string | null
  type?: string | null
  structure_cost_center?: {
    code?: number | null
    description?: string | null
  }
  auxiliary: {
    document?: string | null
    legal_person?: {
      business_name?: string | null
    }
    natural_person?: {
      full_name?: string | null
    }
  }
  structure_area?: {
    code?: number | null
    description?: string | null
  }

  cost_center?: {
    code?: number | null
    purpose?: string | null
    name?: string
  }
  structure_cost_center_id?: number | null
  structure_area_id?: number | null
  cost_center_id?: number | null
  auxiliary_id?: number | null
}
