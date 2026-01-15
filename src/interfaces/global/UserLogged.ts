export interface IUserAuthenticatedResponse {
  success: true | false
  data: IUserData
  message: string
}

export interface IUserData {
  user: IUser
  role: string
  permissions: string[]
  authorization: {
    token: string
    type: string
  }
}

export interface IUser {
  id: number
  name: string
  last_name: string
  document: string
  phone: string
  validation_phone: string | null
  is_validation_phone_active: string
  email: string
  validation_email: string | null
  is_validation_email_active: string
  photo: string
  has_security_question: string
  security_question: { id: number; question: string } | null
  security_answer: string | null
  security_question_reminder: string | null
  active_authentication_methods: number
  authentication_methods: AuthenticationMethod[]
  branch_id: string | null
}

export interface AuthenticationMethod {
  id: number
  method: string
  abbreviation: string
  pivot: Pivot
}

export interface IAuthMethods {
  rn: string
  id: number
  method: string
  abbreviation: string
  pivot: Pivot
}

export interface IAuthMethodsLogs {
  id: number
  used_at: string
  browser_details: string
  ip_address: string
}

export interface Pivot {
  user_id: string
  authentication_method_id: string
  id: string
  status_id: string
  last_used_at: string
  secret_2fa: string
  is_verified: string
  created_at: string
}

export interface Pivot {
  user_id: string
  authentication_method_id: string
  status_id: string
  last_used_at: string
  secret_2fa: string
  created_at: string
}
