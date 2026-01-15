export interface IMedicamentsTable {
  id: number
  code: string
  description: string
  amount: string | number
  posology: string
  medicine_id: number | null
}

export interface IMedicamentsRequest {
  id: number
  medicine_id: number
  amount: number
  posology: string
}
