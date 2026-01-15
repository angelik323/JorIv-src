<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('Accounting', 'UploadAccountingVouchersList', 'create')
          ? 'Crear'
          : undefined
      "
      :btn-icon="useUtils().defaultIconsLucide.plusCircleOutline"
      @to="$router.push({ name: 'UploadAccountingVouchersImport' })"
    >
      <section class="mt-4">
        <FiltersComponent
          @filter="handleFilter"
          :fields="filterConfig"
          @clear-filters="handleClearFilters"
        />
      </section>
      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['status', 'file_name']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #status="{ row }">
            <ShowStatus :type="Number(row?.status.id ?? 1)" />
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
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'

import { useUtils } from '@/composables'
import useUploadAccountingVouchersList from './UploadAccountingVouchersList'

const {
  headerProps,
  filterConfig,
  tableProps,
  handleClearFilters,
  handleFilter,
  updatePage,
  updatePerPage,
  validateRouter,
} = useUploadAccountingVouchersList()
</script>
