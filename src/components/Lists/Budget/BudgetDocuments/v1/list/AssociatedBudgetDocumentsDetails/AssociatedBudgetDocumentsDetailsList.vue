<template>
  <TableList
    hide-pagination
    :title="tableProps.title"
    :loading="tableProps.loading"
    :columns="tableProps.columns"
    :rows="tableProps.rows"
    :pages="tableProps.pages"
    :custom-columns="tableCustomColumns"
  >
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
        @click="handleGoToDetailView(row)"
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
            action: async () => await handleAccountingVoucherActionClick(row),
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
</template>

<script setup lang="ts">
// Components
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import AccountingVoucherList from '@/components/Lists/Budget/BudgetDocuments/v1/list/AccountingVoucher/AccountingVoucherList.vue'
import PaymentOrderList from '@/components/Lists/Budget/BudgetDocuments/v1/list/PaymentOrder/PaymentOrderList.vue'

// Interfaces
import { IBudgetDocumentsListItem } from '@/interfaces/customs/budget/BudgetDocuments'

// Logic
import useAssociatedBudgetDocumentsDetailsList from '@/components/Lists/Budget/BudgetDocuments/v1/list/AssociatedBudgetDocumentsDetails/AssociatedBudgetDocumentsDetailsList'
const props = withDefaults(
  defineProps<{
    documentId: number
  }>(),
  {}
)

const {
  // composable refs and variables
  defaultIconsLucide,

  // Refs and computed props
  tableProps,
  tableCustomColumns,
  accountingVoucherModalRef,
  paymentOrderModalRef,
  selectedDocumentAccountingVoucher,
  selectedDocumentOrderPayment,

  // Functions/Methods
  isEnabledViewAction,
  handleGoToDetailView,
  handleAccountingVoucherActionClick,
  handlePaymentOrderActionClick,
} = useAssociatedBudgetDocumentsDetailsList(props)
</script>
