<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      :btn-label="
        validateRouter('Accounting', 'ConsolidationTreeList', 'create')
          ? headerProperties.btn.label
          : undefined
      "
      :btn-icon="headerProperties.btn.icon"
      @to="goToURL('ConsolidationTreeCreate')"
    >
      <FiltersComponent
        ref="filtersRef"
        :fields="filterConfig"
        :trigger_event_by_field="true"
        @filter="handleFilterSearch"
        @clear-filters="handleClearFilters"
        @update:values="handleUpdateFilterValues"
      />
      <div class="q-pt-md q-my-xl">
        <TableList
          :title="tableProperties.title"
          :loading="tableProperties.loading"
          :rows="tableProperties.rows"
          :columns="tableProperties.columns"
          :pages="tableProperties.pages"
          :custom-columns="['status_id', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #status_id="{ row }">
            <ShowStatus
              v-if="row?.status_id"
              :type="Number(row?.status_id ?? 1)"
            />
            <p v-else>Sin estado</p>
          </template>

          <template #actions="{ row }">
            <!-- Ver -->
            <Button
              v-if="
                validateRouter('Accounting', 'ConsolidationTreeList', 'show') &&
                row.id
              "
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Ver"
              @click="goToURL('ConsolidationTreeView', row.id)"
            />
            <!-- Editar -->
            <Button
              v-if="
                validateRouter('Accounting', 'ConsolidationTreeList', 'edit') &&
                row.id
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Editar"
              @click="goToURL('ConsolidationTreeEdit', row.id)"
            />
          </template>
        </TableList>
      </div>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Composables
import useConsolidationTreeList from '@/views/accounting/consolidation-tree/v2/list/ConsolidationTreeList'

// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import Button from '@/components/common/Button/Button.vue'

const {
  tableProperties,
  headerProperties,
  filterConfig,
  filtersRef,
  defaultIconsLucide,
  goToURL,
  handleFilterSearch,
  handleClearFilters,
  updatePage,
  updateRowsPerPage,
  validateRouter,
  handleUpdateFilterValues,
} = useConsolidationTreeList()
</script>
