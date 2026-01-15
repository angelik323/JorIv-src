<template>
  <div class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <h6 class="q-ma-none">Sección contabilidad</h6>
      <Button
        label="Vista previa"
        :left-icon="defaultIconsLucide.eye"
        color="orange"
        colorIcon="white"
        :outline="false"
        @click="handlePreview"
      />
    </div>

    <TableList
      :loading="false"
      :columns="accountingColumns"
      :rows="accountingRows"
      :custom-columns="[
        'type',
        'fiscal_charge',
        'concept',
        'value',
        'expense_account',
        'expense_cost_center',
        'liability_account',
        'liability_cost_center',
      ]"
      hide-pagination
      hide-bottom
    >
      <template #type="{ row }">
        <span>{{ row.type }}</span>
      </template>

      <template #fiscal_charge="{ row }">
        <span>{{ row.fiscal_charge }}</span>
      </template>

      <template #concept="{ row }">
        <span>{{ row.concept }}</span>
      </template>

      <template #value="{ row }">
        <span>{{
          formatCurrencyString(row.value, { showCurrencySymbol: false }) ||
          '0,00'
        }}</span>
      </template>

      <template #expense_account="{ row }">
        <span>{{
          row.expense_account_id
            ? `${row.expense_account_id} - CUENTA GASTOS`
            : '-'
        }}</span>
      </template>

      <template #expense_cost_center="{ row }">
        <span>{{
          row.expense_cost_center_id
            ? `${row.expense_cost_center_id} - CENTRO COSTO`
            : '-'
        }}</span>
      </template>

      <template #liability_account="{ row }">
        <span>{{
          row.liability_account_id
            ? `${row.liability_account_id} - CUENTA PASIVO`
            : '-'
        }}</span>
      </template>

      <template #liability_cost_center="{ row }">
        <span>{{
          row.liability_cost_center_id
            ? `${row.liability_cost_center_id} - CENTRO COSTO`
            : '-'
        }}</span>
      </template>
    </TableList>
  </div>

  <Modal
    title=" "
    :openDialog="previewModalVisible"
    :minWidth="'80%'"
    :closable="true"
    :showImgDefault="true"
    imageSrc="@/assets/images/icons/documents.svg"
    imageWidth="80px"
    @update:openDialog="handleClosePreview"
  >
    <template #default-img>
      <div class="w-100 q-mt-md">
        <div class="row justify-center">
          <div class="text-h5 text-weight-medium text-center">
            Comprobante contable
          </div>
        </div>
      </div>
    </template>
    <template #content-modal>
      <q-table
        :rows="previewData"
        :columns="previewColumns"
        :hide-pagination="true"
        :hide-bottom="true"
        flat
        bordered
      >
        <template #body-cell-debit="{ row }">
          <q-td
            >${{
              formatCurrencyString(row.debit, {
                showCurrencySymbol: false,
              }) || '0,00'
            }}</q-td
          >
        </template>
        <template #body-cell-credit="{ row }">
          <q-td
            >${{
              formatCurrencyString(row.credit, {
                showCurrencySymbol: false,
              }) || '0,00'
            }}</q-td
          >
        </template>
      </q-table>
      <div class="row justify-center q-mt-md">
        <Button
          label="Cancelar"
          color="orange"
          :outline="true"
          @click="handleClosePreview"
        />
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
// Components
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import Modal from '@/components/common/Modal/ModalComponent.vue'

// Logic
import { useAccountingTab } from './AccountingTab'

// Props
const props = defineProps<{
  settlementId: number
}>()

// Form logic
const {
  accountingRows,
  formatCurrencyString,
  handlePreview,
  accountingColumns,
  defaultIconsLucide,
  previewModalVisible,
  previewData,
  previewColumns,
  handleClosePreview,
} = useAccountingTab(props.settlementId)
</script>
