<template>
  <div>
    <!-- Table for Associated Budget - Disponibilidad -->
    <section class="q-mt-md">
      <TableList
        :title="tableProps_associated_budget_availability.title"
        :loading="tableProps_associated_budget_availability.loading"
        :columns="tableProps_associated_budget_availability.columns"
        :rows="tableProps_associated_budget_availability.rows"
        :pages="tableProps_associated_budget_availability.pages"
        :hide-pagination="true"
        @row-click="(_evt: unknown, row: IAssociatedBudget) => handleRowClick(row)"
      >
        <template #date="{ row }">
          {{ formatDate(row.date, 'DD/MM/YYYY') }}
        </template>
        <template #document_value="{ row }">
          {{ formatCurrency(row.document_value) }}
        </template>
        <template #contract_assigned_value="{ row }">
          {{ formatCurrency(row.contract_assigned_value) }}
        </template>
      </TableList>
    </section>

    <!-- Separator Line -->
    <q-separator class="q-my-md" />

    <!-- Table for Associated Budget - Compromiso -->
    <section class="q-mt-md">
      <TableList
        :title="tableProps_associated_budget_commitment.title"
        :loading="tableProps_associated_budget_commitment.loading"
        :columns="tableProps_associated_budget_commitment.columns"
        :rows="tableProps_associated_budget_commitment.rows"
        :pages="tableProps_associated_budget_commitment.pages"
        @update-page="updatePage"
        @update-rows-per-page="updatePerPage"
      >
        <template #date="{ row }">
          {{ formatDate(row.date, 'DD/MM/YYYY') }}
        </template>
        <template #document_value="{ row }">
          {{ formatCurrency(row.document_value) }}
        </template>
      </TableList>
    </section>
  </div>
</template>

<script setup lang="ts">

// Components
import TableList from '@/components/table-list/TableList.vue'

// logic
import { IAssociatedBudget } from '@/interfaces/customs/derivative-contracting/GeneralContractInquiry'
import useAssociatedBudgetList from '@/components/Lists/DerivativeContracting/GeneralContractInquiry/AssociatedBudget/AssociatedBudgetList'

const props = withDefaults(
  defineProps<{
    contractId?: number | null
  }>(),
  {
    contractId: null,
  }
)

const {
  formatDate,
  formatCurrency,
  tableProps_associated_budget_availability,
  tableProps_associated_budget_commitment,
  updatePage,
  updatePerPage,
  handleRowClick,
} = useAssociatedBudgetList(props)

</script>
