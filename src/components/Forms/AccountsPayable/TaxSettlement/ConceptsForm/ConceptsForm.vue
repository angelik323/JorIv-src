<template>
  <div class="q-pa-md">
    <section class="q-mb-xl">
      <h6 class="q-ma-none q-mb-md">Sección conceptos de pago</h6>
      <TableList
        :loading="false"
        :columns="paymentConceptsColumns"
        :rows="paymentConcepts"
        :custom-columns="['radio_id', 'code', 'name', 'value', 'reteica']"
        hide-pagination
        hide-bottom
      >
        <template #radio_id="{ row }">
          <div class="flex items-center q-gutter-sm">
            <q-radio
              :val="row.id"
              v-model="selectedPaymentConceptId"
              dense
              size="sm"
              color="orange"
              @update:model-value="handleSelectPaymentConcept(row.id)"
            />
            <span>{{ row.id }}</span>
          </div>
        </template>

        <template #code="{ row }">
          {{ row.code || '-' }}
        </template>

        <template #name="{ row }">
          {{ row.name || '-' }}
        </template>

        <template #value="{ row }">
          ${{ formatCurrency(row.value || '0') }}
        </template>

        <template #reteica="{ row }">
          ${{ formatCurrency(row.reteica_total || '0') }}
        </template>
      </TableList>
    </section>

    <q-separator class="q-mb-xl" />

    <section>
      <div class="row justify-between items-center q-mb-md">
        <h6 class="q-ma-none">Liquidación reteica</h6>
        <Button
          label="Agregar"
          :left-icon="defaultIconsLucide.plusCircle"
          color="primary"
          color-icon="white"
          :outline="false"
          @click="handleAddRetentionRow"
        />
      </div>
      <TableList
        :loading="false"
        :columns="retentionColumns"
        :rows="retentionRows"
        :custom-columns="[
          'index',
          'city',
          'base',
          'concept_reteica',
          'percentage_reteica',
          'retention_value',
          'actions',
        ]"
        hide-pagination
        hide-bottom
      >
        <template #index="{ row }">
          {{ row.index || '-' }}
        </template>

        <template #city="{ row }">
          <GenericSelector
            :default_value="row.city_id || ''"
            :manual_option="cities || []"
            placeholder="Seleccione"
            dense
            outlined
            class_name=""
            :hide-bottom-space="true"
            auto_complete
            clearable
            :required="true"
            :rules="[
              (v) => useRules().is_required(v, 'La ciudad es requerida'),
            ]"
            map_options
            @update:modelValue="handleCityChange(row.id, $event)"
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
            :rules="[(v) => useRules().is_required(v, 'La base es requerida')]"
            @update:model-value="
              handleReteicaFieldChange(row.id, 'base', $event.rawValue ?? '')
            "
          />
        </template>

        <template #concept_reteica="{ row }">
          <GenericSelector
            :default_value="row.ica_activity_id || ''"
            :manual_option="ica_economic_activity_concepts || []"
            placeholder="Seleccione"
            dense
            outlined
            class_name=""
            :hide-bottom-space="true"
            auto_complete
            clearable
            :required="true"
            :rules="[
              (v) =>
                useRules().is_required(v, 'El concepto reteica es requerido'),
            ]"
            map_options
            @update:modelValue="handleConceptReteicaChange(row, $event)"
          />
        </template>

        <template #percentage_reteica="{ row }">
          <GenericInput
            :default_value="row.percentage ? String(row.percentage) : ''"
            disable
            dense
            outlined
            class_name=""
            :hide-bottom-space="true"
          />
        </template>

        <template #retention_value="{ row }">
          <InputMoneyComponent
            :model-value="row.retention_value || null"
            placeholder="Inserte"
            class_name=""
            :hide-bottom-space="true"
            required
            :max_decimal_digits="2"
            :rules="[
              (v) =>
                useRules().is_required(v, 'El valor retención es requerido'),
            ]"
            @update:model-value="
              handleRetentionValueChange(row.id, $event.rawValue ?? '')
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
            @click="handleDeleteRetentionRow(row.id)"
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
import { useConceptsForm } from '@/components/Forms/AccountsPayable/TaxSettlement/ConceptsForm/ConceptsForm'

// Props
const props = withDefaults(
  defineProps<{
    settlementId: number
    businessId?: number | null
    onUpdateNetValue?: () => void
  }>(),
  {}
)

// Emits
const emit = defineEmits<{
  onSelectPaymentConcept: [id: number]
  onAddRetentionRow: []
  onDeleteRetentionRow: [id: number | string]
  onCityChange: [
    reteicaId: number | string,
    cityId: number | null,
    accountingStructureId?: number | null
  ]
  onUpdateReteica: [reteicaId: number, base: string, percentage: string]
}>()

// Form logic
const {
  paymentConcepts,
  retentionRows,
  selectedPaymentConceptId,
  cities,
  ica_economic_activity_concepts,
  handleSelectPaymentConcept,
  handleAddRetentionRow,
  handleDeleteRetentionRow,
  handleCityChange,
  handleReteicaFieldChange,
  handleRetentionValueChange,
  handleConceptReteicaChange,
  handleSaveReteicas,
  formatCurrency,
  paymentConceptsColumns,
  retentionColumns,
  defaultIconsLucide,
} = useConceptsForm(
  {
    settlementId: props.settlementId,
    businessId: props.businessId,
  },
  emit
)

defineExpose({
  paymentConcepts,
  retentionRows,
  handleSaveReteicas,
})
</script>
