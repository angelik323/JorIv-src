<template>
  <section>
    <div class="q-mb-lg mt-2">
      <p class="text-black-10 text-weight-bold text-h6 q-mb-none">Bancos</p>
    </div>

    <section class="q-mt-xl q-px-md">
      <TableList
        :title="tableProps.title"
        :loading="tableProps.loading"
        :columns="tableProps.columns"
        :rows="paginated"
        :pages="tableProps.pages"
        @updatePage="(val) => (tableProps.pages.currentPage = val)"
        @updateRowsPerPage="update_rows_per_page"
        :custom-columns="['status_id']"
      >
        <template #status_id="{ row }">
          <ShowStatus :type="Number(row?.status?.id ?? 0)" />
        </template>
      </TableList>
    </section>
  </section>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    data?: IBankAccount[]
    action: ActionType
  }>(),
  {}
)

// components
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

// interfaces
import { ActionType } from '@/interfaces/global/Action'
import { IBankAccount } from '@/interfaces/customs/trust-business/v2/TrustBusinessManagement'

// logic-view
import useBanks from './Banks'

const {
  //
  tableProps,
  paginated,
  update_rows_per_page,
} = useBanks(props)
</script>
