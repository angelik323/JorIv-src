<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerConfig.title"
      :breadcrumbs="headerConfig.breadcrumbs"
      :btn-label="headerConfig.btn.label"
      :btn-icon="headerConfig.btn.icon"
      @to="goToURL(headerConfig.btn.route)"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          ref="filtersRef"
          :fields="filtersConfig"
          @filter="handleFilterSearch"
          @clear-filters="handleClearFilters"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="detailsTableProps.title"
          :loading="detailsTableProps.loading"
          :columns="detailsTableProps.columns"
          :rows="detailsTableProps.rows"
          :pages="detailsTableProps.pages"
          @update-page="handleUpdatePage"
          @update-rows-per-page="handleUpdateRowsPerPage"
        >
          <template #custom-header-action>
            <Button
              v-if="
                validateRouter(
                  'Audit',
                  'AuditEntryOfFunctionalitiesList',
                  'export'
                )
              "
              label="Generar excel"
              tooltip="Generar excel"
              outline
              class="q-mr-xs q-py-sm"
              :leftImg="excelIcon"
              :disabled="detailsTableProps.rows.length === 0"
              @click=""
            />
            <Button
              v-if="
                validateRouter(
                  'Audit',
                  'AuditEntryOfFunctionalitiesList',
                  'export'
                )
              "
              label="Generar PDF"
              tooltip="Generar PDF"
              outline
              class="q-mr-xs q-py-sm"
              :leftImg="pdfIcon"
              :disabled="detailsTableProps.rows.length === 0"
              @click=""
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
// Composable view logic:
import useAuditEntryOfFunctionalities from '@/views/audit/audit-entry-of-functionalities/v1/list/AuditEntryOfFunctionalitiesList'
// Components:
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
// Assets
import excelIcon from '@/assets/images/excel.svg'
import pdfIcon from '@/assets/images/pdf.svg'

const {
  filtersRef,
  headerConfig,
  filtersConfig,
  detailsTableProps,

  goToURL,
  validateRouter,
  handleUpdatePage,
  handleClearFilters,
  handleFilterSearch,
  handleUpdateRowsPerPage,
} = useAuditEntryOfFunctionalities()
</script>
