<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerConfig.title"
      :breadcrumbs="headerConfig.breadcrumbs"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          ref="filtersRef"
          :fields="filtersConfig"
          @update:values="handleFiltersUpdate"
          @filter="handleFilterSearch"
          @clear-filters="handleClearFilters"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="detailsTableProps.title"
          :loading="detailsTableProps.loading"
          :columns="detailsTableProps.columns"
          :rows="detailsTableProps.rows"
          :pages="detailsTableProps.pages"
          @update-page="handleUpdatePage"
          @update-rows-per-page="handleUpdateRowsPerPage"
        ></TableList>
      </section>

      <section class="row justify-end items-center q-gutter-x-md">
        <Button
          outline
          no-caps
          label="Errores en la anulación"
          size="md"
          class-custom="custom"
          :disabled="isDisabledErrorLogsButton"
          @click="handleDownloadErrorLogs"
        />

        <Button
          label="Anular"
          size="md"
          class-custom="custom"
          color="orange"
          :outline="false"
          :disabled="isDisabledCancelButton"
          @click="handleCancelDocument"
        />
      </section>
    </ContentComponent>

    <AlertModalComponent
      ref="futureValidityModalRef"
      title="La vigencia ingresada corresponde a una vigencia futura, no se puede continuar"
      :show-btn-cancel="false"
      @confirm="futureValidityModalRef?.closeModal()"
    />

    <AlertModalComponent
      ref="pastValidityModalRef"
      title="La vigencia ingresada corresponde a una vigencia pasada, ¿Desea continuar?"
      @confirm="handlePastValidityModalConfirm"
    />

    <AlertModalComponent
      ref="documentStatusModalRef"
      title="El documento se encuentra en estado Anulado o Rechazado. No es posible anular"
      :show-btn-cancel="false"
      @confirm="handleDocumentStatusModalConfirm"
    />

    <AlertModalComponent
      ref="documentMovementsModalRef"
      title="El documento tiene documentos asociados o movimientos. No es posible anular"
      :show-btn-cancel="false"
      @confirm="handleDocumentMovementsModalConfirm"
    />

    <AlertModalComponent
      ref="documentDerivativeContractingModalRef"
      title="El documento está asociado a un contrato. Se debe realizar la anulación por el módulo de contratos"
      :show-btn-cancel="false"
      @confirm="handleDocumentDerivativeContractingModalConfirm"
    />

    <AlertModalComponent
      ref="documentAccountingVoucherModalRef"
      title="El documento tiene asociado un comprobante contable, al anular el documento se anulará el comprobante. ¿Desea continuar?"
      @confirm="handleDocumentAccountingVoucherConfirm"
    />

    <AlertModalComponent
      ref="documentAccountingVoucherFormModalRef"
      @confirm="handleDocumentAccountingVoucherFormConfirm"
    >
      <template #default-body>
        <q-form ref="accountingVoucherFormRef">
          <section class="q-px-lg q-pt-md q-gutter-y-sm">
            <div>
              <GenericDateInputComponent
                label="Fecha de anulación"
                required
                mask="YYYY-MM-DD"
                placeholder="YYYY-MM-DD"
                :default_value="accountingVoucherFormModels.cancellation_date"
                :rules="[(v: string) => is_required(v)]"
                @update:model-value="
                  accountingVoucherFormModels.cancellation_date = $event
                "
              />
            </div>

            <div>
              <GenericDateInputComponent
                label="Periodo"
                required
                mask="YYYY-MM"
                placeholder="YYYY-MM"
                :default_value="accountingVoucherFormModels.period"
                :rules="[(v: string) => is_required(v)]"
                @update:model-value="
                  accountingVoucherFormModels.period = $event
                "
              />
            </div>
          </section>
        </q-form>
      </template>
    </AlertModalComponent>

    <AlertModalComponent
      ref="documentCancellationConfirmModalRef"
      title="¿Desea anular el documento?"
      @confirm="handleDocumentCancellationConfirm"
      @close="handleDocumentCancellationCancel"
    />
  </div>
</template>

<script setup lang="ts">
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import TableList from '@/components/table-list/TableList.vue'

import useBudgetDocumentCancellationList from '@/views/budget/budget-document-cancellation/v1/list/BudgetDocumentCancellationList'

const {
  is_required,

  headerConfig,
  filtersRef,
  filtersConfig,
  detailsTableProps,
  isDisabledErrorLogsButton,
  isDisabledCancelButton,
  accountingVoucherFormRef,
  accountingVoucherFormModels,
  futureValidityModalRef,
  pastValidityModalRef,
  documentStatusModalRef,
  documentMovementsModalRef,
  documentDerivativeContractingModalRef,
  documentAccountingVoucherModalRef,
  documentAccountingVoucherFormModalRef,
  documentCancellationConfirmModalRef,

  // Fucntions/Methods
  handleFiltersUpdate,
  handleClearFilters,
  handleFilterSearch,
  handleUpdatePage,
  handleUpdateRowsPerPage,
  handlePastValidityModalConfirm,
  handleCancelDocument,
  handleDownloadErrorLogs,
  handleDocumentStatusModalConfirm,
  handleDocumentMovementsModalConfirm,
  handleDocumentDerivativeContractingModalConfirm,
  handleDocumentAccountingVoucherConfirm,
  handleDocumentAccountingVoucherFormConfirm,
  handleDocumentCancellationCancel,
  handleDocumentCancellationConfirm,
} = useBudgetDocumentCancellationList()
</script>
