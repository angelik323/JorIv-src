<template>
  <q-form ref="formFormatDefinition" class="q-px-lg">
    <section>
      <div
        class="row q-col-gutter-x-lg q-col-gutter-y-sm"
        v-if="action.includes('edit')"
      >
        <div class="col-12 col-md-6">
          <GenericInput
            label="Código"
            required
            :default_value="models.code"
            :rules="[(v: string) => useRules().is_required(v, 'El campo código es requerido')]"
            readonly
          />
        </div>
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Estado"
            :manual_option="default_statuses"
            map_options
            :default_value="models.status_id"
            :clearable="false"
            :auto_complete="false"
            required
            :rules="[(val: string) => useRules().is_required(val, 'El estado es requerido')]"
            @update:model-value="models.status_id = $event"
          />
        </div>
      </div>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Origen"
            :manual_option="origin"
            map_options
            :default_value="models.origin_id"
            :clearable="false"
            :auto_complete="false"
            required
            :rules="[(val: string) => useRules().is_required(val, 'El origen es requerido')]"
            @update:model-value="models.origin_id = $event"
          />
        </div>
        <div class="col-12 col-md-6">
          <GenericInput
            label="Descripción"
            required
            :default_value="models.description"
            :rules="[(v: string) => useRules().is_required(v, 'El campo descripción es requerido'), (v: string) => useRules().max_length(v, 60)]"
            @update:model-value="models.description = $event"
          />
        </div>
        <div class="col-12">
          <p class="text-weight-medium mb-0 text-grey-6">Tipo de formato*</p>
          <q-radio
            v-for="format_type in formatType"
            v-model="models.format_type_id"
            :val="format_type.value"
            :label="format_type.label"
            color="orange"
          />
        </div>
        <div
          class="col-12"
          v-if="
            models.format_type_id ===
            formatType.find((ft) => ft.label === 'Salida')?.value
          "
        >
          <q-checkbox
            v-model="models.dispersal_group"
            label="Grupo de dispersión"
            color="orange"
          />
          <q-checkbox
            v-model="models.generation_time"
            label="Hora de generación"
            color="orange"
          />
          <q-checkbox v-model="models.date" label="Fecha" color="orange" />
        </div>
        <div
          class="col-12"
          v-if="
            models.format_type_id ===
            formatType.find((ft) => ft.label === 'Entrada')?.value
          "
        >
          <q-separator class="q-my-sm" color="grey-4" />
        </div>
        <div
          class="col-12"
          v-if="
            models.format_type_id ===
            formatType.find((ft) => ft.label === 'Entrada')?.value
          "
        >
          <p class="text-weight-medium mb-0 text-grey-6">Tipo de validación</p>
          <q-radio
            v-for="validation_type in validationType"
            v-model="models.validation_type_id"
            :val="validation_type.value"
            :label="validation_type.label"
            color="orange"
          />
        </div>
        <div class="col-12">
          <q-separator class="q-my-sm" color="grey-4" />
        </div>
        <div
          class="col-12"
          v-if="
            models.format_type_id ===
            formatType.find((ft) => ft.label === 'Salida')?.value
          "
        >
          <GenericInput
            label="Nombre de archivo generado"
            required
            :default_value="models.generated_file_name"
            :rules="[(v: string) => useRules().is_required(v, 'El nombre de archivo generado es requerido'), (v: string) => useRules().max_length(v, 60)]"
            @update:model-value="models.generated_file_name = $event"
          />
        </div>
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Extensión del archivo"
            :manual_option="fileExtension"
            map_options
            :default_value="models.file_extension_id"
            :clearable="false"
            :auto_complete="false"
            required
            :rules="[(val: string) => useRules().is_required(val, 'La extensión del archivo es requerida')]"
            @update:model-value="models.file_extension_id = $event"
          />
        </div>
        <div class="col-12 col-md-6">
          <GenericInput
            label="Ruta"
            required
            :default_value="models.path"
            :rules="[(v: string) => useRules().is_required(v, 'La ruta es requerida'), (v: string) => useRules().max_length(v, 40)]"
            @update:model-value="models.path = $event"
          />
        </div>
        <div class="col-12">
          <q-checkbox
            v-if="
              models.format_type_id ===
              formatType.find((ft) => ft.label === 'Salida')?.value
            "
            v-model="models.applies_to_dispersal"
            label="Aplica para Dispersión"
            color="orange"
          />
          <q-checkbox
            v-model="models.equivalence_validation"
            label="Validación de equivalencias"
            color="orange"
          />
        </div>
        <div class="col-12">
          <q-separator class="q-my-sm" color="grey-4" />
        </div>
        <div class="col-12">
          <GenericInput
            label="Longitud del archivo"
            required
            :default_value="models.file_length"
            :rules="[
              (v: string) => useRules().is_required(v, 'La longitud del archivo es requerida'),
              (v) => useRules().max_length(v, 3),
              (v) => useRules().only_number(v),
            ]"
            @update:model-value="models.file_length = $event"
          />
        </div>
        <div class="col-12">
          <p class="text-weight-medium mb-0 text-grey-6">Tipo de archivo</p>
          <q-radio
            v-for="file_type in fileType"
            v-model="models.file_type_id"
            :val="file_type.value"
            :label="file_type.label"
            color="orange"
          />
        </div>
        <div class="col-12">
          <q-separator class="q-my-sm" color="grey-4" />
        </div>
        <div
          class="col-12 col-md-6"
          v-if="
            models.file_type_id ===
            fileType.find((ft) => ft.label === 'Delimitado')?.value
          "
        >
          <GenericInput
            label="Separador"
            max_length="1"
            required
            :default_value="models.separator"
            :rules="[(v: string) => useRules().is_required(v, 'El separador es requerido'), (v: string) => useRules().max_length(v, 1)]"
            @update:model-value="models.separator = $event"
          />
        </div>
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Máscara de valor"
            :manual_option="valueMask"
            map_options
            :default_value="models.value_mask_id"
            :clearable="false"
            :auto_complete="false"
            required
            :rules="[(val: string) => useRules().is_required(val, 'La máscara de valor es requerida')]"
            @update:model-value="models.value_mask_id = $event"
          />
        </div>
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Máscara numérica"
            :manual_option="numericMask"
            map_options
            :default_value="models.numeric_mask_id"
            :clearable="false"
            :auto_complete="false"
            required
            :rules="[(val: string) => useRules().is_required(val, 'La máscara numérica es requerida')]"
            @update:model-value="models.numeric_mask_id = $event"
          />
        </div>
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Máscara de fechas"
            :manual_option="dateMask"
            map_options
            :default_value="models.date_mask_id"
            :clearable="false"
            :auto_complete="false"
            required
            :rules="[(val: string) => useRules().is_required(val, 'La máscara de fechas es requerida')]"
            @update:model-value="models.date_mask_id = $event"
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
import useFormatDefinitionForm from './FormatDefinitionForm'
import { useRules } from '@/composables'
import { default_statuses } from '@/constants'
import { WriteActionType } from '@/interfaces/global'

const {
  models,
  formFormatDefinition,
  origin,
  formatType,
  validationType,
  fileExtension,
  fileType,
  valueMask,
  numericMask,
  dateMask,
} = useFormatDefinitionForm(props)

defineExpose({
  validateForm: () => formFormatDefinition.value?.validate() ?? false,
})
</script>
