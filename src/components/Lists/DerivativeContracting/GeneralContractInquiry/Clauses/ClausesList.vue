<template>
  <div>
    <!-- Table for Annex Documents (Master) -->
    <section class="q-mt-md">
      <TableList
        :title="tableProps_clauses.title"
        :loading="tableProps_clauses.loading"
        :columns="tableProps_clauses.columns"
        :rows="tableProps_clauses.rows"
        :pages="tableProps_clauses.pages"
        @update-page="updatePage"
        @update-rows-per-page="updatePerPage"
      >
      </TableList>
    </section>
  </div>
</template>

<script setup lang="ts">

// Components
import TableList from '@/components/table-list/TableList.vue'

// Composables
import useClausesList from '@/components/Lists/DerivativeContracting/GeneralContractInquiry/Clauses/ClausesList'


const props = withDefaults(
  defineProps<{
    contractId?: number | null
  }>(),
  {
    contractId: null,
  }
)



const {
  tableProps_clauses,
  updatePage,
  updatePerPage,
} = useClausesList(props)
</script>
