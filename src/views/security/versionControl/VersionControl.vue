<script setup lang="ts">
// Components:
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'

// Logic
import { useVersionControlView } from '@/views/security/versionControl/VersionControl'
import TableList from '@/components/table-list/TableList.vue'

const { headerProperties, tableProperties,disableXlsxBtn, updatePage, exportXlsx, updateRowsPerPage } =
  useVersionControlView()
</script>
<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
    >
      <template #addAfter>
        <q-btn
          no-caps
          outline
          unelevated
          class="btn__table-excel"
          size="100%"
          :disable="disableXlsxBtn"
          @click="exportXlsx"
        >
          <img
            class="image__excel-btn q-mr-sm"
            src="@/assets/images/excel.svg"
            alt="Excel Icon"
          />
          Descargar excel
        </q-btn>
      </template>
      <TableList
        :loading="tableProperties.loading"
        :rows="tableProperties.rows"
        :columns="tableProperties.columns"
        :pages="tableProperties.pages"
        :custom-columns="['status', 'actions']"
        @update-page="updatePage"
        @update-rows-per-page="updateRowsPerPage"
      />
    </ContentComponent>
  </div>
</template>
