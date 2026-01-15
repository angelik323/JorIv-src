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
import { IBudgetDocumentsTableEmits } from '@/interfaces/customs/budget/BudgetDocuments';

import useBudgetDocumentsDetailsList from '@/components/Lists/Budget/BudgetDocuments/v1/view/BudgetDocumentsDetails/BudgetDocumentsDetailsList'

const props = withDefaults(
  defineProps<{
    operationLogId: number
  }>(),
  {}
)

const emits = defineEmits<IBudgetDocumentsTableEmits>()

const {
  // Refs and computed props
  tableProps,

  // Functions/Methods
  handleUpdatePage,
  handleUpdateRowsPerPage,
} = useBudgetDocumentsDetailsList(props, emits)
</script>
