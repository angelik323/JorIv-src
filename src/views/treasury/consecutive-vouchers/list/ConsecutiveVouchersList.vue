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
          ref="filterRef"
          :fields="filterConfig"
          @filter="handleFilterSearch"
          @clear-filters="handleClearFilters"
          @show-more="handleShowMoreFilters"
          :buttons="['more_filters']"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['status', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #status="{ row }">
            <ShowStatus :type="Number(row?.status.id ?? 0)" />
          </template>

          <template #custom-header-action>
            <Button
              v-if="
                validateRouter('Treasury', 'ConsecutiveVouchersList', 'export')
              "
              class-custom="custom"
              :outline="true"
              label="Descargar excel"
              color="orange"
              :styleContent="{
                'place-items': 'center',
                color: 'black',
              }"
              @click="onDownloadExcel"
              :disable="!tableProps.rows?.length"
              :left-img="imgButtonHeaderTable"
            />
          </template>

          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter('Treasury', 'ConsecutiveVouchersList', 'show')
              "
              :right-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Ver"
              @click="goToURL('ConsecutiveVouchersView', row.id)"
            >
            </Button>
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import imgButtonHeaderTable from '@/assets/images/excel.svg'

// Logic view
import useConsecutiveVouchersList from '@/views/treasury/consecutive-vouchers/list/ConsecutiveVouchersList'

const {
  headerProps,
  tableProps,
  filterConfig,
  filterRef,
  defaultIconsLucide,
  handleFilterSearch,
  updatePage,
  handleClearFilters,
  onDownloadExcel,
  handleShowMoreFilters,
  updateRowsPerPage,
  goToURL,
  validateRouter,
} = useConsecutiveVouchersList()
</script>
