<template>
  <q-card-section>
    <q-card-section>
      <div class="row q-col-gutter-md">
        <div class="col-xs-12">
          <p class="text-h6 text-weight-bold">Descripción origen</p>
        </div>

        <div class="col-xs-12 col-sm-3">
          <GenericSelector
            label="Negocio"
            auto_complete
            first_filter_option="label"
            second_filter_option="value"
            :manual_option="getBusinessTrustOptions"
            :map_options="true"
            :required="true"
            :disabled="getBusinessTrustOptions.length === 0"
            :default_value="formManagerBankTransfer.businessId"
            @update:modelValue="formManagerBankTransfer.businessId = $event"
            :rules="[(v: string) => is_required(v)]"
            :placeholder="
              getBusinessTrustOptions.length === 0
                ? 'No hay opciones disponibles'
                : 'Seleccione'
            "
          />
        </div>

        <div class="col-xs-12 col-sm-3">
          <GenericSelector
            label="Movimiento"
            auto_complete
            first_filter_option="label"
            second_filter_option="value"
            :manual_option="getMovementsOptions"
            :map_options="true"
            :required="true"
            :default_value="formManagerBankTransfer.movementValue"
            :disabled="getMovementsOptions.length === 0"
            @update:modelValue="formManagerBankTransfer.movementValue = $event"
            :rules="[(v: string) => is_required(v)]"
            :placeholder="
              getMovementsOptions.length === 0
                ? 'No hay opciones disponibles'
                : 'Seleccione'
            "
          />
        </div>

        <div class="col-xs-12 col-sm-3">
          <GenericSelector
            label="Banco"
            auto_complete
            first_filter_option="label"
            second_filter_option="value"
            :manual_option="getBankOptions"
            :map_options="true"
            :required="true"
            :disabled="getBankOptions.length === 0"
            :default_value="formManagerBankTransfer.bankDescription"
            @update:modelValue="
              formManagerBankTransfer.bankDescription = $event
            "
            :rules="[(v: string) => is_required(v)]"
            :placeholder="
              getBankOptions.length === 0
                ? 'No hay opciones disponibles'
                : 'Seleccione'
            "
          />
        </div>

        <div class="col-xs-12 col-sm-3">
          <GenericSelector
            label="Cuenta bancaria"
            auto_complete
            first_filter_option="label"
            second_filter_option="value"
            :manual_option="getBankAccountOptions"
            :map_options="true"
            :required="true"
            :disabled="getBankAccountOptions.length === 0"
            :default_value="formManagerBankTransfer.bankAccountValue"
            @update:modelValue="
              formManagerBankTransfer.bankAccountValue = $event
            "
            :rules="[(v: string) => is_required(v)]"
            :placeholder="
              getBankAccountOptions.length === 0
                ? 'No hay opciones disponibles'
                : 'Seleccione'
            "
          />
        </div>

        <div class="col-xs-12 col-sm-3 col-md-4">
          <GenericSelector
            label="Fondo"
            auto_complete
            first_filter_option="label"
            second_filter_option="value"
            :map_options="true"
            :required="false"
            :manual_option="getFundsOptions"
            :disabled="
              getFundsOptions.length === 0 ||
              formManagerBankTransfer.businessType === 1 ||
              formManagerBankTransfer.businessType === 9
            "
            :default_value="formManagerBankTransfer.fundValue"
            @update:modelValue="formManagerBankTransfer.fundValue = $event"
            :rules="[]"
            :placeholder="
              getFundsOptions.length === 0
                ? 'No hay opciones disponibles'
                : 'Seleccione'
            "
          />
        </div>
        <div class="col-xs-12 col-sm-3 col-md-4">
          <GenericSelector
            label="Plan de inversión"
            auto_complete
            first_filter_option="label"
            second_filter_option="value"
            :map_options="true"
            :required="false"
            :disabled="
              getInversionPlan.length === 0 ||
              formManagerBankTransfer.businessType === 1 ||
              formManagerBankTransfer.businessType === 9
            "
            :manual_option="getInversionPlan"
            :default_value="formManagerBankTransfer.inversionPlan"
            @update:modelValue="formManagerBankTransfer.inversionPlan = $event"
            :rules="[]"
            :placeholder="
              getInversionPlan.length === 0
                ? 'No hay opciones disponibles'
                : 'Seleccione'
            "
          />
        </div>
        <div class="col-xs-12 col-sm-3 col-md-4">
          <GenericSelector
            label="Forma de pago"
            auto_complete
            first_filter_option="label"
            second_filter_option="value"
            :manual_option="getPaymentsOptions"
            :map_options="true"
            :required="true"
            :disabled="getPaymentsOptions.length === 0"
            :default_value="formManagerBankTransfer.paymentMethod"
            @update:modelValue="formManagerBankTransfer.paymentMethod = $event"
            :rules="[(v: string) => is_required(v)]"
            :placeholder="
              getPaymentsOptions.length === 0
                ? 'No hay opciones disponibles'
                : 'Seleccione'
            "
          />
        </div>

        <div class="col-xs-12 col-sm-3 col-md-4">
          <GenericInput
            label="Moneda"
            :required="true"
            type="text"
            :disabled="true"
            :default_value="formManagerBankTransfer.currencyValue"
            @update:modelValue="formManagerBankTransfer.currencyValue = $event"
            :rules="[]"
          />
        </div>

        <div class="col-xs-12 col-sm-3 col-md-4">
          <CurrencyInput
            v-model="formManagerBankTransfer.amountInForeignCurrency"
            :currency="'COP'"
            :disabled="getDisableByMoneyType"
            :placeholder="'Insertar'"
            currencyLabel="Valor moneda extranjera*"
            :rules="[(v: string) => max_length(v, 40)]"
          />
        </div>

        <div class="col-xs-12 col-sm-3 col-md-4">
          <GenericInput
            label="TRM"
            :required="true"
            type="number"
            :disabled="true"
            :default_value="formManagerBankTransfer.trmValue"
            @update:modelValue="formManagerBankTransfer.trmValue = $event"
            :rules="[]"
          />
        </div>
        <div class="col-xs-12 col-sm-3 col-md-3">
          <GenericInput
            label="Naturaleza"
            :required="true"
            type="text"
            :disabled="true"
            :default_value="formManagerBankTransfer.natureValue"
            @update:modelValue="formManagerBankTransfer.natureValue = $event"
            :rules="[]"
          />
        </div>
        <div class="col-xs-12 col-sm-3 col-md-3">
          <CurrencyInput
            v-model="formManagerBankTransfer.costValue"
            :currency="'COP'"
            :disabled="getDisableValue"
            :placeholder="'Inserte'"
            :required="true"
            currencyLabel="Valor"
            :rules="[
              (v: string) => max_length(v, 40),
              (v: string) => is_required(v),
            ]"
          />
        </div>
        <div class="col-xs-12 col-sm-3 col-md-3">
          <GenericSelector
            label="Centro de costos*"
            auto_complete
            first_filter_option="label"
            second_filter_option="value"
            :manual_option="cost_centers"
            :map_options="true"
            :required="false"
            :disabled="!cost_centers.length"
            :default_value="formManagerBankTransfer.costCenter"
            @update:modelValue="formManagerBankTransfer.costCenter = $event"
            :rules="[(v: string) => is_required(v)]"
            :placeholder="
              cost_centers.length === 0
                ? 'No hay opciones disponibles'
                : 'Seleccione'
            "
          />
        </div>
        <div class="col-xs-12 col-sm-3 col-md-3">
          <GenericSelector
            label="Flujo de caja"
            auto_complete
            first_filter_option="label"
            second_filter_option="value"
            :manual_option="getCashFlowStructureEgresoOptions"
            :map_options="true"
            :required="true"
            :disabled="getCashFlowStructureEgresoOptions.length === 0"
            :default_value="formManagerBankTransfer.cashFlow"
            @update:modelValue="formManagerBankTransfer.cashFlow = $event"
            :rules="[]"
            :placeholder="
              getCashFlowStructureEgresoOptions.length === 0
                ? 'No hay opciones disponibles'
                : 'Seleccione'
            "
          />
        </div>
        <div class="col-xs-12 q-mt-md">
          <p class="text-h6 text-weight-bold">Saldos</p>
        </div>
        <div class="col-xs-12 col-sm-6">
          <CurrencyInput
            v-model="formManagerBankTransfer.bankAccountBalance"
            :currency="'COP'"
            :disabled="true"
            :placeholder="'Sin definir'"
            currencyLabel="Saldo cuenta bancaria*"
            :rules="[(v: string) => max_length(v, 40)]"
          />
        </div>
        <div class="col-xs-12 col-sm-6">
          <CurrencyInput
            v-model="formManagerBankTransfer.investmentPlanBalance"
            :currency="'COP'"
            :disabled="true"
            :placeholder="'Sin definir'"
            currencyLabel="Saldo plan de inversión*"
            :rules="[(v: string) => max_length(v, 40)]"
          />
        </div>
      </div>
    </q-card-section>
    <q-card-actions align="right" class="q-my-md">
      <Button
        :outline="false"
        :class-custom="'custom'"
        @click="handleContinue"
        label="Continuar"
        size="md"
        color="orange"
      />
    </q-card-actions>
  </q-card-section>
</template>
<script lang="ts" setup>
// components
import GenericSelector from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import Button from '@/components/common/Button/Button.vue'

// composables
import { useRules } from '@/composables'
import useCreateTransferForm from '@/components/Forms/Treasury/BankTransFer/CreateOriginForm/CreateOriginTransferForm'

const { is_required, max_length } = useRules()

const {
  formManagerBankTransfer,
  getBusinessTrustOptions,
  getBankOptions,
  getBankAccountOptions,
  getMovementsOptions,
  getInversionPlan,
  getCashFlowStructureEgresoOptions,
  getFundsOptions,
  getDisableByMoneyType,
  getDisableValue,
  getPaymentsOptions,

  cost_centers,
  handleContinue,
} = useCreateTransferForm()
</script>
