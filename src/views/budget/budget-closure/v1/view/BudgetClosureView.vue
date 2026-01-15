<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      show-back-btn
      :title="headerConfig.title"
      :breadcrumbs="headerConfig.breadcrumbs"
      @on-back="handleGoToList"
    >
      <TabsComponent :tabs :tabActive :tabActiveIdx />
      <section>
        <VCard>
          <template #content-card>
            <InformationForm action="view" :data="processInfo" />
          </template>
        </VCard>
      </section>

      <section>
        <FiltersComponentV2
          :fields="filtersConfig"
          @filter="handleFilterSearch"
          @clear-filters="handleClearFilters"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          selection="single"
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="tableCustomCols"
          @update-page="handleUpdatePage"
          @update-rows-per-page="handleUpdateRowsPerPage"
          @update:selected="handleSelectedBusinesses"
        >
          <template #custom-header-action>
            <Button
              v-if="isEnabledExportAction()"
              label="Reporte de errores"
              tooltip="Reporte de errores"
              :outline="true"
              :leftImg="excelIcon"
              :disabled="!canDownloadErrorReport"
              @click="handleDownloadErrorReport"
            />
          </template>

          <template
            #status="{ row }: { row: IBudgetClosureProcessedBusinessListItem }"
          >
            <ShowStatus
              :type="Number(row.closure_status)"
              status-type="budget"
            />
          </template>
        </TableList>
      </section>

      <section v-if="selectedProcessedBusiness" class="q-mt-lg">
        <ProcessedBusinessDocumentList
          :businessId="selectedProcessedBusiness.business.id"
          :processId="processId"
        />
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import Button from '@/components/common/Button/Button.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import InformationForm from '@/components/Forms/Budget/BudgetClosure/v1/InformationForm/InformationForm.vue'
import ProcessedBusinessDocumentList from '@/components/Lists/Budget/BudgetClosure/v1/view/ProcessedBusinessDocumentList/ProcessedBusinessDocumentList.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Interfaces
import { IBudgetClosureProcessedBusinessListItem } from '@/interfaces/customs/budget/BudgetClosure'

// Assets
import excelIcon from '@/assets/images/excel.svg'

// View logic
import useBudgetClosureView from '@/views/budget/budget-closure/v1/view/BudgetClosureView'

const {
  // Refs and computed props
  processId,
  headerConfig,
  tabs,
  tabActive,
  tabActiveIdx,
  tableProps,
  processInfo,
  selectedProcessedBusiness,
  tableCustomCols,
  filtersConfig,
  canDownloadErrorReport,

  // Functions/Methods
  handleGoToList,
  isEnabledExportAction,
  handleSelectedBusinesses,
  handleClearFilters,
  handleFilterSearch,
  handleUpdatePage,
  handleUpdateRowsPerPage,
  handleDownloadErrorReport,
} = useBudgetClosureView()
</script>
