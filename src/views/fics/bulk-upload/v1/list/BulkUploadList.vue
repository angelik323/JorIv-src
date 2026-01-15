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
    >
      <FiltersV2
        :fields="filterConfig"
        @filter="handlerSearch"
        @clear-filters="handlerClear"
      />

      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['actions', 'status']"
          @update-page="updatePage"
          @update-rows-per-page="updateRows"
          :dense="true"
        >
          <template #custom-header-action>
            <Button
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              label="Plantillas"
              @click="goToURL('BulkUploadTemplatesList')"
            />
          </template>

          <template #status="{ row }">
            <ShowStatus
              :type="Number(row?.status.id)"
              class-custom="q-px-sm q-py-xs"
              statusType="ficsBulkUpload"
            />
          </template>

          <template #actions="{ row }">
            <Button
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Ver"
              @click="handleOptions('view', row.id)"
            />
            <Button
              :left-icon="defaultIconsLucide.checkCircle"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Autorizar"
              @click="handleOptions('authorize', row.id)"
            />
            <Button
              :left-icon="defaultIconsLucide.closeCircle"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Anular'"
              @click="handleOptions('anular', row.id)"
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
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic view
import useBulkUploadList from '@/views/fics/bulk-upload/v1/list/BulkUploadList'

const {
  goToURL,
  updateRows,
  tableProps,
  updatePage,
  filterConfig,
  handlerClear,
  handleOptions,
  handlerSearch,
  handleGoToCreate,
  headerBreadcrumbs,
  defaultIconsLucide,
} = useBulkUploadList()
</script>
