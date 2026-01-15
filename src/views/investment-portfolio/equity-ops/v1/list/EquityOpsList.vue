<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
    >
      <template #addAfter>
        <Button
          :outline="false"
          label="Crear"
          color="primary"
          color-icon="white"
          class-custom="btn-header"
          :dropdown-options="equity_ops_options['button']"
          :left-icon="defaultIconsLucide.plusCircleOutline"
        />
      </template>

      <FiltersComponent
        show_actions
        :fields="filterConfig"
        @filter="handleFilter"
        @clear-filters="handleClearFilters"
      />

      <NoDataState
        v-if="isEquityOpsEmpty"
        :type="showState === 0 ? 'empty' : 'no-results'"
      />

      <div v-else class="q-pt-md">
        <TableList
          :title="tableProperties.title"
          :loading="tableProperties.loading"
          :rows="tableProperties.rows"
          :columns="tableProperties.columns"
          :pages="tableProperties.pages"
          :custom-columns="['status_id', 'actions']"
          @update-page="handleUpdatePage"
          @update-rows-per-page="handleUpdatePerPage"
        >
          <template #status_id="{ row }">
            <ShowStatus :type="row.status_id" />
          </template>

          <template #actions="{ row }">
            <Button
              flat
              left-icon="Eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              colorIcon="#f45100"
              :tooltip="'Ver'"
              @click="handleEditsType(row.id ?? 0, row.operation_type)"
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
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

import { equity_ops_options } from '@/constants'

import useEquityOpsList from '@/views/investment-portfolio/equity-ops/v1/list/EquityOpsList'

const {
  showState,
  handleFilter,
  filterConfig,
  handleEditsType,
  tableProperties,
  headerProperties,
  handleUpdatePage,
  isEquityOpsEmpty,
  handleClearFilters,
  defaultIconsLucide,
  handleUpdatePerPage,
} = useEquityOpsList()
</script>
