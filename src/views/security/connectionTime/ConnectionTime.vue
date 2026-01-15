<script setup lang="ts">
// Components:
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'

// Logic
import { useConnectionTimeView } from '@/views/security/connectionTime/ConnectionTime'

const {
  showTable,
  tableProperties,
  headerProperties,
  disableXlsxBtn,
  updateRows,
  handleSearch,
  handleClear,
  exportXlsx,
  updatePage,
} = useConnectionTimeView()
</script>
<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
    >
      <section class="q-mt-md q-mb-xl">
        <FiltersComponent @filter="handleSearch" @clear-filters="handleClear" />
      </section>

      <TableList
        v-if="showTable"
        :title="tableProperties.title"
        :loading="tableProperties.loading"
        :rows="tableProperties.rows"
        :columns="tableProperties.columns"
        :pages="tableProperties.pages"
        :custom-columns="['status', 'index', 'actions']"
        @update-page="updatePage"
        @update-rows-per-page="updateRows"
      >
        <template #custom-header-action>
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

        <template #index="{ index }">
          {{ index + 1 }}
        </template>
      </TableList>
    </ContentComponent>
  </div>
</template>
