<template>
  <div class="q-pa-md">
    <div class="row justify-between items-center q-mb-md">
      <h6 class="q-ma-none">Sección contabilidad</h6>
      <Button
        label="Vista previa"
        :left-icon="defaultIconsLucide.eye"
        color="orange"
        colorIcon="white"
        :outline="false"
        @click="handlePreviewClick"
      />
    </div>
    <TableList
      :loading="false"
      :columns="accountingColumns"
      :rows="accountingRows"
      :custom-columns="[
        'expense_account',
        'expense_cost_center',
        'liability_account',
        'liability_cost_center',
      ]"
      hide-pagination
      hide-bottom
    >
      <template #expense_account="{ row }">
        <GenericSelector
          :default_value="row.expense_account_id"
          :manual_option="accounts_chart || []"
          :required="false"
          :rules="[]"
          placeholder="Seleccione"
          dense
          outlined
          map_options
          @update:modelValue="
            (value) => handleFieldUpdate(row, 'expense_account_id', value)
          "
        />
      </template>

      <template #expense_cost_center="{ row }">
        <GenericSelector
          :default_value="row.expense_cost_center_id"
          :manual_option="
            cost_center_structures_by_business_and_account_structure || []
          "
          :required="false"
          :rules="[]"
          placeholder="Seleccione"
          dense
          outlined
          map_options
          @update:modelValue="
            (value) => handleFieldUpdate(row, 'expense_cost_center_id', value)
          "
        />
      </template>

      <template #liability_account="{ row }">
        <GenericSelector
          :default_value="row.liability_account_id"
          :manual_option="cost_center_codes_by_structure || []"
          :required="false"
          :rules="[]"
          placeholder="Seleccione"
          dense
          outlined
          map_options
          @update:modelValue="
            (value) => handleFieldUpdate(row, 'liability_account_id', value)
          "
        />
      </template>

      <template #liability_cost_center="{ row }">
        <GenericSelector
          :default_value="row.liability_cost_center_id"
          :manual_option="cost_center_active || []"
          :required="false"
          :rules="[]"
          placeholder="Seleccione"
          dense
          outlined
          map_options
          @update:modelValue="
            (value) => handleFieldUpdate(row, 'liability_cost_center_id', value)
          "
        />
      </template>
    </TableList>

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
  </div>
</template>

<script setup lang="ts">
// Components
import Button from '@/components/common/Button/Button.vue'
import GenericSelector from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Modal from '@/components/common/Modal/ModalComponent.vue'

// composable
import { useUtils } from '@/composables'
import { useAccountingForm } from '@/components/Forms/AccountsPayable/TaxSettlement/AccountingForm/AccountingForm'

// Props
const props = withDefaults(
  defineProps<{
    settlementId: number
  }>(),
  {}
)

// Form logic
const { defaultIconsLucide } = useUtils()
const {
  accountingRows,
  accounts_chart,
  cost_center_structures_by_business_and_account_structure,
  cost_center_active,
  handleFieldUpdate,
  handleUpdateAccounting,
  handlePreview,
  handleClosePreview,
  accountingColumns,
  cost_center_codes_by_structure,
  previewModalVisible,
  previewData,
  previewColumns,
} = useAccountingForm({
  settlementId: props.settlementId,
})

const { formatCurrencyString } = useUtils()

const handlePreviewClick = async () => {
  await handlePreview()
}

defineExpose({
  accountingRows,
  handleUpdateAccounting,
})
</script>
