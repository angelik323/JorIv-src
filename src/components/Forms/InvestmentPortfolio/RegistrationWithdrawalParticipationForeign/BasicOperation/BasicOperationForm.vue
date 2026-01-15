<template>
  <q-form ref="formElementRef" class="q-pa-lg">
    <section>
      <div class="row q-col-gutter-lg">
        <!-- 1) Unidad -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <GenericSelector
            v-if="!isView"
            label="Unidad"
            :default_value="models.details?.unit_value"
            :manual_option="withdrawal_participation_unit_foreign_currency"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="true"
            :disabled="action === 'edit'"
            :rules="[
              (v) => useRules().is_required(v, 'La unidad es requerida'),
            ]"
            @update:model-value="(val) => (models.details!.unit_value = val)"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Unidad</p>
            <p class="text-weight-medium no-margin">
              {{ models.unit ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- 2) Clase cartera-->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <GenericSelector
            v-if="!isView"
            label="Clase cartera"
            :default_value="models.portfolio_class"
            :manual_option="class_portfolio"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="true"
            :disabled="action === 'edit'"
            :rules="[
              (v) =>
                useRules().is_required(v, 'La clase de cartera es requerida'),
            ]"
            @update:model-value="models.portfolio_class = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Clase cartera</p>
            <p class="text-weight-medium no-margin">
              {{ models.portfolio_class ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- 3) Tipo papel -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <GenericInput
            v-if="!isView"
            label="Tipo papel"
            :default_value="models.security_type"
            :required="true"
            disabled
            placeholder="-"
            :rules="[
              (v) => useRules().is_required(v, 'El tipo de papel es requerido'),
            ]"
            @update:model-value="models.security_type = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo papel</p>
            <p class="text-weight-medium no-margin">
              {{ models.security_type ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- 4) Moneda origen -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <GenericInput
            v-if="!isView"
            label="Moneda origen"
            :default_value="models.origin_currency"
            :required="true"
            disabled
            placeholder="-"
            :rules="[
              (v) =>
                useRules().is_required(v, 'La moneda de origen es requerida'),
            ]"
            @update:model-value="models.origin_currency = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Moneda origen</p>
            <p class="text-weight-medium no-margin">
              {{ models.origin_currency ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- 5) ISIN -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <GenericInput
            v-if="!isView"
            label="ISIN"
            :default_value="models.isin"
            :required="true"
            disabled
            placeholder="-"
            :rules="[(v) => useRules().is_required(v, 'El ISIN es requerido')]"
            @update:model-value="models.isin = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">ISIN</p>
            <p class="text-weight-medium no-margin">
              {{ models.isin ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- 6) Código operación  -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <GenericSelector
            v-if="!isView"
            label="Código operación"
            :default_value="models.operation_code"
            :manual_option="operation_type"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="true"
            :disabled="action === 'edit'"
            :rules="[
              (v) =>
                useRules().is_required(
                  v,
                  'El código de operación es requerido'
                ),
            ]"
            @update:model-value="models.operation_code = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Código operación</p>
            <p class="text-weight-medium no-margin">
              {{ models.operation_code ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- 7) Descripción operación  -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <GenericInput
            v-if="!isView"
            label="Descripción operación"
            :default_value="models.operation_description"
            :required="true"
            disabled
            placeholder="-"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Descripción operación</p>
            <p class="text-weight-medium no-margin">
              {{ models.operation_description ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- 8) N Días operación de contado -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <GenericInput
            v-if="!isView"
            label="N Días operación de contado"
            :default_value="models.cash_operation_days"
            :required="true"
            placeholder="0"
            :rules="[
              (v) =>
                useRules().is_required(v, 'Los días de contado son requeridos'),
            ]"
            @update:model-value="models.cash_operation_days = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              N Días operación de contado
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.cash_operation_days ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- 9) N participación  -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <GenericInput
            v-if="!isView"
            label="N participación"
            :default_value="models.participation_count"
            :required="true"
            disabled
            placeholder="-"
            :rules="[
              (v) => useRules().is_required(v, 'La participación es requerida'),
            ]"
            @update:model-value="models.participation_count = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">N participación</p>
            <p class="text-weight-medium no-margin">
              {{ models.participation_count ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- 10) N título  -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <GenericInput
            v-if="!isView"
            label="N título"
            :default_value="models.title_count"
            :required="true"
            disabled
            placeholder="-"
            :rules="[
              (v) =>
                useRules().is_required(v, 'El número de título es requerido'),
            ]"
            @update:model-value="models.title_count = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">N título</p>
            <p class="text-weight-medium no-margin">
              {{ models.title_count ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- 11) Saldo moneda origen -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <CurrencyInput
            :model-value="models.origin_currency_balance ?? null"
            @update:model-value="
              (val) => (models.origin_currency_balance = val ?? null)
            "
            :currency="'COP'"
            label="Saldo moneda origen"
            placeholder="-"
            currencyLabel=""
            disabled
          />
        </div>

        <!-- 12) Valor unidad moneda origen  -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <CurrencyInput
            :model-value="models.origin_currency_unit_value ?? null"
            @update:model-value="
              (val) => (models.origin_currency_unit_value = val ?? null)
            "
            :currency="'COP'"
            label="Valor unidad moneda origen"
            placeholder="-"
            currencyLabel=""
            disabled
          />
        </div>

        <!-- 13) Saldo actual en unidades  -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <GenericInput
            v-if="!isView"
            label="Saldo actual en unidades"
            :default_value="models.current_balance_units ?? ''"
            disabled
            placeholder="-"
            @update:model-value="(val) => (models.current_balance_units = val)"
            :rules="[]"
          />
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelector from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import { useRules } from '@/composables'
import { IForeignCurrencyWithdrawalParticipationForm } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'
import useBasicOperationForm from './BasicOperationForm'

const props = defineProps<{
  action: ActionType
  data?: IForeignCurrencyWithdrawalParticipationForm | null
}>()

const {
  models,
  formElementRef,
  isView,
  class_portfolio,
  operation_type,
  resetForm,
  withdrawal_participation_unit_foreign_currency,
} = useBasicOperationForm(props)
defineExpose({
  resetForm,
  validateForm: () => formElementRef.value?.validate(),
})
</script>
