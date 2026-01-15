<template>
  <div class="q-pa-md">
    <div class="row justify-between items-center q-mb-md">
      <h6 class="q-ma-none q-mb-md">Sección liquidación</h6>
      <Button
        label="Agregar"
        :left-icon="defaultIconsLucide.plusCircle"
        color="primary"
        color-icon="white"
        :outline="false"
        @click="handleAddRow"
      />
    </div>
    <TableList
      :loading="false"
      :columns="settlementColumns"
      :rows="settlementRows"
      :custom-columns="[
        'index',
        'type',
        'fiscal_charge',
        'concept',
        'base',
        'percentage',
        'value',
        'new_settlement_value',
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
          :manual_option="settlementConceptTypes || []"
          placeholder="Seleccione"
          dense
          outlined
          class_name=""
          :hide-bottom-space="true"
          auto_complete
          clearable
          map_options
          :required="true"
          :rules="[(v) => useRules().is_required(v, 'El tipo es requerido')]"
          @update:modelValue="updateRowType(row, $event)"
        />
      </template>

      <template #fiscal_charge="{ row }">
        <GenericSelector
          :default_value="row.fiscal_charge_id || ''"
          :manual_option="fiscalCharges || []"
          placeholder="Seleccione"
          dense
          outlined
          class_name=""
          :hide-bottom-space="true"
          auto_complete
          clearable
          map_options
          :required="true"
          :rules="[
            (v) => useRules().is_required(v, 'El cargo fiscal es requerido'),
          ]"
          @update:modelValue="updateRowFiscalCharge(row, $event)"
        />
      </template>

      <template #concept="{ row }">
        <GenericSelector
          :default_value="row.settlement_concept_id || ''"
          :manual_option="settlementConcepts || []"
          placeholder="Seleccione"
          dense
          outlined
          class_name=""
          :hide-bottom-space="true"
          auto_complete
          clearable
          map_options
          :required="true"
          :rules="[
            (v) => useRules().is_required(v, 'El concepto es requerido'),
          ]"
          @update:modelValue="updateRowConcept(row, $event)"
        />
      </template>

      <template #base="{ row }">
        <InputMoneyComponent
          :model-value="row.base || null"
          placeholder="Inserte"
          class_name=""
          :hide-bottom-space="true"
          :disabled="row.type === 'Base'"
          :required="row.type !== 'Base'"
          :max_decimal_digits="2"
          :rules="[
            (v) => {
              if (row.type === 'Base') return true
              return useRules().is_required(v, 'La base es requerida')
            },
            (v) => {
              if (row.type === 'Base' || !v) return true
              return useRules().only_positive_number(v)
            },
          ]"
          @update:model-value="updateRowBase(row, $event.rawValue ?? '')"
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
          :disable="row.type === 'Base'"
          :required="row.type !== 'Base'"
          :rules="[
            (v) => {
              if (row.type === 'Base') return true
              return useRules().is_required(v, 'El porcentaje es requerido')
            },
            (v) => {
              if (row.type === 'Base' || !v) return true
              return useRules().only_number_with_max_integers_and_decimals(v, 3, 2)
            },
            (v) => useRules().percentage_between(v, 0, 100),
          ]"
          @update:modelValue="updateRowPercentage(row, $event)"
        />
      </template>

      <template #value="{ row }">
        <GenericInput
          :default_value="formatNumber(row.value)"
          disabled
          dense
          outlined
          class_name=""
          :hide-bottom-space="true"
        />
      </template>

      <template #new_settlement_value="{ row }">
        <InputMoneyComponent
          :model-value="row.new_liquidation_value || null"
          placeholder="Inserte"
          class_name=""
          :hide-bottom-space="true"
          :max_decimal_digits="2"
          :rules="[(v) => useRules().only_positive_number(v)]"
          @update:model-value="
            updateNewLiquidationValue(row, $event.rawValue ?? '')
          "
        />
      </template>

      <template #actions="{ row }">
        <Button
          :left-icon="defaultIconsLucide.trash"
          color="red"
          :outline="false"
          :flat="true"
          tooltip="Eliminar"
          @click="handleDeleteRow(row.id)"
        />
      </template>
    </TableList>

    <div class="row justify-end q-mt-md q-pa-md">
      <div class="text-weight-medium">
        Valor neto: ${{ formatCurrency(netValue) }}
      </div>
    </div>
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
import { useLiquidationForm } from '@/components/Forms/AccountsPayable/TaxSettlement/LiquidationForm/LiquidationForm'

// Props
const props = withDefaults(
  defineProps<{
    data?: {
      settlementRows?: any[]
      netValue?: string
      settlementConceptTypes?: { label: string; value: string | number }[]
      fiscalCharges?: { label: string; value: string | number }[]
      settlementConcepts?: { label: string; value: string | number }[]
    } | null
  }>(),
  {}
)

// Emits
const emit = defineEmits<{
  onDeleteRow: [id: number | string]
  onUpdateRows: [rows: any[]]
}>()

// Form logic
const {
  settlementRows,
  netValue,
  settlementConceptTypes,
  fiscalCharges,
  settlementConcepts,
  updateRowBase,
  updateRowPercentage,
  updateNewLiquidationValue,
  updateRowType,
  updateRowFiscalCharge,
  updateRowConcept,
  handleAddRow,
  handleDeleteRow,
  formatCurrency,
  formatNumber,
  settlementColumns,
  defaultIconsLucide,
} = useLiquidationForm(props, emit)

// Expose data for parent component
defineExpose({
  settlementRows,
  netValue,
})
</script>
