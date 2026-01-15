<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="handleGoTo"
    >
      <section class="q-mt-md">
        <FiltersComponent
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClear"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :loading="businessTableProps.loading"
          :columns="businessTableProps.columns"
          :rows="businessTableProps.rows"
          :pages="businessTableProps.pages"
          :custom-columns="['actions']"
          selection="multiple"
          v-model:selected="selected"
        />
      </section>
      <div class="row justify-end q-gutter-md">
        <Button
          :outline="false"
          :class-custom="'custom'"
          label="Eliminar"
          size="md"
          color="orange"
          :disabled="disableDeleteButton()"
          @click="handleDeleteItem"
        />
      </div>
    </ContentComponent>

    <AlertModalComponent
      ref="alertModalRef"
      :title="alertModalConfig.title"
      :description_message="alertModalConfig.description_message"
      :showBtnConfirm="true"
      :textBtnConfirm="'Eliminar'"
      :textBtnCancel="'Cerrar'"
      :showCloseBtn="true"
      :showImgDefault="true"
      @confirm="handleDestroy"
    />
  </div>
</template>

<script setup lang="ts">
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import { defaultIconsLucide } from '@/utils'
import useReportingLimitsForChangesInEquityDelete from './ReportingLimitsChangesEquityDelete'

const {
  headerProps,
  filterConfig,
  alertModalConfig,
  alertModalRef,
  selected,
  businessTableProps,
  handleDeleteItem,
  disableDeleteButton,
  handleClear,
  handleFilter,
  handleGoTo,
  handleDestroy,
} = useReportingLimitsForChangesInEquityDelete()
</script>
