<template>
  <q-form ref="detailOfIndividualBasicDataRef" class="q-px-lg">
    <section>
      <div class="q-mb-lg mb-0 mt-2">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">Detalle</p>
      </div>
      <div class="mt-1 mb-1">
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-none">
          <div
            class="col-xs-12 col-sm-12"
            :class="
              ['edit', 'create', 'view'].includes(action)
                ? 'col-md-4'
                : 'col-md-12'
            "
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Fecha efectiva{{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericDateInputComponent
              v-if="['create', 'edit'].includes(action)"
              :required="true"
              :default_value="effective_date_filter ?? models.effective_date"
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El campo es requerido'),
              ]"
              :disabled="is_editing"
              @update:modelValue="models.effective_date = $event"
            />
            <p
              v-else
              class="text-grey-6 mb-0"
              :class="['view'].includes(action) ? 'col-md-4' : 'col-md-12'"
            >
              {{ models.effective_date ?? 'No registrado' }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="
              ['edit', 'create', 'view'].includes(action)
                ? 'col-md-4'
                : 'col-md-12'
            "
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Formas de pago{{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.method_payment_id"
              :manual_option="paymentLabels"
              :auto_complete="true"
              :required="true"
              :map_options="true"
              :disabled="is_editing"
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El campo es requerido'),
              ]"
              @update:model-value="models.method_payment_id = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ useUtils().getLabel(models.method_payment_id, payments) }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="
              ['edit', 'create', 'view'].includes(action)
                ? 'col-md-4'
                : 'col-md-12'
            "
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Centro de costos
              {{
                ['create', 'edit'].includes(action) && !isCenterCostDisabled
                  ? '*'
                  : ''
              }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.cost_center_id"
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El campo es requerido'),
              ]"
              :manual_option="bank_account_cost_centers"
              :auto_complete="true"
              required
              :disabled="isCenterCostDisabled"
              :map_options="true"
              @update:modelValue="models.cost_center_id = $event"
            />
            <p
              v-else
              class="text-grey-6 mb-0"
              :class="['view'].includes(action) ? 'col-md-4' : 'col-md-12'"
            >
              {{
                useUtils().getLabel(
                  models.cost_center_id,
                  bank_account_cost_centers
                )
              }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="
              ['edit', 'create', 'view'].includes(action)
                ? 'col-md-3'
                : 'col-md-12'
            "
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Flujo de caja
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.cash_flow_id"
              :rules="
                isCashFlowDisabled
                  ? [
                      (v: string) =>
                        useRules().is_required(v, 'El campo es requerido'),
                    ]
                  : []
              "
              :manual_option="cash_flow_structure_egreso"
              :auto_complete="true"
              :required="false"
              :map_options="true"
              :disabled="!isCashFlowDisabled"
              @update:modelValue="models.cash_flow_id = $event"
            />
            <p
              v-else
              class="text-grey-6 mb-0"
              :class="['view'].includes(action) ? 'col-md-4' : 'col-md-12'"
            >
              {{
                useUtils().getLabel(
                  models.cash_flow_id,
                  cash_flow_structure_egreso
                )
              }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="
              ['edit', 'create', 'view'].includes(action)
                ? 'col-md-3'
                : 'col-md-12'
            "
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Banco {{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.bank_id"
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El campo es requerido'),
              ]"
              :manual_option="banks_record_expenses"
              :auto_complete="true"
              :required="true"
              :map_options="true"
              :disabled="is_editing"
              @update:modelValue="models.bank_id = $event"
            />
            <p
              v-else
              class="text-grey-6 mb-0"
              :class="['view'].includes(action) ? 'col-md-4' : 'col-md-12'"
            >
              {{ useUtils().getLabel(models.bank_id, banks_record_expenses) }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="
              ['edit', 'create', 'view'].includes(action)
                ? 'col-md-3'
                : 'col-md-12'
            "
          >
            <p
              class="text-weight-medium mb-0 ellipsis"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Cuenta bancaria
              {{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.bank_account_id"
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El campo es requerido'),
              ]"
              :manual_option="bank_accounts_with_name"
              :auto_complete="true"
              :required="true"
              :map_options="true"
              :disabled="is_editing"
              @update:modelValue="models.bank_account_id = $event"
            />
            <p
              v-else
              class="text-grey-6 mb-0"
              :class="['view'].includes(action) ? 'col-md-4' : 'col-md-12'"
            >
              {{
                useUtils().getLabel(
                  models.bank_account_id,
                  bank_accounts_with_name
                )
              }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="
              ['edit', 'create', 'view'].includes(action)
                ? 'col-md-3'
                : 'col-md-12'
            "
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Concepto
              {{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.concept"
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El campo es requerido'),
                (v: string) => useRules().max_length(v, 100),
              ]"
              :required="true"
              @update:modelValue="models.concept = $event"
            />
            <p
              v-else
              class="text-grey-6 mb-0"
              :class="['view'].includes(action) ? 'col-md-4' : 'col-md-12'"
            >
              {{ models.concept ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
      <q-separator class="q-mt-sm" />
    </section>

    <section class="q-mt-lg">
      <div class="q-mb-lg mb-0">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">Moneda</p>
      </div>

      <div class="mt-1 mb-1">
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-none">
          <div
            class="col-xs-12 col-sm-12"
            :class="
              ['edit', 'create', 'view'].includes(action)
                ? 'col-md-6'
                : 'col-md-12'
            "
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Valor moneda extranjera
              {{
                ['create', 'edit'].includes(action) && isBankAccountDisabled
                  ? '*'
                  : ''
              }}
            </p>
            <CurrencyInput
              v-if="['create', 'edit'].includes(action)"
              v-model="models.foreign_currency_value"
              :currency="'COP'"
              required
              :disabled="!isBankAccountDisabled"
              placeholder="Inserte"
              hide-icon
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El campo es requerido'),
              ]"
              @update:modelValue="models.foreign_currency_value = $event"
            />
            <p
              v-else
              class="text-grey-6 mb-0"
              :class="['view'].includes(action) ? 'col-md-4' : 'col-md-12'"
            >
              {{
                useUtils().formatCurrencyString(
                  models.foreign_currency_value
                ) ?? 'No registrado'
              }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="
              ['edit', 'create', 'view'].includes(action)
                ? 'col-md-6'
                : 'col-md-12'
            "
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Moneda
              {{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.coin"
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El campo es requerido'),
              ]"
              :required="isBankAccountDisabled"
              :disabled="true"
              @update:modelValue="models.coin = $event"
            />
            <p
              v-else
              class="text-grey-6 mb-0"
              :class="['view'].includes(action) ? 'col-md-4' : 'col-md-12'"
            >
              {{ models.coin ?? 'No registrado' }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="
              ['edit', 'create', 'view'].includes(action)
                ? 'col-md-4'
                : 'col-md-12'
            "
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              TRM
              {{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <CurrencyInput
              v-if="['create', 'edit'].includes(action)"
              v-model="models.trm"
              :currency="'COP'"
              required
              :disabled="!isBankAccountDisabled"
              hide-icon
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El campo es requerido'),
              ]"
              @update:modelValue="models.trm = $event"
            />

            <p
              v-else
              class="text-grey-6 mb-0"
              :class="['view'].includes(action) ? 'col-md-4' : 'col-md-12'"
            >
              {{
                useUtils().formatCurrencyString(models.trm) ?? 'No registrado'
              }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="
              ['edit', 'create', 'view'].includes(action)
                ? 'col-md-4'
                : 'col-md-12'
            "
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Valor
              {{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <CurrencyInput
              v-if="['create', 'edit'].includes(action)"
              v-model="models.value"
              :currency="'COP'"
              required
              :disabled="isBankAccountDisabled || is_editing"
              placeholder="Inserte"
              hide-icon
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El campo es requerido'),
                (v: string) => useRules().only_positive_value(v),
              ]"
              @update:modelValue="models.value = $event"
            />
            <p
              v-else
              class="text-grey-6 mb-0"
              :class="['view'].includes(action) ? 'col-md-4' : 'col-md-12'"
            >
              {{
                useUtils().formatCurrencyString(models.value) ?? 'No registrado'
              }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="
              ['edit', 'create', 'view'].includes(action)
                ? 'col-md-4'
                : 'col-md-12'
            "
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Instrucciones
              {{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.instructions"
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El campo es requerido'),
                (v: string) => useRules().max_length(v, 250),
              ]"
              :required="true"
              :disabled="!isInstructionDisabled"
              @update:modelValue="models.instructions = $event"
            />
            <p
              v-else
              class="text-grey-6 mb-0"
              :class="['view'].includes(action) ? 'col-md-4' : 'col-md-12'"
            >
              {{ models.instructions ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
      <q-separator class="q-mt-sm" />
    </section>

    <section class="q-mt-lg">
      <div class="q-mb-lg mb-0">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">Banco</p>
      </div>

      <div class="mt-1 mb-1">
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-none">
          <div
            class="col-xs-12 col-sm-12"
            :class="
              ['edit', 'create', 'view'].includes(action)
                ? 'col-md-4'
                : 'col-md-12'
            "
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              NIT beneficiario{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.nit_third_party_id"
              :manual_option="active_third_parties"
              :auto_complete="true"
              :required="true"
              :map_options="true"
              :disabled="is_editing"
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El campo es requerido'),
              ]"
              @update:model-value="models.nit_third_party_id = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{
                useUtils().getLabel(
                  models.nit_third_party_id,
                  active_third_parties
                )
              }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="
              ['edit', 'create', 'view'].includes(action)
                ? 'col-md-4'
                : 'col-md-12'
            "
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Banco beneficiario
              {{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.beneficiary_bank_id"
              :manual_option="bank_third_partie"
              :auto_complete="true"
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El campo es requerido'),
              ]"
              :required="true"
              :map_options="true"
              :disabled="isBankBeneficiaryDisabled"
              @update:modelValue="models.beneficiary_bank_id = $event"
            />
            <p
              v-else
              class="text-grey-6 mb-0"
              :class="['view'].includes(action) ? 'col-md-4' : 'col-md-12'"
            >
              {{
                useUtils().getLabel(
                  models.beneficiary_bank_id,
                  bank_third_partie
                )
              }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="
              ['edit', 'create', 'view'].includes(action)
                ? 'col-md-4'
                : 'col-md-12'
            "
          >
            <p
              class="text-weight-medium mb-0 ellipsis"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Cuenta bancaria beneficiario{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.beneficiary_bank_account"
              :manual_option="bank_account_third_parties"
              :auto_complete="true"
              :required="true"
              :map_options="true"
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El campo es requerido'),
              ]"
              :disabled="!isPaymentsDisabled"
              @update:model-value="models.beneficiary_bank_account = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{
                useUtils().getLabel(
                  models.beneficiary_bank_account,
                  bank_account_third_parties
                )
              }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="
              ['edit', 'create', 'view'].includes(action)
                ? 'col-md-4'
                : 'col-md-12'
            "
          >
            <p
              class="text-weight-medium mb-0 ellipsis"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Tipo de documento autorizado
              {{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.authorized_document_type_id"
              :manual_option="document_type"
              :auto_complete="true"
              required
              :map_options="true"
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El campo es requerido'),
              ]"
              :disabled="!isBankAccountThirdPartyDisabled"
              @update:model-value="models.authorized_document_type_id = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{
                useUtils().getLabel(
                  models.authorized_document_type_id,
                  document_type
                )
              }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="
              ['edit', 'create', 'view'].includes(action)
                ? 'col-md-4'
                : 'col-md-12'
            "
          >
            <p
              class="text-weight-medium mb-0 ellipsis"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Identificación del autorizado
              {{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.identification_authorized"
              :manual_option="active_third_parties"
              :auto_complete="true"
              required
              :map_options="true"
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El campo es requerido'),
              ]"
              :disabled="!isBankAccountThirdPartyDisabled"
              @update:model-value="models.identification_authorized = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{
                useUtils().getLabel(
                  models.identification_authorized,
                  active_third_parties
                )
              }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="
              ['edit', 'create', 'view'].includes(action)
                ? 'col-md-4'
                : 'col-md-12'
            "
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Sucursal
              {{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.bank_branch_id"
              :manual_option="bank_branches_third_party"
              :auto_complete="true"
              :required="false"
              :map_options="true"
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El campo es requerido'),
              ]"
              :disabled="isBankBranchDisabled"
              @update:model-value="models.bank_branch_id = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{
                useUtils().getLabel(
                  models.bank_branch_id,
                  bank_branches_third_party
                )
              }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="
              ['edit', 'create', 'view'].includes(action)
                ? 'col-md-4'
                : 'col-md-12'
            "
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              GMF
              {{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <CurrencyInput
              v-if="['create', 'edit'].includes(action)"
              :currency="'COP'"
              v-model="models.gmf"
              :required="false"
              :rules="[]"
              :disabled="true"
              hide-icon
              @update:model-value="models.gmf = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ useUtils().formatCurrencyString(models.gmf) }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// components
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
// composables
import { useRules, useUtils } from '@/composables'
// logic
import useDetailOfIndividualExpensesData from './DetailOFIndividualExpensesData'
import { ActionType } from '@/interfaces/global'
//interfaces
import { IDetailOfIndividualExpensesRequest } from '@/interfaces/customs'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IDetailOfIndividualExpensesRequest | null
  }>(),
  {}
)

defineExpose({
  validateForm: () => detailOfIndividualBasicDataRef.value?.validate(),
  getModels: () => models.value,
})

const {
  models,
  detailOfIndividualBasicDataRef,
  effective_date_filter,
  payments,
  paymentLabels,
  bank_account_cost_centers,
  banks_record_expenses,
  bank_accounts_with_name,
  active_third_parties,
  cash_flow_structure_egreso,
  isBankAccountDisabled,
  isInstructionDisabled,
  bank_account_third_parties,
  bank_third_partie,
  isPaymentsDisabled,
  document_type,
  isCenterCostDisabled,
  isCashFlowDisabled,
  isBankAccountThirdPartyDisabled,
  isBankBranchDisabled,
  is_editing,
  bank_branches_third_party,
  isBankBeneficiaryDisabled,
} = useDetailOfIndividualExpensesData(props)
</script>
