<template>
  <q-form
    ref="detailFormElementRef"
    :class="['create', 'edit'].includes(action) ? 'q-pa-lg' : 'q-pa-sm'"
  >
    <section>
      <p
        v-if="['create', 'edit'].includes(action)"
        class="text-black-10 text-weight-bold text-h6"
      >
        Detalle
      </p>
      <div class="row q-col-gutter-lg">
        <div class="col-xs-12 col-sm-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="NIT Beneficiario"
            :default_value="modelsForm.nit_third_party_id"
            :manual_option="third_parties"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="true"
            :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El campo NIT Beneficiario es requerido'),
              ]"
            @update:model-value="modelsForm.nit_third_party_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">NIT Beneficiario</p>
            <p class="text-weight-medium no-margin">
              {{
                modelsView.third_party?.id
                  ? `${modelsView.third_party?.document ?? ''} - ${
                      modelsView.third_party?.name ?? ''
                    }`
                  : '-'
              }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Forma de recaudo"
            :default_value="modelsForm.type_receive_id"
            :manual_option="type_receive_with_name"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="true"
            :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El campo Tipo de recaudo es requerido'),
              ]"
            @update:model-value="modelsForm.type_receive_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Forma de recaudo</p>
            <p class="text-weight-medium no-margin">
              {{
                modelsView.type_receive?.id
                  ? `${modelsView.type_receive?.code ?? ''} - ${
                      modelsView.type_receive?.description ?? ''
                    }`
                  : '-'
              }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Centro de costos"
            :default_value="modelsForm.cost_center_id"
            :manual_option="bank_account_cost_centers"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :disabled="
              !business_selected?.account?.has_cost_center ||
              !selectedMovementHasCostCenter
            "
            :required="false"
            :rules="[]"
            @update:model-value="modelsForm.cost_center_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Centro de costos</p>
            <p class="text-weight-medium no-margin">
              {{
                modelsView.cost_center?.id
                  ? `${modelsView.cost_center?.code ?? ''} - ${
                      modelsView.cost_center?.name ?? ''
                    }`
                  : '-'
              }}
            </p>
          </div>
        </div>

        <div
          :class="[
            'col-xs-12 col-sm-12',
            ['view'].includes(action) ? 'col-md-4' : 'col-md-3',
          ]"
        >
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Flujo de caja"
            :default_value="modelsForm.cash_flow_id"
            :manual_option="cash_flow_structure_egreso"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :disabled="!business_selected?.treasurie?.has_cash_flow"
            :required="false"
            :rules="[]"
            @update:model-value="modelsForm.cash_flow_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Flujo de caja</p>
            <p class="text-weight-medium no-margin">
              {{
                modelsView.cash_flow?.id
                  ? `${modelsView.cash_flow?.code ?? ''} - ${
                      modelsView.cash_flow?.name ?? ''
                    }`
                  : '-'
              }}
            </p>
          </div>
        </div>

        <div
          :class="[
            'col-xs-12 col-sm-12',
            ['view'].includes(action) ? 'col-md-4' : 'col-md-3',
          ]"
        >
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Concepto"
            :default_value="modelsForm.concept"
            placeholder="-"
            :required="true"
            @update:model-value="modelsForm.concept = $event"
            :rules="[
                (v: string) => useRules().is_required(v, 'El campo Concepto es requerido'),
                (v: string) => useRules().max_length(v, 100),
              ]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Concepto</p>
            <p class="text-weight-medium no-margin">
              {{ modelsView.concept ?? '-' }}
            </p>
          </div>
        </div>

        <div
          :class="[
            'col-xs-12 col-sm-12',
            ['view'].includes(action) ? 'col-md-4' : 'col-md-3',
          ]"
        >
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Banco"
            :default_value="modelsForm.bank_id"
            :manual_option="business_bank_accounts_check"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="true"
            :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El campo Banco es requerido'),
              ]"
            @update:model-value="modelsForm.bank_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Banco</p>
            <p class="text-weight-medium no-margin">
              {{
                modelsView.bank?.id
                  ? `${modelsView.bank?.bank_code ?? ''} - ${
                      modelsView.bank?.description ?? ''
                    }`
                  : '-'
              }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Cuenta bancaria"
            :default_value="modelsForm.bank_account_id"
            :manual_option="filteredBankAccounts"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="true"
            :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El campo Cuenta bancaria es requerido'),
              ]"
            @update:model-value="selectBankAccount($event)"
          />
        </div>
      </div>

      <q-separator
        v-if="['create', 'edit'].includes(action)"
        class="q-mt-md q-mb-lg"
      />

      <div class="row q-col-gutter-lg">
        <div
          v-if="['view'].includes(action)"
          class="col-xs-12 col-sm-12 col-md-4 mt-0"
        >
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Cuenta bancaria</p>
            <p class="text-weight-medium no-margin">
              {{
                modelsView.bank_account?.id
                  ? `${modelsView.bank_account?.account_number ?? ''} - ${
                      modelsView.bank_account?.account_name ?? ''
                    }`
                  : '-'
              }}
            </p>
          </div>
        </div>

        <div
          v-if="['create', 'edit'].includes(action)"
          class="col-xs-12 col-sm-12 col-md-12"
        >
          <p class="text-black-10 text-weight-bold text-h6 q-mb-none">Moneda</p>
        </div>
        <div
          :class="[
            'col-xs-12 col-sm-12',
            ['view'].includes(action) ? 'col-md-4' : 'col-md-6',
          ]"
        >
          <CurrencyInput
            v-if="['create', 'edit'].includes(action)"
            :hide-icon="true"
            v-model="modelsForm.foreign_currency_value"
            :currency="'COP'"
            label="Valor Moneda extranjera"
            placeholder="-"
            :disabled="!isCoinForeign"
            :required="isCoinForeign"
            @update:model-value="calculateValueForeignCurrency($event)"
            :rules="isCoinForeign ? [
                (v: string) => useRules().is_required(v, 'El campo Valor Moneda extranjera es requerido'),
                (v: string) => useRules().max_length(v, 20),
              ] : []"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Valor Moneda extranjera</p>
            <p class="text-weight-medium no-margin">
              {{
                useUtils().formatCurrencyString(
                  modelsView.foreign_currency_value,
                  { showCurrencySymbol: false }
                ) ?? '-'
              }}
            </p>
          </div>
        </div>

        <div
          :class="[
            'col-xs-12 col-sm-12',
            ['view'].includes(action) ? 'col-md-4' : 'col-md-6',
          ]"
        >
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Moneda"
            :default_value="modelsForm.coin"
            placeholder="-"
            disabled
            :required="false"
            @update:model-value="modelsForm.coin = $event"
            :rules="[
                (v: string) => useRules().is_required(v, 'El campo Moneda es requerido'),
              ]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Moneda</p>
            <p class="text-weight-medium no-margin">
              {{ modelsView.coin ?? '-' }}
            </p>
          </div>
        </div>

        <div
          :class="[
            'col-xs-12 col-sm-12',
            ['view'].includes(action) ? 'col-md-4' : 'col-md-3',
          ]"
        >
          <CurrencyInput
            v-if="['create', 'edit'].includes(action)"
            :hide-icon="true"
            v-model="modelsForm.trm"
            :currency="'COP'"
            label="TRM"
            placeholder="-"
            :disabled="!isCoinForeign"
            :required="isCoinForeign"
            @update:model-value="calculateValueTRM($event)"
            :rules="isCoinForeign ? [
                (v: string) => useRules().is_required(v, 'El campo TRM es requerido'),
              ] : []"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">TRM</p>
            <p class="text-weight-medium no-margin">
              {{
                useUtils().formatCurrencyString(modelsView.trm, {
                  showCurrencySymbol: false,
                }) ?? '-'
              }}
            </p>
          </div>
        </div>

        <div
          :class="[
            'col-xs-12 col-sm-12',
            ['view'].includes(action) ? 'col-md-4' : 'col-md-3',
          ]"
        >
          <CurrencyInput
            v-if="['create', 'edit'].includes(action)"
            :hide-icon="true"
            v-model="modelsForm.value"
            :currency="'COP'"
            label="Valor"
            placeholder="-"
            :required="true"
            @update:model-value="modelsForm.value = $event"
            :rules="[
                (v: string) => useRules().is_required(v, 'El campo valor es requerido'),
                () => useRules().only_positive_value(modelsForm.value?.toString() ?? ''),
              ]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Valor</p>
            <p class="text-weight-medium no-margin">
              {{
                useUtils().formatCurrencyString(modelsView.value, {
                  showCurrencySymbol: false,
                }) ?? '-'
              }}
            </p>
          </div>
        </div>

        <div
          :class="[
            'col-xs-12 col-sm-12',
            ['view'].includes(action) ? 'col-md-4' : 'col-md-3',
          ]"
        >
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Número de cheque"
            :default_value="modelsForm.checkbook"
            placeholder="-"
            :disabled="!isCheck"
            :required="isCheck"
            @update:model-value="modelsForm.checkbook = $event"
            :rules="isCheck ? [
                (v: string) => useRules().is_required(v, 'El campo Número de cheque es requerido'),
                (v: string) => useRules().max_length(v, 15),
                (v: string) => useRules().only_number(v),
              ] : []"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Número de cheque</p>
            <p class="text-weight-medium no-margin">
              {{ modelsView.checkbook ?? '-' }}
            </p>
          </div>
        </div>

        <div
          :class="[
            'col-xs-12 col-sm-12',
            ['view'].includes(action) ? 'col-md-4' : 'col-md-3',
          ]"
        >
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Banco de cheque"
            :default_value="modelsForm.bank_checkbook_id"
            :manual_option="banks"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :disabled="!isCheck"
            :required="isCheck"
            :rules="isCheck ? [
                (v: string) => useRules().is_required(v, 'El campo Banco de cheque es requerido'),
              ] : []"
            @update:model-value="modelsForm.bank_checkbook_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Banco de cheque</p>
            <p class="text-weight-medium no-margin">
              {{
                modelsView.bank_checkbook?.bank_code
                  ? `${modelsView.bank_checkbook?.bank_code ?? ''} - ${
                      modelsView.bank_checkbook?.description ?? ''
                    }`
                  : '-'
              }}
            </p>
          </div>
        </div>

        <div
          :class="[
            'col-xs-12 col-sm-12',
            ['view'].includes(action) ? 'col-md-4' : 'col-md-6',
          ]"
        >
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            :option_calendar="optionsMaxCalendar"
            label="Fecha efectiva"
            :default_value="modelsForm.effective_date"
            :mask="'YYYY-MM-DD'"
            :placeholder="'YYYY-MM-DD'"
            :required="true"
            :rules="[
                (v: string) => useRules().is_required(v, 'El campo Fecha efectiva es requerido'),
              ]"
            @update:model-value="modelsForm.effective_date = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha efectiva</p>
            <p class="text-weight-medium no-margin">
              {{ modelsView.effective_date ?? '-' }}
            </p>
          </div>
        </div>

        <div
          :class="[
            'col-xs-12 col-sm-12',
            ['view'].includes(action) ? 'col-md-4' : 'col-md-6',
          ]"
        >
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Plan de inversión"
            :default_value="modelsForm.investment_plans_id"
            :manual_option="[]"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="false"
            :rules="[]"
            @update:model-value="modelsForm.investment_plans_id = $event"
          />
          <div v-else class="text-black-90 col-12">
            <p class="text-weight-bold no-margin">Plan de inversión</p>
            <p class="text-weight-medium no-margin">
              {{ modelsView.investment_plans?.id ?? '-' }}
            </p>
          </div>
        </div>
      </div>

      <q-separator v-if="['view'].includes(action)" class="q-mt-md" />
    </section>
  </q-form>
</template>

<script setup lang="ts">
// Components
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'

// Logic view
import useRecordIndividualIncomeDetailForm from './RecordIndividualIncomeDetailForm'

// Utils
import { useRules, useUtils } from '@/composables'
import { ActionType } from '@/interfaces/global'
import {
  IRecordIndividualIncomeDetailForm,
  IRecordIndividualIncomeDetailView,
} from '@/interfaces/customs'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?:
      | IRecordIndividualIncomeDetailForm
      | IRecordIndividualIncomeDetailView
      | null
  }>(),
  {}
)

defineExpose({
  validateForm: () => detailFormElementRef.value?.validate(),
})

const {
  modelsForm,
  modelsView,
  detailFormElementRef,
  third_parties,
  type_receive_with_name,
  bank_account_cost_centers,
  selectedMovementHasCostCenter,
  business_bank_accounts_check,
  cash_flow_structure_egreso,
  filteredBankAccounts,
  business_selected,
  isCoinForeign,
  isCheck,
  banks,
  calculateValueForeignCurrency,
  optionsMaxCalendar,
  selectBankAccount,
  calculateValueTRM,
} = useRecordIndividualIncomeDetailForm(props)
</script>
