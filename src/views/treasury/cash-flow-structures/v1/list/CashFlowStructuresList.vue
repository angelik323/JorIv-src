<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      :btn-label="validateRouter('Treasury', 'CashFlowStructuresList', 'create') ? headerProperties.btn.label : undefined"
      :btn-icon="headerProperties.btn.icon"
      @to="handlerGoTo('CashFlowStructuresCreate')"
    >
      <FiltersComponentV2
        :fields="filterConfig"
        :trigger_event_by_field="true"
        @filter="handleFilterSearch"
        @clear-filters="handleClearFilters"
      />
      <div class="q-pt-md q-my-xl">
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
          <template #actions="{ row }">
            <!-- Editar -->
            <Button
              v-if="row.id && validateRouter('Treasury', 'CashFlowStructuresList', 'edit')"
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Editar"
              @click="handleOptions('edit', row.id)"
            />
            <!-- Inactivar -->
            <Button
              v-if="row.id && validateRouter('Treasury', 'CashFlowStructuresList', 'delete')"
              :left-icon="defaultIconsLucide.trash"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Eliminar"
              @click="handleOptions('delete', row.id)"
            />
          </template>
        </TableList>
      </div>
      <AlertModalComponent
        ref="alertModalRef"
        styleModal="min-width: 470px"
        :showImgDefault="false"
        :title="alertModalConfig.description"
        :description_message="''"
        @confirm="changeStatus()"
      >
        <template #default-img>
          <q-img
            src="@/assets/images/icons/alert_popup_delete.svg"
            max-width="80px"
            width="80px"
            fit="contain"
          />
        </template>
      </AlertModalComponent>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import useCashFlowStructuresList from './CashFlowStructuresList'
import { defaultIconsLucide } from '@/utils'

const {
  headerProperties,
  tableProperties,
  alertModalRef,
  alertModalConfig,
  filterConfig,
  handleOptions,
  changeStatus,
  handleFilterSearch,
  handleClearFilters,
  handlerGoTo,
  updatePage,
  updateRowsPerPage,
  validateRouter
} = useCashFlowStructuresList()
</script>
