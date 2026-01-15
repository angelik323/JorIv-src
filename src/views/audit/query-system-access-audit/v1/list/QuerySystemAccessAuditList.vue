<template>
  <div class="q-mx-xl">
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
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          @update-page="handleUpdatePage"
          @update-rows-per-page="handleUpdatePerPage"
        >
          <template #custom-header-action>
            <Button
              outline
              class-custom="custom q-mr-md"
              label="Descargar excel"
              color="orange"
              :left-img="excelIcon"
              :styleContent="{
                'place-items': 'center',
                color: 'black',
              }"
            />

            <Button
              outline
              class-custom="custom"
              label="Descargar PDF"
              color="orange"
              :left-img="pdfIcon"
              :styleContent="{
                'place-items': 'center',
                color: 'black',
              }"
            />
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
import useQuerySystemAccessAuditList from '@/views/audit/query-system-access-audit/v1/list/QuerySystemAccessAuditList'

const {
  showState,
  tableProps,
  headerProps,
  filterConfig,
  isTableEmpty,
  handleFilter,
  handleUpdatePage,
  handleClearFilters,
  handleUpdatePerPage,
} = useQuerySystemAccessAuditList()
</script>
