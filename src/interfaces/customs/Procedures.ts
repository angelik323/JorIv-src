export interface IProceduresTable {
  id: number
  code: string
  amount: string | number
  description: string
  observation: string
  procedure_id: number | null
}

export interface IProceduresRequest {
  id: number
  procedure_id: number
  amount: number
  observation: string
}
