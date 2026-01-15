<template>
  <FiltersComponent
    ref="filterRef"
    :fields="filterConfig"
    @update:values="handleChangeFilters"
    @filter="handleFilter"
    @clear-filters="handleClearFilter"
  />
  <TableList
    :title="openPlansTableProps.title"
    :loading="openPlansTableProps.loading"
    :columns="openPlansTableProps.columns"
    :rows="openPlansTableProps.rows"
    :pages="openPlansTableProps.pages"
    @update-page="handleUpdatePage"
    @update-rows-per-page="handleUpdateRowsPerPage"
  >
    <template #custom-header-action>
      <Button
        label="Descargar excel"
        tooltip="Descargar excel"
        :outline="true"
        :leftImg="excelIcon"
        :disabled="openPlansTableProps.rows.length === 0"
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
import useOpenPlansList from '@/components/Lists/Fics/FiduciaryInvestmentPlan/v1/Reports/OpenPlans/OpenPlansList'

const {
  filterRef,
  filterConfig,
  openPlansTableProps,

  handleChangeFilters,
  handleFilter,
  handleClearFilter,
  handleUpdatePage,
  handleUpdateRowsPerPage,
  handleDownload,
} = useOpenPlansList()
</script>
