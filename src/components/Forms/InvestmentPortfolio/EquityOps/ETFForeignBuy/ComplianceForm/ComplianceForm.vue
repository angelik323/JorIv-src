<template>
  <q-form ref="complianceFormRef" aria-label="Formulario de cumplimiento">
    <section aria-label="Sección de formulario de cumplimiento">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.quantity_units"
            label="Cantidad de unidades"
            placeholder="-"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.origin_currency_id"
            label="Moneda origen"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="coins"
            :rules="[
              (val: string) => useRules().is_required(val, 'La moneda origen es requerida'),
            ]"
            @update:modelValue="formData.origin_currency_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            :model-value="formData.value_origin_currency"
            label="Valor moneda origen"
            placeholder="-"
            currency="COP"
            disabled
            required
            :hideIcon="true"
          />
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            :model-value="formData.factor_conversion"
            label="Factor de conversión"
            placeholder="-"
            currency="COP"
            disabled
            required
            :hideIcon="true"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.compliance_currency_id"
            label="Moneda cumplimiento"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="coins"
            :rules="[]"
            @update:modelValue="formData.compliance_currency_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            v-model="formData.value_negotiation_currency"
            label="Valor moneda negociación"
            placeholder="Inserte"
            currency="COP"
            required
            :hideIcon="true"
            :rules="[
              (val: string) => useRules().is_required(val, 'La moneda origen es requerida'),
            ]"
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

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            :default_value="formData.colocation_resources_date"
            label="Fecha de colocación de recursos"
            mask="YYYY-MM-DD"
            placeholder="YYYY-MM-DD"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'La fecha de colocación de recursos es requerida'),
              (val: string) => useRules().valid_format_date(val, 'YYYY-MM-DD'),
            ]"
            @update:model-value="formData.colocation_resources_date = $event"
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

import useComplianceForm from '@/components/Forms/InvestmentPortfolio/EquityOps/ETFForeignBuy/ComplianceForm/ComplianceForm'

const { coins, formData, complianceFormRef, setComplianceDate } =
  useComplianceForm()

defineExpose({
  formData,
  setComplianceDate,
  getValues: () => formData.value,
  validateForm: () => complianceFormRef.value?.validate(),
})
</script>
