<template>
  <section v-if="!isLoading">
    <q-form ref="basic_data_form_ref">
      <!-- Información de auditoría (solo en edición) -->
      <template v-if="action === 'edit' && auditInfo">
        <div class="q-mb-lg">
          <p class="text-black-90 text-weight-bold text-h6 q-mb-none">
            Información del registro
          </p>
        </div>

        <div class="row q-col-gutter-md q-mb-lg">
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
            <GenericInput
              label="Estado del registro"
              type="text"
              :required="false"
              :disabled="true"
              :default_value="auditInfo.status_name"
            />
          </div>

          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
            <GenericInput
              label="Fecha de creación"
              type="text"
              :required="false"
              :disabled="true"
              :default_value="auditInfo.created_at?.slice(0, 10)"
            />
          </div>

          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
            <GenericInput
              label="Creado por"
              type="text"
              :required="false"
              :disabled="true"
              :default_value="auditInfo.created_by"
            />
          </div>

          <div
            v-if="auditInfo.updated_at"
            class="col-xs-12 col-sm-6 col-md-4 col-lg-3"
          >
            <GenericInput
              label="Fecha de actualización"
              type="text"
              :required="false"
              :disabled="true"
              :default_value="auditInfo.updated_at?.slice(0, 10)"
            />
          </div>

          <div
            v-if="auditInfo.updated_by"
            class="col-xs-12 col-sm-6 col-md-4 col-lg-3"
          >
            <GenericInput
              label="Actualizado por"
              type="text"
              :required="false"
              :disabled="true"
              :default_value="auditInfo.updated_by"
            />
          </div>
        </div>

        <q-separator class="q-my-lg" />
      </template>

      <!-- Datos Básicos -->
      <div class="q-mb-lg">
        <p class="text-black-90 text-weight-bold text-h6 q-mb-none">
          Datos básicos
        </p>
      </div>

      <div class="row q-col-gutter-md">
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <GenericSelector
            label="Nombre del negocio"
            auto_complete
            return_object
            first_filter_option="label"
            second_filter_option="value"
            :manual_option="business_trusts"
            :map_options="true"
            :required="true"
            :disabled="isView"
            :default_value="models.business_trust_id"
            :rules="[(v) => is_required(v)]"
            @update:modelValue="handleBusinessTrustChange($event)"
          />
        </div>

        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <GenericInput
            label="Número de obligación financiera"
            type="text"
            :required="true"
            :disabled="isView"
            :default_value="models.obligation_number"
            :rules="[
              (v) => is_required(v),
              (v) => min_length(v, 1),
              (v) => max_length(v, 15),
            ]"
            @update:model-value="
              models.obligation_number = $event?.toUpperCase() ?? null
            "
          />
        </div>

        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <GenericSelector
            label="Titular"
            auto_complete
            return_object
            first_filter_option="label"
            second_filter_option="value"
            :manual_option="third_party_nit"
            :map_options="true"
            :required="true"
            :disabled="isView"
            :default_value="models.titular_id"
            :rules="[(v) => is_required(v)]"
            @update:modelValue="handleTitularChange($event)"
          />
        </div>

        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <GenericInput
            label="Identificación"
            type="text"
            :required="false"
            :disabled="true"
            :default_value="titularIdentification"
          />
        </div>

        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <GenericSelector
            label="Banco"
            auto_complete
            return_object
            first_filter_option="label"
            second_filter_option="value"
            :manual_option="banks_initial_balance"
            :map_options="true"
            :required="true"
            :disabled="isView"
            :default_value="models.bank_id"
            :rules="[(v) => is_required(v)]"
            @update:modelValue="handleBankChange($event)"
          />
        </div>

        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <GenericSelector
            label="Tipo de crédito"
            auto_complete
            first_filter_option="label"
            second_filter_option="value"
            :manual_option="credit_types"
            :map_options="true"
            :required="true"
            :disabled="isView"
            :default_value="models.credit_type_id"
            :rules="[(v) => is_required(v)]"
            @update:modelValue="models.credit_type_id = $event"
          />
        </div>

        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <CurrencyInput
            v-model="models.amount"
            :currency="'COP'"
            :placeholder="'Ingrese un valor'"
            currencyLabel="Valor del crédito"
            required
            :disabled="isView"
            :rules="[(v: string) => is_required(v), (v: string) => max_length(v, 25), (v: string) => only_positive_value(v)]"
          />
        </div>

        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <GenericInput
            label="Tasa (%)"
            type="text"
            :required="true"
            :disabled="isView"
            :default_value="models.interest_rate"
            :rules="[(v) => is_required(v), (v) => max_length(v, 6)]"
            @update:model-value="
              models.interest_rate = parseFloat($event) || null
            "
          />
        </div>

        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <GenericSelector
            label="Factor"
            auto_complete
            first_filter_option="label"
            second_filter_option="value"
            :manual_option="factors"
            :map_options="true"
            :required="true"
            :disabled="isView"
            :default_value="models.factor_id"
            :rules="[(v) => is_required(v)]"
            @update:modelValue="models.factor_id = $event"
          />
        </div>

        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <GenericSelector
            label="Periodicidad del pago"
            auto_complete
            first_filter_option="label"
            second_filter_option="value"
            :manual_option="periodicities"
            :map_options="true"
            :required="true"
            :disabled="isView"
            :default_value="models.periodicity_id"
            :rules="[(v) => is_required(v)]"
            @update:modelValue="models.periodicity_id = $event"
          />
        </div>

        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <GenericInput
            label="Plazo (cuotas)"
            type="number"
            :required="true"
            :disabled="isView"
            :default_value="models.quotas"
            :min_value="1"
            :max_value="999"
            :rules="[
              (v) => is_required(v),
              (v) => minimal_quote(1, v, 'Plazo'),
            ]"
            @update:model-value="models.quotas = parseInt($event) || null"
          />
        </div>

        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <GenericInput
            label="Día de pago"
            type="number"
            :required="true"
            :disabled="isView"
            :default_value="models.payment_day"
            :min_value="1"
            :max_value="30"
            :rules="[
              (v) => is_required(v),
              (v) => minimal_quote(1, v, 'Día de pago'),
              (v) => max_quote(30, v, 'Día de pago'),
            ]"
            @update:model-value="models.payment_day = parseInt($event) || null"
          />
        </div>

        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <GenericInput
            label="Días de alerta"
            type="number"
            :required="true"
            :disabled="isView"
            :default_value="models.alert_days"
            :min_value="1"
            :max_value="99"
            :rules="[
              (v) => is_required(v),
              (v) => min_length(v, 1),
              (v) => max_length(v, 2),
            ]"
            @update:model-value="models.alert_days = parseInt($event) || null"
          />
        </div>
      </div>

      <q-separator class="q-my-lg" />

      <!-- Configuración del plan de pagos -->
      <div class="q-mb-lg">
        <p class="text-black-90 text-weight-bold text-h6 q-mb-none">
          Cálculos de la obligación
        </p>
      </div>

      <div class="row q-col-gutter-md">
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <GenericSelector
            label="Método de cálculo de interés"
            auto_complete
            first_filter_option="label"
            second_filter_option="value"
            :manual_option="calculation_methods"
            :map_options="true"
            :required="true"
            :disabled="isView"
            :default_value="models.calculation_method_id"
            :rules="[(v) => is_required(v)]"
            @update:modelValue="models.calculation_method_id = $event"
          />
        </div>

        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <GenericSelector
            label="Base de cálculo"
            auto_complete
            first_filter_option="label"
            second_filter_option="value"
            :manual_option="base_calculations"
            :map_options="true"
            :required="true"
            :disabled="isView"
            :default_value="models.calculation_base_id"
            :rules="[(v) => is_required(v)]"
            @update:modelValue="models.calculation_base_id = $event"
          />
        </div>

        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <GenericSelector
            label="Tipo de cuota"
            auto_complete
            first_filter_option="label"
            second_filter_option="value"
            :manual_option="quota_types"
            :map_options="true"
            :required="true"
            :disabled="isView"
            :default_value="models.quota_type_id"
            :rules="[(v) => is_required(v)]"
            @update:modelValue="models.quota_type_id = $event"
          />
        </div>

        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <GenericSelector
            label="Tipo de amortización"
            auto_complete
            first_filter_option="label"
            second_filter_option="value"
            :manual_option="amortization_types"
            :map_options="true"
            :required="true"
            :disabled="isView"
            :default_value="models.amortization_type_id"
            :rules="[(v) => is_required(v)]"
            @update:modelValue="models.amortization_type_id = $event"
          />
        </div>
      </div>

      <q-separator class="q-my-lg" />

      <!-- Plan de pagos -->
      <div class="q-mb-lg">
        <p class="text-black-90 text-weight-bold text-h6 q-mb-none">
          Plan de pagos
        </p>
      </div>

      <div class="row q-col-gutter-md">
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <GenericInput
            label="Número de cuotas"
            type="number"
            :required="false"
            :disabled="true"
            :default_value="numberOfQuotas"
          />
        </div>

        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <GenericDate
            label="Fecha de inicio plan de pagos"
            :default_value="models.start_date"
            :mask="'YYYY-MM-DD'"
            :required="true"
            :disabled="isView"
            placeholder="Seleccione una fecha"
            :rules="[(v: string) => is_required(v)]"
            @update:modelValue="models.start_date = $event"
          />
        </div>

        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <GenericDate
            label="Fecha final plan de pagos"
            :default_value="models.end_date"
            :mask="'YYYY-MM-DD'"
            :required="false"
            :disabled="true"
            placeholder="Calculada automáticamente"
            :rules="[]"
          />
        </div>

        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <CurrencyInput
            v-model="models.initial_balance"
            :currency="'COP'"
            :placeholder="'Valor del crédito'"
            currencyLabel="Saldo inicial"
            :disabled="true"
          />
        </div>

        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <CurrencyInput
            v-model="models.capital_quota"
            :currency="'COP'"
            :placeholder="'Calculado automáticamente'"
            currencyLabel="Cuota capital"
            :disabled="true"
          />
        </div>
      </div>

      <div class="row justify-end q-mt-lg">
        <Button
          label="Vista previa"
          size="md"
          unelevated
          outline
          color="orange"
          class="text-capitalize btn-filter custom"
          :disabled="!isFormValid"
          @click="openPreviewModal"
        />
      </div>
    </q-form>

    <!-- Modal de vista previa del plan de pagos -->
    <PaymentPlanPreviewModal
      ref="paymentPlanPreviewModalRef"
      :payment_plan_items="paymentPlanItems"
    />
  </section>
