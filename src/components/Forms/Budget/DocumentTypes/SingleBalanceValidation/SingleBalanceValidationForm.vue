<template>
  <q-form
    ref="formRef"
    aria-label="Formulario de datos básicos para englobe de títulos"
  >
    <section class="row q-col-gutter-x-lg">
      <div class="col-12 col-md-6">
        <GenericSelectorComponent
          label="Estructura presupuestal"
          :manual_option="accounting_budget_mapping_parameters"
          map_options
          auto_complete
          required
          :disabled="action === 'edit'"
          :rules="[(val: string) => useRules().is_required(val, '')]"
          :default_value="models.accounting_budget_mapping_parameter_id"
          @update:model-value="selectBudgetStructure($event)"
        />
      </div>
      <div class="col-12 col-md-6">
        <GenericInputComponent
          label="Rubro presupuestal"
          required
          disabled
          :default_value="models.budget_item_structure"
          :rules="[() => true]"
        />
      </div>
      <div class="col-12 col-md-6">
        <GenericInputComponent
          label="Estructura recurso"
          required
          disabled
          :default_value="models.resource_structure"
          :rules="[() => true]"
        />
      </div>
      <div class="col-12 col-md-6">
        <GenericInputComponent
          label="Estructura área"
          required
          disabled
          :default_value="models.area_structure"
          :rules="[() => true]"
        />
      </div>
      <div class="col-12 col-md-6">
        <GenericSelectorComponent
          label="Código de movimiento"
          :manual_option="code_movements"
          map_options
          auto_complete
          required
          :disabled="action === 'edit'"
          :rules="[(val: string) => useRules().is_required(val, '')]"
          :default_value="models.code_movement_id"
          @update:model-value="models.code_movement_id = $event"
        />
      </div>
      <div class="col-12 col-md-6">
        <GenericInputComponent
          label="Descripción código de movimiento"
          :default_value="
            code_movements.find(
              (item) => item.value === models.code_movement_id
            )?.movement_description
          "
          disabled
          :rules="[() => true]"
        />
      </div>
      <div class="col-12 col-md-6">
        <GenericSelectorComponent
          label="Nivel del que valida el saldo"
          :manual_option="budget_levels"
          map_options
          auto_complete
          required
          display_label="level"
          :rules="[(val: string) => useRules().is_required(val, '')]"
          :default_value="models.balance_validation_level_id"
          @update:model-value="models.balance_validation_level_id = $event"
        />
      </div>
      <div class="col-12 col-md-6">
        <GenericInputComponent
          label="Descripción del nivel"
          :default_value="
            budget_levels.find(
              (item) => item.value === models.balance_validation_level_id
            )?.description
          "
          disabled
          :rules="[() => true]"
        />
      </div>
      <div class="col-12 col-md-6">
        <RadioYesNo
          label="Valida tipo de documento*"
          v-model="models.validates_document_type"
          :is-radio-button="false"
          :is-switch="false"
        />
      </div>
      <div class="col-12 col-md-6">
        <GenericSelectorComponent
          label="Tipo de documento del que valida el saldo"
          :manual_option="budget_document_types_selector"
          map_options
          auto_complete
          required
          :disabled="!models.validates_document_type"
          :rules="[(val: string) => useRules().is_required(val, '')]"
          :default_value="models.validated_document_type_id"
          @update:model-value="models.validated_document_type_id = $event"
        />
      </div>
      <div class="col-12 col-md-6">
        <GenericInputComponent
          label="Descripción tipo de documento"
          :default_value="
            budget_document_types_selector.find(
              (item) => item.value === models.validated_document_type_id
            )?.description
          "
          disabled
          :rules="[() => true]"
        />
      </div>
    </section>
  </q-form>
</template>

<script lang="ts" setup>
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

// Interfaces
import { WriteActionType } from '@/interfaces/global'
import { IBalanceValidationItemModel } from '@/interfaces/customs/budget/BudgetDocumentTypes'

// Composables
import { useRules } from '@/composables'

// Logic
import useSingleBalanceValidationForm from '@/components/Forms/Budget/DocumentTypes/SingleBalanceValidation/SingleBalanceValidationForm'

const props = withDefaults(
  defineProps<{
    action: WriteActionType
    data?: IBalanceValidationItemModel
  }>(),
  {}
)

const {
  models,
  formRef,
  budget_levels,
  code_movements,
  budget_document_types_selector,
  accounting_budget_mapping_parameters,
  selectBudgetStructure,
} = useSingleBalanceValidationForm(props)

defineExpose({
  validateForm: () => formRef.value?.validate(),
  getFormData: () => models.value,
})
</script>
