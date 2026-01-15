<template>
  <q-form ref="informationFormRef" aria-label="Formulario de datos básicos">
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
            :default_value="formData.description_portfolio_name"
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
            @update:model-value="formData.portfolio_operation_date = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            :default_value="formData.operation_type_id"
            label="Código operación"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.operation_type"
            :rules="[
              (val: string) => useRules().is_required(val, 'El código de operación es requerido'),
            ]"
            @update:modelValue="formData.operation_type_id = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericInputComponent
            :default_value="formData.operation_type_description"
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
            v-model="formData.has_commision"
            :titleRadioTrue="'Sí'"
            :titleRadioFalse="'No'"
          />
        </div>

        <div class="col-12">
          <q-separator class="q-my-lg" />
        </div>

        <div class="row col-12 items-center justify-between q-px-md">
          <p class="q-mb-none mt-1 text-weight-medium q-ml-md">Negociación*</p>
          <RadioYesNo
            class="q-mt-none"
            v-model="formData.negotiation"
            :titleRadioTrue="'Operación contado'"
            :titleRadioFalse="'Operación spot'"
          />
        </div>

        <section class="row col-12" v-if="formData.negotiation">
          <div class="col-12">
            <q-separator class="q-my-lg" />
          </div>

          <div class="col-12 col-md-4">
            <GenericInputComponent
              :default_value="formData.number_days"
              label="Número de días"
              placeholder="Inserte"
              type="text"
              required
              :rules="[
              (val: string) => useRules().is_required(val, 'El número de días es requerido'),
              (val: string) => useRules().max_value(val, 5),
              (val: string) => useRules().min_value(val, 1),
              (val: string) => useRules().only_number(val),
            ]"
              @update:model-value="formData.number_days = $event"
            />
          </div>
        </section>
      </div>

      <q-separator
        :class="formData.negotiation ? 'q-mt-sm q-mb-xl' : 'q-mt-lg q-mb-xl'"
      />
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

import { useRules } from '@/composables'

import useInformationForm from './InformationForm'

const { formData, resetForm, selectOptions, informationFormRef } =
  useInformationForm()

defineExpose({
  resetForm,
  getValues: () => formData.value,
  validateForm: () => informationFormRef.value?.validate(),
})
</script>
