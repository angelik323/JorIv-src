<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <FiltersComponent
        ref="filtersRef"
        :fields="filterConfig"
        :buttons="['more_filters']"
        @filter="handleFilter"
        @show-more="handleShowMoreFilters"
        @clear-filters="handleClearFilters"
      />

      <NoDataState
        v-if="isTableEmpty"
        :type="showState === 0 ? 'empty' : 'no-results'"
      />

      <div v-else class="q-pt-md q-my-xl">
        <TableList
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :title="tableProps.title"
          @update-page="handleUpdatePage"
          @update-rows-per-page="handleUpdatePerPage"
        >
          <template #custom-header-action>
            <Button
              outline
              class-custom="custom"
              label="Descargar excel"
              color="orange"
              :styleContent="{
                'place-items': 'center',
                color: 'black',
              }"
              :left-img="excelIcon"
              @click="exportExcel"
            />
          </template>
        </TableList>
      </div>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Assets
import excelIcon from '@/assets/images/excel.svg'

// Logic view
import useBudgetBalanceQueryList from '@/views/budget/budget-balance-query/v1/list/BudgetBalanceQueryList'

const {
  showState,
  tableProps,
  filtersRef,
  headerProps,
  exportExcel,
  filterConfig,
  handleFilter,
  isTableEmpty,
  handleUpdatePage,
  handleClearFilters,
  handleUpdatePerPage,
  handleShowMoreFilters,
} = useBudgetBalanceQueryList()
</script>
