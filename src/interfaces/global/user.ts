import { IUploadedFile } from './File'

export interface IUserList {
  id: number
  name: string
  last_name: string
  document: number
  phone: string
  email: string
  status: {
    id: number
    description: string
  }
}

export interface IGetUserByDocument {
  document?: string | number | null
  document_type?: string | number | null
}

export interface IUserCount {
  total: number
  active: number
  inactive: number
}

export interface ICreateUpdateUser
  extends IUserDataForm,
    IAdditionalInformationForm {
  permissions: string[]
}

export interface IUserDataForm {
  // User data:
  role?: number | null
  expiration_date?: string | null
  branch_id?: number | null
  // Personal user data:
  document_type_id?: number | null
  document?: string | null
  name?: string | null
  second_name?: string | null
  last_name?: string | null
  second_last_name?: string | null
  expedition_place_id?: number | null
  sex?: string | null
  // Contact data:
  phone?: string | null
  email?: string | null
  created_at?: string | null
  user_type?: string | null
  profile?: string | null
  state?: boolean | null
}

export interface IUserDataFormV2 {
  // Personal user data:
  created_at?: string | null
  user_type?: string | null
  user?: string | null
  document_type_id?: number | null
  document?: string | null
  name?: string | null
  second_name?: string | null
  last_name?: string | null
  second_last_name?: string | null
  expedition_place_id?: number | null
  sex?: string | null
  // User data:
  role?: number | null
  expiration_date?: string | null
  branch_id?: number | null
  // Contact data:
  phone?: string | null
  email?: string | null
  profile?: string | null
  state?: boolean | null
}

export interface IAdditionalInformationForm {
  // Emergency contact
  emergency_contact_name?: string | null
  emergency_contact_phone?: string | number | null
  emergency_contact_relationship?: string | null
  // Banks data:
  bank_id?: number | null
  account_number?: string | null
  account_type?: string | null
  // Files:
  resume?: IUploadedFile[] | null
  resume_name?: string[] | null
}

export interface IUserData {
  id: number
  expiration_date: string
  name: string
  last_name: string
  document_type_id: number
  document: string
  expedition_place_id: number
  expedition_place: City
  sex: string
  phone: string
  email: string
  emergency_contact_name: string
  emergency_contact_phone: string
  emergency_contact_relationship: string
  bank_id: number
  bank: Bank
  account_number: string
  account_type: string
  photo: string | null
  first_login: number
  status_id: number
  has_security_question: number
  security_question_id: number | null
  security_answer: string | null
  security_question_reminder: string | null
  status: Status
  document_type: DocumentType
  documents: Document[]
  role: Role
  permissions: Permission[]
  branch_id: number
  branch: Branch
}

export interface Branch {
  id: number
  name: string
  description: string
  status_id: number
}

export interface City {
  code: string
  department_id: string
  id: number
  name: string
}

export interface DocumentType {
  id: number
  name: string
  abbreviation: string
  model: string
  status_id: string
}

export interface Permission {
  id: number
  name: string
  module: string
  description: string
  status: string
  status_id: number
}

export interface Role {
  id: number
  name: string
  status_id: number
}

export interface Document {
  id: number
  documentable_type: string
  documentable_id: string
  url: string
  name: string
  mime_type: string
  type: string
}

export interface Status {
  id: number
  status: string
}

export interface Bank {
  accounting_account: string
  description: string
  id: number
  status_id: number
  type: string
}
