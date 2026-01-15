<template>
  <section>
    <TableList
      :title="tableProps.title"
      :loading="tableProps.loading"
      :columns="tableProps.columns"
      :custom-columns="['status_id', 'total_amount']"
      :rows="paginated"
      :pages="tableProps.pages"
      @updatePage="(val) => (tableProps.pages.currentPage = val)"
      @updateRowsPerPage="
        (val) => {
          pageSize = val
          tableProps.pages.currentPage = 1
        }
      "
    >
      <template #status_id="{ row }">
        <ShowStatus :type="Number(row?.status_id ?? 0)" />
      </template>

      <template #total_amount="{ row }">
        {{ formatCurrency(`${row.total_amount}`) }}
      </template>
    </TableList>

    <TableList
      :title="tablePropsConcepts.title"
      :loading="tablePropsConcepts.loading"
      :columns="tablePropsConcepts.columns"
      :custom-columns="['total_amount', 'status_id']"
      class="mt-2"
      :rows="paginatedConcepts"
      :pages="tablePropsConcepts.pages"
      @updatePage="(val) => (tablePropsConcepts.pages.currentPage = val)"
      @updateRowsPerPage="
        (val) => {
          pageSizeConcepts = val
          tablePropsConcepts.pages.currentPage = 1
        }
      "
    >
      <template #status_id="{ row }">
        <ShowStatus :type="Number(row?.status_id ?? 0)" />
      </template>
      <template #total_amount="{ row }">
        {{ formatCurrency(`${row.total_amount}`) }}
      </template>
    </TableList>
  </section>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    action: 'view'
    data?: IBillingCollect[] | null
  }>(),
  {}
)
// components
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'

// logic view
import useBillingTrustBusiness from './BillingTrustBusiness'

// interfaces
import { IBillingCollect } from '@/interfaces/customs/trust-business/TrustBusinesses'

import { useUtils } from '@/composables/useUtils'
const { formatCurrency } = useUtils()

const {
  tableProps,
  tablePropsConcepts,
  pageSize,
  paginated,
  pageSizeConcepts,
  paginatedConcepts,
} = useBillingTrustBusiness(props)

defineExpose({
  validateForm: () => true,
})
</script>
