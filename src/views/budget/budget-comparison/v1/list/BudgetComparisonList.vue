<template>
  <div class="q-mx-lg">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <FiltersComponent
        :fields="filterConfig"
        trigger_event_by_field
        @filter="handleFilter"
        @clear-filters="handleClearFilters"
      />

      <NoDataState
        v-if="isTableEmpty"
        :type="showState === 0 ? 'empty' : 'no-results'"
      />

      <div v-else class="q-pt-md q-my-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          @update-page="handleUpdatePage"
          @update-rows-per-page="handleUpdatePerPage"
        >
          <template #custom-header-action>
            <div class="row q-gutter-md">
              <Button
                outline
                class-custom="custom"
                label="Descargar PDF"
                color="orange"
                :styleContent="{
                  'place-items': 'center',
                  color: 'black',
                }"
                :left-img="pdfIcon"
                @click="handleDownloadPdf"
              />

              <Button
                outline
                class-custom="custom"
                label="Descargar Excel"
                color="orange"
                :styleContent="{
                  'place-items': 'center',
                  color: 'black',
                }"
                :left-img="excelIcon"
                @click="handleDownloadExcel"
              />
            </div>
          </template>
        </TableList>
      </div>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Assets
import excelIcon from '@/assets/images/excel.svg'
import pdfIcon from '@/assets/images/pdf.svg'

// Logic view
import useBudgetComparisonList from '@/views/budget/budget-comparison/v1/list/BudgetComparisonList'

const {
  showState,
  tableProps,
  headerProps,
  filterConfig,
  handleFilter,
  isTableEmpty,
  handleUpdatePage,
  handleClearFilters,
  handleUpdatePerPage,
  handleDownloadExcel,
  handleDownloadPdf,
} = useBudgetComparisonList()
</script>
