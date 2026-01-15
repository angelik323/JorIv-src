export interface IGetUsers {
  status_id: number | string | null
  specialty_id: number | string | null
  search: string | null
}

export interface IGetUserByDocumentOrId {
  success: boolean
  data?: IUserData
  message: string
}

export interface IUserData {
  created_at: string
  deleted_at?: string
  care_center?: {
    name: string
    id: number
  }
  care_center_id: number
  document: string
  document_type: {
    abbreviation: string
    id: number
    name: string
  }
  document_type_id: number
  email: string
  expedition_place: {
    code: string
    department_id: number
    id: number
    name: string
  }
  expedition_place_id: number
  first_login: boolean
  id: number
  last_name: string
  name: string
  nurse_type: string | null
  phone: string
  photo?: string
  professional_register: string
  reference_center: {
    name: string
  }
  reference_center_id: number
  rethus?: string
  role_type: string
  security_answer?: string
  security_question_id?: string
  security_reminder?: string
  sex: string
  signature: string
  specialty: {
    name: string
    status_id: number
  }
  specialty_expiration_date: string
  specialty_id: number
  status: {
    description: string
    id: number
  }
  status_id: number
}
