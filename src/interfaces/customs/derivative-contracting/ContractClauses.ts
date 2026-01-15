export interface IContractClausesList {
  id: number
  name: string
  description: string
  status: { id: number }
}

export interface IContractClausesResponse {
  id: number
  code: number | null
  name: string | null
  clause_type_id: number | string | null
  clausule: string | null
  type: { id: number; name: string }
  status: { id: number }
}

export interface IContractClausesForm {
  code: number | null
  name: string | null
  clause_type_id: number | string | null
  clausule: string | null
  status_id?: number
  WhichClause?: string | null
}
