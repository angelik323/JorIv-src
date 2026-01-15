<template>
  <q-form role="form" ref="emitterFormRef" aria-label="Formulario de emisor">
    <section aria-label="Sección de formulario de emisor">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.emitter_id"
            label="ID Emisor"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.issuersCounterparties"
            :rules="[
              (val: string) => useRules().is_required(val, 'El ID del emisor es requerido'),
            ]"
            @update:modelValue="formData.emitter_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="dynamicFields.emitter_description"
            label="Descripción"
            placeholder="-"
            type="text"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.class_action"
            label="Clase acción"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.actionClass"
            :rules="[
              (val: string) => useRules().is_required(val, 'La clase de acción es requerida'),
            ]"
            @update:modelValue="formData.class_action = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.unit_actions"
            label="ID unidad/acción"
            placeholder="Inserte"
            type="text"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El ID de la unidad/acción es requerido'),
              (val: string) => useRules().max_length(val, 20),
            ]"
            @update:model-value="formData.unit_actions = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.buyer_id"
            label="ID comprador"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.issuers"
            :rules="[
              (val: string) => useRules().is_required(val, 'El ID del comprador es requerido'),
            ]"
            @update:modelValue="formData.buyer_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="dynamicFields.buyer_description"
            label="Descripción comprador"
            placeholder="-"
            type="text"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.commissioner_id"
            label="ID comisionista"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.issuersCounterparties"
            :rules="[
              (val: string) => useRules().is_required(val, 'El ID del comisionista es requerido'),
            ]"
            @update:modelValue="formData.commissioner_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="dynamicFields.commissioner_description"
            label="Descripción comisionista"
            placeholder="-"
            type="text"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-3" v-if="getBasicData.commission ?? false">
          <p class="q-mb-none mt-1 text-weight-medium q-ml-md">
            Base comisión*
          </p>
          <div>
            <q-option-group
              v-model="formData.commission_base"
              :options="optionsBaseCommission"
              color="orange"
              inline
              dense
              required
            />
          </div>
        </div>

        <div class="col-12 col-md-3" v-if="getBasicData.commission ?? false">
          <GenericInputComponent
            :default_value="formData.commission_value"
            label="Porcentaje o valor fijo"
            placeholder="Inserte"
            type="text"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El porcentaje o valor fijo es requerido'),
              (val: string) => useRules().max_integer_decimal(val,15, 2),
            ]"
            @update:model-value="formData.commission_value = $event"
          />
        </div>
      </div>

      <q-separator class="q-my-lg" />
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'

import { useRules } from '@/composables'

import useEmitterForm from './EmitterForm'

const {
  formData,
  resetForm,
  selectOptions,
  emitterFormRef,
  dynamicFields,
  getBasicData,
  optionsBaseCommission,
} = useEmitterForm()

defineExpose({
  resetForm,
  getValues: () => formData.value,
  validateForm: () => emitterFormRef.value?.validate(),
})
</script>
