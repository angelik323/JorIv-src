<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerConfig.title"
      :breadcrumbs="headerConfig.breadcrumbs"
      :btn-label="headerConfig.btnLabel"
      @to="goToURL('BudgetClosureCreate')"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          ref="filtersRef"
          :fields="filtersConfig"
          :buttons="['more_filters']"
          @filter="handleFilterSearch"
          @clear-filters="handleClearFilters"
          @show-more="handleShowMoreFilters"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="tableCustomCols"
          @update-page="handleUpdatePage"
          @update-rows-per-page="handleUpdateRowsPerPage"
        >
          <template #status="{ row }">
            <ShowStatus :type="Number(row.status)" status-type="budget" />
          </template>

          <template #actions="{ row }: { row: IBudgetClosureProcessListItem }">
            <Button
              v-if="isEnabledViewAction()"
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Ver"
              @click="
                goToURL('BudgetClosureView', {
                  id: row.id,
                  actionType: row.action_type,
                })
              "
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/common/Button/Button.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'

import useBudgetClosureList from '@/views/budget/budget-closure/v1/list/BudgetClosureList'
import { IBudgetClosureProcessListItem } from '@/interfaces/customs/budget/BudgetClosure'

const {
  // Imported composable variables
  defaultIconsLucide,

  // Refs & Computed props
  headerConfig,
  filtersRef,
  filtersConfig,
  tableProps,
  tableCustomCols,

  // Imported composable functions
  goToURL,

  // Functions/Methods
  handleFilterSearch,
  handleClearFilters,
  handleUpdatePage,
  handleUpdateRowsPerPage,
  handleShowMoreFilters,
  isEnabledViewAction,
} = useBudgetClosureList()
</script>
