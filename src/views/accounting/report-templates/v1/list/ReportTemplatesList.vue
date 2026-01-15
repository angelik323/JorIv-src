<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      :btn-label="
        validateRouter('Accounting', 'ReportTemplatesList', 'create')
          ? 'Crear'
          : undefined
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="goToURL('ReportTemplatesCreate')"
    >
      <FiltersComponent
        show_actions
        :fields="filterConfig"
        @filter="handleFilter"
        @clear-filters="handleClearFilters"
      />

      <NoDataState
        v-if="isReportTemplatesEmpty"
        :type="showState === 0 ? 'empty' : 'no-results'"
      />

      <div v-else class="q-pt-md">
        <TableList
          :title="tableProperties.title"
          :loading="tableProperties.loading"
          :rows="tableProperties.rows"
          :columns="tableProperties.columns"
          :pages="tableProperties.pages"
          :custom-columns="tableProperties.customColumns"
          @update-page="handleUpdatePage"
          @update-rows-per-page="handleUpdatePerPage"
        >
          <template #actions="{ row }">
            <Button
              v-if="validateRouter('Accounting', 'ReportTemplatesList', 'show')"
              flat
              :left-icon="defaultIconsLucide.eye"
              color-icon="#f45100"
              :class-custom="'custom'"
              :outline="false"
              tooltip="Ver"
              @click="handleOptions('view', row.id)"
            />
            <Button
              v-if="validateRouter('Accounting', 'ReportTemplatesList', 'edit')"
              flat
              :left-icon="defaultIconsLucide.edit"
              color-icon="#f45100"
              :class-custom="'custom'"
              :outline="false"
              tooltip="Editar"
              @click="handleOptions('edit', row.id)"
            />
          </template>
        </TableList>
      </div>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

import useReportTemplatesList from '@/views/accounting/report-templates/v1/list/ReportTemplatesList'

const {
  goToURL,
  showState,
  handleFilter,
  filterConfig,
  handleOptions,
  validateRouter,
  tableProperties,
  headerProperties,
  handleUpdatePage,
  handleClearFilters,
  defaultIconsLucide,
  handleUpdatePerPage,
  isReportTemplatesEmpty,
} = useReportTemplatesList()
</script>
