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
          @filter="handleFilterSearch"
          @clear-filters="handleClearFilters"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="tableCustomColumns"
          @update-page="handleUpdatePage"
          @update-rows-per-page="handleUpdateRowsPerPage"
        >
          <template #custom-header-action>
            <Button
              v-if="isEnabledDownloadAction()"
              class-custom="custom"
              color="orange"
              label="Descargar excel"
              outline
              tooltip="Descargar excel"
              :disabled="!isEnableToDownloadFile"
              :leftImg="excelIcon"
              @click="handleDownloadDocument"
            />
          </template>

          <template #status="{ row }: { row: IBudgetDocumentsListItem }">
            <div>
              <ShowStatus :type="row.status.id" status-type="budget" />
            </div>
          </template>

          <template #actions="{ row }: { row: IBudgetDocumentsListItem }">
            <Button
              v-if="isEnabledViewAction()"
              class-custom="custom"
              color="orange"
              colorIcon="#f45100"
              flat
              tooltip="Ver"
              :left-icon="defaultIconsLucide.eye"
              :outline="false"
              @click="handleGoToShowView(row)"
            />

            <Button
              v-if="isEnabledViewAction() && row.has_operation_log"
              class-custom="custom"
              color="orange"
              colorIcon="#f45100"
              flat
              tooltip="Documento asociado"
              :left-icon="defaultIconsLucide.bulletList"
              :outline="false"
              @click="handleAssociatedDocumentClick(row)"
            />

            <Button
              v-if="isEnabledViewAction()"
              class-custom="custom"
              color="orange"
              colorIcon="#f45100"
              flat
              tooltip="Más acciones"
              :dropdown-options="[
                {
                  label: 'Contabilidad',
                  action: async () =>
                    await handleAccountingVoucherActionClick(row),
                  disable: !row.has_accounting,
                },
                {
                  label: 'Orden de pago',
                  action: async () => await handlePaymentOrderActionClick(row),
                  // TODO: enable after CXP HU0020 is available
                  // disable: !row.has_order_payment
                  disable: true,
                },
              ]"
              :left-icon="defaultIconsLucide.moreVertical"
              :outline="false"
            />
          </template>
        </TableList>
      </section>

      <section v-if="selectedDocumentAssociatedDocs" class="q-mt-lg">
        <AssociatedBudgetDocumentsList
          :document-id="selectedDocumentAssociatedDocs.id"
        />
      </section>

      <AlertModalComponent
        ref="accountingVoucherModalRef"
        style-modal="min-width: 80%"
        margin-top-body="q-mt-none"
        :show-img-default="false"
        :show-btn-cancel="false"
        :show-btn-confirm="false"
      >
        <template #default-body>
          <section class="q-mx-xl">
            <AccountingVoucherList
              :document-id="selectedDocumentAccountingVoucher?.id"
            />
          </section>
        </template>
      </AlertModalComponent>

      <AlertModalComponent
        ref="paymentOrderModalRef"
        style-modal="min-width: 80%"
        margin-top-body="q-mt-none"
        :show-img-default="false"
        :show-btn-cancel="false"
        :show-btn-confirm="false"
      >
        <template #default-body>
          <section class="q-mx-xl">
            <PaymentOrderList :document-id="selectedDocumentOrderPayment?.id" />
          </section>
        </template>
      </AlertModalComponent>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import AssociatedBudgetDocumentsList from '@/components/Lists/Budget/BudgetDocuments/v1/list/AssociatedBudgetDocuments/AssociatedBudgetDocumentsList.vue'
import AccountingVoucherList from '@/components/Lists/Budget/BudgetDocuments/v1/list/AccountingVoucher/AccountingVoucherList.vue'
import PaymentOrderList from '@/components/Lists/Budget/BudgetDocuments/v1/list/PaymentOrder/PaymentOrderList.vue'

// Interfaces
import { IBudgetDocumentsListItem } from '@/interfaces/customs/budget/BudgetDocuments'

// Assets
import excelIcon from '@/assets/images/excel.svg'

// Logic
import useBudgetDocumentsList from '@/views/budget/budget-documents/v1/list/BudgetDocumentsList'

const {
  // composable refs and variables
  defaultIconsLucide,

  // Refs and computed props
  headerConfig,
  filtersRef,
  filtersConfig,
  tableProps,
  tableCustomColumns,
  isEnableToDownloadFile,
  selectedDocumentAssociatedDocs,
  selectedDocumentAccountingVoucher,
  selectedDocumentOrderPayment,
  accountingVoucherModalRef,
  paymentOrderModalRef,

  // Functions/Methods
  handleClearFilters,
  handleFilterSearch,
  handleUpdatePage,
  handleUpdateRowsPerPage,
  isEnabledViewAction,
  isEnabledDownloadAction,
  handleDownloadDocument,
  handleAssociatedDocumentClick,
  handleAccountingVoucherActionClick,
  handlePaymentOrderActionClick,
  handleGoToShowView,
} = useBudgetDocumentsList()
</script>
