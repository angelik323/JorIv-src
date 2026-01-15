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
            :default_value="formData.settlement_currency || '-'"
            label="Moneda cumplimiento"
            placeholder="-"
            type="text"
            disabled
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.negotiation_currency_value"
            label="Valor moneda negociación"
            placeholder="Inserte"
            type="text"
            required
            @update:model-value="setNegotiationCurrencyValue(Number($event))"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            :default_value="formData.settlement_date"
            label="Fecha cumplimiento"
            mask="YYYY-MM-DD"
            placeholder="YYYY-MM-DD"
            :rules="[]"
            disabled
            required
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
            :rules="[]"
            disabled
            required
            :option_calendar="disableWeekends"
            @update:model-value="formData.funding_placement_date = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.settlement_origin_value"
            label="Valor cumplimiento moneda origen"
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
            disabled
            :disable="formData.operation_type !== 'Operacion Spot'"
            @update:model-value="
              formData.spot_rate_compliance_value = Number($event)
            "
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.conversion_factor ?? null"
            label="Factor conversión"
            placeholder="Inserte"
            :required="true"
            disabled
            type="text"
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

    <q-separator class="q-my-lg" />

    <section aria-label="Flujos">
      <TableList
        :title="tableProps.title"
        :loading="tableProps.loading"
        :rows="tableProps.rows"
        :columns="tableProps.columns"
        :pages="tableProps.pages"
        :custom-columns="['index', 'date', 'interest', 'capital']"
      >
        <template #index="{ row }">{{ row.__index }}</template>
        <template #date="{ row }">{{ row.date }}</template>
        <template #interest="{ row }">
          {{ utils.getFormatNumber(row.interest) }}
        </template>
        <template #capital="{ row }">
          {{ utils.getFormatNumber(row.capital) }}
        </template>
      </TableList>

      <div class="row q-co l-gutter-x-lg q-col-gutter-y-sm q-mt-md">
        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="displayTir"
            label="Tir Compra"
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
import TableList from '@/components/table-list/TableList.vue'
import useComplianceFormView from './ComplianceForm'
import { useUtils } from '@/composables'

const utils = useUtils()

const {
  complianceFormRef,
  formData,
  tableProps,
  displayTir,
  disableWeekends,
  setInstrumentCurrency,
  setPurchaseValueOrigin,
  resetForm,
  setFlows,
  setTirPurchase,
  getValues,
  setNegotiationCurrencyValue,
  setSpotRateValue,
  loadFromService,
} = useComplianceFormView()

defineExpose({
  resetForm,
  validateForm: () => complianceFormRef.value?.validate?.(),
  getValues,
  setFlows,
  setTirPurchase,
  setNegotiationCurrencyValue,
  setSpotRateValue,
  loadFromService,
  setInstrumentCurrency,
  setPurchaseValueOrigin,
})
</script>
