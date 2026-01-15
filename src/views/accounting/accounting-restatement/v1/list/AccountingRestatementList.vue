<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('Accounting', 'AccountingRestatementList', 'create')
          ? 'Crear'
          : undefined
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="$router.push({ name: 'AccountingRestatementCreate' })"
    >
      <section>
        <FiltersComponent
          ref="filtersRef"
          @filter="handleFilter"
          :fields="filterConfig"
          @show-more="handleShowMoreFilters"
          :buttons="['more_filters']"
          @update:values="filterUpdate"
          @clear-filters="handleClear"
        />
      </section>
      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['status', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        ></TableList>
      </section>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
import { defaultIconsLucide } from '@/utils'
import useAccountingRestatementList from './AccountingRestatementList'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
const {
  headerProps,
  tableProps,
  filterConfig,
  updatePage,
  updatePerPage,
  handleFilter,
  handleShowMoreFilters,
  validateRouter,
  filterUpdate,
  handleClear,
  filtersRef,
} = useAccountingRestatementList()
</script>
