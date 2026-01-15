export interface IPersonalInformationFields {
  first_name: boolean
  last_name: boolean
  document_type: boolean
  document_number: boolean
  identity_none: boolean
  document_expedition_location: boolean
  expedition_date: boolean
  nationality: boolean
  country_of_residence: boolean
  birthday: boolean
  sex: boolean
  marital_status: boolean
  education_level: boolean
  blood_type: boolean
  population_type: boolean
  population_group: boolean
  occupation: boolean
  disability: boolean
  vital_status: boolean
  gender: boolean
}

export interface IContactInformationFields {
  main_phone: boolean
  secondary_phone: boolean
  email: boolean
  department: boolean
  city: boolean
  zone: boolean
  neighborhood: boolean
  address: boolean
  georeferencing: boolean
}

export interface ISocialSecurityInformationFields {
  regime: boolean
  administrator: boolean
  arl: boolean
  membership: boolean
  prepaid: boolean
  care_programs: boolean
}

export interface ICustodianInformationFields {
  companion_name: boolean
  companion_document: boolean
  companion_phone: boolean
}

export interface IMoreInformationFields {
  observation: boolean
}

export interface IPatient {
  id: number
  care_center: GenericInterface
  name: string
  last_name: string
  document: string
  type_document: GenericInterface
  document_expedition_location: { id: number; name: string }
  expedition_date: string
  nacionality: string
  birthday: string
  sex: string
  marital_status_id: GenericInterface
  education: GenericInterface
  blood_type: GenericInterface
  population_type: GenericInterface
  population_group: GenericInterface
  occupation: string
  disability: string
  vital_status: string
  gender: GenericInterface
  main_phone: string
  secondary_phone: string
  email: string
  country_of_residence_code: GenericInterface
  department: GenericInterface
  city: GenericInterface
  zone: string
  neighborhood: string
  address: string
  georeferencing: string
  regime: GenericInterface
  administrator: GenericInterface
  arl: GenericInterface
  membership: GenericInterface
  prepaid: GenericInterface
  companion_name: string
  companion_document: string
  companion_phone: string
  observations: string
}

export interface GenericInterface {
  id: number
  name: string
  code?: string
}

export interface IPersonalInformationForm {
  first_name: string
  last_name: string
  document_type: string | number | null
  document_number: string
  document_number_prefix: string
  identity_none?: boolean
  document_expedition_location: string | number
  expedition_date: string
  nationality: string | number | null
  country_of_residence: string | number | null
  birthday: string
  sex: string | number | null
  blood_type: string | number | null
  marital_status: string | number | null
  education_level: string | number | null
  population_type: string | number | null
  population_group: string | number | null
  occupation: string
  disability: string
  vital_status: string
  gender: string | number | null
}
export interface IContactInformationForm {
  main_phone: string
  secondary_phone: string
  email: string
  department: string | number | null
  city: string | number | null
  zone: string | number | null
  neighborhood: string | number | null
  address: string
  georeferencing: string
}
export interface ISocialSecurityInformationForm {
  regime: string | number | null
  administrator: string | number | null
  arl: string | number | null
  membership: string | number | null
  prepaid: string | number | null
  care_programs: Array<any> | string
}
export interface ICustodianInformationForm {
  companion_name: string
  companion_document: string
  companion_phone: string
}
export interface IMoreInformationForm {
  observations: string
}

export interface IPatientList {
  id: number
  care_center_id: number
  reference_center_id: number
  name: string
  last_name: string
  eps_id: number
  document_type_id: number
  document: string
  document_expedition_location_code: string
  expedition_date: string
  nationality: string
  birthday: string
  gender: string
  marital_status_id: number
  education_id: number
  blood_type_id: number
  population_type_id: number
  population_group_id: number
  occupation_id: null
  sexual_orientation_id: number
  disability: string
  vital_status: string
  main_phone: string
  secondary_phone: string
  email: string
  country_id: number
  department_id: number
  city_id: number
  zone: string
  neighborhood: string
  address: string
  georeferencing: string
  regime_id: number
  administrator_id: number
  arl_id: number
  membership_id: number
  prepaid_id: number
  companion_name: string
  companion_document: string
  companion_phone: string
  observations: string
  is_subcribed: boolean
  status_id: number
  deleted_at: null
  created_at: string
  updated_at: string
  administrator?: {
    id: number
    name: string
  }
  status: {
    id: number
    description: string
  }
}

export interface IGetPatientByDocumentOrId {
  success: boolean
  data: IPatientData
  message: string
}

export interface IPatientData {
  id: number
  care_center_id: number
  reference_center_id: number
  name: string
  last_name: string
  eps_id: null
  document_type_id: number
  document: string
  document_expedition_location_code: string
  expedition_date: string
  nationality: string
  birthday: string
  gender: string
  marital_status_id: number
  education_id: number
  blood_type_id: number
  population_type_id: number
  population_group_id: number
  occupation_id: null
  sexual_orientation_id: number
  disability: string
  vital_status: string
  main_phone: string
  secondary_phone: string
  email: string
  country_id: number
  department_id: number
  city_id: number
  zone: string
  neighborhood: string
  address: string
  georeferencing: string
  regime_id: number
  administrator_id: number
  arl_id: number
  membership_id: number
  prepaid_id: number
  companion_name: string
  companion_document: string
  companion_phone: string
  observations: string
  is_subcribed: boolean
  status_id: number
  deleted_at: null
  created_at: string
  updated_at: string
}
