<template>
  <section>
    <TableList
      :columns="tableProps.columns"
      :rows="tableProps.rows"
      :loading="tableProps.loading"
      :hide-pagination="true"
    >
      <template #custom-header>
        <div class="q-mt-xl q-mb-sm">
          <p class="text-subtitle1 text-weight-bold">
            {{ tableProps.title }}
          </p>
          <p class="text-grey-6">
            {{ tableProps.description }}
          </p>
        </div>
      </template>
    </TableList>
  </section>
</template>

<script setup lang="ts">
// Components
import TableList from '@/components/table-list/TableList.vue'

// Logic view
import useAccountingParametersAuxiliariesList from '@/components/Lists/Fics/AccountingParameters/AccountingParametersAuxiliaries/AccountingParametersAuxiliariesList'

const { tableProps } = useAccountingParametersAuxiliariesList()
</script>
