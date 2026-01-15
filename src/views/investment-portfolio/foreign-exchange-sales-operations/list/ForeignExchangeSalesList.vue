<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <template #addAfter>
        <Button
          v-if="
            validateRouter(
              'InvestmentPortfolio',
              'InvestmentPortfolioList',
              'create'
            )
          "
          :label="headerProps.btn.label"
          :icon="headerProps.btn.icon"
          :color="headerProps.btn.color || 'primary'"
          :size="headerProps.btn.size || 'md'"
          :outline="headerProps.btn.outline"
          :class-custom="headerProps.btn.class || 'btn-header'"
          :disabled="headerProps.btn.disable || false"
          :color-icon="'white'"
          :tooltip="'Opciones'"
          :dropdown-options="[
            {
              label: 'Compra divisas',
              routeName: 'ForeignExchangeBuyCreate',
            },
            {
              label: 'Venta divisas',
              routeName: 'ForeignExchangeSalesCreate',
            },
          ]"
        />
      </template>
      <section class="q-mt-md">
        <FiltersComponent :fields="filterConfig" @filter="handleFilterSearch" />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProperties.title"
          :loading="tableProperties.loading"
          :columns="tableProperties.columns"
          :rows="tableProperties.rows"
          :pages="tableProperties.pages"
          :custom-columns="['status', 'actions', 'type']"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #status="{ row }">
            <ShowStatus
              :type="row.status_id ?? 1"
              class-custom="q-px-sm q-py-xs"
            />
          </template>
          <template #actions="{ row }">
            <!-- Ver -->
            <Button
              v-if="
                validateRouter(
                  'InvestmentPortfolio',
                  'InvestmentPortfolioList',
                  'show'
                )
              "
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Ver"
              @click="goToView(row)"
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components:
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

// Logic view
import useForeignExchangeSalesBuyList from './ForeignExchangeSalesList'

const {
  // Props
  headerProps,
  tableProperties,
  filterConfig,
  // Methods
  handleFilterSearch,
  updatePage,
  defaultIconsLucide,
  goToView,
  updateRowsPerPage,
  validateRouter,
} = useForeignExchangeSalesBuyList()
</script>
