<template>
  <div class="q-mx-xl">
    <ContentComponent
      :breadcrumbs="headerProps.breadcrumbs"
      :title="headerProps.title"
      content-indentation
      indentation
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          ref="filtersRef"
          :buttons="['more_filters']"
          :fields="filterConfig"
          trigger_event_by_field
          @filter="handleFilter"
          @clear-filters="handleClear"
          @show-more="handleShowMoreFilters"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :columns="tableProps.columns"
          :custom-columns="['actions']"
          :loading="tableProps.loading"
          :pages="tableProps.pages"
          :rows="tableProps.rows"
          :title="tableProps.title"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #actions="{ row }">
            <Button
              :class-custom="'custom'"
              :flat="true"
              :outline="false"
              :right-icon="defaultIconsLucide.download"
              color="orange"
              colorIcon="#f45100"
              tooltip="Descargar"
              @click="downloadExcelById(row.id)"
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
//components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
//logic
import useExpenseReceiptList from './ExpenseReceiptList'
import { defaultIconsLucide } from '@/utils'

const {
  headerProps,
  filterConfig,
  tableProps,
  filtersRef,
  handleFilter,
  handleClear,
  handleShowMoreFilters,
  updatePage,
  updatePerPage,
  downloadExcelById,
} = useExpenseReceiptList()
</script>
