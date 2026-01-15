<template>
  <q-form ref="formRecordType" class="q-px-lg">
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
          <GenericInput
            label="Orden"
            required
            :default_value="models.order"
            :rules="[
              (v: string) => useRules().is_required(v, 'El campo orden es requerido'), 
              (v: number) => useRules().max_length(v.toString(), 1),
              (v) => useRules().only_number(v)
            ]"
            @update:model-value="models.order = $event"
          />
        </div>
        <div class="col-12 col-md-6">
          <GenericInput
            label="Nombre de tipo de registro"
            required
            :default_value="models.name"
            :rules="[(v: string) => useRules().is_required(v, 'El campo nombre de tipo de registro es requerido'), (v: string) => useRules().max_length(v, 50)]"
            @update:model-value="models.name = $event"
          />
        </div>
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Tipo de registro"
            :manual_option="registerType"
            map_options
            :default_value="models.record_type_id"
            :clearable="false"
            :auto_complete="false"
            required
            :rules="[(val: string) => useRules().is_required(val, 'El tipo de registro es requerido')]"
            @update:model-value="models.record_type_id = $event"
          />
        </div>
        <div class="col-12 col-md-6">
          <GenericInput
            label="Longitud"
            required
            :default_value="models.length"
            :rules="[
              (v: string) => useRules().is_required(v, 'El campo longitud es requerido'),
              (v: string) => useRules().max_length(v, 3),
              (v: string) => useRules().only_number(v)
            ]"
            @update:model-value="models.length = $event"
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
import useRecordTypeForm from './RecordTypeForm'
import { useRules } from '@/composables'
import { WriteActionType } from '@/interfaces/global'

const { models, formRecordType, registerType } = useRecordTypeForm(props)

defineExpose({
  validateForm: () => formRecordType.value?.validate() ?? false,
})
</script>
