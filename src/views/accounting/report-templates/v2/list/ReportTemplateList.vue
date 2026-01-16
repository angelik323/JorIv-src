<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      :btn-label="
        validateRouter('Accounting', 'ReportTemplatesList', 'create')
          ? headerProperties.btn.label
          : undefined
      "
      :btn-icon="headerProperties.btn.icon"
      :btn-class="'custom'"
      @to="goToURL('ReportTemplatesCreate')"
    >
      <template #addBefore>
        <Button
          v-if="validateRouter('Accounting', 'ReportTemplatesList', 'create')"
          :outline="true"
          :label="'Imágenes'"
          :left-icon="defaultIconsLucide.fileOutline"
          :color-icon="'orange'"
          :color="'orange'"
          :class="'custom'"
          @click="goToURL('ReportTemplateImages')"
        />
      </template>
      <FiltersComponent
        show_actions
        :fields="filterConfig"
        @filter="handleFilterSearch"
        @clear-filters="handleClearFilters"
      />
      <div class="q-pt-md">
        <TableList
          :title="tableProperties.title"
          :loading="tableProperties.loading"
          :rows="tableProperties.rows"
          :columns="tableProperties.columns"
          :pages="tableProperties.pages"
          :custom-columns="['status', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #status="{ row }">
            <RadioYesNo
              :model-value="row.status?.id"
              :is-switch="true"
              :is-radio-button="false"
              :class="'absolute'"
              @update:model-value="() => modifyStatus(row.id)"
            />
          </template>

          <template #actions="{ row }">
            <Button
              v-if="validateRouter('Accounting', 'ReportTemplatesList', 'show')"
              :right-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              size=""
              tooltip="Ver"
              @click="goToURL('ReportTemplatesView', { id: row.id })"
            />
            <Button
              v-if="validateRouter('Accounting', 'ReportTemplatesList', 'edit')"
              :right-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Editar"
              @click="goToURL('ReportTemplatesEdit', row.id)"
            />
          </template>
        </TableList>
      </div>
      <AlertModalComponent
        ref="alertModalRef"
        v-model="modalRef"
        :title="alertModalConfig.title"
        :description_message="alertModalConfig.description"
        style-modal="min-width: 400px; flex-direction: row;"
        :showImgDefault="false"
        @close="modalRef = false"
        @confirm="submitDataModify"
      />
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
//Components
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'

//Logic view
import useReportTemplateList from '@/views/accounting/report-templates/v2/list/ReportTemplateList'

const {
  headerProperties,
  modalRef,
  tableProperties,
  defaultIconsLucide,
  filterConfig,
  alertModalConfig,
  goToURL,
  handleFilterSearch,
  handleClearFilters,
  updatePage,
  updateRowsPerPage,
  modifyStatus,
  submitDataModify,
  validateRouter,
} = useReportTemplateList()
</script>
