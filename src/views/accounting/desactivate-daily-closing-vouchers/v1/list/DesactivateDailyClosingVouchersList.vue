<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('Accounting', 'DesactivateDailyClosingList', 'create')
          ? 'Crear'
          : undefined
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="handlerGoTo('DesactivateDailyClosingCreate')"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleCleanFilters"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProps.rows.length > 0 ? tableProps.title : ''"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :hideHeader="tableProps.rows.length === 0"
          @update-page="updatePage"
          @update-rows-per-page="updateRows"
        >
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// components
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'

// logic
import useDesactivateDailyClousingVouchersList from './DesactivateDailyClosingVouchersList'

// utils
import { defaultIconsLucide } from '@/utils'

const {
  headerProps,
  tableProps,
  filterConfig,

  handleFilter,
  handlerGoTo,
  updatePage,
  updateRows,
  validateRouter,
  handleCleanFilters,
} = useDesactivateDailyClousingVouchersList()
</script>
