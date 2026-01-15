<template>
  <q-form ref="formInformationModal" style="max-height: 70vh; overflow: auto">
    <div class="q-px-lg">
      <div class="row q-col-gutter-lg">
        <div class="col-xs-12 col-sm-6 col-md-6">
          <GenericInput
            label="Código cuenta contable"
            required
            :default_value="models.code"
            :disabled="'edit'.includes(action)"
            :rules="[
                (v: string) => useRules().is_required(v, 'El código de cuenta es requerido'),
                (v: string) => useRules().no_consecutive_spaces(v),        
                (v: string) => useRules().only_number(v),
                (v: string) => useRules().max_length(v, 20),
                (v: string) => useRules().not_start_with_zero(v),
              ]"
            @update:model-value="models.code = $event"
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-6">
          <GenericInput
            label="Nombre de la cuenta"
            required
            :default_value="models.name"
            :rules="[
                (v: string) => useRules().is_required(v, 'El nombre de la cuenta es requerido'),
                (v: string) => useRules().min_length(v, 2),
                (v: string) => useRules().max_length(v, 250),
                (v: string) =>useRules().no_consecutive_spaces(v),
              ]"
            @update:model-value="models.name = $event"
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-6 q-pt-none">
          <GenericSelectorComponent
            label="Tipo"
            required
            map_options
            auto_complete
            :default_value="models.type"
            :manual_option="account_chart_types"
            :first_filter_option="'label'"
            :second_filter_option="'code'"
            :disabled="'edit'.includes(action)"
            :rules="[
              (val: string) => useRules().is_required(val, 'El tipo de cuenta es requerido')
            ]"
            @update:model-value="models.type = $event"
          />
        </div>
      </div>

      <div class="col-12 q-pt-none q-px-md">
        <div class="row justify-between items-center">
          <p class="mb-0">Naturaleza*</p>
          <RadioYesNo
            :titleRadioTrue="'Débito'"
            :titleRadioFalse="'Crédito'"
            v-model="models.nature"
          />
        </div>
      </div>
      <q-separator />
      <div class="col-12 q-pt-none q-px-md">
        <div class="row justify-between items-center">
          <p class="mb-0">Estado*</p>
          <RadioYesNo
            :titleRadioTrue="'Activo'"
            :titleRadioFalse="'Inactivo'"
            v-model="models.status_id"
          />
        </div>
      </div>
      <q-separator />
      <div class="col-12 q-pt-none q-px-md">
        <div class="row justify-between items-center">
          <p class="mb-0">Centro de costos*</p>
          <RadioYesNo v-model="models.has_cost_center" />
        </div>
      </div>
      <q-separator />
      <div class="col-12 q-pt-none q-px-md">
        <div class="row justify-between items-center">
          <p class="mb-0">Base de retenciones ICA por ingresos*</p>
          <RadioYesNo v-model="models.applies_ica_withholding_income" />
        </div>
      </div>
      <q-separator />
      <div class="col-12 q-pt-none q-px-md">
        <div class="row justify-between items-center">
          <p class="mb-0">Base de retención utilidades*</p>
          <RadioYesNo v-model="models.applies_withholding_profits" />
        </div>
      </div>
      <q-separator />
      <div class="col-12 q-pt-none q-px-md">
        <div class="row justify-between items-center">
          <p class="mb-0">Reexpresa moneda*</p>
          <RadioYesNo v-model="models.is_currency_reexpressed" />
        </div>
      </div>
      <q-separator />
      <template v-if="models.is_currency_reexpressed">
        <div class="row q-col-gutter-lg q-pt-lg">
          <div class="col-xs-12 col-sm-6 col-md-6 q-pt-md">
            <GenericSelectorComponent
              label="Tipo de moneda"
              :required="false"
              map_options
              auto_complete
              :default_value="models.currency_id"
              :manual_option="coins"
              :rules="models.is_currency_reexpressed ? [(val: string) => useRules().is_required(val, 'El tipo de moneda es requerido')] : [() => true]"
              @update:model-value="models.currency_id = $event"
            />
          </div>
        </div>
        <q-separator />
        <section class="q-pt-md">
          <p class="mb-0 text-weight-bold text-subtitle1">
            Diferencia positiva
          </p>
          <div class="row q-col-gutter-lg q-pt-lg">
            <div class="col-xs-12 col-sm-6 col-md-6 q-pt-md">
              <GenericSelectorComponent
                label="Código de cuenta contable"
                :required="models.is_currency_reexpressed"
                map_options
                auto_complete
                :default_value="
                  models.reexpression_settings.positive?.account_code_id
                "
                :manual_option="account_chart_by_account_structure"
                :rules="models.is_currency_reexpressed ? [(val: string) => useRules().is_required(val)] : [() => true]"
                @update:model-value="
                  models.reexpression_settings.positive.account_code_id = $event
                "
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6 q-pt-md">
              <GenericSelectorComponent
                label="Auxiliar"
                :required="false"
                map_options
                auto_complete
                :default_value="
                  models.reexpression_settings.positive?.third_party_id
                "
                :manual_option="third_parties_formatted"
                :rules="[]"
                @update:model-value="
                  models.reexpression_settings.positive.third_party_id = $event
                "
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6 q-py-md">
              <GenericSelectorComponent
                label="Movimientos de fondos"
                :required="false"
                map_options
                auto_complete
                :default_value="
                  models.reexpression_settings.positive?.fund_movement_id
                "
                :manual_option="movements_codes"
                :rules="[]"
                @update:model-value="
                  models.reexpression_settings.positive.fund_movement_id =
                    $event
                "
              />
            </div>
          </div>
        </section>
        <q-separator />
        <section class="q-pt-md">
          <p class="mb-0 text-weight-bold text-subtitle1">
            Diferencia negativa
          </p>
          <div class="row q-col-gutter-lg q-pt-lg">
            <div class="col-xs-12 col-sm-6 col-md-6 q-pt-md">
              <GenericSelectorComponent
                label="Código de cuenta contable"
                :required="models.is_currency_reexpressed"
                map_options
                auto_complete
                :default_value="
                  models.reexpression_settings.negative?.account_code_id
                "
                :manual_option="account_chart_by_account_structure"
                :rules="models.is_currency_reexpressed ? [(val: string) => useRules().is_required(val)] : [() => true]"
                @update:model-value="
                  models.reexpression_settings.negative.account_code_id = $event
                "
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6 q-pt-md">
              <GenericSelectorComponent
                label="Auxiliar"
                :required="false"
                map_options
                auto_complete
                :default_value="
                  models.reexpression_settings.negative?.third_party_id
                "
                :manual_option="third_parties_formatted"
                :rules="[]"
                @update:model-value="
                  models.reexpression_settings.negative.third_party_id = $event
                "
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6 q-py-md">
              <GenericSelectorComponent
                label="Movimientos de fondos"
                :required="false"
                map_options
                auto_complete
                :default_value="
                  models.reexpression_settings.negative?.fund_movement_id
                "
                :manual_option="movements_codes"
                :rules="[]"
                @update:model-value="
                  models.reexpression_settings.negative.fund_movement_id =
                    $event
                "
              />
            </div>
          </div>
        </section>
      </template>
      <q-separator />
    </div>
  </q-form>
</template>

<script setup lang="ts">
// components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

// interfaces
import { IChartAccount } from '@/interfaces/customs'

// logic view
import useAccountingAccountForm from '@/components/Forms/Accounting/ChartAccounts/information/v2/AccountingAccountForm'

// composables
import { useRules } from '@/composables'
import { ActionType } from '@/interfaces/global'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IChartAccount | null
  }>(),
  {}
)

const {
  coins,
  models,
  movements_codes,
  account_chart_types,
  formInformationModal,
  third_parties_formatted,
  account_chart_by_account_structure,
  getFormData,
} = useAccountingAccountForm(props)

defineExpose({
  validateForm: () => formInformationModal.value?.validate(),
  getFormData: () => getFormData(),
})
</script>
