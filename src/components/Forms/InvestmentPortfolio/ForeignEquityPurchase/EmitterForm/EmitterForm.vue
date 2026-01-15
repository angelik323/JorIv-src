<template>
  <q-form ref="emitterFormRef" aria-label="Formulario de emisor">
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
            @update:modelValue="formData.issuers_counterparty_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.issuers_counterparty_description"
            label="Descripción"
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
            @update:modelValue="formData.action_class = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.paper_type_id"
            label="Código papel"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.paperType"
            :rules="[
              (val: string) => useRules().is_required(val, 'El código del papel es requerido'),
            ]"
            @update:modelValue="formData.paper_type_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.isin_code_id"
            label="ISIN"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.isin"
            :rules="[
              (val: string) => useRules().is_required(val, 'El ISIN es requerido'),
              (val: string) => useRules().only_alphanumeric(val),
              (val: string) => useRules().max_length(val, 11),
            ]"
            @update:model-value="formData.isin_code_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.nemoten_code_id"
            label="Nemotécnico"
            placeholder="Inserte"
            type="text"
            disabled
            :rules="[
              (val: string) => useRules().is_required(val, 'El nemotécnico es requerido'),
              (val: string) => useRules().only_alphanumeric(val),
            ]"
            @update:model-value="formData.nemoten_code_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.issuers_counterparty_seller_id"
            label="ID vendedor"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.issuers"
            :rules="[
              (val: string) => useRules().is_required(val, 'El ID del vendedor es requerido'),
            ]"
            @update:modelValue="
              formData.issuers_counterparty_seller_id = $event
            "
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.issuers_counterparty_seller_description"
            label="Descripción vendedor"
            placeholder="-"
            type="text"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.issuers_counterparty_administrator_id"
            label="ID administrador"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.administrators"
            :rules="[
              (val: string) => useRules().is_required(val, 'El ID del administrador es requerido'),
            ]"
            @update:modelValue="
              formData.issuers_counterparty_administrator_id = $event
            "
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="
              formData.issuers_counterparty_administrator_description
            "
            label="Descripción administrador"
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
            @update:modelValue="
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

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.currency_id"
            label="Moneda origen"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.currencyForeign"
            :rules="[
              (val: string) => useRules().is_required(val, 'La moneda es requerida'),
            ]"
            @update:modelValue="formData.currency_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.value_currency"
            label="Valor moneda origen"
            placeholder="-"
            type="text"
            disabled
            required
            @update:model-value="formData.value_currency = $event"
          />
        </div>

        <div class="col-12 col-md-3" v-if="formData.has_commission">
          <RadioYesNo
            class="q-mt-none"
            has-title
            v-model="formData.commission_base"
            title="Base comisión*"
            :titleRadioTrue="'%'"
            :titleRadioFalse="'Valor fijo'"
          />
        </div>

        <div class="col-12 col-md-3" v-if="formData.has_commission">
          <GenericInputComponent
            :default_value="formData.percentage_or_fixed_value"
            label="Porcentaje o valor fijo"
            placeholder="Inserte"
            type="text"
            :required="formData.has_commission"
            :rules="[
              (val: string) => !formData.has_commission || useRules().is_required(val, 'El porcentaje o valor fijo es requerido'),
              (val: string) => useRules().max_integer_decimal(val, formData.commission_base ? 3 : 15, 2),
            ]"
            @update:model-value="formData.percentage_or_fixed_value = $event"
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

      <q-separator class="q-mt-md q-mb-lg" />
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

import { useRules } from '@/composables'

import useEmitterForm from './EmitterForm'

const { formData, resetForm, selectOptions, emitterFormRef } = useEmitterForm()

defineExpose({
  resetForm,
  getValues: () => formData.value,
  validateForm: () => emitterFormRef.value?.validate(),
})
</script>
