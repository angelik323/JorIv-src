<template>
  <section>
    <TableList
      :columns="tableProps.columns"
      :rows="tableProps.rows"
      :loading="tableProps.loading"
      :rows-per-page-options="tableProps.rowsPerPageOptions"
      :hide-pagination="true"
    >
      <template #custom-header>
        <div
          class="q-mt-sm q-mb-sm full-width flex justify-between items-center"
        >
          <span class="text-subtitle1 text-weight-bold">
            {{ tableProps.title }}
          </span>
          <Button
            :outline="false"
            :label="'Asignar código'"
            :class-custom="'items-center'"
            :left-icon="defaultIconsLucide.plusCircleOutline"
            color-icon="white"
            :style-content="{ 'align-items': 'center' }"
            @click="$router.push({ name: 'ProcessCodesCreate' })"
          />
        </div>
      </template>
    </TableList>
  </section>
</template>

<script setup lang="ts">
// Components
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic view
import useProcessCodesList from '@/components/Lists/Fics/AccountingParameters/ProcessCodes/ProcessCodesList'

const { tableProps, defaultIconsLucide } = useProcessCodesList()
</script>
