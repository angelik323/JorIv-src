export interface IParticipationTypeRegistration {
  id?: number
  code: number
  description: string
}

export interface IParticipationTypeRegistrationCreatePayload {
  code: number
  description: string
}

export interface IParticipationTypeRegistrationModel {
  id: number
  code: number
  description: string
}

export interface IParticipationTypeRegistrationDetailResponse {
  id: number
  code: number
  description: string
}

export interface IParticipationTypeRegistrationFilters {
  code: number | null
  page?: number
  rows?: number
}
