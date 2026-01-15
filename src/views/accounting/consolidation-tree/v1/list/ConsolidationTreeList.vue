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
      @to="handlerGoTo('ConsolidationTreeCreate')"
    >
      <FiltersComponent
        :fields="filterConfig"
        :trigger_event_by_field="true"
        @filter="handleFilterSearch"
        @clear-filters="handleClearFilters"
      />
      <div class="q-pt-md q-my-xl">
        <TableList
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
              clickable
              @click="handleOptions('toggle_status', row.id, row.status_id)"
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
              @click="handlerGoTo('ConsolidationTreeView', row.id)"
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
              @click="handlerGoTo('ConsolidationTreeEdit', row.id)"
            />
          </template>
        </TableList>
        <AlertModalComponent
          ref="alertModalRef"
          styleModal="min-width: 480px"
          :title="alertModalConfig.title"
          @confirm="toggleConsolidationTreeStatus"
        />
      </div>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import useConsolidationTreeList from './ConsolidationTreeList'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import { defaultIconsLucide } from '@/utils'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import Button from '@/components/common/Button/Button.vue'

const {
  alertModalRef,
  alertModalConfig,
  tableProperties,
  headerProperties,
  filterConfig,
  handlerGoTo,
  handleOptions,
  handleFilterSearch,
  handleClearFilters,
  updatePage,
  updateRowsPerPage,
  toggleConsolidationTreeStatus,
  validateRouter,
} = useConsolidationTreeList()
</script>
