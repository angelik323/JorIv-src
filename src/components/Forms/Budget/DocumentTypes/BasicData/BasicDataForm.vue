<template>
  <q-form
    ref="formRef"
    aria-label="Formulario de datos básicos para englobe de títulos"
  >
    <div class="row q-col-gutter-x-lg">
      <div class="col-12 col-md-6">
        <GenericSelectorComponent
          :default_value="models.budget_level_id"
          label="Nivel"
          auto_complete
          map_options
          required
          :manual_option="budget_levels"
          :rules="[
              (val: string) => useRules().is_required(val, 'El nivel es requerido'),
            ]"
          :disabled="['edit'].includes(action) || readonly"
          @update:modelValue="models.budget_level_id = $event"
        />
      </div>
      <div class="col-12 col-md-6">
        <GenericInputComponent
          :default_value="models.code"
          label="Código"
          required
          :disabled="['edit'].includes(action) || readonly"
          :rules="[
              (val: string) => useRules().is_required(val, 'El código es requerido'),
              (val: string) => useRules().max_length(val, 20),
            ]"
          @update:modelValue="models.code = $event"
        />
      </div>
      <div class="col-12 col-md-6">
        <GenericInputComponent
          :default_value="models.description"
          label="Descripción"
          max_length="100"
          required
          :disabled="readonly"
          :rules="[
              (val: string) => useRules().is_required(val, 'La descripción es requerida'),
              (val: string) => useRules().max_length(val, 100),
              (val: string) => useRules().no_special_characters_extended(val),
            ]"
          @update:modelValue="models.description = $event.toUpperCase()"
        />
      </div>
      <div class="col-12 col-md-6">
        <GenericSelectorComponent
          :default_value="models.validity"
          label="Vigencia"
          auto_complete
          map_options
          required
          :manual_option="budget_document_validities"
          :disabled="readonly"
          :rules="[
              (val: string) => useRules().is_required(val, 'La vigencia es requerida'),
            ]"
          @update:modelValue="models.validity = $event"
        />
      </div>
      <div class="col-12 col-md-6">
        <RadioYesNo
          v-model="models.requires_authorization"
          label="Requiere autorización"
          :is-radio-button="false"
          :is-switch="false"
          class-check="text-black-90"
          :is-disabled="readonly"
        />
      </div>
      <div class="col-12 col-md-6">
        <RadioYesNo
          v-model="models.allows_adjustments"
          label="Permite ajustes"
          :is-radio-button="false"
          :is-switch="false"
          class-check="text-black-90"
          :is-disabled="readonly"
        />
      </div>
      <div class="col-12 col-md-6">
        <RadioYesNo
          v-model="models.validity_closure"
          label="Cierre de vigencia"
          :is-radio-button="false"
          :is-switch="false"
          class-check="text-black-90"
          :is-disabled="readonly"
        />
      </div>
      <div class="col-12 col-md-6">
        <RadioYesNo
          v-model="models.creates_new_document"
          label="Constituyen nuevo documento"
          :is-radio-button="false"
          :is-switch="false"
          class-check="text-black-90"
          :is-disabled="readonly"
        />
      </div>
      <div class="col-12 col-md-6">
        <RadioYesNo
          v-model="models.allows_additions"
          label="Aplica adiciones"
          :is-radio-button="false"
          :is-switch="false"
          class-check="text-black-90"
          :is-disabled="readonly"
        />
      </div>
      <div class="col-12 col-md-6">
        <RadioYesNo
          v-model="models.allows_deductions"
          label="Aplica deducciones"
          :is-radio-button="false"
          :is-switch="false"
          class-check="text-black-90"
          :is-disabled="readonly"
        />
      </div>
      <div class="col-12 col-md-6">
        <RadioYesNo
          v-model="models.validates_area"
          label="Valida área"
          :is-radio-button="false"
          :is-switch="false"
          class-check="text-black-90"
          :is-disabled="readonly"
        />
      </div>
      <div class="col-12 col-md-6">
        <RadioYesNo
          v-model="models.requires_city"
          label="Solicita ciudad"
          :is-radio-button="false"
          :is-switch="false"
          class-check="text-black-90"
          :is-disabled="readonly"
        />
      </div>
      <div class="col-12 col-md-6">
        <RadioYesNo
          v-model="models.requires_balance_validation_by_document_type"
          label="Requiere validación de saldos por tipo de documento"
          :is-radio-button="false"
          :is-switch="false"
          class-check="text-black-90"
          :is-disabled="
            readonly ||
            (models.requires_balance_validation_by_document_type &&
              ['edit'].includes(action))
          "
          @update:model-value="
            emits(
              'update:balance_validation',
              models.requires_balance_validation_by_document_type
            )
          "
        />
      </div>
      <div class="col-12 col-md-6">
        <RadioYesNo
          v-model="models.has_expiration_date"
          label="Fecha de expiración"
          :is-radio-button="false"
          :is-switch="false"
          class-check="text-black-90"
          :is-disabled="readonly"
        />
      </div>
      <div class="col-12 col-md-6">
        <GenericSelectorComponent
          :default_value="models.expiration_periodicity"
          label="Periodicidad de expiración"
          auto_complete
          map_options
          required
          display_value="key"
          :manual_option="budget_document_expiration_periodicities"
          :rules="[
              (val: string) => useRules().is_required(val, 'La periodicidad de expiración es requerida'),
            ]"
          :disabled="!models.has_expiration_date || readonly"
          @update:modelValue="models.expiration_periodicity = $event"
        />
      </div>
      <div class="col-12 col-md-6">
        <GenericSelectorComponent
          :default_value="models.numbering_type"
          label="Numeración"
          auto_complete
          map_options
          required
          display_value="key"
          :manual_option="budget_document_numbering_types"
          :rules="[
              (val: string) => useRules().is_required(val, 'La numeración es requerida'),
            ]"
          :disabled="['edit'].includes(action) || readonly"
          @update:modelValue="models.numbering_type = $event"
        />
      </div>
    </div>
  </q-form>
</template>

<script lang="ts" setup>
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

// Composables
import { useRules } from '@/composables'

// Interfaces
import { WriteActionType } from '@/interfaces/global'
import { IBugdetDocumentTypeResponse } from '@/interfaces/customs/budget/BudgetDocumentTypes'

// Logic
import useBasicDataForm from '@/components/Forms/Budget/DocumentTypes/BasicData/BasicDataForm'

const props = withDefaults(
  defineProps<{
    action: WriteActionType
    data?: IBugdetDocumentTypeResponse
    readonly?: boolean
  }>(),
  {
    readonly: false,
  }
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:balance_validation', value: boolean): void
}>()

const {
  formRef,
  budget_levels,
  budget_document_validities,
  budget_document_numbering_types,
  budget_document_expiration_periodicities,
  models,
} = useBasicDataForm(props)

defineExpose({
  validateForm: () => formRef.value?.validate(),
  getFormData: () => models.value,
})
</script>
