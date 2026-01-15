<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
    >
      <template #addAfter>
        <Button
          v-if="
            validateRouter(
              'InvestmentPortfolio',
              'ComplianceOperationsPortfolioList',
              'create'
            )
          "
          :outline="false"
          :label="headerProperties.btn.label"
          :icon="headerProperties.btn.icon"
          color="primary"
          size="md"
          class-custom="btn-header"
          :dropdown-options="headerProperties.btn.options"
          color-icon="white"
        />
      </template>
      <FiltersComponent
        ref="filtersRef"
        :fields="filterConfig"
        @filter="handleFilterSearch"
        @clear-filters="handleClearFilters"
      />
      <div class="q-pt-md q-my-xl">
        <TableList
          :title="tableProperties.title"
          :loading="tableProperties.loading"
          :rows="tableProperties.rows"
          :columns="tableProperties.columns"
          :pages="tableProperties.pages"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        />
      </div>
    </ContentComponent>
  </div>
</template>
<script lang="ts" setup>
import Button from '@/components/common/Button/Button.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import useComplianceOperationsPortfolioList from '@/views/investment-portfolio/compliance-operations-portfolio/v1/list/ComplianceOperationsPortfolioList'

const {
  headerProperties,
  filterConfig,
  tableProperties,
  handleClearFilters,
  handleFilterSearch,
  updatePage,
  updateRowsPerPage,
  validateRouter,
} = useComplianceOperationsPortfolioList()
</script>
