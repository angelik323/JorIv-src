<template>
  <section>
    <TableList
      :columns="tableProps.columns"
      :rows="tableProps.rows"
      :pages="tableProps.pages"
      :custom-no-data-message-title="tableProps.customNoDataMessageTitle"
      :custom-no-data-message-subtitle="tableProps.customNoDataMessageSubtitle"
      :loading="tableProps.loading"
      :custom-columns="['status_id']"
      @update-page="updatePage"
      @update-rows-per-page="updatePerPage"
    >
      <template #status_id="{ row }">
        <ShowStatus :type="Number(row?.status_id ?? 0)" />
      </template>
      <template #custom-header>
        <div class="q-mt-xl q-mb-sm">
          <span class="text-subtitle1 text-weight-bold">
            {{ tableProps.title }}
          </span>
        </div>
      </template>
    </TableList>
  </section>
</template>

<script setup lang="ts">
// Components
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'

// Logic view
import useAssociatedBusinessesList from '@/components/Lists/Fics/AccountingParameters/AssociateBusinesses/AssociatedBusinessesList'

const { tableProps, updatePage, updatePerPage } = useAssociatedBusinessesList()
</script>
