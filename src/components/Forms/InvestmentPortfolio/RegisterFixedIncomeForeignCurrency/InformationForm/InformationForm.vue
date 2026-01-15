<template>
  <q-form
    role="form"
    ref="informationFormRef"
    aria-label="Formulario de datos básicos (moneda extranjera)"
  >
    <section aria-label="Cabecera">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.investment_portfolio_id"
            label="Código de portafolio"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.investment_portfolio"
            :rules="[req]"
            @update:model-value="formData.investment_portfolio_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :key="`portfolio_desc_${formData.portfolio_description}`"
            :default_value="formData.portfolio_description"
            label="Descripción portafolio"
            placeholder="-"
            type="text"
            disabled
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            :default_value="formData.operation_date"
            label="Fecha de operación"
            mask="YYYY-MM-DD"
            placeholder="YYYY-MM-DD"
            disabled
            required
            :rules="[dateFmt, dateLTEtoday]"
            @update:model-value="formData.operation_date = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.operation_type_id"
            label="Código operación"
            placeholder="Seleccione"
            auto_complete
            map_options
            :required="true"
            :manual_option="selectOptions.operation_type"
            :rules="[req]"
            @update:model-value="formData.operation_type_id = $event"
          />
        </div>
      </div>
    </section>

    <q-separator class="q-my-lg" />
    <div class="text-subtitle1 text-weight-medium q-mb-md">Datos faciales</div>

    <section aria-label="Datos faciales">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <div class="text-grey-8 text-body2 text-weight-medium q-mb-sm">
            Tipo operación*
          </div>
          <RadioYesNo
            v-model="formData.operation_type"
            :options="[
              { label: 'Spot', value: 'Operacion Spot' },
              { label: 'De contado', value: 'Operacion Contado' },
            ]"
          />
        </div>
        <div class="col-12 col-md-3" v-if="showDays">
          <GenericInputComponent
            :default_value="formData.number_days"
            label="No. Días"
            placeholder="-"
            type="number"
            :required="showDays"
            :rules="[
              (val: string) => (useRules().is_required(val, 'El numero de dias es requerido')),
              (val: number) => (useRules().max_value(val, 5)),
              (val: number) => (useRules().min_value(val, 1))
            ]"
            @update:model-value="formData.number_days = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.market"
            label="Mercado"
            placeholder="Seleccione"
            required
            map_options
            :manual_option="selectOptions.market_types_buy_fixed_income"
            :disabled="false"
            :rules="[req]"
            @update:model-value="formData.market = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.issuer_id"
            label="Emisor"
            placeholder="Seleccione"
            auto_complete
            map_options
            :required="true"
            :manual_option="selectOptions.issuers"
            :rules="[req]"
            @update:model-value="formData.issuer_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.isin_code_id"
            label="ISIN"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.isins"
            :rules="[req]"
            @update:model-value="formData.isin_code_id = Number($event)"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.mnemonic"
            label="Nemotécnico"
            placeholder="-"
            type="text"
            disabled
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            :default_value="formData.issue_date"
            label="Fecha emisión"
            mask="YYYY-MM-DD"
            placeholder="YYYY-MM-DD"
            :disabled="true"
            required
            :rules="[dateFmt]"
            @update:model-value="formData.issue_date = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            :default_value="formData.maturity_date"
            label="Fecha vencimiento"
            mask="YYYY-MM-DD"
            placeholder="YYYY-MM-DD"
            :disabled="true"
            required
            :rules="[dateFmt]"
            @update:model-value="formData.maturity_date = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.perioricity"
            label="Periodicidad"
            placeholder="Seleccione"
            auto_complete
            map_options
            :disabled="true"
            required
            :manual_option="selectOptions.periodicities"
            :rules="[req]"
            @update:model-value="formData.perioricity = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.modality"
            label="Modalidad"
            placeholder="Seleccione"
            auto_complete
            :disabled="true"
            map_options
            required
            :manual_option="selectOptions.modalities"
            :rules="[req]"
            @update:model-value="formData.modality = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.paper_type_id"
            label="Tipo papel"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.paper_types"
            :rules="[req]"
            @update:model-value="formData.paper_type_id = Number($event)"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.rate_type"
            label="Tipo tasa"
            placeholder="Seleccione"
            auto_complete
            :disabled="true"
            map_options
            required
            :manual_option="selectOptions.rate_types"
            :rules="[req]"
            @update:model-value="formData.rate_type = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.rate_code"
            label="Código tasa"
            placeholder="Inserte"
            type="text"
            :disabled="formData.rate_type !== 'Variable'"
            :rules="[reqRateCode]"
            @update:model-value="formData.rate_code = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            v-model="formData.fixed_rate_value"
            label="Valor tasa"
            placeholder="Inserte"
            currency="USD"
            disabled
            required
            :hideIcon="true"
            :rules="[req]"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.currency_id"
            label="Moneda"
            placeholder="Seleccione"
            auto_complete
            :disabled="true"
            map_options
            required
            :manual_option="selectOptions.currencies"
            :rules="[req]"
            @update:model-value="formData.currency_id = Number($event)"
          />
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            v-model="formData.currency_value"
            label="Valor moneda"
            placeholder="Inserte"
            currency="USD"
            :disabled="true"
            required
            :hideIcon="true"
            :rules="[numDec10]"
          />
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            v-model="formData.face_value"
            label="Valor nominal"
            placeholder="Inserte"
            currency="USD"
            required
            :hideIcon="true"
            :rules="[req]"
          />
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            v-model="formData.purchase_value"
            label="Valor compra"
            placeholder="Inserte"
            currency="USD"
            required
            :hideIcon="true"
            :rules="[req]"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.counterparty_id"
            label="Contraparte"
            placeholder="Seleccione"
            auto_complete
            map_options
            :required="true"
            :manual_option="selectOptions.counterparties"
            :rules="[req]"
            @update:model-value="formData.counterparty_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <div class="text-grey-8 text-body2 text-weight-medium q-mb-sm">
            Clase de inversión*
          </div>
          <RadioYesNo
            v-model="formData.investment_class"
            :options="[
              { label: 'IN', value: 'IN' },
              { label: 'DV', value: 'DV' },
            ]"
          />
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import useInformationForm from './InformationForm'
import { useRules } from '@/composables'

const {
  formData,
  selectOptions,
  informationFormRef,
  showDays,
  reqRateCode,
  resetForm,
  req,
  numDec10,
  dateFmt,
  dateLTEtoday,
} = useInformationForm()

defineExpose({
  resetForm,
  getValues: () => formData.value,
  validateForm: () => informationFormRef.value?.validate(),
})
</script>
