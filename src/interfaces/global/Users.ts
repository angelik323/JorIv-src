export interface IGetUserData {
  id: number
  document: string
  document_type_id: number
  document_type: IDocumentType
  name: string
  second_name: string
  last_name: string
  second_last_name: string
  phone: string | number
  email: string
  user_code: string
  user_type: string
  profile_type: string
  status: IStatus
  status_id: number
  created_at: string
  roles: IRoles[]
}

interface IDocumentType {
  id: number
  name: string
  abbreviation: string
  model: string
  status_id: number
}

interface IStatus {
  id: number
  status: string
}

interface IRoles {
  id: number
  name: string
}

export interface ICreateUpdateUserFormData {
  document: string | null
  document_type_id: number | null
  name: string | null
  second_name: string | null
  last_name: string | null
  second_last_name: string | null
  phone: string | null
  user_code: string | null
  email: string | null
  profile_type: string | null
  user_type: string | null
  status_id: number | null
  role: number | null
  password: string | null
  password_check: boolean
  creation_date: string | null
}
