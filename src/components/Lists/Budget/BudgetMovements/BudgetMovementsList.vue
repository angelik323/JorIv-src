<template>
  <section class="q-my-md">
    <FiltersComponent
      @filter="handleFilter"
      :fields="filterConfig"
      @clear-filters="clearFilters"
    />
    <div class="q-ma-md no-bottom-mx">
      <TableList
        :title="selected_budget_level_id !== null ? tableProps.title : ''"
        :loading="tableProps.loading"
        :columns="tableProps.rows.length ? tableProps.columns : []"
        :rows="tableProps.rows"
        :pages="tableProps.pages"
        :custom-columns="['increase', 'decrease', 'actions']"
        @update-page="updatePage"
        @update-rows-per-page="updatePerPage"
        :custom-no-data-message-title="tableProps.no_data_title"
        :custom-no-data-message-subtitle="tableProps.no_data_subtitle"
      >
        <template #custom-header-action>
          <div class="q-gutter-sm">
            <Button
              v-if="validateRouter('Budget', 'BudgetLevelsList', 'create')"
              :outline="false"
              label="Agregar"
              left-icon="PlusCircle"
              color-icon="white"
              :styleContent="{
                'place-items': 'center',
                'border-radius': '20px',
                'font-size': '13px',
              }"
              @click="openFormModal('create')"
            />
            <Button
              v-if="validateRouter('Budget', 'BudgetLevelsList', 'export')"
              outline
              class="text-capitalize btn-filter custom"
              color="orange"
              :left-img="excelIcon"
              label="Descargar excel"
              @click="downloadBudgetMovements"
              tooltip="Descargar excel"
            />
          </div>
        </template>

        <template #increase="{ row }">
          <RadioYesNo
            :model-value="[1, '1', true, 'true'].includes(row.increase_balance)"
            :hasTitle="false"
            :hasSubtitle="false"
            :isDisabled="true"
            :is-radio-button="false"
          />
        </template>
        <template #decrease="{ row }">
          <RadioYesNo
            :model-value="[1, '1', true, 'true'].includes(row.decrease_balance)"
            :hasTitle="false"
            :hasSubtitle="false"
            :isDisabled="true"
            :is-radio-button="false"
          />
        </template>
        <template #actions="{ row }">
          <Button
            v-if="validateRouter('Budget', 'BudgetLevelsList', 'edit')"
            :left-icon="defaultIconsLucide.edit"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            tooltip="Editar"
            @click="openFormModal('edit', row)"
          />

          <Button
            v-if="validateRouter('Budget', 'BudgetLevelsList', 'delete')"
            :left-icon="defaultIconsLucide.trash"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            tooltip="Eliminar"
            @click="openDeleteModal(row.id)"
          />
        </template>
      </TableList>
    </div>
  </section>

  <AlertModalComponent
    ref="formModalRef"
    @confirm="handleSubmitForm"
    :style-modal="'min-width: 90dvw'"
    :showImgDefault="false"
    marginTopBody="mt-0"
    marginTopActions="mt-0"
    :showBtnConfirm="false"
    :showBtnCancel="false"
  >
    <template #default-body>
      <BudgetMovementsForm
        ref="modalFormRef"
        :title="
          modalAction === 'edit'
            ? 'Editar códigos de movimiento por nivel'
            : 'Agregar códigos de movimiento por nivel'
        "
        :action="modalAction"
        :edit-data="modalAction === 'edit' ? selectedRow : null"
        :selected-budget-level-id="selected_budget_level_id"
        @cancel="handleModalClose"
      />
    </template>
  </AlertModalComponent>

  <AlertModalComponent
    ref="deleteModalRef"
    @confirm="confirmDelete"
    :textBtnConfirm="'Aceptar'"
    title="¿Desea eliminar el código de movimiento por nivel?"
    :show-img-default="false"
  >
    <template #default-img
      ><q-img
        src="@/assets/images/icons/alert_popup_delete.svg"
        max-width="80px"
        width="80px"
        fit="contain"
    /></template>
  </AlertModalComponent>
</template>

<script setup lang="ts">
import Button from '@/components/common/Button/Button.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import useBudgetMovementsList from '@/components/Lists/Budget/BudgetMovements/BudgetMovementsList'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import BudgetMovementsForm from '@/components/Forms/Budget/BudgetMovements/InformationForm.vue'
import excelIcon from '@/assets/images/excel.svg'

const {
  tableProps,
  filterConfig,
  selected_budget_level_id,
  formModalRef,
  deleteModalRef,
  modalFormRef,
  modalAction,
  selectedRow,
  defaultIconsLucide,
  updatePage,
  updatePerPage,
  openDeleteModal,
  handleFilter,
  clearFilters,
  confirmDelete,
  downloadBudgetMovements,
  openFormModal,
  handleModalClose,
  handleSubmitForm,
  validateRouter,
} = useBudgetMovementsList()
</script>

<style
  lang="scss"
  scoped
  src="@/components/Lists/Budget/BudgetMovements/BudgetMovementsList.scss"
></style>
