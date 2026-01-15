<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClear"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProperties.title"
          :loading="tableProperties.loading"
          :columns="tableProperties.columns"
          :rows="tableProperties.rows"
          :pages="tableProperties.pages"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
          v-model:selected="selectedRows"
          selection="multiple"
        >
          <template #custom-header-action>
            <Button
              v-if="
                validateRouter(
                  'SettlementCommissions',
                  'SettlementFiduciaryCommissionsList',
                  'create'
                )
              "
              no-caps
              class-custom="custom"
              :outline="false"
              :disabled="selectedRows?.length > 0"
              label="Liquidar todas"
              color="orange"
              @click="handleOpenModalLiquidate(true)"
              style="margin-right: 10px"
            />

            <Button
              v-if="
                validateRouter(
                  'SettlementCommissions',
                  'SettlementFiduciaryCommissionsList',
                  'create'
                )
              "
              no-caps
              class-custom="custom"
              :outline="false"
              :disabled="selectedRows?.length === 0"
              label="Liquidar comisiones"
              color="orange"
              @click="handleOpenModalLiquidate(false)"
            />
          </template>

          <template #status="{ row }">
            <ShowStatus
              :type="Number(row?.comission_settlement_statuses_id)"
              status-type="billingPortfolio"
            />
          </template>
        </TableList>

        <AlertModalComponent
          ref="alertModalRef"
          styleModal="min-width: 470px"
          :title="alertModalConfig.title"
          :description_message="alertModalConfig.description"
          @confirm="handleLiquidateAction"
        />
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
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// Logic view
import useFiduciaryCommissionList from '@/views/settlement-commissions/fiduciary-commission/v2/list/FiduciaryCommissionList'

const {
  headerProps,
  tableProperties,
  filterConfig,
  selectedRows,
  defaultIconsLucide,
  alertModalRef,
  alertModalConfig,

  handleFilter,
  updatePage,
  updatePerPage,
  handleClear,
  handleLiquidateAction,
  handleOpenModalLiquidate,
  validateRouter,
} = useFiduciaryCommissionList()
</script>
