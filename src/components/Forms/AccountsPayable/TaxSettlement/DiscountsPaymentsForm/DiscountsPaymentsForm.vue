<template>
  <div class="q-pa-md">
    <section class="q-mb-xl">
      <h6 class="q-ma-none q-mb-md">Sección descuentos/pagos</h6>
      <TableList
        :loading="false"
        :columns="discountPaymentColumns"
        :rows="discountPaymentRows"
        :custom-columns="[
          'radio',
          'id',
          'type',
          'fiscal_charge',
          'concept',
          'base',
          'percentage',
          'value',
        ]"
        hide-pagination
        hide-bottom
      >
        <template #radio="{ row }">
          <div class="flex justify-center">
            <q-radio
              :val="row.id"
              :model-value="
                selectedDiscountPaymentId === row.id ? row.id : null
              "
              @update:model-value="handleSelectDiscountPayment(row.id)"
              dense
              size="sm"
              color="orange"
            />
          </div>
        </template>

        <template #id="{ row }">
          {{ row.id }}
        </template>

        <template #type="{ row }">
          {{ row.type || '-' }}
        </template>

        <template #fiscal_charge="{ row }">
          {{ row.fiscal_charge || '-' }}
        </template>

        <template #concept="{ row }">
          {{ row.concept || '-' }}
        </template>

        <template #base="{ row }">
          ${{ formatCurrency(row.base || '0') }}
        </template>

        <template #percentage="{ row }">
          {{ row.percentage || '-' }}
        </template>

        <template #value="{ row }">
          ${{ formatCurrency(row.value || '0') }}
        </template>
      </TableList>
    </section>

    <section class="q-mt-xl">
      <div class="row justify-end q-mt-md q-pa-md">
        <div class="text-weight-medium">
          Valor neto: ${{ formatCurrency(netValue || '0') }}
        </div>
      </div>
      <div class="row justify-between items-center q-mb-md">
        <h6 class="q-ma-none q-mb-md">Descuentos</h6>
        <Button
          label="Agregar"
          :left-icon="defaultIconsLucide.plusCircle"
          color="primary"
          color-icon="white"
          :outline="false"
          @click="handleAddDiscountRow"
        />
      </div>
      <TableList
        :loading="false"
        :columns="discountColumns"
        :rows="discountRows"
        :custom-columns="[
          'index',
          'type',
          'concept',
          'fiscal_charge',
          'base',
          'percentage',
          'value',
          'actions',
        ]"
        hide-pagination
        hide-bottom
      >
        <template #index="{ row }">
          {{ row.index || '-' }}
        </template>

        <template #type="{ row }">
          <GenericSelector
            :default_value="row.type || ''"
            :manual_option="discountPaymentTypes || []"
            placeholder="Seleccione"
            dense
            outlined
            class_name=""
            :hide-bottom-space="true"
            auto_complete
            clearable
            :required="true"
            :rules="[(v) => useRules().is_required(v, 'El tipo es requerido')]"
            map_options
            @update:modelValue="handleTypeChange(row, $event)"
          />
        </template>

        <template #concept="{ row }">
          <GenericSelector
            :default_value="row.settlement_concept_id || ''"
            :manual_option="settlement_concepts_by_structure_and_type || []"
            placeholder="Seleccione"
            dense
            outlined
            class_name=""
            :hide-bottom-space="true"
            auto_complete
            clearable
            :required="true"
            :rules="[
              (v) => useRules().is_required(v, 'El concepto es requerido'),
            ]"
            map_options
            :disable="!row.type"
            @update:modelValue="handleConceptChange(row, $event)"
          />
        </template>

        <template #fiscal_charge="{ row }">
          <GenericInput
            :default_value="row.fiscal_charge_id ? 'Cargo fiscal' : '-'"
            disable
            dense
            outlined
            class_name=""
            :hide-bottom-space="true"
          />
        </template>

        <template #base="{ row }">
          <InputMoneyComponent
            :model-value="row.base || null"
            placeholder="Inserte"
            class_name=""
            :hide-bottom-space="true"
            required
            :max_decimal_digits="2"
            :rules="[
              (v) => useRules().is_required(v, 'La base es requerida'),
              (v) => {
                if (!v) return true
                const num = parseFloat(v)
                const max = parseFloat(netValue || '0')
                if (num > max) return 'La base no puede ser mayor al valor neto'
                return true
              },
            ]"
            @update:model-value="
              handleUpdateBase(
                row,
                $event.rawValue ?? '',
                parseFloat(netValue || '0')
              )
            "
          />
        </template>

        <template #percentage="{ row }">
          <GenericInput
            :default_value="row.percentage || ''"
            placeholder="Inserte"
            dense
            outlined
            class_name=""
            :hide-bottom-space="true"
            required
            :rules="[
              (v) => useRules().is_required(v, 'El porcentaje es requerido'),
              (v) => {
                if (!v) return true
                if (!/^\d+(\.\d{1,2})?$/.test(v))
                  return 'Debe ser un número válido con máximo 2 decimales'
                const parts = v.split('.')
                if (parts[0].length > 3) return 'Máximo 3 dígitos enteros'
                if (parseFloat(v) > 100)
                  return 'El porcentaje no puede ser mayor a 100'
                return true
              },
            ]"
            @update:modelValue="handleUpdatePercentage(row, $event)"
          />
        </template>

        <template #value="{ row }">
          <InputMoneyComponent
            :model-value="row.value || null"
            placeholder="Inserte"
            class_name=""
            :hide-bottom-space="true"
            required
            :max_decimal_digits="2"
            :rules="[(v) => useRules().is_required(v, 'El valor es requerido')]"
            @update:model-value="handleValueChange(row, $event.rawValue ?? '')"
          />
        </template>

        <template #actions="{ row }">
          <Button
            :left-icon="defaultIconsLucide.trash"
            color="red"
            :outline="false"
            :flat="true"
            tooltip="Eliminar"
            @click="handleDeleteDiscountRow(row.id)"
          />
        </template>
      </TableList>
    </section>
  </div>
