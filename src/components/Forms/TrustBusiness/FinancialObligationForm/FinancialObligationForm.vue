<template>
  <q-card class="q-pa-md">
    <q-form @submit="handlerSubmit">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
            <GenericInput
              label="Nombre"
              :required="true"
              :disabled="true"
              :default_value="basicFormFinancialObligation.businessTrustName"
              :rules="[(v) => is_required(v), (v) => min_length(v, 2)]"
              @update:model-value="
                basicFormFinancialObligation.businessTrustName = $event
              "
            />
          </div>
          <div
            class="col-xs-12 col-sm-6 col-md-4 col-lg-3"
            v-if="props.action === 'edit'"
          >
            <GenericDate
              :label="'Fecha confirmación bancaria'"
              :default_value="financialObligationLastModification"
              :mask="'YYYY-MM-DD'"
              :required="'edit'.includes(props.action)"
              :placeholder="'Inserte una fecha'"
              :rules="[
                (v: string) => is_required(v),
                (v: string) => date_before_or_equal_to_the_current_date(v),
              ]"
              @update:modelValue="financialObligationLastModification = $event"
            />
          </div>
        </div>
        <div class="row q-col-gutter-md">
          <div class="col-12">
            <p class="text-black text-weight-medium text-h6 q-mb-none">
              Datos generales
            </p>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
            <GenericSelector
              label="Banco"
              auto_complete
              first_filter_option="label"
              second_filter_option="value"
              :manual_option="getBankListOptions"
              :map_options="true"
              :disabled="getDisabledFieldsEdit"
              :required="true"
              :default_value="basicFormFinancialObligation.bankName"
              @update:modelValue="
                basicFormFinancialObligation.bankName = $event
              "
              :rules="[(v) => is_required(v)]"
            />
          </div>

          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
            <GenericSelector
              label="Tipo de crédito"
              auto_complete
              first_filter_option="label"
              second_filter_option="value"
              :manual_option="getCreditTypeOptions"
              :map_options="true"
              :required="true"
              :disabled="false"
              :default_value="basicFormFinancialObligation.creditType"
              @update:modelValue="
                basicFormFinancialObligation.creditType = $event
              "
              :rules="[(v) => is_required(v)]"
            />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
            <GenericSelector
              label="Periodicidad del pago"
              auto_complete
              first_filter_option="label"
              second_filter_option="value"
              :manual_option="getPaymentFrequencyOptions"
              :map_options="true"
              :required="true"
              :disabled="false"
              :default_value="basicFormFinancialObligation.paymentPeriod"
              @update:modelValue="
                basicFormFinancialObligation.paymentPeriod = $event
              "
              :rules="[(v) => is_required(v)]"
            />
          </div>

          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
            <CurrencyInput
              v-model="basicFormFinancialObligation.paymentValue"
              :currency="'COP'"
              :placeholder="'Ingrese un valor'"
              currencyLabel="Valor del crédito"
              required
              :rules="[ 
              (v: string) => is_required(v), 
              (v: string) => max_length(v, 40)
               ]"
            />
          </div>

          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
            <GenericInput
              label="Plazo"
              type="number"
              :required="true"
              :default_value="basicFormFinancialObligation.paymentTerm"
              :rules="[
                (v) => is_required(v),
                (v) => minimal_quote(1, v, 'Plazo'),
                (v) => max_length(v, 4),
              ]"
              :min_value="1"
              @update:model-value="
                basicFormFinancialObligation.paymentTerm = $event
              "
            />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
            <GenericInput
              label="Número de obligación"
              :required="true"
              :disabled="getDisabledFieldsEdit"
              :default_value="basicFormFinancialObligation.paymentNumber"
              :rules="[(v) => is_required(v), (v) => max_length(v, 30)]"
              @update:model-value="
                basicFormFinancialObligation.paymentNumber = $event
              "
            />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
            <GenericInput
              label="Tasa(%)"
              :required="true"
              type="text"
              :default_value="basicFormFinancialObligation.interestRate"
              :rules="[(v) => is_required(v), (v) => max_length(v, 5)]"
              @update:model-value="
                basicFormFinancialObligation.interestRate = $event
              "
            />
          </div>

          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
            <GenericInput
              label="Titular"
              :required="true"
              :default_value="basicFormFinancialObligation.accountHolder"
              :disabled="getDisabledFieldsEdit"
              :rules="[(v) => is_required(v), (v) => max_length(v, 30)]"
              @update:model-value="
                basicFormFinancialObligation.accountHolder = $event
              "
            />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
            <GenericInput
              label="Nit"
              :required="true"
              type="number"
              :default_value="basicFormFinancialObligation.nitNumber"
              :disabled="getDisabledFieldsEdit"
              :rules="[(v) => is_required(v), (v) => max_length(v, 9)]"
              :min_value="1"
              @update:model-value="
                basicFormFinancialObligation.nitNumber = $event
              "
            />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
            <GenericInput
              label="Día de pago"
              :required="true"
              :disabled="false"
              type="number"
              :default_value="basicFormFinancialObligation.payDay"
              :rules="[
                (v) => is_required(v),
                (v) => minimal_quote(1, v, 'Día de pago'),
                (v) => max_length(v, 2),
                (v) => max_quote(31, v, 'Día de pago'),
              ]"
              :min_value="1"
              :max_value="31"
              @update:model-value="basicFormFinancialObligation.payDay = $event"
            />
          </div>

          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
            <GenericInput
              label="Días de alerta"
              :required="true"
              :disabled="false"
              type="number"
              :default_value="basicFormFinancialObligation.warningDays"
              :rules="[
                (v) => is_required(v),
                (v) => length_between(v, 1, 3),
                (v) => {
                  if (!v) return true
                  const num = parseInt(v)
                  if (num < 1) return 'El número debe ser mayor o igual a 1'
                  if (num > 365) return 'El número debe ser menor o igual a 365'
                  return true
                },
              ]"
              :min_value="1"
              :max_value="365"
              @update:model-value="
                basicFormFinancialObligation.warningDays = $event
              "
            />
          </div>
        </div>
      </q-card-section>
      <q-separator inset />
      <q-card-actions align="right" class="q-my-md">
        <Button
          :outline="false"
          :class-custom="'custom'"
          type="submit"
          :label="props.action === 'edit' ? 'Actualizar' : 'Crear'"
          size="md"
          color="orange"
        />
      </q-card-actions>
    </q-form>
  </q-card>
  <InfoModal
    ref="alertModalRef"
    styleModal="min-width: 470px"
    :title="alertModalConfig.title"
    :description_message="alertModalConfig.description"
    :textBtnConfirm="alertModalConfig.btnLabel"
    :loader="alertModalConfig.loader"
    :show-btn-cancel="false"
    :show-btn-confirm="false"
  >
    <template #default-body>
      <div class="q-mx-xl">
        <GenericInput
          :label="alertModalConfig.selectorLabel"
          :required="true"
          :disabled="getDisableField"
          :default_value="addSelectorValue"
          :rules="[
            (v) => is_required(v, alertModalConfig.selectorLabel),
            (v) =>
              max_length(v, alertModalConfig.type === 'credit-type' ? 20 : 30),
            (v) => min_length(v, 3),
          ]"
          @update:model-value="addSelectorValue = $event"
        />
      </div>
    </template>
    <template #custom-actions>
      <Button
        outline
        label="Cancelar"
        size="md"
        unelevated
        color="orange"
        class="text-capitalize btn-filter custom"
        @click="closeModalInput"
      />
      <Button
        :outline="false"
        label="Crear"
        size="md"
        unelevated
        color="orange"
        :disabled="!addSelectorValue"
        @click="
          handlerUpdateSelector(
            alertModalConfig,
            addSelectorValue,
            getCreditTypeOptions,
            getPaymentFrequencyOptions
          )
        "
      />
    </template>
  </InfoModal>
</template>

<script setup lang="ts">
// components
import GenericSelector from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDate from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'

import Button from '@/components/common/Button/Button.vue'
import InfoModal from '@/components/common/AlertModal/AlertModalComponent.vue'

import useFinancialObligationForm from '@/components/Forms/TrustBusiness/FinancialObligationForm/FinancialObligationForm'
import { ISelectorAddTypes } from '@/interfaces/customs'
import { useRules } from '@/composables'

const props = withDefaults(
  defineProps<{
    action: ISelectorAddTypes
  }>(),
  {
    action: 'default',
  }
)

const {
  is_required,
  max_length,
  length_between,
  min_length,
  minimal_quote,
  max_quote,
  date_before_or_equal_to_the_current_date,
} = useRules()

const {
  basicFormFinancialObligation,
  financialObligationLastModification,
  getDisabledFieldsEdit,
  getBankListOptions,
  getCreditTypeOptions,
  getPaymentFrequencyOptions,
  handlerSubmit,
  alertModalConfig,
  alertModalRef,
  addSelectorValue,
  closeModalInput,
  handlerUpdateSelector,
  getDisableField,
} = useFinancialObligationForm(props)
</script>
