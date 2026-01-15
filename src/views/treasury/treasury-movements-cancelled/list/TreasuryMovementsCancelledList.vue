<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
    >
      <section class="q-mt-md">
        <FiltersComponent
          ref="filterRef"
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
          @update-page="updatePage"
          :custom-columns="['actions']"
          @update-rows-per-page="updatePerPage"
        >
          <template #custom-header-action>
            <Button
              no-caps
              outline
              class-custom="custom"
              label="Descargar excel"
              :disabled="!canDownload"
              color="orange"
              :styleContent="{
                'place-items': 'center',
                color: 'black',
              }"
              :text-color="'orange'"
              :left-img="imgButtonHeaderTable"
              @click="handleDownloadExcel"
            >
              <img
                class="image-excel"
                src="@/assets/images/excel.svg"
                alt="Excel Icon"
              />
              Descargar formato
            </Button>
          </template>

          <template #actions="{ row }">
            <Button
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Ver'"
              @click="goToShowView(row.id)"
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import imgButtonHeaderTable from '@/assets/images/excel.svg'
import useTreasuryMovementsCancelledList from '@/views/treasury/treasury-movements-cancelled/list/TreasuryMovementsCancelledList'

const {
  headerProps,
  tableProps,
  filterConfig,
  filterRef,
  canDownload,
  defaultIconsLucide,
  handleClear,
  handleFilter,
  updatePage,
  updatePerPage,
  handleDownloadExcel,
  goToShowView,
} = useTreasuryMovementsCancelledList()
</script>
