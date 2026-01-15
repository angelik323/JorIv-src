<template>
  <q-form ref="complianceFormRef" aria-label="Formulario de cumplimiento">
    <section aria-label="Sección de formulario de cumplimiento">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.exchange_traded_fund_id"
            label="Número ETF's"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.etfs"
            :rules="[
              (val: string) => useRules().is_required(val, 'El número de ETFs es requerido'),
            ]"
            @update:modelValue="onSelectETF"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.title_id"
            label="Número título"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.available_title"
            :rules="[
              (val: string) => useRules().is_required(val, 'El número de título es requerido'),
            ]"
            @update:modelValue="formData.title_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.title_id"
            label="Descripción título"
            placeholder="-"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.exchange_traded_fund_transmitter_nit"
            label="NIT emisor"
            placeholder="-"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="
              formData.exchange_traded_fund_transmitter_description
            "
            label="Descripción emisor"
            placeholder="-"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.buyer_id"
            label="NIT comprador"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.emitter"
            :rules="[
              (val: string) => useRules().is_required(val, 'El NIT del comprador es requerido'),
            ]"
            @update:modelValue="formData.buyer_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.buyer_description"
            label="Descripción comprador"
            placeholder="-"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.commission_agent_id"
            label="NIT comisionista"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.commission_agents"
            :rules="[
              (val: string) => useRules().is_required(val, 'El NIT del comisionista es requerido'),
            ]"
            @update:modelValue="formData.commission_agent_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.commission_agent_description"
            label="Descripción comisionista"
            placeholder="-"
            disabled
            required
          />
        </div>

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
          <GenericInputComponent
            :default_value="formData.quantity_sell_units"
            label="Cantidad de unidades disponibles"
            placeholder="-"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.quantity_sell_units"
            label="Unidades ETF's venta"
            placeholder="Inserte"
            disabled
            required
            @update:model-value="formData.unit_origin_currency = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            v-model="formData.value_unit_origin_currency"
            label="Valor unidad venta moneda origen"
            placeholder="Inserte"
            currency="COP"
            required
            :hideIcon="true"
            :rules="[
              (val: string) => useRules().is_required(val, 'El valor unidad venta moneda origen es requerido'),
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

<script setup lang="ts">
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'

import { useRules } from '@/composables'

import useComplianceForm from '@/components/Forms/InvestmentPortfolio/EquityOps/ETFForeignSell/ComplianceForm/ComplianceForm'

const { formData, onSelectETF, selectOptions, complianceFormRef } =
  useComplianceForm()

defineExpose({
  formData,
  getValues: () => formData.value,
  validateForm: () => complianceFormRef.value?.validate(),
})
</script>
