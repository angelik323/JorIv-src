<template>
  <q-form ref="complianceFormRef" aria-label="Formulario de cumplimiento">
    <section aria-label="Sección de formulario de cumplimiento">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="formData.quantity_units"
            label="Cantidad de unidades"
            placeholder="Inserte"
            type="text"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'La cantidad de unidades es requerida'),
              (val: string) => useRules().only_number_with_max_integers_and_decimals(val, 15, 6),
            ]"
            @update:model-value="formData.quantity_units = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="formData.unit_value_currency_origin"
            label="Valor unidad moneda origen"
            placeholder="Inserte"
            type="text"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El valor de la unidad moneda origen es requerido'),
              (val: string) => useRules().only_number_with_max_integers_and_decimals(val, 15, 6),
            ]"
            @update:model-value="formData.unit_value_currency_origin = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="
              useUtils().getFormatNumber(formData.purchase_value ?? 0)
            "
            label="Valor compra moneda origen"
            placeholder="-"
            type="text"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericInputComponent
            :default_value="
              useUtils().getFormatNumber(formData.commission_value ?? 0)
            "
            label="Valor comisión moneda origen"
            placeholder="-"
            type="text"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericInputComponent
            :default_value="
              useUtils().getFormatNumber(formData.total_operation_value ?? 0)
            "
            label="Valor total operación"
            placeholder="-"
            type="text"
            disabled
            required
          />
        </div>

        <div class="col-12">
          <q-separator class="q-my-sm" />
        </div>

        <div class="row col-12 items-center justify-between q-px-md">
          <p class="q-mb-none mt-1 text-weight-medium q-ml-md">
            Cumple en moneda origen*
          </p>
          <RadioYesNo
            class="q-mt-none"
            v-model="formData.complies_origin_currency"
            :titleRadioTrue="'Sí'"
            :titleRadioFalse="'No'"
          />
        </div>

        <div class="col-12">
          <q-separator class="q-my-md" />
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="formData.compliance_currency ?? LOCAL_CURRENCY_CODE"
            label="Moneda de cumplimiento"
            placeholder="-"
            type="text"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="formData.currency_negotiation_value"
            label="Valor moneda negociación"
            placeholder="Inserte"
            type="text"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El valor de la moneda de negociación es requerido'),
              (val: string) => useRules().only_number_with_max_integers_and_decimals(val, 15, 10),
            ]"
            @update:model-value="formData.currency_negotiation_value = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericDateInputComponent
            :default_value="formData.compliance_date"
            label="Fecha de cumplimiento"
            mask="YYYY-MM-DD"
            placeholder="YYYY-MM-DD"
            required
            disabled
            :rules="[
              (val: string) => useRules().is_required(val, 'La fecha de cumplimiento es requerida'),
              (val: string) => useRules().valid_format_date(val, 'YYYY-MM-DD'),
            ]"
            :option_calendar="(date_str: string) => {
              const calendarRules = useCalendarRules()
              return (
              calendarRules.only_weekdays()(date_str)
              )
            }"
            @update:model-value="formData.compliance_date = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericDateInputComponent
            :default_value="formData.placement_resources_date"
            label="Fecha colocación de recursos"
            mask="YYYY-MM-DD"
            placeholder="YYYY-MM-DD"
            required
            disabled
            :rules="[
              (val: string) => useRules().is_required(val, 'La fecha de colocación de recursos es requerida'),
              (val: string) => useRules().valid_format_date(val, 'YYYY-MM-DD'),
            ]"
            :option_calendar="(date_str: string) => {
              const calendarRules = useCalendarRules()
              return (
              calendarRules.only_weekdays()(date_str)
              )
            }"
            @update:model-value=""
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="formData.complies_origin_currency_value"
            label="Valor cumplimiento moneda origen"
            placeholder="-"
            type="text"
            disabled
            required
          />
        </div>

        <template v-if="!formData.negotiation">
          <div class="col-12 col-md-4">
            <GenericInputComponent
              :default_value="formData.spot_rate_value"
              label="Valor tasa spot"
              placeholder="-"
              type="text"
              disabled
              required
            />
          </div>

          <div
            class="col-12 col-md-4"
            v-if="formData.currency_negotiation_value !== null"
          >
            <GenericInputComponent
              :default_value="
                useUtils().getFormatNumber(formData.compliance_spot_value ?? 0)
              "
              label="Valor cumplimiento tasa spot"
              placeholder="-"
              type="text"
              disabled
              required
            />
          </div>
        </template>

        <div class="col-12 col-md-4" v-if="formData.negotiation">
          <GenericInputComponent
            :default_value="formData.conversion_factor"
            label="Factor de conversión"
            placeholder="Inserte"
            type="text"
            disabled
            required
            @update:model-value="formData.conversion_factor = $event"
          />
        </div>

        <div class="col-12 col-md-4" v-if="formData.negotiation">
          <GenericInputComponent
            :default_value="
              useUtils().getFormatNumber(formData.local_compliance_value ?? 0)
            "
            label="Giro cumplimiento moneda local"
            placeholder="-"
            type="text"
            disabled
            required
          />
        </div>
      </div>

      <q-separator class="q-mt-md q-mb-lg" />
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

import { useCalendarRules, useRules, useUtils } from '@/composables'

import useComplianceForm from './ComplianceForm'

const {
  formData,
  resetForm,
  setNegotiation,
  complianceFormRef,
  LOCAL_CURRENCY_CODE,
} = useComplianceForm()

defineExpose({
  resetForm,
  setNegotiation,
  getValues: () => formData.value,
  validateForm: () => complianceFormRef.value?.validate(),
})
</script>
