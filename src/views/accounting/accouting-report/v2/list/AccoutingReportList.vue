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
          v-if="
            validateRouter(
              'Accounting',
              'AccoutingReportList',
              'action_generate'
            )
          "
          :outline="false"
          label="Generar"
          color="primary"
          color-icon="white"
          class-custom="btn-header"
          :dropdown-grouped="true"
          :dropdown-options="accounting_report_options"
          :left-icon="defaultIconsLucide.plusCircleOutline"
        />
      </template>

      <FiltersComponent
        ref="filtersRef"
        :fields="filterConfig"
        :buttons="['more_filters']"
        @filter="handleFilter"
        @update:values="onChangeFilter"
        @show-more="handleShowMoreFilters"
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
          :custom-columns="['actions']"
          @update-page="handleUpdatePage"
          @update-rows-per-page="handleUpdateRowsPerPage"
        >
          <template #actions="{ row }">
            <Button
              v-if="
                row.reports_generated?.some(
                  (r: IAccountingReportList['reports_generated'][0]) => r.mime_type?.type === 'PDF' &&
                  r.has_ready_to_download === true &&
                  r.url_to_download_for_s3
                )
              "
              :left-icon="defaultIconsLucide.pdf"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              flat
              colorIcon="#f45100"
              :tooltip="'Descargar PDF'"
              @click="downloadReport(row, 'PDF')"
            />

            <Button
              v-if="
                row.reports_generated?.some(
                  (r: IAccountingReportList['reports_generated'][0]) => r.mime_type?.type === 'EXCEL' &&
                  r.has_ready_to_download === true &&
                  r.url_to_download_for_s3
                )
              "
              :left-icon="defaultIconsLucide.excel"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              flat
              colorIcon="#f45100"
              :tooltip="'Descargar Excel'"
              @click="downloadReport(row, 'EXCEL')"
            />
          </template>
        </TableList>
      </div>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Interfaces -Constants
import { IAccountingReportList } from '@/interfaces/customs/accounting/v2/AccountingReport'
import { accounting_report_options } from '@/constants/resources/accounting'

// Logic view
import useAccountingReportList from '@/views/accounting/accouting-report/v2/list/AccoutingReportList'

const {
  showState,
  tableProps,
  filtersRef,
  headerProps,
  handleFilter,
  filterConfig,
  isTableEmpty,
  validateRouter,
  onChangeFilter,
  downloadReport,
  handleUpdatePage,
  defaultIconsLucide,
  handleClearFilters,
  handleShowMoreFilters,
  handleUpdateRowsPerPage,
} = useAccountingReportList()
</script>
