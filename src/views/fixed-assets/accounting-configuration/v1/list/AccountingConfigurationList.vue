<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerPropsList.title"
      :breadcrumbs="headerPropsList.breadcrumbs"
      :btn-label="'Crear'"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="$router.push({ name: 'AccountingConfigurationCreate' })"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClearFilters"
          @update:values="handleUpdateFilters"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['actions']"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #actions="{ row }">
            <Button
              tooltip="Editar"
              flat
              :outline="false"
              :left-icon="defaultIconsLucide.edit"
              @click="handleEdit(row.id)"
            />
            <Button
              tooltip="Eliminar"
              flat
              :outline="false"
              :left-icon="defaultIconsLucide.trash"
              @click="handleDeleteModal(row.id, row.can_be_deleted_by_time)"
            />
            <Button
              tooltip="Ver"
              flat
              :outline="false"
              :left-icon="defaultIconsLucide.eye"
              @click="handleView(row.id)"
            />
          </template>
        </TableList>

        <AlertModalComponent
          ref="alertModalRef"
          styleModal="min-width: 470px"
          :title="alertModalConfig.description"
          :textBtnConfirm="alertModalConfig.textBtnConfirm"
          :textBtnCancel="alertModalConfig.textBtnCancel"
          :showBtnCancel="alertModalConfig.showBtnCancel"
          @confirm="handleConfirmDelete"
        >
        </AlertModalComponent>
      </section>
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
// components
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// logic-view
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import useAccountingConfigurationList from '@/views/fixed-assets/accounting-configuration/v1/list/AccountingConfigurationList'

const {
  defaultIconsLucide,
  alertModalRef,
  alertModalConfig,

  headerPropsList,
  tableProps,
  filterConfig,

  handleDeleteModal,
  handleConfirmDelete,
  handleView,
  handleEdit,
  handleFilter,
  handleClearFilters,
  handleUpdateFilters,

  updatePage,
  updateRowsPerPage,
} = useAccountingConfigurationList()
</script>
