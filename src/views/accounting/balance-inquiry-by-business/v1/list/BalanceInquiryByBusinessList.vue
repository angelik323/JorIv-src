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
          ref="filterComponentRef"
          :fields="filterConfig"
          trigger_event_by_field
          @show-more="handleShowMoreFilters"
          @filter="handleFilter"
          @update:values="onFilterChange"
          @clear-filters="handleClear"
          :buttons="['more_filters']"
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
              v-if="validateRouter('Accounting', 'BalanceInquiryByBusinessList', 'export')"
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

<script lang="ts" setup>
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import excelIcon from '@/assets/images/excel.svg'
import useBalanceInquiryByBusinessList from './BalanceInquiryByBusinessList'

const {
  headerProps,
  filterComponentRef,
  filterConfig,
  tableProps,

  handleFilter,
  handleShowMoreFilters,
  updatePerPage,
  updatePage,
  downloadExcel,
  handleClear,
  onFilterChange,
  validateRouter
} = useBalanceInquiryByBusinessList()
</script>
