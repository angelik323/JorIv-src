export interface IRejectionReasonResponse {
  id: number
  code: number
  description: string
  status_id: number
  status: {
    id: number
    name: string
  }
  created_by: number
  updated_by: number | null
  created_at: string
  updated_at: string
}

export interface IRejectionReasonItemList {
  id: number
  code: number
  description: string
  status_id: number
  created_by: number
  updated_by: number | null
  created_at: string
  updated_at: string
}

export interface IRejectionReasonInformationForm {
  code: string | null
  description: string | null
  status: number | string | null
}

export interface IRejectionReasonToCreate {
  code: string | null
  description: string | null
  status?: number
}

export interface IRejectionReasonToEdit {
  description: string | null
}

export interface IRejectionReasonChangeStatus {
  status_id: number | null
}
