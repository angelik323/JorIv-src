<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="handleGoToList"
    >
      <section class="q-my-md">
        <TabsComponent
          :tabs="tabs"
          :tab-active="activeTab"
          :tab-active-idx="activeTabIdx"
        />

        <VCard>
          <template #content-card>
            <InformationLegalization
              v-show="activeTab === 'information'"
              :data="genericInvestmentPlan"
              action="view"
            />
          </template>
        </VCard>

        <VCard>
          <template #content-card>
            <section class="q-mx-lg q-mt-lg">
              <div class="row justify-start items-center">
                <p class="text-weight-bold text-subtitle1 q-mb-lg">Consulta</p>
              </div>

              <FiltersComponent
                :fields="filterConfig"
                @filter="handleFilter"
                @clear-filters="handleClearFilter"
              />

              <TableList
                :title="tableProps.title"
                :loading="tableProps.loading"
                :columns="tableProps.columns"
                :rows="tableProps.rows"
                :pages="tableProps.pages"
                @update-page="handleUpdatePage"
                @update-rows-per-page="handleUpdateRowsPerPage"
              >
                <template #custom-header-action>
                  <Button
                    label="Descargar excel"
                    tooltip="Descargar excel"
                    :outline="true"
                    :leftImg="excelIcon"
                    :disabled="tableProps.rows.length === 0"
                    @click="handleDownload"
                  />
                </template>
              </TableList>
            </section>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import InformationLegalization from '@/components/Forms/Fics/GenericInvestmentPlans/LegalizationResources/InformationLegalization/InformationLegalization.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Assets
import excelIcon from '@/assets/images/excel.svg'

// Logic view
import useLegalizationResourcesView from '@/views/fics/generic-investment-plans/v1/view-legalization/LegalizationResourcesView'

const {
  tabs,
  activeTab,
  tableProps,
  headerProps,
  activeTabIdx,
  filterConfig,
  handleFilter,
  handleGoToList,
  handleDownload,
  handleUpdatePage,
  handleClearFilter,
  genericInvestmentPlan,
  handleUpdateRowsPerPage,
} = useLegalizationResourcesView()
</script>
