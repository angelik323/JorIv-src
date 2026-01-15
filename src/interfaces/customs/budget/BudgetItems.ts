// Interfaces & types
import { QTable } from 'quasar'

export interface IBudgetItemsForm {
  id?: number
  status_id?: number | null
  budget_structure_id: number | null
  resource_structure_id: number | null
  accounting_structure_id: number | null
  code: number | null
  description: string
  type: string
  nature: string
}
export interface IBudgetItemRow {
  id?: number
  status_id: number | null
  budget_structure: {
    code: string
    description: string
    id: number
  } | null
  resource_structure: {
    code: string
    description: string
    id: number
  } | null
  accounting_structure: {
    code: string
    description: string
    id: number
  } | null
  code: string
  description: string
  type: string
  nature: string
}
export interface IBudgetItemsTable {
  title: string
  loading: boolean
  columns: QTable['columns']
  rows: IBudgetItemRow[]
  pages: {
    currentPage: number
    lastPage: number
  }
}
