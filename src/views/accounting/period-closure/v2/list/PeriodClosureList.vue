<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('Accounting', 'PeriodClosureList', 'create')
          ? 'Crear'
          : undefined
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="goToURL('PeriodClosureCreate')"
    >
      <section class="q-mt-md">
        <FiltersComponent
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClear"
        />
      </section>

      <NoDataState
        v-if="isPeriodClosureEmpty"
        :type="showState === 0 ? 'empty' : 'no-results'"
      />

      <section v-else class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        />
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Componentes comunes
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'

// Composable
import usePeriodClosureList from '@/views/accounting/period-closure/v2/list/PeriodClosureList'

const {
  headerProps,
  tableProps,
  filterConfig,
  showState,
  isPeriodClosureEmpty,
  validateRouter,
  handleClear,
  handleFilter,
  updatePage,
  updatePerPage,
  defaultIconsLucide,
  goToURL,
} = usePeriodClosureList()
</script>
