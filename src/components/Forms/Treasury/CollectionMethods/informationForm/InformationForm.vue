<template>
  <q-form ref="formElementRef" class="q-pa-xl">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">

        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Formas de recaudo"
            :default_value="models.type_receive_id"
            :manual_option="selectOptions.typeReceive"
            map_options
            auto_complete
            required
            :rules="[(val: string) => is_required(val, 'La forma de recaudo es requerida')]"
            @update:modelValue="models.type_receive_id = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericInput
            label="Descripcion"
            :default_value="models.description"
            :disabled="true"
            :rules="[(val: string) => is_required(val, 'La descripción es requerida'),]"
            @update:model-value="models.description = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Tipo comisión"
            :default_value="models.commission_rate"
            :manual_option="selectOptions.commission_rate"
            map_options
            auto_complete
            :required="false"
            :rules="[]"
            @update:modelValue="models.commission_rate = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericInput
            label="Porcentaje comisión"
            :default_value="models.commission_percentage"
            required
            :disabled="models.commission_rate !== '% Comisión'"
            :rules="[
              (val: string) => is_required(val, 'La Porcentaje comisión es requerido'),
              (val: number) => only_number_with_max_integers_and_decimals(`${val}`, 3, 5)
            ]"
            @update:model-value="models.commission_percentage = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericInput
            label="Valor fijo"
            :default_value="models.fixed_value"
            required
            :disabled="models.commission_rate !== 'Valor Fijo'"
            :rules="[
              (val: string) => is_required(val, 'El valor fijo es requerido'),
              (val: number) => only_number_with_max_integers_and_decimals(`${val}`, 2, 5)
            ]"
            @update:model-value="models.fixed_value = $event"
          />
        </div>

        <div class="col-12">
          <GenericInput
            label="Observaciones"
            :default_value="models.observations"
            required
            :rules="[
              (val: string) => is_required(val, 'Las observaciones son requeridas'),
            ]"
            @update:model-value="models.observations = $event"
          />
        </div>

      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'

import { WriteActionType } from '@/interfaces/global'
import { CollectionMethodsForm } from '@/interfaces/customs/treasury/CollectionForms'

import useInformationForm from './InformationForm'

const props = withDefaults(
  defineProps<{
    action: WriteActionType
    data: CollectionMethodsForm | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: CollectionMethodsForm | null): void
}>()

const {
  formElementRef,
  models,
  selectOptions,
  only_number_with_max_integers_and_decimals,
  is_required
} = useInformationForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>