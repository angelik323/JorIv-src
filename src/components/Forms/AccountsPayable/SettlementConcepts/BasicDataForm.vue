<template>
  <q-form ref="basicDataFormRef" class="q-pa-lg">
    <section>
      <!-- Fila 1: Estructura contable + Descripción estructura -->
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Estructura contable"
            :default_value="models.structure_id"
            :manual_option="account_structures"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :disabled="isEdit"
            :rules="[
              (val: string) =>
                is_required(val, 'La estructura contable es requerida'),
            ]"
            @update:model-value="models.structure_id = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericInputComponent
            label="Descripción estructura contable"
            type="text"
            :default_value="structureDescription"
            :required="false"
            :disabled="true"
          />
        </div>
      </div>

      <!-- Fila 2: Concepto + Descripción + Tipo -->
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericInputComponent
            label="Concepto"
            type="text"
            :default_value="models.concept_code"
            :required="true"
            :disabled="isEdit"
            :rules="[
              (val: string) => is_required(val, 'El concepto es requerido'),
              (val: string) => max_length(val, 3),
              (val: string) => only_alphanumeric(val),
            ]"
            @update:model-value="models.concept_code = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            label="Descripción"
            type="text"
            :default_value="models.description"
            :required="true"
            :disabled="false"
            :rules="[
              (val: string) =>
                is_required(val, 'La descripción es requerida'),
              (val: string) => max_length(val, 60),
              (val: string) => only_alphanumeric(val),
            ]"
            @update:model-value="models.description = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Tipo"
            :default_value="models.type"
            :manual_option="settlement_concept_types"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :disabled="isEdit"
            :rules="[(val: string) => is_required(val, 'El tipo es requerido')]"
            @update:model-value="handleTypeChange($event)"
          />
        </div>
      </div>

      <!-- ¿Aplica IVA? - Solo si tipo es "Base" -->
      <div v-if="models.type === 'Base'" class="row mt-1">
        <div class="col-12 flex justify-between">
          <div class="col-auto">
            <p class="q-my-none">¿Aplica IVA?</p>
          </div>
          <div class="col-auto">
            <RadioYesNo
              v-model="models.apply_iva"
              :isRadioButton="true"
              :hasTitle="false"
              :hasSubtitle="false"
            />
          </div>
        </div>
      </div>

      <q-separator v-if="models.type === 'Base'" class="my-1" />

      <!-- Fila 3: Clase + Porcentaje -->
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Clase"
            :default_value="models.class"
            :manual_option="filteredClassOptions"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :disabled="isEdit"
            :rules="[(val: string) => is_required(val, 'La clase es requerida')]"
            @update:model-value="handleClassChange($event)"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericInputComponent
            label="Porcentaje"
            type="text"
            :default_value="models.percentage"
            :required="true"
            :disabled="false"
            :rules="[
              (val: string) => is_required(val, 'El porcentaje es requerido'),
              (val: string) => max_integer_decimal(val, 5, 2),
            ]"
            @update:model-value="models.percentage = $event"
          />
        </div>
      </div>

      <!-- ¿Bases mínimas en UVT? -->
      <div class="row mt-1">
        <div class="col-12 flex justify-between">
          <div class="col-auto self-center">
            <p class="q-my-none">¿Bases mínimas en UVT?</p>
          </div>
          <div class="col-auto">
            <RadioYesNo
              v-model="models.has_minimum_uvt"
              :isRadioButton="true"
              :hasTitle="false"
              :hasSubtitle="false"
              @update:model-value="handleUVTChange($event)"
            />
          </div>
        </div>
      </div>

      <q-separator class="my-1" />

      <!-- Bases mínimas en UVT -->
      <div v-if="models.has_minimum_uvt" class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6">
          <GenericInputComponent
            label="Base mínima retención fuente UVT"
            type="number"
            :default_value="models.min_withholding_uvt"
            :required="true"
            :disabled="false"
            :rules="[
              (val: string) =>
                is_required(val, 'La base mínima retención fuente UVT es requerida'),
              (val: string) => max_length(val, 3),
            ]"
            @update:model-value="models.min_withholding_uvt = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericInputComponent
            label="Base mínima retención de IVA en UVT"
            type="number"
            :default_value="models.min_withholding_iva_uvt"
            :required="true"
            :disabled="false"
            :rules="[
              (val: string) =>
                is_required(val, 'La base mínima retención IVA UVT es requerida'),
              (val: string) => max_length(val, 3),
            ]"
            @update:model-value="models.min_withholding_iva_uvt = $event"
          />
        </div>
      </div>

      <!-- Bases mínimas en Pesos -->
      <div v-if="!models.has_minimum_uvt" class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6">
          <GenericInputComponent
            label="Base mínima retención fuente en pesos"
            type="number"
            :default_value="models.min_withholding_pesos"
            :required="true"
            :disabled="false"
            :rules="[
              (val: string) =>
                is_required(val, 'La base mínima retención fuente en pesos es requerida'),
              (val: string) => max_length(val, 4),
            ]"
            @update:model-value="models.min_withholding_pesos = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericInputComponent
            label="Base mínima retención de IVA en pesos"
            type="number"
            :default_value="models.min_withholding_iva_pesos"
            :required="true"
            :disabled="false"
            :rules="[
              (val: string) =>
                is_required(val, 'La base mínima retención IVA en pesos es requerida'),
              (val: string) => max_length(val, 4),
            ]"
            @update:model-value="models.min_withholding_iva_pesos = $event"
          />
        </div>
      </div>

      <q-separator class="my-1" />

      <!-- Cuenta contable concepto -->
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            :label="isITETax ? 'Cuenta contable concepto' : 'Cuenta contable concepto'"
            :default_value="models.plan_account_id"
            :manual_option="accounts_by_structure"
            :auto_complete="true"
            :required="isITETax"
            :map_options="true"
            :rules="
              isITETax
                ? [
                    (val: string) =>
                      is_required(val, 'La cuenta contable concepto es requerida'),
                  ]
                : []
            "
            @update:model-value="handlePlanAccountChange($event)"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericInputComponent
            label="Descripción cuenta contable concepto"
            type="text"
            :default_value="models.plan_account_label"
            :required="false"
            :disabled="true"
          />
        </div>
      </div>

      <!-- Cuenta contable pasivo -->
      <div v-if="!isITETax" class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Cuenta contable pasivo"
            :default_value="models.liability_account_id"
            :manual_option="accounts_by_structure"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :rules="[
              (val: string) =>
                is_required(val, 'La cuenta contable pasivo es requerida'),
            ]"
            @update:model-value="handleLiabilityAccountChange($event)"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericInputComponent
            label="Descripción cuenta contable pasivo"
            type="text"
            :default_value="models.liability_account_label"
            :required="false"
            :disabled="true"
          />
        </div>
      </div>

      <!-- Cuenta contable gasto -->
      <div v-if="!isITETax" class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Cuenta contable gasto"
            :default_value="models.expense_account_id"
            :manual_option="accounts_by_structure"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :rules="[
              (val: string) =>
                is_required(val, 'La cuenta contable gasto es requerida'),
            ]"
            @update:model-value="handleExpenseAccountChange($event)"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericInputComponent
            label="Descripción cuenta contable gasto"
            type="text"
            :default_value="models.expense_account_label"
            :required="false"
            :disabled="true"
          />
        </div>
      </div>

      <!-- Cargo fiscal + Cuenta notas crédito -->
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Cargo fiscal"
            :default_value="models.fiscal_charge_id"
            :manual_option="fiscal_charges"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :rules="[
              (val: string) =>
                is_required(val, 'El cargo fiscal es requerido'),
            ]"
            @update:model-value="models.fiscal_charge_id = $event"
          />
        </div>

        <div v-if="!isITETax" class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Cuenta contable notas crédito periodos anteriores"
            :default_value="models.credit_notes_account_id"
            :manual_option="accounts_by_structure"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :rules="[
              (val: string) =>
                is_required(
                  val,
                  'La cuenta contable notas crédito es requerida'
                ),
            ]"
            @update:model-value="models.credit_notes_account_id = $event"
          />
        </div>
      </div>

      <!-- Estado (solo en Edit) -->
      <div v-if="isEdit" class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Estado"
            :default_value="models.status_id"
            :manual_option="tree_status"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :rules="[(val: string) => is_required(val, 'El estado es requerido')]"
            @update:model-value="models.status_id = $event"
          />
        </div>
      </div>

      <q-separator class="mt-1" />
    </section>
  </q-form>
</template>

<script setup lang="ts">
// components
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

// interfaces
import { ISettlementConceptsForm } from '@/interfaces/customs/accounts-payable/SettlementConcepts'
import { ActionType } from '@/interfaces/global'

// logic view
import useBasicDataForm from '@/components/Forms/AccountsPayable/SettlementConcepts/BasicDataForm'

const emit = defineEmits(['update:data'])

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: ISettlementConceptsForm | null
  }>(),
  {}
)

const {
  basicDataFormRef,
  models,
  structureDescription,

  // selects
  account_structures,
  accounts_by_structure,
  settlement_concept_types,
  fiscal_charges,
  filteredClassOptions,
  tree_status,

  // refs control
  isEdit,
  isITETax,

  // rules
  is_required,
  max_length,
  only_alphanumeric,
  max_integer_decimal,

  // handlers
  handleTypeChange,
  handleClassChange,
  handleUVTChange,
  handlePlanAccountChange,
  handleLiabilityAccountChange,
  handleExpenseAccountChange,
} = useBasicDataForm(props, emit)

defineExpose({
  validateForm: () => basicDataFormRef.value?.validate(),
})
</script>