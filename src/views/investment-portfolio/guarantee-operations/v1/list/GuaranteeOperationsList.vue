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
          :outline="headerProperties.btn.outline"
          :label="headerProperties.btn.label"
          :icon="headerProperties.btn.icon"
          :color="headerProperties.btn.color"
          :size="headerProperties.btn.size"
          :class-custom="headerProperties.btn.class"
          :disabled="headerProperties.btn.disable"
          :dropdown-options="headerProperties.btn.options"
          color-icon="white"
        />
      </template>

      <section class="q-mt-md">
        <FiltersComponent
          ref="filterComponentRef"
          :fields="filterConfig"
          trigger_event_by_field
          @filter="handleFilterSearch"
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
          :custom-columns="['actions']"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #actions="{ row }">
            <Button
              v-if="
                row.id &&
                validateRouter(
                  'InvestmentPortfolio',
                  'GuaranteeOperationsList',
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
              @click="
                goToURL(
                  GUARANTEE_OPERATION_ROUTES[
                    row.type as EGuaranteeOperationType
                  ],
                  row.id
                )
              "
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Interfaces
import { EGuaranteeOperationType } from '@/interfaces/customs/investment-portfolio/GuaranteeOperations'

// Components
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic view
import useGuaranteeOperationsList from '@/views/investment-portfolio/guarantee-operations/v1/list/GuaranteeOperationsList'

const {
  defaultIconsLucide,
  headerProperties,
  tableProperties,
  filterComponentRef,
  filterConfig,
  GUARANTEE_OPERATION_ROUTES,
  handleClearFilters,
  handleFilterSearch,
  updatePage,
  updateRowsPerPage,
  goToURL,
  validateRouter,
} = useGuaranteeOperationsList()
</script>
