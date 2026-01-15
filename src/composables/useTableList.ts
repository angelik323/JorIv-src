import { ref } from 'vue'

import {
  IUsePaginatedTableList,
  IUsePaginatedTableListProps,
} from '@/interfaces/global'
import { IPaginatedFiltersFormat } from '@/interfaces/customs'

export const usePaginatedTableList = <T extends object>({
  tableProps,
  listPromiseFn,
}: IUsePaginatedTableListProps<T>): IUsePaginatedTableList => {
  const filtersFormat = ref<IPaginatedFiltersFormat>({ page: 1, rows: 20 })

  const listAction = async (filters: IPaginatedFiltersFormat) => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    const res = await listPromiseFn(filters)
    tableProps.value.rows = res.list
    tableProps.value.pages = res.pages
    tableProps.value.loading = false
  }

  const handleClearFilters = () => {
    tableProps.value.rows = []
  }

  const handleFilterSearch = async (filters: IPaginatedFiltersFormat) => {
    filtersFormat.value = {
      ...filters,
      page: 1,
      rows: filtersFormat.value.rows,
    }
    await listAction(filtersFormat.value)
  }

  const handleUpdatePage = async (page: number) => {
    filtersFormat.value.page = page
    await listAction(filtersFormat.value)
  }

  const handleUpdateRowsPerPage = async (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows
    await listAction(filtersFormat.value)
  }

  const getFilterFormatValues = () => {
    return { ...filtersFormat.value }
  }

  const refetch = async () => {
    await listAction(filtersFormat.value)
  }

  return {
    handleClearFilters,
    handleFilterSearch,
    handleUpdatePage,
    handleUpdateRowsPerPage,
    getFilterFormatValues,
    refetch,
  }
}
