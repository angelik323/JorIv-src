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
          :outline="headerProps.btn.outline"
          :label="headerProps.btn.label"
          :icon="headerProps.btn.icon"
          :color="headerProps.btn.color || 'primary'"
          :size="headerProps.btn.size || 'md'"
          :class-custom="headerProps.btn.class || 'btn-header'"
          :disabled="headerProps.btn.disable || false"
          :color-icon="'white'"
          :dropdown-options="headerProps.btn.options"
        />
      </template>
      <section>
        <FiltersComponent
          @filter="handleFilter"
          :fields="filterConfig"
          @clear-filters="handleClear"
        />
      </section>
      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :columns="tableProps.columns"
          :custom-columns="['status', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #status="{ row }">
            <ShowStatus
              :type="Number(row?.status ?? 0)"
              status-type="investmentPortfolio"
            />
          </template>

          <template #actions="{ row }">
            <Button
              :color="'primary'"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              tooltip="Ver"
              :icon="defaultIconsLucide.eye"
              @click="
                goToURL('DerivativeInvestmentOperationsView', { id: row.id })
              "
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>
<script lang="ts" setup>
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

import { useDerivativeInvestmentOperationList } from '@/views/investment-portfolio/derivative-investment-operation/v1/list/DerivativeInvestmentOperationList'
const {
  filterConfig,
  headerProps,
  tableProps,
  defaultIconsLucide,

  updatePage,
  updatePerPage,
  handleFilter,
  handleClear,
  goToURL,
} = useDerivativeInvestmentOperationList()
</script>
