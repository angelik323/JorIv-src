<template>
  <TableList
    :title="tableProps.title"
    :loading="tableProps.loading"
    :columns="tableProps.columns"
    :rows="tableProps.rows"
    :pages="tableProps.pages"
    @update-page="handleUpdatePage"
    @update-rows-per-page="handleUpdateRowsPerPage"
  />
</template>

<script setup lang="ts">
import TableList from '@/components/table-list/TableList.vue'

import useProcessedBusinessDocumentList from '@/components/Lists/Budget/BudgetClosure/v1/view/ProcessedBusinessDocumentList/ProcessedBusinessDocumentList'

const props = withDefaults(
  defineProps<{
    businessId: number | null
    processId: number
  }>(),
  {}
)

const {
  // Refs and computed props
  tableProps,

  // Functions/Methods
  handleUpdatePage,
  handleUpdateRowsPerPage,
} = useProcessedBusinessDocumentList(props)
</script>
