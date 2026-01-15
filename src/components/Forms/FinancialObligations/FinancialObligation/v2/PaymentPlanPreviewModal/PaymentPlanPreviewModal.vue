<template>
  <ModalComponent
    :open-dialog="isOpen"
    title="Previsualización de plan de pagos"
    min-width="900px"
    :closable="true"
    @update:open-dialog="closeModal"
  >
    <template #content-modal>
      <TableList
        :rows="payment_plan_items"
        :columns="columns"
        row-key="number_quota"
        :loading="false"
        :custom-columns="[
          'id',
          'initial_balance',
          'total_quota',
          'interest_mora',
          'capital',
          'final_balance',
          'status',
        ]"
        :hide-bottom="false"
        :rows-per-page-options="[10, 20, 50, 0]"
        :pagination="{ rowsPerPage: 0 }"
      >
        <template #id="{ row, index }">
          {{ row?.id ?? row?.obligation_id ?? index + 1 }}
        </template>

        <template #initial_balance="{ row }">
          {{ formatCurrency((row.balance ?? 0) + (row.capital ?? 0)) }}
        </template>

        <template #total_quota="{ row }">
          {{
            formatCurrency(
              row.quota ?? (row.capital ?? 0) + (row.interest ?? 0)
            )
          }}
        </template>

        <template #interest_mora="{ row }">
          {{ formatCurrency(row.interest_mora ?? 0) }}
        </template>

        <template #capital="{ row }">
          {{ formatCurrency(row.capital ?? 0) }}
        </template>

        <template #final_balance="{ row }">
          {{ formatCurrency(row.balance ?? 0) }}
        </template>

        <template #status="{ row }">
          {{ row.status ?? 'PENDIENTE' }}
        </template>
      </TableList>

      <div class="row justify-end q-mt-md">
        <Button
          label="Cerrar"
          size="md"
          unelevated
          outline
          color="orange"
          class="text-capitalize btn-filter custom"
          @click="closeModal"
        />
      </div>
    </template>
  </ModalComponent>
</template>

<script setup lang="ts">
// components
import ModalComponent from '@/components/common/Modal/ModalComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// interfaces
import { IPaymentPlanCalculateQuota } from '@/interfaces/customs/financial-obligations/v2/FinancialObligation'

// logic
import usePaymentPlanPreviewModal from '@/components/Forms/FinancialObligations/FinancialObligation/v2/PaymentPlanPreviewModal/PaymentPlanPreviewModal'

defineProps<{
  payment_plan_items: IPaymentPlanCalculateQuota[]
}>()

const { isOpen, columns, formatCurrency, openModal, closeModal } =
  usePaymentPlanPreviewModal()

defineExpose({
  openModal,
  closeModal,
})
</script>
