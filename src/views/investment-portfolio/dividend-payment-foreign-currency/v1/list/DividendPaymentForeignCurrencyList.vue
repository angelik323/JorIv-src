<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      btn-label="Crear"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="handleGoTo('DividendPaymentForeignCurrencyCreate')"
    >
      <FiltersComponent
        show_actions
        :fields="filterConfig"
        @filter="handleFilter"
        @clear-filters="handleClearFilters"
      />

      <NoDataState
        v-if="isDividendsPaymentsEmpty"
        :type="showState === 0 ? 'empty' : 'no-results'"
      />

      <div v-else class="q-pt-md">
        <TableList
          :title="tableProperties.title"
          :loading="tableProperties.loading"
          :rows="tableProperties.rows"
          :columns="tableProperties.columns"
          :pages="tableProperties.pages"
          :custom-columns="['actions']"
          @update-page="handleUpdatePage"
          @update-rows-per-page="handleUpdatePerPage"
        >
          <template #actions="{ row }">
            <Button
              left-icon="Eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              flat
              colorIcon="#f45100"
              :tooltip="'Ver'"
              @click="handleGoTo('DividendPaymentForeignCurrencyView', row.id)"
            />
          </template>
        </TableList>
      </div>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

import useDividendPaymentForeignCurrencyList from './DividendPaymentForeignCurrencyList'

const {
  showState,
  handleGoTo,
  handleFilter,
  filterConfig,
  tableProperties,
  headerProperties,
  handleUpdatePage,
  handleClearFilters,
  defaultIconsLucide,
  handleUpdatePerPage,
  isDividendsPaymentsEmpty,
} = useDividendPaymentForeignCurrencyList()
</script>
