export interface IServiceType {
  id: number
  created_at: string | null
  updated_at: string | null
  name: string
  type: string
  model: string
  status: string
  scheduleable: number
}

export interface ISpecialtyType {
  id: number
  description: string
}

export interface IDoctorBySpecialty {
  details: {
    id: number
    names: string
    surnames: string
  }
  id: number
  name: string
  user_info_id: number
}
