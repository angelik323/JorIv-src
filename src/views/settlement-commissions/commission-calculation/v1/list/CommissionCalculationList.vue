<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      btn-label="Crear"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="goToURL('CommissionCalculationCreate')"
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
          :custom-columns="['status', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #status="{ row }">
            <ShowStatus :type="Number(row?.business_status_snapshot ?? 1)" />
          </template>

          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter(
                  'SettlementCommissions',
                  'CommissionsCalculationList',
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
                goToURL('CommissionCalculationView', {
                  id: row?.business_trust_commissions?.id,
                })
              "
            />
            <Button
              v-if="
                validateRouter(
                  'SettlementCommissions',
                  'CommissionsCalculationList',
                  'edit'
                )
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Editar"
              :disabled="
                row.business_trust_commissions?.calculation_type !== 'Manual'
              "
              @click="
                goToURL('CommissionCalculationEdit', {
                  id: row?.business_trust_commissions?.id,
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

// Logic view
import useCommissionCalculationList from '@/views/settlement-commissions/commission-calculation/v1/list/CommissionCalculationList'

const {
  headerProps,
  tableProperties,
  filterConfig,
  defaultIconsLucide,

  handleFilter,
  updatePage,
  updatePerPage,
  handleClear,
  goToURL,
  validateRouter,
} = useCommissionCalculationList()
</script>
