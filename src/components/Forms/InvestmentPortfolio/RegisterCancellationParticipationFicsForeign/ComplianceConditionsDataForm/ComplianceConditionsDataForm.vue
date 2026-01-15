<template>
  <q-form
    role="form"
    ref="complianceConditionsDataFormRef"
    aria-label="Formulario de datos de condiciones de cumplimiento"
  >
    <section
      aria-label="Sección de formulario de datos de condiciones de cumplimiento"
    >
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <CurrencyInput
            :modelValue="models.value_currency"
            label="Valor moneda"
            placeholder="Inserte"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El valor moneda es requerido'),
            ]"
            disabled
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="models.conversion_factor"
            label="Factor de conversión"
            placeholder="-"
            type="text"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericDateInputComponent
            :default_value="models.compliance_date"
            label="Fecha de cumplimiento"
            mask="YYYY-MM-DD"
            placeholder="YYYY-MM-DD"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'La fecha de cumplimiento es requerida'),
              (val: string) => useRules().valid_format_date(val, 'YYYY-MM-DD'),
            ]"
            @update:model-value="models.compliance_date = $event"
          />
        </div>
        <div class="col-12 col-md-4">
          <GenericDateInputComponent
            :default_value="models.resource_placement_date"
            label="Fecha colocación de recursos"
            mask="YYYY-MM-DD"
            placeholder="YYYY-MM-DD"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'La fecha de colocación de recursos es requerida'),
              (val: string) => useRules().valid_format_date(val, 'YYYY-MM-DD'),
            ]"
            @update:model-value="models.resource_placement_date = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <CurrencyInput
            :modelValue="models.value_compliance_currency_origin"
            label="Valor cumplimiento moneda origen"
            placeholder="-"
            required
            disabled
            :rules="[
              (val: string) => useRules().is_required(val, 'El valor cumplimiento moneda origen es requerido'),
            ]"
          />
        </div>

        <div class="col-12 col-md-4">
          <CurrencyInput
            :modelValue="models.local_currency_compliance_transfer"
            label="Valor giro cumplimiento moneda local"
            placeholder="-"
            required
            disabled
            :rules="[
              (val: string) => useRules().is_required(val, 'El valor giro cumplimiento moneda local es requerido'),
            ]"
          />
        </div>

        <div class="col-12">
          <q-separator class="q-my-lg" />
        </div>
      </div>
    </section>
  </q-form>
</template>
<script lang="ts" setup>
import { useRules } from '@/composables'
import useComplianceConditionsDataForm from './ComplianceConditionsDataForm'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'

const { models, complianceConditionsDataFormRef, resetForm } =
  useComplianceConditionsDataForm()

defineExpose({
  resetForm,
  getValues: () => models.value,
  validateForm: () => complianceConditionsDataFormRef.value?.validate(),
})
</script>
