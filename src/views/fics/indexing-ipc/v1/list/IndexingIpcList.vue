<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="headerProps.btn.label"
      :btn-icon="headerProps.btn.icon"
      @to="goToURL('IndexingIpcCreate')"
    >
      <FiltersComponent
        @filter="handleFilter"
        :fields="filterConfig"
        @clear-filters="onCleanData()"
      />

      <NoDataState
        v-if="isTableEmpty"
        :type="showState === 0 ? 'empty' : 'no-results'"
      />

      <section v-else class="q-pt-md q-my-xl">
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
              v-if="validateRouter('Fics', 'IndexingIpcList', 'show')"
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              tooltip="ver"
              @click="goToURL('IndexingIpcRead', row.id_fund)"
            />

            <Button
              :left-icon="defaultIconsLucide.download"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              tooltip="Descargar"
              @click="onDownload(row.id, row.fund)"
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic view
import useIndexingIpcList from '@/views/fics/indexing-ipc/v1/list/IndexingIpcList'

const {
  goToURL,
  showState,
  updatePage,
  tableProps,
  onDownload,
  headerProps,
  onCleanData,
  filterConfig,
  handleFilter,
  isTableEmpty,
  updatePerPage,
  validateRouter,
  defaultIconsLucide,
} = useIndexingIpcList()
</script>
