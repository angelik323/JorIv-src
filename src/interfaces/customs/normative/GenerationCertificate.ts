export interface IGenerationCertificateGroupListItem {
  id: number
  progress: string
  period: string
  zip: string
}

export interface IGenerationCertificateDetailListItem {
  id: number
  person_type: string
  client: number
  period: string
  url: string
}

export interface IGenerationCertificateInformationForm {
  person_types: string | null
  start_client_id: number | null
  end_client_id: number | null
  start_period?: string | null
  end_period?: string | null
  validity?: string | null
  massive?: boolean
  has_validity?: boolean
}
export interface IGenerationCertificateToCreate {
  person_types: string | null
  start_client_id: number | null
  end_client_id: number | null
  validity?: string | null
  start_period?: string | null
  end_period?: string | null
}
