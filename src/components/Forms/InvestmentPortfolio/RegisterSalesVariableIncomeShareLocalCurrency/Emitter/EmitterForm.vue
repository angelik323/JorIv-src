<template>
  <q-form role="form" ref="emitterFormRef" aria-label="Formulario de emisor">
    <section aria-label="Sección de formulario de emisor">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.issuers_counterparty_id"
            label="ID Emisor"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.issuersCounterparties"
            :rules="[
              (val: string) => useRules().is_required(val, 'El ID del emisor es requerido'),
            ]"
            @update:model-value="formData.issuers_counterparty_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.issuers_counterparty_description"
            label="Descripción emisor"
            placeholder="-"
            type="text"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.action_class"
            label="Clase acción"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.actionClass"
            :rules="[
              (val: string) => useRules().is_required(val, 'La clase de acción es requerida'),
            ]"
            @update:model-value="formData.action_class = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.issuers_counterparty_seller_id"
            label="ID Comprador"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.issuers"
            :rules="[
              (val: string) => useRules().is_required(val, 'El ID del comprador es requerido'),
            ]"
            @update:model-value="
              formData.issuers_counterparty_seller_id = $event
            "
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.issuers_counterparty_seller_description"
            label="Descripción comprador"
            placeholder="-"
            type="text"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.issuers_counterparty_commissioner_id"
            label="ID comisionista"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.issuersCounterparties"
            :rules="[
              (val: string) => useRules().is_required(val, 'El ID del comisionista es requerido'),
            ]"
            @update:model-value="
              formData.issuers_counterparty_commissioner_id = $event
            "
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="
              formData.issuers_counterparty_commissioner_description
            "
            label="Descripción comisionista"
            placeholder="-"
            type="text"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-3" v-if="hasCommission">
          <div class="text-grey-8 text-body2 text-weight-medium q-mb-md">
            Base comisión
            <RadioYesNo
              v-model="formData.commission_base"
              :options="[
                { label: 'Porcentaje %', value: true },
                { label: 'Valor fijo', value: false },
              ]"
            />
          </div>
        </div>

        <div class="col-12 col-md-3" v-if="hasCommission">
          <GenericInputComponent
            :default_value="formData.percentage_or_fixed_value"
            label="Porcentaje o Valor fijo"
            placeholder="Inserte"
            type="text"
            :rules="[
(val: string) =>
  val === '' || val === null || useRules().only_number_greater_than_zero_with_decimal(val) === true
    ? true
    : 'Ingrese un número válido',
              (val: string) => (val === '' || Number(val) >= 0) || 'El valor no puede ser negativo',
            ]"
            @update:model-value="
              formData.percentage_or_fixed_value =
                $event === '' || $event === null ? null : Number($event)
            "
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.unit_or_share"
            label="ID unidad/acción"
            placeholder="Inserte"
            type="text"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El ID de la unidad/acción es requerido'),
              (val: string) => useRules().max_length(val, 20),
              (val: string) => useRules().only_letters(val),
            ]"
            @update:model-value="formData.unit_or_share = $event"
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
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import { useRules } from '@/composables'
import useEmitterForm from './EmitterForm'

const { formData, resetForm, selectOptions, emitterFormRef, hasCommission } =
  useEmitterForm()

defineExpose({
  resetForm,
  getValues: () => formData.value,
  validateForm: () => emitterFormRef.value?.validate(),
})
</script>
