<template>
  <q-form ref="formRecordColumns" class="q-px-lg">
    <section>
      <div
        class="row q-col-gutter-x-lg q-col-gutter-y-sm"
        v-if="action.includes('edit')"
      >
        <div class="col-12">
          <GenericInput
            label="Código"
            required
            :default_value="models.code"
            :rules="[(v: string) => useRules().is_required(v, 'El campo código es requerido')]"
            readonly
          />
        </div>
      </div>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Campo variable"
            :manual_option="variables"
            map_options
            :default_value="models.variable_field_id"
            :clearable="false"
            auto_complete
            required
            :should_slice_options="false"
            :rules="[(val: string) => useRules().is_required(val, 'El campo variable es requerido')]"
            @update:model-value="handleChangeVariableField"
          />
        </div>
        <div class="col-12 col-md-6">
          <GenericInput
            label="Dimensión"
            :required="isFixedPositionOnFileType"
            :disabled="!isFixedPositionOnFileType"
            :default_value="models.dimension"
            :rules="[
              (v: string) => useRules().is_required(v, 'El campo dimensión es requerido'),
              (v: string) => useRules().max_length(v, 2),
              (v: string) => useRules().only_number(v)
            ]"
            @update:model-value="models.dimension = $event"
          />
        </div>
        <div class="col-12">
          <GenericInput
            label="Nombre de campo cubre en la estructura"
            type="text"
            required
            :default_value="models.structure_field_name"
            :rules="[(v: string) => useRules().is_required(v, 'El campo nombre de campo cubre en la estructura es requerido'), (v: string) => useRules().max_length(v, 60)]"
            @update:model-value="models.structure_field_name = $event"
          />
        </div>
        <div class="col-12 col-md-6">
          <GenericInput
            label="Posición inicial"
            required
            :default_value="models.start_position"
            :rules="[
              (v: string) => useRules().is_required(v, 'El campo posición inicial es requerido'),
              (v: string) => useRules().max_length(v, 3),
              (v: string) => useRules().only_number(v)
              ]"
            @update:model-value="models.start_position = $event"
          />
        </div>
        <div class="col-12 col-md-6">
          <GenericInput
            label="Posición final"
            type="number"
            :required="isFixedPositionOnFileType"
            disabled
            :default_value="models.end_position"
            placeholder="-"
            :rules="[(v: string) => useRules().is_required(v, 'El campo posición final es requerido'), (v: number) => useRules().max_length(v.toString(), 3)]"
            @update:model-value="models.end_position = $event"
          />
        </div>
        <div class="col-12 col-md-6">
          <GenericInput
            label="Tipo de dato"
            required
            :default_value="
              variables.find((v) => v.value === models.variable_field_id)
                ?.data_type || ''
            "
            :rules="[(v: string) => useRules().is_required(v, 'El campo tipo de dato es requerido')]"
            disabled
            @update:model-value="models.data_type = $event"
          />
        </div>
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Justificado"
            :manual_option="justification"
            map_options
            :default_value="models.justified_id"
            :clearable="false"
            :auto_complete="false"
            :required="isFixedPositionOnFileType"
            :disabled="!isFixedPositionOnFileType"
            :rules="[(val: string) => useRules().is_required(val, 'El campo justificado es requerido')]"
            @update:model-value="models.justified_id = $event"
          />
        </div>
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Máscara"
            :manual_option="mask"
            map_options
            :default_value="models.mask_id"
            :clearable="false"
            :auto_complete="false"
            :required="!disabledMask"
            :rules="[
              (val: string) =>
                !disabledMask
                  ? useRules().is_required(val, 'El campo máscara es requerido')
                  : true,
            ]"
            @update:model-value="models.mask_id = $event"
            :disabled="disabledMask"
          />
        </div>
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Constante"
            :manual_option="constant"
            :map_options="true"
            :default_value="models.constant"
            :clearable="false"
            :auto_complete="false"
            :required="false"
            :rules="[]"
            @update:model-value="models.constant = $event"
            :disabled="disabledConstant"
          />
        </div>
        <div class="col-12 col-md-6">
          <GenericInput
            type="text"
            label="Valor"
            :required="false"
            :default_value="models.value"
            placeholder="Inserte"
            :rules="[ (v: string) => useRules().only_alphanumeric(v),
            (v: string) => useRules().max_length(v, Number(valueLength))
            ]"
            @update:model-value="models.value = $event"
            :disabled="disabledValueAndFillerCharacter"
          />
        </div>
        <div class="col-12 col-md-6">
          <GenericInput
            label="Carácter de relleno"
            :required="isFixedPositionOnFileType"
            :disabled="
              !isFixedPositionOnFileType || disabledValueAndFillerCharacter
            "
            :default_value="models.filler_character"
            placeholder="S o N"
            :rules="[(v: string) => useRules().is_required(v, 'El campo carácter de relleno es requerido'), (v: string) => useRules().max_length(v, 1), (v: string) => /^[SN]$/.test(v) || 'El carácter de relleno debe ser S o N']"
            @update:model-value="models.filler_character = $event"
          />
        </div>
      </div>
    </section>
  </q-form>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    action: WriteActionType
    id: number | null
  }>(),
  {}
)
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import useRecordColumnsForm from './RecordColumnsForm'
import { useRules } from '@/composables'
import { WriteActionType } from '@/interfaces/global'

const {
  models,
  formRecordColumns,
  variables,
  valueLength,
  mask,
  constant,
  justification,
  isFixedPositionOnFileType,
  disabledMask,
  disabledConstant,
  disabledValueAndFillerCharacter,
  handleChangeVariableField,
} = useRecordColumnsForm(props)

defineExpose({
  validateForm: () => formRecordColumns.value?.validate() ?? false,
})
</script>
