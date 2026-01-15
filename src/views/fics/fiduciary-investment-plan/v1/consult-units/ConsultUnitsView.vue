<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="handleGoBack"
    >
      <section class="q-my-md">
        <TabsComponent
          :tabs="tabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
        />

        <Card>
          <template #content-card>
            <section class="q-pa-lg">
              <ConsultUnitsViewForm
                ref="formInformation"
                :action="'view'"
                :data="consult_units_basic_data_form"
              />
            </section>
          </template>
        </Card>
      </section>

      <FiltersComponentV2
        :fields="filterConfig"
        @filter="handleFilter"
        @clear-filters="clearFilters"
      />

      <div class="q-mt-md">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          hide-pagination
        />
      </div>

      <q-separator class="q-my-lg" />

      <section class="q-my-lg">
        <div class="row justify-end q-gutter-md">
          <div class="col-auto">
            <Button
              :outline="false"
              class-custom="custom"
              label="Reporte"
              size="md"
              color="orange"
              @click="consultUnitsReport"
            />
          </div>
        </div>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ConsultUnitsViewForm from '@/components/Forms/Fics/FiduciaryInvestmentPlan/ConsultUnits/ConsultUnitsForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import Card from '@/components/common/VCard/VCard.vue'

// Logic view
import useConsultUnitsView from '@/views/fics/fiduciary-investment-plan/v1/consult-units/ConsultUnitsView'

const {
  tabs,
  tabActive,
  tableProps,
  headerProps,
  tabActiveIdx,
  handleGoBack,
  handleFilter,
  clearFilters,
  filterConfig,
  consultUnitsReport,
  consult_units_basic_data_form,
} = useConsultUnitsView()
</script>
