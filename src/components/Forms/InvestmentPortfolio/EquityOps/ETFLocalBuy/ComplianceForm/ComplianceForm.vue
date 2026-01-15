<template>
  <q-form ref="complianceFormRef" aria-label="Formulario de cumplimiento">
    <section aria-label="Sección de formulario de cumplimiento">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="formData.quantity_units"
            label="Cantidad de unidades"
            placeholder="-"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-4">
          <CurrencyInput
            v-model="formData.unit_value"
            label="Valor unidad compra"
            placeholder="Inserte"
            currency="COP"
            required
            :hideIcon="true"
            :rules="[
              (val: string) => useRules().is_required(val, 'El valor unidad compra es requerido'),
            ]"
          />
        </div>

        <div class="col-12 col-md-4">
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

        <div class="col-12 col-md-6">
          <CurrencyInput
            :model-value="formData.compliance_value"
            label="Valor cumplimiento"
            placeholder="-"
            currency="COP"
            disabled
            required
            :hideIcon="true"
          />
        </div>

        <div class="col-12 col-md-6">
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
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'

import { useRules } from '@/composables'

import useComplianceForm from './ComplianceForm'

const { formData, complianceFormRef, setComplianceDate } = useComplianceForm()

defineExpose({
  formData,
  setComplianceDate,
  getValues: () => formData.value,
  validateForm: () => complianceFormRef.value?.validate(),
})
</script>
