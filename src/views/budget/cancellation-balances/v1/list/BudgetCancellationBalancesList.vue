<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
    >
      <FiltersComponentV2
        ref="filtersRef"
        :fields="filterFields"
        @clear-filters="handleClear"
        @filter="handleFilterSearch"
        @update:values="onFilterChange"
      />
      <section class="q-mt-xl">
        <TableList
          ref="tableRef"
          :title="tableProperties.title"
          :loading="tableProperties.loading"
          :columns="tableProperties.columns"
          :rows="tableProperties.rows"
          :pages="tableProperties.pages"
          :custom-columns="['actions']"
          selection="multiple"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
          @selected="(val) => (selectedRows = val.selected)"
        >
          <template #actions="{ row }">
            <Button
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Asignar"
              :disabled="
                !selectedRows.some((selected) => selected.id === row.id)
              "
              @click="handleAssignCancellationBalancesModal(row)"
            />
          </template>
        </TableList>
        <AlertModalComponent
          ref="alertModalRef"
          styleModal="min-width: 480px"
          :title="alertModalConfig.title"
          @confirm="changeStatusAction"
        ></AlertModalComponent>
        <AlertModalComponent
          ref="validityModalRef"
          styleModal="min-width: 480px"
          title="La vigencia corresponde a una vigencia pasada. ¿Desea continuar?"
          text-btn-confirm="Cancelar"
          text-btn-cancel="Aceptar"
          @confirm="resetValidity"
        ></AlertModalComponent>
        <AssignCancellationBalancesModal
          ref="assignCancellationBalancesModalRef"
          v-if="configAssignCancellationBalancesModal.isOpen"
          :openDialog="configAssignCancellationBalancesModal.isOpen"
          :data="configAssignCancellationBalancesModal.data"
          @update:openDialog="
            (val: boolean) => (configAssignCancellationBalancesModal.isOpen = val)
          "
          @update:success="fetchListAfterUpdate()"
        />
      </section>
      <section class="mx-1 mb-2">
        <div class="row justify-end q-gutter-md">
          <Button
            :outline="false"
            color="orange"
            label="Confirmar"
            class="btn-filter custom"
            :disabled="isDisabledBulkCancelButton"
            @click="openAlertModal()"
          />
        </div>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import AssignCancellationBalancesModal from '@/components/Forms/Budget/CancellationBalances/Modal/AssignCancellationBalancesModal.vue'

// Logic view
import useCancellationBalancesList from '@/views/budget/cancellation-balances/v1/list/BudgetCancellationBalancesList'

const {
  filtersRef,
  filterFields,
  headerProperties,
  tableProperties,
  tableRef,
  defaultIconsLucide,
  alertModalRef,
  alertModalConfig,
  configAssignCancellationBalancesModal,
  selectedRows,
  isDisabledBulkCancelButton,
  validityModalRef,
  handleAssignCancellationBalancesModal,
  fetchListAfterUpdate,
  handleClear,
  handleFilterSearch,
  updatePage,
  updatePerPage,
  openAlertModal,
  changeStatusAction,
  onFilterChange,
  resetValidity,
} = useCancellationBalancesList()
</script>
