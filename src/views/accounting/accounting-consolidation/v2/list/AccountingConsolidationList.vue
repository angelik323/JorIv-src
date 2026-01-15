<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('Accounting', 'AccountingConsolidationList', 'process')
          ? 'Procesar'
          : undefined
      "
      :btn-icon="headerProps.btn.icon"
      @to="goToURL('AccountingConsolidationCreate')"
    >
      <section class="q-mt-md">
        <FiltersComponent
          ref="filterComponentRef"
          :fields="filterConfig"
          :buttons="['more_filters']"
          @filter="handleFilterSearch"
          @show-more="handleShowFilters"
          @clear-filters="handleClearFilters"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProperties.title"
          :loading="tableProperties.loading"
          :columns="tableProperties.columns"
          :rows="tableProperties.rows"
          :pages="tableProperties.pages"
          :custom-columns="['status', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #status="{ row }">
            <ShowStatus
              :type="Number(row?.status.id === 84 ? 106 : 0)"
              :status-type="'accounting'"
            />
          </template>

          <template #actions="{ row }">
            <Button
              v-if="
                row.id &&
                validateRouter(
                  'Accounting',
                  'AccountingConsolidationList',
                  'show'
                )
              "
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Ver"
              @click="goToURL('AccountingConsolidationView', row.id)"
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import Button from '@/components/common/Button/Button.vue'

//Logic view
import useAccountingConsolidation from '@/views/accounting/accounting-consolidation/v2/list/AccountingConsolidationList'

const {
  headerProps,

  //Icons
  defaultIconsLucide,

  //Table props
  tableProperties,

  //Table methods
  updatePage,
  updateRowsPerPage,
  handleClearFilters,
  handleFilterSearch,
  validateRouter,

  //Filters
  filterConfig,
  filterComponentRef,
  handleShowFilters,

  //Navigate actions
  goToURL,
} = useAccountingConsolidation()
</script>
