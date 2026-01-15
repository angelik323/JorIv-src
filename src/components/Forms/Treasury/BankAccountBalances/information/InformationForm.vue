<template>
  <q-form ref="formInformation">
    <section>
      <div class="mx-3 mt-2 mb-3">
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-none">
          <div class="col-12 col-md-6">
            <p class="text-weight-medium text-grey-6 mb-0">Negocio*</p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :manual_option="business_trusts"
              :map_options="true"
              :required="true"
              :default_value="models.business_id"
              :auto_complete="true"
              :disabled="action === 'edit'"
              @update:modelValue="models.business_id = $event"
              :rules="[(val: string) => !!val || 'El negocio es requerido']"
            />
          </div>

          <div class="col-12 col-md-6">
            <p class="text-weight-medium text-grey-6 mb-0">Banco*</p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :manual_option="banks_record_expenses"
              :map_options="true"
              :required="true"
              :default_value="models.bank_id"
              :auto_complete="true"
              :disabled="action === 'edit'"
              @update:modelValue="models.bank_id = $event"
              :rules="[
                (val: string) => !!val || 'La cuenta bancaria es requerida',
              ]"
            />
          </div>

          <div class="col-12" v-if="['edit'].includes(action)">
            <p class="text-weight-medium text-grey-6 mb-0">Moneda*</p>
            <GenericInput
              required
              disabled
              :default_value="models.currency"
              :rules="[(v: string) => !!v || 'La moneda es requerida']"
              @update:model-value="models.currency = $event"
            />
          </div>

          <div class="col-12 col-md-6">
            <p class="text-weight-medium text-grey-6 mb-0">Cuenta bancaria*</p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :manual_option="business_bank_accounts_with_name"
              :map_options="true"
              :required="true"
              :default_value="models.bank_account_id"
              :auto_complete="true"
              :return_object="true"
              @update:modelValue="handleBankAccount"
              :rules="[(v: string) => useRules().is_required(v)]"
            />
          </div>

          <div class="col-12 col-md-6">
            <p class="text-weight-medium text-grey-6 mb-0">
              Saldo inicial moneda local*
            </p>
            <CurrencyInput
              v-if="['create', 'edit'].includes(action)"
              v-model="models.initial_balance_local_currency"
              :currency="'COP'"
              :placeholder="''"
              currencyLabel=""
              :rules="[
                (v: string) => useRules().is_required(v),
                (v: string) => useRules().max_length(v, 20),
              ]"
            />
          </div>

          <div
            class="col-6"
            :class="['edit'].includes(action) ? 'col-md-12' : ''"
          >
            <p class="text-weight-medium text-grey-6 mb-0">
              Saldo inicial moneda extranjera{{ !isLocalCurrency ? '*' : '' }}
            </p>
            <CurrencyInput
              v-if="['create', 'edit'].includes(action)"
              v-model="models.initial_balance_foreign_currency"
              :currency="'COP'"
              :placeholder="''"
              currencyLabel=""
              :required="isLocalCurrency"
              :disabled="isLocalCurrency"
              :rules="
                !isLocalCurrency
                  ? [
                      (v: string) => useRules().is_required(v),
                      (v: string) => useRules().max_length(v, 20),
                    ]
                  : []
              "
            />
          </div>

          <div v-if="['edit'].includes(action)" class="col-12 col-md-6">
            <p class="text-weight-medium text-grey-6 mb-0">
              Fecha de apertura*
            </p>
            <div
              v-if="['create', 'edit'].includes(action)"
              class="q-field--with-bottom"
            >
              <GenericInput
                :default_value="models.opening_date"
                :required="false"
                disabled
                :rules="[]"
                @update:modelValue="models.opening_date = $event"
              />
            </div>
          </div>

          <div class="col-12 col-md-6">
            <p class="text-weight-medium text-grey-6 mb-0">
              Fecha saldo inicial*
            </p>
            <GenericDateInputComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.initial_balance_date"
              :required="true"
              :rules="[
                (val: string) =>
                  !!val || 'La fecha de constitución es requerida',
                (v: string) => date_before_or_equal_to_the_current_date(v),
              ]"
              @update:modelValue="models.initial_balance_date = $event"
              :navigation_max_year="new Date().getFullYear().toString()"
              :navigation_min_year="'1000/01'"
              :option_calendar="
                ($event) => useUtils().isDateAllowed($event, holidays)
              "
              :onNavigation="handlerHolidays"
            />
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'

import useInformationForm from './InformationForm'

// Composables
import { useRules } from '@/composables'

const props = withDefaults(
  defineProps<{
    action: 'create' | 'edit'
    data?: any | null
  }>(),
  {}
)

const emits = defineEmits(['validate:form'])

const {
  formInformation,
  models,
  banks_record_expenses,
  business_trusts,
  business_bank_accounts_with_name,
  isLocalCurrency,
  holidays,
  useUtils,
  handleBankAccount,
  date_before_or_equal_to_the_current_date,
  handlerHolidays,
} = useInformationForm(props)

defineExpose({
  validateForm: () => formInformation.value?.validate(),
})
</script>