</template>

<script setup lang="ts">
// Components
import Button from '@/components/common/Button/Button.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelector from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import InputMoneyComponent from '@/components/InputMoney/InputMoneyComponent.vue'
import TableList from '@/components/table-list/TableList.vue'

// Logic
import { useRules } from '@/composables'
import { useDiscountsPaymentsForm } from '@/components/Forms/AccountsPayable/TaxSettlement/DiscountsPaymentsForm/DiscountsPaymentsForm'

// Props
const props = withDefaults(
  defineProps<{
    settlementId: number
    businessId?: number | null
    netValue?: string
  }>(),
  {}
)

// Emits
const emit = defineEmits<{
  onSelectDiscountPayment: [id: number]
  onAddDiscountRow: []
  onDeleteDiscountRow: [id: number | string]
  onUpdateDiscountEntry: [entryId: number, base: string, percentage: string]
  onTypeChange: [type: string]
  onConceptChange: [conceptId: number, row: unknown]
  onShowAlert: [{ message: string; type: string }]
}>()

// Form logic
const {
  discountPaymentRows,
  discountRows,
  formatCurrency,
  selectedDiscountPaymentId,
  discountPaymentTypes,
  netValue,
  handleSelectDiscountPayment,
  handleAddDiscountRow,
  handleDeleteDiscountRow,
  handleUpdateBase,
  handleUpdatePercentage,
  handleValueChange,
  handleTypeChange,
  handleConceptChange,
  handleSaveDiscountEntries,
  discountPaymentColumns,
  discountColumns,
  defaultIconsLucide,
  settlement_concepts_by_structure_and_type,
} = useDiscountsPaymentsForm(
  {
    settlementId: props.settlementId,
    businessId: props.businessId,
    netValue: props.netValue,
  },
  emit
)

defineExpose({
  discountPaymentRows,
  discountRows,
  handleSaveDiscountEntries,
})
</script>
