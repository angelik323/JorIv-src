export interface ICollectionConceptsResponse {
  structure_id: number | null
  structure_name: string | null
  structure_use: string | null
  structure_code: string | null
  type: string | null
  description: string | null
  status?: {
    id: number
    status: string
  } | null
  status_id?: number | null
}

export interface ICollectionConceptsInformationForm {
  structure_id: number | null
  structure_name: string | null
  structure_use: string | null
  structure_code: string | null
  type: string | null
  description: string | null
}
