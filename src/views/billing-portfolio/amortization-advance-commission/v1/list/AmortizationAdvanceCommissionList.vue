<template>
  <div class="q-mx-xl">
    <ContentComponent
      :header-props="headerProps"
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClearFilters"
        />
      </section>

      <section class="mt-6">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :selection="'single'"
          :custom-columns="['status', 'actions']"
          @selected="handleAmortizationSelection"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #custom-header-action>
            <Button
              left-icon="PlusCircle"
              color="orange"
              color-icon="white"
              class-custom="custom"
              :outline="false"
              label="Crear nuevo registro"
              @click="
                $router.push({
                  name: 'AmortizationAdvanceCommissionCreate',
                  params: {
                    id: selectedAmortizationId,
                  },
                })
              "
              :disabled="isDisabledAmortization"
            />
          </template>

          <template #status="{ row }">
            <ShowStatus
              :type="Number(row?.status?.id)"
              status-type="billingPortfolio"
            />
          </template>

          <template #actions="{ row }">
            <!-- Ver -->
            <Button
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Ver"
              @click="
                $router.push({
                  name: 'AmortizationAdvanceCommissionView',
                  params: {
                    id: row.id,
                  },
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
// Components
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

// Utils & Assets
import { defaultIconsLucide } from '@/utils'

// Logic view
import useAmortizationAdvanceCommissionList from './AmortizationAdvanceCommissionList'

const {
  headerProps,
  tableProps,
  filterConfig,
  isDisabledAmortization,
  selectedAmortizationId,
  handleAmortizationSelection,
  handleClearFilters,
  handleFilter,
  updatePage,
  updateRowsPerPage,
} = useAmortizationAdvanceCommissionList()
</script>
