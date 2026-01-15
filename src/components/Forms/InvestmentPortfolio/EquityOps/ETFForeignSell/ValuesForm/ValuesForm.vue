<template>
  <q-form ref="valuesFormRef" aria-label="Formulario de cumplimiento">
    <section aria-label="Sección de formulario de cumplimiento">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="row col-12 items-center justify-between q-px-md">
          <p class="q-mb-none mt-1 text-weight-medium q-ml-md">
            Cumple en moneda origen*
          </p>
          <RadioYesNo
            class="q-mt-none"
            v-model="formData.compliance_origin_currency"
            :titleRadioTrue="'Si'"
            :titleRadioFalse="'No'"
          />
        </div>

        <div class="col-12">
          <q-separator class="q-my-lg" />
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="formData.compliance_currency_description"
            label="Moneda cumplimiento"
            placeholder="-"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericDateInputComponent
            :default_value="formData.compliance_date"
            label="Fecha cumplimiento"
            mask="YYYY-MM-DD"
            placeholder="YYYY-MM-DD"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'La fecha de cumplimiento es requerida'),
              (val: string) => useRules().valid_format_date(val, 'YYYY-MM-DD'),
            ]"
            @update:model-value="formData.compliance_date = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericDateInputComponent
            :default_value="formData.colocation_resources_date"
            label="Fecha colocación de recursos"
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

        <div class="col-12 col-md-4" v-if="!isSpot">
          <CurrencyInput
            v-model="formData.value_negotiation_currency"
            label="Valor moneda negociación"
            placeholder="Inserte"
            currency="COP"
            required
            :hideIcon="true"
            :rules="[
              (val: string) => useRules().is_required(val, 'El valor moneda negociación es requerido'),
            ]"
          />
        </div>

        <div class="col-12 col-md-4" v-if="!isSpot">
          <CurrencyInput
            :model-value="formData.value_operation_origin_currency"
            label="Valor operación moneda origen"
            placeholder="-"
            currency="COP"
            disabled
            required
            :hideIcon="true"
          />
        </div>

        <div class="col-12 col-md-4" v-if="isSpot">
          <CurrencyInput
            :model-value="formData.value_spot_rate"
            label="Valor tasa spot"
            placeholder="-"
            currency="COP"
            disabled
            required
            :hideIcon="true"
          />
        </div>

        <div class="col-12 col-md-4" v-if="isSpot">
          <CurrencyInput
            :model-value="formData.value_compliance_spot_rate"
            label="Valor cumplimiento tasa spot"
            placeholder="-"
            currency="COP"
            disabled
            required
            :hideIcon="true"
          />
        </div>

        <div class="col-12 col-md-4" v-if="!isSpot">
          <CurrencyInput
            :model-value="formData.factor_conversion"
            label="Factor de conversión"
            placeholder="-"
            currency="COP"
            disabled
            required
            :precision="6"
            :hideIcon="true"
          />
        </div>

        <div class="col-12 col-md-4" v-if="!isSpot">
          <CurrencyInput
            :model-value="formData.gyre_compliance_local_currency"
            label="Giro cumplimiento moneda local"
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
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

import { useRules } from '@/composables'

import useValuesForm from '@/components/Forms/InvestmentPortfolio/EquityOps/ETFForeignSell/ValuesForm/ValuesForm'

const { isSpot, formData, valuesFormRef, setComplianceDate } = useValuesForm()

defineExpose({
  formData,
  setComplianceDate,
  getValues: () => formData.value,
  validateForm: () => valuesFormRef.value?.validate(),
})
</script>
