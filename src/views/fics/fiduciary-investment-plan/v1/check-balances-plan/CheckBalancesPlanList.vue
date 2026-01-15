<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="handleGoBack"
    >
      <section class="q-my-md">
        <CheckBalancesPlanListForm ref="formInformation" :action="'view'" />
      </section>

      <VCard>
        <template #content-card>
          <div class="mx-3 mt-2 mb-3">
            <div class="row center q-mb-lg">
              <p class="text-weight-bold text-black-90 text-h6">
                Listado de movimientos plan de inversión
              </p>

              <Button
                outline
                label="Descargar excel"
                :leftImg="excelIcon"
                tooltip="Descargar excel"
                @click="exportExcel"
                :disabled="tableProps.rows.length === 0"
              />
            </div>

            <FiltersComponent
              ref="filterComponentRef"
              :fields="filterConfigRef"
              @filter="handleFilter"
              @clear-filters="handleClearFilters"
            />

            <TableList
              :loading="tableProps.loading"
              :columns="tableProps.columns"
              :rows="tableProps.rows"
              :pages="tableProps.pages"
              @update-page="updatePage"
              @update-rows-per-page="updateRowsPerPage"
            />
          </div>
        </template>
      </VCard>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import CheckBalancesPlanListForm from '@/components/Forms/Fics/FiduciaryInvestmentPlan/CheckBalancesPlanList/CheckBalancesPlanListForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Assets
import excelIcon from '@/assets/images/excel.svg'

// Logic view
import useCheckBalancesPlanList from '@/views/fics/fiduciary-investment-plan/v1/check-balances-plan/CheckBalancesPlanList'

const {
  updatePage,
  tableProps,
  exportExcel,
  handleFilter,
  handleGoBack,
  filterConfigRef,
  headerProperties,
  updateRowsPerPage,
  filterComponentRef,
  handleClearFilters,
} = useCheckBalancesPlanList()
</script>
<style src="./CheckBalancesPlanList.scss" lang="scss" scoped />
