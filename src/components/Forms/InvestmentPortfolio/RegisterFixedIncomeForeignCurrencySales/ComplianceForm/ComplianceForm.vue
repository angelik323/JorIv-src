<template>
  <q-form
    role="form"
    ref="complianceFormRef"
    aria-label="Formulario condiciones de cumplimiento (moneda extranjera)"
  >
    <section aria-label="Condiciones de cumplimiento">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm items-end">
        <div class="col-12 col-md-3">
          <div class="text-grey-8 text-body2 text-weight-medium q-mb-sm">
            Cumple moneda origen*
          </div>
          <RadioYesNo
            v-model="formData.fulfill_in_origin"
            :options="[
              { label: 'Sí', value: true },
              { label: 'No', value: false },
            ]"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.settlement_currency"
            label="Moneda cumplimiento"
            placeholder="-"
            map_options
            :required="false"
            :rules="[]"
            :manual_option="settlementCurrencyOptions"
            :disabled="true"
            @update:model-value="formData.settlement_currency = String($event)"
          />
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            v-model="formData.negotiation_currency_value"
            label="Valor moneda negociación"
            placeholder="Inserte valor"
            currency="COP"
            required
            :hideIcon="true"
            :precision="2"
            :rules="[
    (val: string) => useRules().is_required(val, 'El valor moneda negociación es requerido'),
  ]"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            :default_value="formData.settlement_date"
            label="Fecha cumplimiento"
            mask="YYYY-MM-DD"
            placeholder="YYYY-MM-DD"
            :required="true"
            disabled
            :rules="[]"
            :option_calendar="disableWeekends"
            @update:model-value="formData.settlement_date = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            :default_value="formData.funding_placement_date"
            label="Fecha colocación de recursos"
            mask="YYYY-MM-DD"
            placeholder="YYYY-MM-DD"
            disabled
            :rules="[]"
            required
            :option_calendar="disableWeekends"
            @update:model-value="formData.funding_placement_date = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.settlement_origin_value"
            label="Valor cumplimiento Moneda Origen"
            placeholder="-"
            type="text"
            disabled
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.spot_rate_value"
            label="Valor tasa spot"
            placeholder="-"
            :required="true"
            type="text"
            disabled
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.spot_rate_compliance_value"
            label="Valor cumplimiento tasa spot"
            placeholder="-"
            type="text"
            :disabled="formData.operation_type !== 'Operacion Spot'"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.conversion_factor ?? null"
            label="Factor conversión"
            placeholder="-"
            type="text"
            required
            disabled
            @update:model-value="formData.conversion_factor = Number($event)"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.giro_local_currency"
            label="Giro cumplimiento moneda local"
            placeholder="-"
            type="text"
            disabled
          />
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import useComplianceForm from './ComplianceForm'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import { useRules } from '@/composables'

const {
  complianceFormRef,
  formData,
  settlementCurrencyOptions,
  disableWeekends,
  setInstrumentCurrency,
  setOperationContext,
  setPurchaseValueOrigin,
  setNegotiationCurrencyValue,
  setSpotRateValue,
  getValues,
  validateForm,
  resetForm,
} = useComplianceForm()

defineExpose({
  validateForm,
  getValues,
  resetForm,
  setInstrumentCurrency,
  setOperationContext,
  setPurchaseValueOrigin,
  setNegotiationCurrencyValue,
  setSpotRateValue,
})
</script>
