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
            :manual_option="withdrawal_participation_unit_local_currency"
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

        <!-- 3) Moneda -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <GenericInput
            v-if="!isView"
            label="Moneda"
            :default_value="models.currency_id"
            :required="true"
            disabled
            placeholder="COP"
            :rules="[
              (v) =>
                useRules().is_required(v, 'La moneda de origen es requerida'),
            ]"
            @update:model-value="models.currency_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Moneda origen</p>
            <p class="text-weight-medium no-margin">
              {{ models.currency_id ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- 4) Valor moneda -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <GenericInput
            v-if="!isView"
            label="Valor moneda"
            :default_value="models.value_currency"
            :required="true"
            placeholder="1"
            disabled
            :rules="[
              (v) => useRules().is_required(v, 'El valor moneda es requeridos'),
            ]"
            @update:model-value="models.value_currency = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Valor moneda</p>
            <p class="text-weight-medium no-margin">
              {{ models.cash_value_currency ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- 5) Código operación  -->
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

        <!-- 6) Descripción operación  -->
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

        <!-- 7) Tipo de papel -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <GenericInput
            v-if="!isView"
            label="Tipo de papel"
            :default_value="models.details?.paper_type ?? ''"
            :required="true"
            disabled
            placeholder="-"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo de papel</p>
            <p class="text-weight-medium no-margin">
              {{ models.details?.paper_type ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- 8) N participación  -->
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

        <!-- 9) N título  -->
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

        <!-- 10) Saldo moneda origen -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <CurrencyInput
            v-if="!isView"
            v-model="models.current_participation_balance_in_pesos"
            :currency="'COP'"
            label="Saldo en participación en pesos"
            placeholder="-"
            :disabled="true"
            currencyLabel=""
            :rules="[
      (val: string) => useRules().is_required(val, 'El saldo en participación en pesos es requerido'),
      (val: string) => useRules().max_length(val, 17),
      (val: string) => useRules().min_length(val, 1),
    ]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Saldo en participación en pesos
            </p>
            <p class="text-weight-medium no-margin">
              {{
                models.current_participation_balance_in_pesos ?? 'No registrado'
              }}
            </p>
          </div>
        </div>

        <!-- 11) Saldo actual en unidades  -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <GenericInput
            v-if="!isView"
            :default_value="models.current_balance_in_units"
            :currency="'COP'"
            label="Saldo actual en unidades"
            placeholder="-"
            disabled
            :rules="[
      (val: string) => useRules().is_required(val, 'El saldo actual en unidades es requerido'),
      (val: string) => useRules().max_length(val, 17),
      (val: string) => useRules().min_length(val, 1),
    ]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Saldo actual en unidades</p>
            <p class="text-weight-medium no-margin">
              {{ models.current_balance_in_units ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- 12) Valor retiro -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <GenericInput
            v-if="!isView"
            label="Valor retiro"
            :default_value="models.withdrawal_value"
            :required="true"
            placeholder="0"
            :rules="[
              (v) => useRules().is_required(v, 'El valor retiro es requeridos'),
            ]"
            @update:model-value="models.withdrawal_value = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Valor retiro</p>
            <p class="text-weight-medium no-margin">
              {{ models.withdrawal_value ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- 13) Saldo actual en unidades  -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <CurrencyInput
            v-if="!isView"
            v-model="models.participation_balance_in_pesos"
            :currency="'COP'"
            label="Saldo actual participa en pesos"
            placeholder="-"
            :disabled="true"
            currencyLabel=""
            :rules="[
      (val: string) => useRules().is_required(val, 'El saldo actual participa en pesos es requerido'),
      (val: string) => useRules().max_length(val, 17),
      (val: string) => useRules().min_length(val, 1),
    ]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Saldo actual en unidades</p>
            <p class="text-weight-medium no-margin">
              {{ models.participation_balance_in_pesos ?? 'No registrado' }}
            </p>
          </div>
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
import { ILocalCurrencyWithdrawalParticipationForm } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'
import useBasicOperationForm from './BasicOperationForm'

const props = defineProps<{
  action: ActionType
  data?: ILocalCurrencyWithdrawalParticipationForm | null
}>()

const {
  models,
  formElementRef,
  isView,
  resetForm,
  class_portfolio,
  operation_type,
  withdrawal_participation_unit_local_currency,
} = useBasicOperationForm(props)
defineExpose({
  resetForm,
  validateForm: () => formElementRef.value?.validate(),
})
</script>
