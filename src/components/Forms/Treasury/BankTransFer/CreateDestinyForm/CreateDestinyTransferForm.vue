<template>
  <q-card-section>
    <q-card-section>
      <div class="row q-col-gutter-md">
        <div class="col-xs-12">
          <p class="text-h6 text-weight-bold">Descripción destino</p>
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
            :default_value="formManagerDestinyBankTransfer.businessId"
            @update:modelValue="
              formManagerDestinyBankTransfer.businessId = $event
            "
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
            :default_value="formManagerDestinyBankTransfer.movementValue"
            :disabled="getMovementsOptions.length === 0"
            @update:modelValue="
              formManagerDestinyBankTransfer.movementValue = $event
            "
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
            :default_value="formManagerDestinyBankTransfer.bankDescription"
            @update:modelValue="
              formManagerDestinyBankTransfer.bankDescription = $event
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
            :default_value="formManagerDestinyBankTransfer.bankAccountValue"
            @update:modelValue="
              formManagerDestinyBankTransfer.bankAccountValue = $event
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
              formManagerDestinyBankTransfer.businessType === 1 ||
              formManagerDestinyBankTransfer.businessType === 9 ||
              true
            "
            :default_value="formManagerDestinyBankTransfer.fundValue"
            @update:modelValue="
              formManagerDestinyBankTransfer.fundValue = $event
            "
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
            :required="true"
            :disabled="
              getInversionPlan.length === 0 ||
              formManagerDestinyBankTransfer.businessType === 1 ||
              formManagerDestinyBankTransfer.businessType === 9
            "
            :manual_option="getInversionPlan"
            :default_value="formManagerDestinyBankTransfer.inversionPlan"
            @update:modelValue="
              formManagerDestinyBankTransfer.inversionPlan = $event
            "
            :rules="[(v: string) => is_required(v)]"
            :placeholder="
              getInversionPlan.length === 0
                ? 'No hay opciones disponibles'
                : 'Seleccione'
            "
          />
        </div>
        <div class="col-xs-12 col-sm-3 col-md-4">
          <GenericSelector
            label="Tipo de recaudo"
            auto_complete
            first_filter_option="label"
            second_filter_option="value"
            :manual_option="getTypeReceive"
            :map_options="true"
            :required="true"
            :disabled="getTypeReceive.length === 0"
            :default_value="formManagerDestinyBankTransfer.paymentMethod"
            @update:modelValue="
              formManagerDestinyBankTransfer.paymentMethod = $event
            "
            :rules="[(v: string) => is_required(v)]"
            :placeholder="
              getTypeReceive.length === 0
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
            :default_value="formManagerDestinyBankTransfer.currencyValue"
            @update:modelValue="
              formManagerDestinyBankTransfer.currencyValue = $event
            "
            :rules="[]"
          />
        </div>

        <div class="col-xs-12 col-sm-3 col-md-4">
          <CurrencyInput
            v-model="formManagerDestinyBankTransfer.amountInForeignCurrency"
            :currency="'COP'"
            :disabled="getDisableByMoneyType"
            :placeholder="'Seleccione una cuenta'"
            currencyLabel="Valor moneda extranjera"
            :rules="[(v: string) => max_length(v, 40)]"
          />
        </div>

        <div class="col-xs-12 col-sm-3 col-md-4">
          <GenericInput
            label="TRM"
            :required="true"
            type="number"
            :disabled="true"
            :default_value="formManagerDestinyBankTransfer.trmValue"
            @update:modelValue="
              formManagerDestinyBankTransfer.trmValue = $event
            "
            :rules="[]"
          />
        </div>
        <div class="col-xs-12 col-sm-3 col-md-3">
          <GenericInput
            label="Naturaleza"
            :required="true"
            type="text"
            :disabled="true"
            :default_value="formManagerDestinyBankTransfer.natureValue"
            @update:modelValue="
              formManagerDestinyBankTransfer.natureValue = $event
            "
            :rules="[]"
          />
        </div>
        <div class="col-xs-12 col-sm-3 col-md-3">
          <CurrencyInput
            v-model="formManagerDestinyBankTransfer.costValue"
            :currency="'COP'"
            :disabled="true"
            :placeholder="'Seleccione una cuenta'"
            currencyLabel="Valor"
            :rules="[(v: string) => max_length(v, 40)]"
          />
        </div>
        <div class="col-xs-12 col-sm-3 col-md-3">
          <GenericSelector
            label="Centro de costos"
            auto_complete
            first_filter_option="label"
            second_filter_option="value"
            :manual_option="cost_centers"
            :map_options="true"
            :required="true"
            :disabled="cost_centers.length === 0"
            :default_value="formManagerDestinyBankTransfer.costCenter"
            @update:modelValue="
              formManagerDestinyBankTransfer.costCenter = $event
            "
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
            :default_value="formManagerDestinyBankTransfer.cashFlow"
            @update:modelValue="
              formManagerDestinyBankTransfer.cashFlow = $event
            "
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
            v-model="formManagerDestinyBankTransfer.bankAccountBalance"
            :currency="'COP'"
            :disabled="true"
            :placeholder="'Seleccione una cuenta'"
            currencyLabel="Saldo cuenta bancaria"
            :rules="[(v: string) => max_length(v, 40)]"
          />
        </div>
        <div class="col-xs-12 col-sm-6">
          <CurrencyInput
            v-model="formManagerDestinyBankTransfer.investmentPlanBalance"
            :currency="'COP'"
            :disabled="true"
            :placeholder="'Seleccione una cuenta'"
            currencyLabel="Saldo plan de inversión"
            :rules="[(v: string) => max_length(v, 40)]"
          />
        </div>
      </div>
    </q-card-section>
    <q-card-actions align="right" class="q-my-md">
      <Button
        :outline="true"
        :class-custom="'custom'"
        @click="handlerGoPrevTab('origin-data')"
        label="Volver"
        size="md"
        color="orange"
      />
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
import useCreateTransferDestinyForm from '@/components/Forms/Treasury/BankTransFer/CreateDestinyForm/CreateDestinyTransferForm'

const { is_required, max_length } = useRules()

const {
  formManagerDestinyBankTransfer,
  getBankOptions,
  getBankAccountOptions,
  getBusinessTrustOptions,
  getMovementsOptions,
  getInversionPlan,
  getCashFlowStructureEgresoOptions,
  getFundsOptions,
  getDisableByMoneyType,
  cost_centers,
  getTypeReceive,
  handlerGoPrevTab,
  handleContinue,
} = useCreateTransferDestinyForm()
</script>