</template>

<script setup lang="ts">
// components
import GenericSelector from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDate from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import Button from '@/components/common/Button/Button.vue'
import PaymentPlanPreviewModal from '@/components/Forms/FinancialObligations/FinancialObligation/v2/PaymentPlanPreviewModal/PaymentPlanPreviewModal.vue'

// interfaces
import { ActionType } from '@/interfaces/global'
import {
  IFinancialObligationFormV2,
  IFinancialObligationAuditInfo,
} from '@/interfaces/customs/financial-obligations/v2/FinancialObligation'

// composables
import { useRules } from '@/composables/useRules'

// logic
import useBasicDataForm from '@/components/Forms/FinancialObligations/FinancialObligation/v2/BasicDataForm/BasicDataForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IFinancialObligationFormV2 | null
    auditInfo?: IFinancialObligationAuditInfo | null
  }>(),
  {
    auditInfo: null,
  }
)

const emits =
  defineEmits<(e: 'update:models', value: IFinancialObligationFormV2) => void>()

const {
  is_required,
  max_length,
  min_length,
  minimal_quote,
  max_quote,
  only_positive_value,
} = useRules()

const {
  models,
  basic_data_form_ref,
  isLoading,
  isView,
  business_trusts,
  third_party_nit,
  banks_initial_balance,
  credit_types,
  periodicities,
  factors,
  calculation_methods,
  base_calculations,
  quota_types,
  amortization_types,
  titularIdentification,
  numberOfQuotas,
  isFormValid,
  paymentPlanItems,
  paymentPlanPreviewModalRef,

  handleBusinessTrustChange,
  handleTitularChange,
  handleBankChange,
  openPreviewModal,
} = useBasicDataForm(props, emits)

const { action, auditInfo } = props

defineExpose({
  validateForm: async () => {
    return await basic_data_form_ref.value?.validate()
  },
})
</script>
