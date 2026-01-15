<template>
  <section>
    <TableList
      selection="single"
      :title="tableProps.title"
      :loading="tableProps.loading"
      :columns="tableProps.columns"
      :rows="tableProps.rows"
      :pages="tableProps.pages"
      @update-page="handleUpdatePage"
      @update-rows-per-page="handleUpdateRowsPerPage"
      @update:selected="handleSelectedDocuments"
    />
  </section>

  <section v-if="selectedDocument" class="q-mt-xl">
    <AssociatedBudgetDocumentsDetailsList :document-id="selectedDocument.id" />
  </section>
</template>

<script setup lang="ts">
import TableList from '@/components/table-list/TableList.vue'
import AssociatedBudgetDocumentsDetailsList from '../AssociatedBudgetDocumentsDetails/AssociatedBudgetDocumentsDetailsList.vue'

import useAssociatedBudgetDocumentsList from '@/components/Lists/Budget/BudgetDocuments/v1/list/AssociatedBudgetDocuments/AssociatedBudgetDocumentsList'

const props = withDefaults(
  defineProps<{
    documentId: number
  }>(),
  {}
)

const {
  // Refs and computed props
  tableProps,
  selectedDocument,

  // Functions/Methods
  handleUpdatePage,
  handleUpdateRowsPerPage,
  handleSelectedDocuments,
} = useAssociatedBudgetDocumentsList(props)
</script>
