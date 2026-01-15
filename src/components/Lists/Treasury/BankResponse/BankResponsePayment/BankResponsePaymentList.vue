<template>
  <section>
    <span class="text-subtitle1 text-weight-bold">
      Listado de Pagos de grupo de dispersión
    </span>

    <section class="q-mt-md">
      <FiltersComponent
        :fields="filterConfig"
        @filter="handleFilter"
        @clear-filters="handleFilterClear"
      />
    </section>

    <TableList
      ref="tableRef"
      :loading="tableProps.loading"
      :columns="tableProps.columns"
      :rows="tableProps.rows"
      :pages="tableProps.pages"
      :custom-columns="[
        'actions',
        'movement_status',
        'bank_response_status',
        'check_reject',
        'check_apply',
        'check_debit',
      ]"
      :canDisableSelection="true"
      selection="multiple"
      :selectionFilter="customSelectionFilter"
      :disableSelection="isSelectionDisabled"
      @update-page="updatePage"
      @update-rows-per-page="updatePerPage"
      @update:selected="onUpdateSelected"
    >
      <template #custom-header>
        <div
          class="q-mt-sm q-mb-sm full-width flex justify-between items-center"
        >
          <span class="text-subtitle1 text-weight-bold">
            {{ tableProps.title }}
          </span>

          <div class="flex items-center q-gutter-x-md">
            <Button
              :outline="false"
              :label="'Asignar'"
              :class-custom="'items-center'"
              color-icon="white"
              :left-icon="defaultIconsLucide.plusCircle"
              :style-content="{ 'align-items': 'center' }"
              :disable="
                processTypeSelected === 'Archivo' || selectedRows?.length === 0
              "
              @click="handleShowModalBankResponseAssign(true)"
            />
          </div>
        </div>
      </template>

      <template #movement_status="{ row }">
        <ShowStatus :type="Number(row?.movement_status?.id ?? 0)" />
      </template>

      <template #bank_response_status="{ row }">
        <ShowStatus :type="Number(row?.bank_response_status?.id ?? 0)" />
      </template>

      <template #check_reject="{ row }">
        <RadioYesNo
          :model-value="row.bank_response_status?.id === 10 || false"
          :isRadioButton="false"
          :hasTitle="false"
          :hasSubtitle="false"
          titleRadioTrue=""
          titleRadioFalse=""
          :disabled="true"
        />
      </template>

      <template #check_apply="{ row }">
        <RadioYesNo
          :model-value="row.bank_response_status?.id === 102 || false"
          :isRadioButton="false"
          :hasTitle="false"
          :hasSubtitle="false"
          titleRadioTrue=""
          titleRadioFalse=""
          :disabled="true"
        />
      </template>

      <template #check_debit="{ row }">
        <RadioYesNo
          :model-value="row.bank_response_status?.id === 103 || false"
          :isRadioButton="false"
          :hasTitle="false"
          :hasSubtitle="false"
          titleRadioTrue=""
          titleRadioFalse=""
          :disabled="true"
        />
      </template>

      <template #actions="{ row }">
        <Button
          :left-icon="defaultIconsLucide.eye"
          color="primary"
          class-custom="custom"
          :outline="false"
          :flat="true"
          color-icon="#f45100"
          tooltip="Ver"
          @click="handleShowModalBankResponseDescription(row.id, true)"
        />
      </template>
    </TableList>

    <ModalComponent
      title="Opciones de respuesta"
      classTitle="text-h6 text-weight-bold q-pa-sm"
      :openDialog="showModalBankResponseAssign"
      :minWidth="$q.screen.width <= 607 ? '100%' : '40%'"
      @update:openDialog="handleShowModalBankResponseAssign()"
    >
      <template #content-modal>
        <BankResponseAssignForm
          v-if="showModalBankResponseAssign"
          @close:modal="handleShowModalBankResponseAssign()"
          @update:table-status="onUpdateTableStatus()"
        />
      </template>
    </ModalComponent>

    <ModalComponent
      title="Descripción"
      classTitle="text-h6 text-weight-bold q-pa-sm"
      :openDialog="showModalBankResponseDescription"
      :minWidth="$q.screen.width <= 607 ? '100%' : '70%'"
      @update:openDialog="handleShowModalBankResponseDescription()"
    >
      <template #content-modal>
        <BankResponseDescriptionForm
          v-if="showModalBankResponseDescription"
          @close:modal="handleShowModalBankResponseDescription()"
        />
      </template>
    </ModalComponent>
  </section>
</template>

<script setup lang="ts">
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import Button from '@/components/common/Button/Button.vue'
import ModalComponent from '@/components/common/Modal/ModalComponent.vue'
import BankResponseAssignForm from '@/components/Forms/Treasury/BankResponse/BankResponseAssign/BankResponseAssignForm.vue'
import BankResponseDescriptionForm from '@/components/Forms/Treasury/BankResponse/BankResponseDescription/BankResponseDescriptionForm.vue'

import useBankResponsePaymentList from './BankResponsePaymentList'

withDefaults(defineProps<{ processTypeSelected: string }>(), {
  processTypeSelected: 'Archivo',
})

const {
  defaultIconsLucide,
  filterConfig,
  tableProps,
  showModalBankResponseAssign,
  showModalBankResponseDescription,
  selectedRows,
  tableRef,
  isSelectionDisabled,
  handleFilter,
  handleFilterClear,
  updatePage,
  updatePerPage,
  handleShowModalBankResponseAssign,
  handleShowModalBankResponseDescription,
  onSearchPaymentList,
  onUpdateSelected,
  onUpdateTableStatus,
  customSelectionFilter,
} = useBankResponsePaymentList()

defineExpose({
  onSearchPaymentList,
})
</script>
