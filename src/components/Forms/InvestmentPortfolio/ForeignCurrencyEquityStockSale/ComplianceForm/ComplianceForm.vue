<template>
  <q-form
    role="form"
    ref="complianceFormRef"
    aria-label="Formulario de cumplimiento"
  >
    <section aria-label="Sección de formulario de cumplimiento">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            :default_value="formData.origin_currency"
            label="Moneda origen"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.coins"
            :rules="[
              (val: string) => useRules().is_required(val, 'La moneda de origen es requerida'),
            ]"
            @update:modelValue="handleUpdateSelectorOriginCurrency($event)"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="
              useUtils().getFormatNumber(formData.origin_currency_value ?? 0)
            "
            label="Valor moneda origen"
            placeholder="-"
            type="text"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="formData.available_shares_quantity"
            label="Cantidad de acciones disponibles emisor"
            placeholder="-"
            type="number"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="formData.sale_shares_quantity"
            label="Cantidad de acciones venta"
            placeholder="Inserte"
            type="number"
            :min_value="1"
            :max_value="formData.available_shares_quantity"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'La cantidad de acciones venta es requerida'),
              (val: string) => useRules().max_integer_decimal(val, 15, 6),
              (val: string) => useRules().min_value(val, 1),
              (val: string) => useRules().max_value(val, formData.available_shares_quantity),
            ]"
            @update:model-value="formData.sale_shares_quantity = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="formData.sale_unit_value_currency"
            label="Valor unidad venta moneda origen"
            placeholder="Inserte"
            type="text"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El valor de unidad venta es requerida'),
              (val: string) => useRules().max_integer_decimal(val, 15, 2),
            ]"
            @update:model-value="formData.sale_unit_value_currency = $event"
          />
        </div>
        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="
              useUtils().getFormatNumber(
                formData.commission_value_currency_origin ?? 0,
              )
            "
            label="Valor comisión moneda origen"
            placeholder="-"
            type="text"
            disabled
            required
          />
        </div>
        <div class="col-12">
          <q-separator class="q-my-lg" />
        </div>
        <div class="row col-12 items-center justify-between q-px-md">
          <p class="q-mb-none mt-1 text-weight-medium q-ml-md">
            Cumple en moneda origen*
          </p>
          <RadioYesNo
            class="q-mt-none"
            v-model="formData.complies_in_origin_currency"
            :titleRadioTrue="'Sí'"
            :titleRadioFalse="'No'"
            @update:model-value="formData.complies_in_origin_currency = $event"
          />
        </div>
        <div class="col-12">
          <q-separator class="q-my-lg" />
        </div>
        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="complianceCurrencyLabel"
            label="Moneda de cumplimiento"
            placeholder="-"
            type="text"
            required
            disabled
          />
        </div>
        <div class="col-12 col-md-4">
          <GenericDateInputComponent
            :default_value="formData.compliance_date"
            label="Fecha de cumplimiento"
            mask="YYYY-MM-DD"
            placeholder="YYYY-MM-DD"
            required
            :option_calendar="isBusinessDay"
            :rules="[
              (val: string) => useRules().is_required(val, 'La fecha de cumplimiento es requerida'),
              (val: string) => useRules().valid_format_date(val, 'YYYY-MM-DD'),
            ]"
            @update:model-value="formData.compliance_date = $event"
          />
        </div>
        <div class="col-12 col-md-4">
          <GenericDateInputComponent
            :default_value="formData.resource_placement_date"
            label="Fecha de colocación de recursos"
            mask="YYYY-MM-DD"
            :placeholder="isOperationSpot ? '-' : 'YYYY-MM-DD'"
            :required="!isOperationSpot"
            :disabled="isOperationSpot"
            :option_calendar="isBusinessDay"
            :rules="[

              (val: string) => useRules().is_required(val, 'La fecha de colocación de recursos es requerida'),
              (val: string) => useRules().valid_format_date(val, 'YYYY-MM-DD'),
            ]"
            @update:model-value="formData.resource_placement_date = $event"
          />
        </div>
        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="formData.negotiation_currency_value"
            label="Valor moneda negociación"
            placeholder="Inserte"
            type="number"
            required
            :disabled="isOperationSpot"
            :rules="[
              (val: string) => useRules().is_required(val, 'La moneda de negociación es requerida'),
              (val: string) => useRules().only_number_with_max_integers_and_decimals(val, 15, 6),
            ]"
            @update:model-value="formData.negotiation_currency_value = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="formData.operation_value_origin_currency"
            label="Valor total operación moneda origen"
            placeholder="-"
            type="text"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="formData.spot_rate_value"
            label="Valor tasa spot"
            placeholder="-"
            type="number"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="formData.compliance_spot_rate_value"
            label="Valor cumplimiento tasa spot"
            placeholder="-"
            type="number"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="formData.conversion_factor"
            label="Factor conversión"
            placeholder="-"
            type="number"
            required
            disabled
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="formData.local_currency_compliance_amount"
            label="Giro cumplimiento moneda local"
            placeholder="-"
            type="number"
            disabled
            required
          />
        </div>
      </div>

      <q-separator class="q-my-lg" />
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'

import { useRules, useUtils } from '@/composables'

import useComplianceForm from './ComplianceForm'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'

const {
  formData,
  complianceFormRef,
  complianceCurrencyLabel,
  selectOptions,
  isOperationSpot,
  resetForm,
  handleUpdateSelectorOriginCurrency,
  isBusinessDay,
} = useComplianceForm()

defineExpose({
  resetForm,
  getValues: () => formData.value,
  validateForm: () => complianceFormRef.value?.validate(),
})
</script>
