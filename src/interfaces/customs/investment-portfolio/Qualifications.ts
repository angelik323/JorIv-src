export interface IQualificationsList {
  id: number | null
  action_rating: string
  group: number | null
  rating_code: string
  history_qualification?: {
    created_at?: string
    updated_at?: string
    creator_data?: string
    update_data?: string
  }
}

export interface IQualificationsForm {
  id?: number | null
  action_rating: string
  group: number | null
  rating_code: string
  history_qualification?: {
    created_at: string
    updated_at: string | null
    creator_data: string
    update_data: string | null
  }
}

export interface IQualificationsToCreate {
  action_rating: string
  group: number | null
  rating_code: string
  history_qualification?: {
    created_at?: string
    updated_at?: string
    creator_data?: string
    update_data?: string
  }
}

export interface IQualificationsResponse {
  id: number | null
  action_rating: string
  group: number | null
  rating_code: string
  history_qualification: {
    created_at: string
    updated_at: string | null
    creator_data: string
    update_data: string | null
  }
}
