<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerBreadcrumbs.title"
      :breadcrumbs="headerBreadcrumbs.breadcrumbs"
      :btn-label="headerBreadcrumbs.btn.label"
      :btn-icon="headerBreadcrumbs.btn.icon"
      @to="handleGoToCreate"
      show-back-btn
      @on-back="handleGoToBack"
    >
      <FiltersV2
        @filter="handlerSearch"
        :fields="filterConfig"
        @clear-filters="handlerClear"
      />

      <NoDataState type="empty" v-if="tableProps.rows.length === 0" />

      <section class="q-mt-xl" v-else>
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['actions']"
          @update-page="updatePage"
          @update-rows-per-page="updateRows"
        >
          <template #actions="{ row }">
            <Button
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Ver"
              @click="goToURL('BulkUploadTemplatesView', row.id)"
            />
            <Button
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Editar"
              @click="handleGoToEdit(row.id)"
            />
            <Button
              v-if="row.id"
              :left-icon="defaultIconsLucide.download"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Descargar'"
              @click="onDdownloadExcel(row.id)"
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>
<script lang="ts" setup>
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic view
import BulkUploadTemplatesList from '@/views/fics/bulk-upload-templates/v1/list/BulkUploadTemplatesList'

const {
  goToURL,
  updateRows,
  tableProps,
  updatePage,
  filterConfig,
  handlerClear,
  handlerSearch,
  handleGoToBack,
  handleGoToEdit,
  onDdownloadExcel,
  handleGoToCreate,
  headerBreadcrumbs,
  defaultIconsLucide,
} = BulkUploadTemplatesList()
</script>
