export interface ILoginUser {
  email: string
  password: string
}

export interface IRecoverPassword {
  document: string
  answer: string
}

export interface IUserSecurityData {
  securityQuestion: {
    id: number
    question: string
  }
  security_question_id: 3
  security_reminder: string
}

export interface IUpdateCurrentPassword {
  password: string
  password_confirmation: string
}
