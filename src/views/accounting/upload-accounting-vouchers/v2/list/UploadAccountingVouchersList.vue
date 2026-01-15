<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('Accounting', 'UploadAccountingVouchersList', 'process')
          ? 'Procesar'
          : undefined
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="goToURL('UploadAccountingVouchersImport')"
    >
      <section class="mt-4">
        <FiltersComponent
          :fields="filterConfig"
          @filter="handleFilterSearch"
          @clear-filters="handleClearFilters"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProperties.title"
          :loading="tableProperties.loading"
          :columns="tableProperties.columns"
          :rows="tableProperties.rows"
          :pages="tableProperties.pages"
          :custom-columns="['status', 'file_name', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #status="{ row }">
            <ShowStatus
              :type="Number(row?.status.id ?? 1)"
              statusType="accountingVouchers"
            />
          </template>
          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter(
                  'Accounting',
                  'UploadAccountingVouchersList',
                  'export'
                )
              "
              :left-icon="defaultIconsLucide.download"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Descargar'"
              @click="handleDownloadFile(row)"
            />
          </template>

          <template #file_name="{ row }">
            <div class="q-pa-md row items-center">
              <img
                class="image-excel q-mr-sm"
                src="@/assets/images/excel.svg"
                alt="Excel Icon"
              />
              {{ row.file_name }}
            </div>
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Componentes comunes
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Composable
import useUploadAccountingVouchersList from '@/views/accounting/upload-accounting-vouchers/v2/list/UploadAccountingVouchersList'
const {
  headerProps,
  filterConfig,
  tableProperties,
  handleClearFilters,
  handleFilterSearch,
  updatePage,
  updateRowsPerPage,
  defaultIconsLucide,
  goToURL,
  handleDownloadFile,
  validateRouter,
} = useUploadAccountingVouchersList()
</script>
