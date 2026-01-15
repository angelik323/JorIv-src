<template>
  <q-form ref="valuesFormRef" aria-label="Formulario de cumplimiento">
    <section aria-label="Sección de formulario de cumplimiento">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.origin_currency_description"
            label="Moneda origen"
            placeholder="-"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            v-model="formData.value_unit_origin_currency"
            label="Valor unidad compra moneda origen"
            placeholder="Inserte"
            currency="COP"
            required
            :hideIcon="true"
            :rules="[
              (val: string) => useRules().is_required(val, 'El valor unidad compra moneda origen es requerido'),
            ]"
          />
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            :model-value="formData.value_commission_origin_currency"
            label="Valor comisión moneda origen"
            placeholder="-"
            currency="COP"
            disabled
            required
            :hideIcon="true"
          />
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            :model-value="formData.value_total_origin_currency"
            label="Valor total moneda origen"
            placeholder="-"
            currency="COP"
            disabled
            required
            :hideIcon="true"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.local_currency_description"
            label="Moneda local"
            placeholder="-"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            v-model="formData.value_unit_local_currency"
            label="Valor unidad compra moneda local"
            placeholder="-"
            currency="COP"
            disabled
            required
            :hideIcon="true"
          />
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            :model-value="formData.value_commission_local_currency"
            label="Valor comisión moneda local"
            placeholder="-"
            currency="COP"
            disabled
            required
            :hideIcon="true"
          />
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            :model-value="formData.value_total_local_currency"
            label="Valor total moneda local"
            placeholder="-"
            currency="COP"
            disabled
            required
            :hideIcon="true"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.compliance_currency_description"
            label="Moneda cumplimiento"
            placeholder="-"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            :model-value="formData.value_unit_compliance_currency"
            label="Valor unidad compra moneda cumplimiento"
            placeholder="-"
            currency="COP"
            disabled
            required
            :hideIcon="true"
          />
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            :model-value="formData.value_commission_compliance_currency"
            label="Valor comisión moneda cumplimiento"
            placeholder="-"
            currency="COP"
            disabled
            required
            :hideIcon="true"
          />
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            :model-value="formData.value_total_compliance_currency"
            label="Valor total cumplimiento"
            placeholder="-"
            currency="COP"
            disabled
            required
            :hideIcon="true"
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
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'

import { useRules } from '@/composables'

import useValuesForm from '@/components/Forms/InvestmentPortfolio/EquityOps/ETFForeignBuy/ValuesForm/ValuesForm'

const { formData, valuesFormRef } = useValuesForm()

defineExpose({
  formData,
  getValues: () => formData.value,
  validateForm: () => valuesFormRef.value?.validate(),
})
</script>
