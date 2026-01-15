<template>
  <q-form ref="informationFormRef" aria-label="Formulario de datos básicos">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.investment_portfolio_id"
            label="Código de portafolio"
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
            label="Descripción de portafolio"
            placeholder="-"
            type="text"
            disabled
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            :default_value="formData.operation_date"
            label="Fecha de operación"
            placeholder="AAAA/MM/DD"
            mask="YYYY-MM-DD"
            required
            disabled
            :rules="[]"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.operation_type_id"
            label="Código de operación"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.operation_type"
            :rules="[req]"
            @update:model-value="formData.operation_type_id = $event"
          />
        </div>
      </div>

      <q-separator class="q-my-sm" />
    </section>

    <section class="q-mt-lg">
      <div class="q-mb-lg">
        <p class="text-black text-weight-bold text-h6 q-mb-none">
          Datos faciales
        </p>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <span class="text-grey-7 text-weight-medium break-word q-ml-sm">
            Tipo*
          </span>
          <RadioYesNo
            v-model="formData.market"
            :options="[
              { label: 'Primario', value: 'Primario' },
              { label: 'Secundario', value: 'Secundario' },
            ]"
            label="Tipo*"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.issuer_id"
            label="Emisor"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.issuers"
            :rules="[req]"
            @update:modelValue="formData.issuer_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.isin_code_id"
            label="ISIN"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.isins"
            :rules="[req]"
            :disabled="isIsinDisabled"
            @update:model-value="formData.isin_code_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.paper_type_id"
            label="Tipo papel"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.paper_types"
            :rules="[req]"
            @update:model-value="formData.paper_type_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.mnemonic"
            label="Nemotécnico"
            type="text"
            :placeholder="isPrimaryMarket ? 'Inserte' : '-'"
            :required="isPrimaryMarket"
            :disabled="!isPrimaryMarket"
            :rules="isPrimaryMarket ? [req] : []"
            @update:model-value="
              (val) => {
                if (isPrimaryMarket) formData.mnemonic = val
              }
            "
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            :default_value="formData.issue_date"
            label="Fecha emisión"
            placeholder="AAAA/MM/DD"
            mask="YYYY-MM-DD"
            required
            :rules="[dateFmt]"
            @update:model-value="formData.issue_date = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            :default_value="formData.maturity_date"
            label="Fecha vencimiento"
            placeholder="AAAA/MM/DD"
            mask="YYYY-MM-DD"
            required
            :rules="[dateFmt]"
            @update:model-value="formData.maturity_date = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <span class="text-grey-7 text-weight-medium break-word q-ml-sm">
            Clase tasa*
          </span>
          <RadioYesNo
            v-model="formData.rate_class"
            :options="[
              { label: 'Efectivo', value: 'Efectivo' },
              { label: 'Nominal', value: 'Nominal' },
            ]"
            label="Clase tasa*"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.perioricity"
            label="Periodicidad"
            :placeholder="isPrimaryMarket ? 'Seleccione' : '-'"
            auto_complete
            map_options
            :manual_option="periodicityOptions"
            :required="isPrimaryMarket"
            :disabled="!isPrimaryMarket"
            :rules="[req]"
            @update:model-value="
              (val) => {
                if (isPrimaryMarket) formData.perioricity = val
              }
            "
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.modality"
            label="Modalidad"
            :placeholder="isPrimaryMarket ? 'Seleccione' : '-'"
            auto_complete
            map_options
            :manual_option="modalityOptions"
            :required="isPrimaryMarket"
            :disabled="!isPrimaryMarket"
            :rules="[req]"
            @update:model-value="
              (val) => {
                if (isPrimaryMarket) formData.modality = val
              }
            "
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.rate_type"
            label="Tipo tasa"
            :placeholder="isPrimaryMarket ? 'Seleccione' : '-'"
            auto_complete
            map_options
            :manual_option="rateTypeOptions"
            :required="isPrimaryMarket"
            :disabled="!isPrimaryMarket"
            :rules="[req]"
            @update:model-value="
              (val) => {
                if (isPrimaryMarket) formData.rate_type = val
              }
            "
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.rate_code"
            label="Código tasa"
            :placeholder="isPrimaryMarket ? 'Inserte' : '-'"
            type="text"
            :required="isPrimaryMarket"
            :disabled="isRateCodeDisabled"
            :rules="[reqRateCode]"
            @update:model-value="formData.rate_code = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            v-model="formData.fixed_rate_value"
            label="Valor tasa"
            :placeholder="isPrimaryMarket ? 'Inserte' : '-'"
            currency="COP"
            hideIcon
            :required="isPrimaryMarket"
            :disabled="!isPrimaryMarket"
            :rules="isPrimaryMarket ? [req] : []"
          />
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            v-model="formData.spread"
            label="Spread"
            :placeholder="isPrimaryMarket ? 'Inserte' : '-'"
            currency="COP"
            hideIcon
            :required="isPrimaryMarket"
            :disabled="isSpreadDisabled"
            :rules="isPrimaryMarket ? [reqRateCode] : []"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :key="`currency_${formData.paper_type_id}`"
            :default_value="formData.currency_code"
            label="Moneda"
            placeholder="-"
            type="text"
            disabled
          />
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            :key="`currency_rate_${formData.currency_id}_${currency_value}`"
            v-model="currency_value"
            label="Valor moneda"
            placeholder="-"
            currency="COP"
            hideIcon
            disabled
          />
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            v-model="formData.face_value"
            label="Valor nominal"
            currency="COP"
            hideIcon
            required
            :rules="[req]"
          />
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            v-model="formData.purchase_value"
            label="Valor compra"
            currency="COP"
            hideIcon
            required
            :rules="[req]"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.counterparty_id"
            label="Contraparte"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.counterparties"
            :rules="[req]"
            @update:model-value="formData.counterparty_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.deposit_issuer_id"
            label="Depósito"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.deposits"
            :rules="[req]"
            @update:model-value="formData.deposit_issuer_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="formData.compensation_system"
            label="Sistema compensación"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.compensation_systems"
            :rules="[req]"
            @update:model-value="formData.compensation_system = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.folio"
            label="Folio"
            type="number"
            required
            :rules="[req]"
            @update:model-value="formData.folio = $event"
          />
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import useInformationForm from './InformationForm'

const {
  formData,
  isPrimaryMarket,
  currency_value,
  selectOptions,
  informationFormRef,
  rateTypeOptions,
  isIsinDisabled,
  isRateCodeDisabled,
  periodicityOptions,
  modalityOptions,
  isSpreadDisabled,
  reqRateCode,
  resetForm,
  req,
  dateFmt,
} = useInformationForm()

defineExpose({
  resetForm,
  getValues: () => formData.value,
  validateForm: () => informationFormRef.value?.validate(),
})
</script>
