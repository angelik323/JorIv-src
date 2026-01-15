import { computed, ref } from 'vue'

export const usePagination = <T>(items: () => T[], initialRowsPerPage = 20) => {
  const currentPage = ref(1)
  const rowsPerPage = ref(initialRowsPerPage)

  const lastPage = computed(() => {
    return Math.max(1, Math.ceil(items().length / rowsPerPage.value))
  })

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * rowsPerPage.value
    const end = start + rowsPerPage.value
    return items().slice(start, end)
  })

  const shouldShowPagination = computed(() => {
    return items().length > 20
  })

  const handleUpdatePage = (page: number) => {
    currentPage.value = page
  }

  const handleUpdateRowsPerPage = (perPage: number) => {
    rowsPerPage.value = perPage
    currentPage.value = 1
  }

  const adjustPageAfterDelete = (totalItems: number) => {
    const newLastPage = Math.max(1, Math.ceil(totalItems / rowsPerPage.value))
    if (currentPage.value > newLastPage) {
      currentPage.value = newLastPage
    }
  }

  const resetPagination = () => {
    currentPage.value = 1
  }

  return {
    currentPage,
    rowsPerPage,
    lastPage,
    paginatedItems,
    shouldShowPagination,
    handleUpdatePage,
    handleUpdateRowsPerPage,
    adjustPageAfterDelete,
    resetPagination,
  }
}
