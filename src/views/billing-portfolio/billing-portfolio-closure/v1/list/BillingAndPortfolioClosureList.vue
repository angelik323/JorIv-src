<template>
  <div class="q-mx-xl">
    <ContentComponent
      :header-props="headerProps"
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter(
          'BillingCollection',
          'BillingAndPortfolioClosureList',
          'create'
        )
          ? 'Crear'
          : undefined
      "
      :btn-icon="useUtils().defaultIconsLucide.plusCircleOutline"
      @to="$router.push({ name: 'BillingAndPortfolioClosureCreate' })"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClearFilters"
        />

        <NoDataState
          v-if="isBillingAndPortfolioClosureEmpty"
          :type="showState === 0 ? 'empty' : 'no-results'"
          :title="
            showState === 0
              ? 'Realice una búsqueda para ver los datos'
              : 'No se encontraron resultados'
          "
          :subtitle="
            showState === 0
              ? 'Aquí visualizará los resultados de su búsqueda'
              : 'Pruebe con otra búsqueda'
          "
        />
        <section class="mt-6" v-else>
          <TableList
            :title="tableProps.title"
            :loading="tableProps.loading"
            :columns="tableProps.columns"
            :rows="tableProps.rows"
            :pages="tableProps.pages"
            :custom-columns="['status', 'actions']"
            @update-page="updatePage"
            @update-rows-per-page="updateRowsPerPage"
          >
            <template #status="{ row }">
              <ShowStatus
                :type="Number(row?.status?.id)"
                status-type="billingPortfolio"
              />
            </template>

            <template #actions="{ row }">
              <!-- Ver -->
              <Button
                v-if="
                  validateRouter(
                    'BillingCollection',
                    'BillingAndPortfolioClosureList',
                    'show'
                  )
                "
                :left-icon="useUtils().defaultIconsLucide.eye"
                color="orange"
                class-custom="custom"
                :outline="false"
                flat
                colorIcon="#f45100"
                tooltip="Ver"
                @click="
                  $router.push({
                    name: 'BillingAndPortfolioClosureView',
                    params: {
                      id: row.id,
                    },
                  })
                "
              />
              <Button
                v-if="
                  validateRouter(
                    'BillingCollection',
                    'BillingAndPortfolioClosureList',
                    'show'
                  )
                "
                :left-icon="useUtils().defaultIconsLucide.receiptText"
                color="orange"
                class-custom="custom"
                :outline="false"
                flat
                colorIcon="#f45100"
                tooltip="Confirmar cierre"
                :disabled="row.status.id === 23"
                @click="
                  $router.push({
                    name: 'BillingAndPortfolioClosureConfirm',
                    params: {
                      id: row.id,
                    },
                  })
                "
              />
              <Button
                v-if="
                  validateRouter(
                    'BillingCollection',
                    'BillingAndPortfolioClosureList',
                    'export'
                  )
                "
                :left-icon="useUtils().defaultIconsLucide.download"
                color="orange"
                class-custom="custom"
                :outline="false"
                flat
                colorIcon="#f45100"
                :disabled="row.status.id !== 23"
                tooltip="Descargar excel"
                @click="exportExcel(row.id)"
              />
            </template>
          </TableList>
        </section>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'

// Logic view
import useBillingAndPortfolioClosureList from './BillingAndPortfolioClosureList'

const {
  headerProps,
  filterConfig,
  tableProps,
  showState,
  isBillingAndPortfolioClosureEmpty,
  handleFilter,
  handleClearFilters,
  updatePage,
  updateRowsPerPage,
  validateRouter,
  useUtils,
  exportExcel,
} = useBillingAndPortfolioClosureList()
</script>
