<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          ref="filtersRef"
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClear"
          @update:values="onFilterChange"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :rows="tableProps.rows"
          :columns="tableProps.columns"
          :pages="tableProps.pages"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #custom-header-action>
            <Button
              v-if="
                validateRouter(
                  'Accounting',
                  'ConsecutiveQueriesOfReceiptsList',
                  'export'
                )
              "
              :outline="true"
              label="Descargar excel"
              :leftImg="excelIcon"
              :disabled="tableProps.rows.length === 0"
              tooltip="Descargar excel"
              @click="downloadExcel()"
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import useConsecutiveQueriesOfReceiptsList from './ConsecutiveQueriesOfReceiptsList'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import excelIcon from '@/assets/images/excel.svg'

const {
  headerProps,
  filterConfig,
  tableProps,
  filtersRef,
  validateRouter,
  handleFilter,
  handleClear,
  updatePage,
  updatePerPage,
  downloadExcel,
  onFilterChange,
} = useConsecutiveQueriesOfReceiptsList()
</script>
