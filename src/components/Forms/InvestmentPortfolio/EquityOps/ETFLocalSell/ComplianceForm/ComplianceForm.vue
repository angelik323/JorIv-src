<template>
  <q-form ref="complianceFormRef" aria-label="Formulario de cumplimiento">
    <section aria-label="Sección de formulario de cumplimiento">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            :default_value="formData.title_id"
            label="Número título"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="available_title"
            :rules="[
              (val: string) => useRules().is_required(val, 'El número de título es requerido'),
            ]"
            @update:model-value="formData.title_id = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="formData.quantity_units"
            label="Cantidad de unidades disponibles"
            placeholder="-"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="formData.quantity_sell_units"
            label="Cantidad unidades a vender"
            placeholder="-"
            type="text"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            v-model="formData.value_unit_sell"
            label="Valor unidad de venta"
            placeholder="Inserte"
            currency="COP"
            required
            :hideIcon="true"
            :rules="[
              (val: string) => useRules().is_required(val, 'El valor unidad de venta es requerido'),
            ]"
          />
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            :model-value="formData.value_real_commission"
            label="Valor comisión"
            placeholder="-"
            currency="COP"
            disabled
            required
            :hideIcon="true"
          />
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            :model-value="formData.compliance_value"
            label="Valor cumplimiento"
            placeholder="-"
            currency="COP"
            required
            disabled
            :hideIcon="true"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            :default_value="formData.compliance_date"
            label="Fecha de cumplimiento"
            mask="YYYY-MM-DD"
            placeholder="YYYY-MM-DD"
            required
            disabled
            :rules="[]"
          />
        </div>

        <div class="col-12">
          <q-separator class="q-my-lg" />
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'

import { useRules } from '@/composables'

import useComplianceForm from './ComplianceForm'

const { formData, available_title, complianceFormRef, setComplianceDate } =
  useComplianceForm()

defineExpose({
  formData,
  setComplianceDate,
  getValues: () => formData.value,
  validateForm: () => complianceFormRef.value?.validate(),
})
</script>
