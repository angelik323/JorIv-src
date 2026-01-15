<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <FiltersComponent
        :fields="filterConfig"
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
          :rows="tableProps.rows"
          :columns="tableProps.columns"
          :pages="tableProps.pages"
          :custom-columns="['actions']"
          @update-page="handleUpdatePage"
          @update-rows-per-page="handleUpdateRowsPerPage"
        >
          <template #custom-header-action>
            <Button
              outline
              class-custom="custom"
              label="Descargar excel"
              color="orange"
              :styleContent="{
                'place-items': 'center',
                color: 'black',
              }"
              :left-img="excelIcon"
              :disable="Object.keys(getFilterFormatValues()).length === 0"
              @click="handleDownloadExcel"
            />
          </template>

          <template #actions="{ row }">
            <Button
              :left-icon="defaultIconsLucide.book"
              colorIcon="#f45100"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              tooltip="Documento asociado"
              @click="goToURL('BudgetTransfersQueryDocument', row.id)"
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
// Assets
import excelIcon from '@/assets/images/excel.svg'
// Logic view
import useBudgetTransferQueryList from '@/views/budget/budget-transfers-query/v1/list/BudgetTransfersQueryList'

const {
  showState,
  tableProps,
  headerProps,
  isTableEmpty,
  filterConfig,
  defaultIconsLucide,
  goToURL,
  handleFilter,
  handleUpdatePage,
  handleClearFilters,
  handleDownloadExcel,
  handleUpdateRowsPerPage,
  getFilterFormatValues,
} = useBudgetTransferQueryList()
</script>
