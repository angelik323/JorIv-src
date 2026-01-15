<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <section class="q-mt-md">
        <FiltersComponent
          ref="filter_component_ref"
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClear"
        />
      </section>
      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['actions']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter('Treasury', 'CheckTreasuryReceiptList', 'show')
              "
              :left-icon="useUtils().defaultIconsLucide.eye"
              color-icon="#f45100"
              :class-custom="'custom'"
              :outline="false"
              flat
              tooltip="Ver"
              @click="handleGoToView(row.id)"
            />
          </template>
          <template #custom-header-action>
            <Button
              v-if="
                validateRouter('Treasury', 'CheckTreasuryReceiptList', 'export')
              "
              :outline="true"
              label="Descargar excel"
              :leftImg="excelIcon"
              :disabled="tableProps.rows.length === 0"
              tooltip="Descargar excel"
              @click="downloadAction"
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import excelIcon from '@/assets/images/excel.svg'
import useCheckTreasuryReceiptList from './CheckTreasuryReceiptList'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import { useUtils } from '@/composables'

const {
  headerProps,
  filterConfig,
  tableProps,
  filter_component_ref,
  handleFilter,
  handleClear,
  updatePage,
  updatePerPage,
  handleGoToView,
  downloadAction,
  validateRouter,
} = useCheckTreasuryReceiptList()
</script>
