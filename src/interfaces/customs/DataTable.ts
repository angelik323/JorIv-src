import { QTable } from "quasar"
import { IPages } from "./IPages"

export interface IDataTable<T = any> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface ITableProps<T> {
  title: string
  loading: boolean
  columns: QTable['columns']
  customColumns?: string[]
  rows: T[]
  pages: IPages
}
