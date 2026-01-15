<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <section>
        <FiltersComponentV2
          ref="filtersRef"
          :fields="filters"
          @filter="handleFilter"
          @clear-filters="handleClear"
        />
      </section>
      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :columns="tableProps.columns"
          :custom-columns="['status', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #custom-header-action>
            <Button
              v-if="
                validateRouter('Accounting', 'CheckBalanceCostList', 'export')
              "
              :outline="true"
              label="Descargar excel"
              :leftImg="excelIcon"
              tooltip="Descargar excel"
              @click="downloadExcel"
              :disabled="tableProps.rows.length === 0"
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import excelIcon from '@/assets/images/excel.svg'
import { useCheckBalanceCostList } from './CheckBalanceCostList'

const {
  //value
  headerProps,
  tableProps,
  filters,
  filtersRef,

  //Funciones
  validateRouter,
  downloadExcel,
  handleClear,
  handleFilter,
  updatePage,
  updatePerPage,
} = useCheckBalanceCostList()
</script>
