import type { QTableColumn } from 'quasar'
import { Ref } from 'vue'

import { IPaginated, IPaginatedFiltersFormat } from '@/interfaces/customs'

interface IPages {
  currentPage: number
  lastPage: number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IBaseTableProps<T extends Record<string, any>> {
  title?: string
  loading?: boolean
  wrapCells?: boolean
  columns: QTableColumn<T>[]
  rows: T[] | Ref<T[]>
  pages: IPages | Ref<IPages>
}

export type IUsePaginatedTableListProps<T extends object> = {
  readonly listPromiseFn: (
    params: IPaginatedFiltersFormat
  ) => Promise<IPaginated<T>>
  readonly tableProps: Ref<IBaseTableProps<T>>
}

export type IUsePaginatedTableList = {
  handleClearFilters: () => void
  handleFilterSearch: (filters: IPaginatedFiltersFormat) => Promise<void>
  handleUpdatePage: (page: number) => Promise<void>
  handleUpdateRowsPerPage: (rows: number) => Promise<void>
  getFilterFormatValues: () => IPaginatedFiltersFormat
  refetch: () => Promise<void>
}
