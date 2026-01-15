<template>
  <q-form
    role="form"
    ref="basicDataFormRef"
    aria-label="Formulario de datos básicos"
  >
    <section aria-label="Sección de formulario de datos básicos">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            :default_value="formData.investment_portfolio_id"
            label="Código portafolio"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.investment_portfolio"
            :rules="[
              (val: string) => useRules().is_required(val, 'El código de portafolio es requerido'),
            ]"
            @update:model-value="formData.investment_portfolio_id = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="formData.investment_portfolio_description"
            label="Descripción"
            placeholder="-"
            type="text"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericDateInputComponent
            :default_value="formData.portfolio_operation_date"
            label="Fecha operación portafolio"
            mask="YYYY-MM-DD"
            placeholder="YYYY-MM-DD"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'La fecha de operación del portafolio es requerida'),
              (val: string) => useRules().valid_format_date(val, 'YYYY-MM-DD'),
            ]"
            disabled
            @update:model-value="formData.portfolio_operation_date = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            :default_value="formData.operation_id"
            label="Código operación"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.operation_type"
            :rules="[
              (val: string) => useRules().is_required(val, 'El código de operación es requerido'),
            ]"
            @update:modelValue="formData.operation_id = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericInputComponent
            :default_value="formData.operation_description"
            label="Descripción operación"
            placeholder="-"
            type="text"
            disabled
            required
          />
        </div>

        <div class="row col-12 items-center justify-between q-px-md">
          <p class="q-mb-none mt-1 text-weight-medium q-ml-md">Comisión*</p>
          <RadioYesNo
            class="q-mt-none"
            v-model="formData.commission"
            :titleRadioTrue="'Sí'"
            :titleRadioFalse="'No'"
          />
        </div>
        <div class="col-12">
          <q-separator class="q-my-lg" />
        </div>
        <div class="row col-12 items-center justify-between q-px-md">
          <p class="q-mb-none mt-1 text-weight-medium q-ml-md">Negociación*</p>
          <div>
            <q-radio
              class="custom-radio"
              v-model="formData.negotiation"
              val="Operación de contado"
              label="Operación contado"
              color="orange"
            />
            <q-radio
              class="custom-radio"
              v-model="formData.negotiation"
              val="Operación Spot"
              label="Operación Spot"
              color="orange"
            />
          </div>
        </div>
        <div class="col-12">
          <q-separator class="q-my-lg" />
        </div>
        <div
          class="col-12 col-md-6"
          v-if="formData.negotiation === 'Operación de contado'"
        >
          <GenericInputComponent
            :default_value="formData.number_days"
            label="Número de días"
            placeholder="Inserte"
            type="number"
            :min_value="1"
            :max_value="5"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El número de días es requerido'),
              (val: string) => useRules().only_number(val),
              (val: string) => useRules().min_value(val, 1),
              (val: string) => useRules().max_value(val, 5),
            ]"
          />
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

import { useRules } from '@/composables'

import useBasicDataForm from './BasicDataForm'

const { formData, resetForm, selectOptions, basicDataFormRef } =
  useBasicDataForm()

defineExpose({
  resetForm,
  getValues: () => formData.value,
  validateForm: () => basicDataFormRef.value?.validate(),
})
</script>
