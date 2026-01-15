export interface IManagementPlanTable {
  id: number
  description: string
  code: string
  diagnostic_id: number | null
}

export interface IManagementPlanRequest {
  type_consult: string | null
  response: string
  diagnostic: { diagnostic_id: number | null }[]
}
