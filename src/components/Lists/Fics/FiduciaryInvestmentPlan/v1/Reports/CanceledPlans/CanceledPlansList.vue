<template>
  <FiltersComponent
    ref="filterRef"
    :fields="filterConfig"
    @update:values="handleChangeFilters"
    @filter="handleFilter"
    @clear-filters="handleClearFilter"
  />
  <TableList
    :title="canceledPlansTableProps.title"
    :loading="canceledPlansTableProps.loading"
    :columns="canceledPlansTableProps.columns"
    :rows="canceledPlansTableProps.rows"
    :pages="canceledPlansTableProps.pages"
    @update-page="handleUpdatePage"
    @update-rows-per-page="handleUpdateRowsPerPage"
  >
    <template #custom-header-action>
      <Button
        label="Generar excel"
        tooltip="Generar excel"
        :outline="true"
        :leftImg="excelIcon"
        :disabled="canceledPlansTableProps.rows.length === 0"
        @click="handleDownload"
      />
    </template>
  </TableList>
</template>

<script setup lang="ts">
// Components
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Assets
import excelIcon from '@/assets/images/excel.svg'

// Logic view
import useCanceledPlansList from '@/components/Lists/Fics/FiduciaryInvestmentPlan/v1/Reports/CanceledPlans/CanceledPlansList'

const {
  filterRef,
  filterConfig,
  canceledPlansTableProps,

  handleChangeFilters,
  handleFilter,
  handleClearFilter,
  handleUpdatePage,
  handleUpdateRowsPerPage,
  handleDownload,
} = useCanceledPlansList()
</script>
