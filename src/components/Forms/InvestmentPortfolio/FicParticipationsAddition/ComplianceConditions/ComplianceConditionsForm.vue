<template>
  <q-form ref="complianceFormRef">
    <section class="q-mt-md">
      <div class="row items-end q-col-gutter-x-lg q-col-gutter-y-sm">

        <div class="col-12 col-md-3">
          <GenericInputComponent
            label="Valor moneda"
            :default_value="models.currency_value"
            :placeholder="'Ingrese un valor'"
            required
            disabled
            :rules="[ 
              (v: string) => is_required(v), 
            ]"
            @update:model-value="models.currency_value = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            label="Factor de conversión"
            :default_value="models.conversion_factor"
            :placeholder="'Ingrese un valor'"
            required
            disabled
            :rules="[ 
              (v: string) => max_integer_decimal(v, 1, 6)
            ]"
          />
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            currencyLabel="Valor adición moneda origen"
            v-model="models.value_addition_currency_origin"
            :currency="'COP'"
            :placeholder="'Ingrese un valor'"
            required
            hideIcon
            :rules="[ 
              (v: string) => is_required(v), 
            ]"
            @update:model-value="models.value_addition_currency_origin = $event"
          />
        </div>
        
        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            :default_value="models.compliance_date"
            label="Fecha de cumplimiento"
            mask="YYYY-MM-DD"
            placeholder="AAAA-MM-DD"
            :option_calendar="isBusinessDay"
            required
            :rules="[
              (val: string) => is_required(val, 'La fecha de cumplimiento es requerida'),
              (val: string) => valid_format_date(val, 'YYYY-MM-DD'),
            ]"
            @update:model-value="models.compliance_date = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            :default_value="models.resource_placement_date"
            label="Fecha colocacion de recursos"
            mask="YYYY-MM-DD"
            placeholder="AAAA-MM-DD"
            :option_calendar="isBusinessDay"
            required
            :rules="[
              (val: string) => is_required(val, 'La fecha de colocacion de recursos es requerida'),
              (val: string) => valid_format_date(val, 'YYYY-MM-DD'),
            ]"
            @update:model-value="models.resource_placement_date = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            label="Valor cumplimiento moneda origen"
            :default_value="models.value_compliance_currency_origin"
            :placeholder="'Ingrese un valor'"
            required
            disabled
            :rules="[]"
          />
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            currencyLabel="Giro cumplimiento moneda local"
            v-model="models.local_currency_compliance_transfer"
            :currency="'COP'"
            :placeholder="'Ingrese un valor'"
            required
            disabled
            hideIcon
            :rules="[ 
              (v: string) => is_required(v), 
            ]"
            @update:model-value="models.local_currency_compliance_transfer = $event"
          />
        </div>
        
      </div>
    </section>
  </q-form>
</template> 

<script setup lang="ts">
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'

import { IComplianceConditionsForm } from '@/interfaces/customs'
import ComplianceConditionsForm from '@/components/Forms/InvestmentPortfolio/FicParticipationsAddition/ComplianceConditions/ComplianceConditionsForm'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'

const props = withDefaults(
  defineProps<{
    data: IComplianceConditionsForm | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
}>()

const {
  complianceFormRef,
  models,
  is_required,
  max_integer_decimal,
  valid_format_date,
  isBusinessDay,
} = ComplianceConditionsForm(props, emits)

defineExpose({
  validateForm: () => complianceFormRef.value?.validate(),
})
</script>