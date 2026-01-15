<template>
  <q-form ref="formFinance" class="q-pa-lg">
    <section>
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Información financiera
        </p>
        <p
          v-if="['create', 'edit'].includes(action)"
          class="text-grey-6 text-weight-medium q-mb-none"
        >
          Proporcione los datos sobre la información financiera de su nuevo
          cliente como persona natural.
        </p>
      </div>

      <RadioYesNo
        v-model="models.financial_info.report_income"
        class="q-pt-md q-pl-sm"
        hasTitle
        title="¿Declara renta?"
        :hasSubtitle="false"
        :isDisabled="!['create', 'edit'].includes(action)"
      />
      <q-separator class="q-mt-sm" />

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-lg">
        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Total ingresos operacionales mensuales{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <CurrencyInput
            v-if="['create', 'edit'].includes(action)"
            v-model="models.financial_info.total_operational_income"
            :currency="'COP'"
            :placeholder="''"
            currencyLabel=""
            :rules="[
              (v: string) => useRules().is_required(v),
              (v: string) => useRules().max_length(v, 20),
              (v: string) => useRules(). only_number_greater_than_zero(v) 
            ]"
          />
          <p v-else class="text-grey-6 mb-0">
            {{
              formatCurrencyString(
                models.financial_info.total_operational_income
              ) ?? 'No registrado'
            }}
          </p>
        </div>

        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Total egresos operacionales mensuales{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <CurrencyInput
            v-if="['create', 'edit'].includes(action)"
            v-model="models.financial_info.total_expenses"
            :currency="'COP'"
            :placeholder="''"
            currencyLabel=""
            :rules="[
              (v: string) => useRules().is_required(v),
              (v: string) => useRules().max_length(v, 20),
              (v: string) => useRules(). only_number_greater_than_zero(v) 
            ]"
          />
          <p v-else class="text-grey-6 mb-0">
            {{
              formatCurrencyString(models.financial_info.total_expenses) ??
              'No registrado'
            }}
          </p>
        </div>

        <div class="col-12 col-md-3 q-pa-none"></div>

        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Total ingresos no operacionales mensuales{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>

          <CurrencyInput
            v-if="['create', 'edit'].includes(action)"
            v-model="models.financial_info.total_non_operational_income"
            :currency="'COP'"
            :placeholder="''"
            currencyLabel=""
            :rules="[
                (v: string) =>
                  useRules().is_required(v),
                (v: string) =>
                  useRules().max_length(v, 20),
                (v: string) => useRules(). only_number_greater_than_zero(v) 
            ]"
          />
          <p v-else class="text-grey-6 mb-0">
            {{
              formatCurrencyString(
                models.financial_info.total_non_operational_income
              ) ?? 'No registrado'
            }}
          </p>
        </div>

        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0 ellipsis"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Concepto otros ingresos no operacionales mensuales
          </p>
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            :default_value="
              models.financial_info.other_non_operational_income_concept
            "
            :required="
              Number(models.financial_info.total_non_operational_income) > 0
                ? true
                : false
            "
            :rules="
                Number(models.financial_info.total_non_operational_income) > 0
                  ? [
                      (v: string) => useRules().is_required(v),
                      (v: string) => useRules().only_letters(v),
                      (v: string) => useRules().max_length(v, 30),
                    ]
                  : []
              "
            @update:model-value="
              models.financial_info.other_non_operational_income_concept =
                $event
            "
          />
          <p v-else class="text-grey-6 mb-0">
            {{
              models.financial_info.other_non_operational_income_concept ??
              'No registrado'
            }}
          </p>
        </div>

        <div class="col-12 col-md-3 q-pa-none"></div>

        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Total activos{{ ['create', 'edit'].includes(action) ? '*' : '' }}
          </p>
          <CurrencyInput
            v-if="['create', 'edit'].includes(action)"
            v-model="models.financial_info.assets"
            :currency="'COP'"
            :placeholder="''"
            currencyLabel=""
            :rules="[
                (v: string) => useRules().is_required(v),
                (v: string) => useRules().max_length(v, 20),
                (v: string) => useRules(). only_number_greater_than_zero(v),
                (v: string) => {
                  const clean = v.replace(/\./g, '').replace(/,/g, '');
                  return !models.financial_info.report_income || Number(clean) > 1000 || 'El total de activos debe ser mayor a 1000';
                }

              ]"
          />
          <p v-else class="text-grey-6 mb-0">
            {{
              formatCurrencyString(models.financial_info.assets) ??
              'No registrado'
            }}
          </p>
        </div>

        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Total pasivos{{ ['create', 'edit'].includes(action) ? '*' : '' }}
          </p>
          <CurrencyInput
            v-if="['create', 'edit'].includes(action)"
            v-model="models.financial_info.liabilities"
            :currency="'COP'"
            :placeholder="''"
            currencyLabel=""
            :rules="[
                (v: string) => useRules().is_required(v),
                (v: string) => useRules().max_length(v, 20),
                (v: string) => useRules(). only_number_greater_than_zero(v),
                (v: string) => {
                  const clean = v.replace(/\./g, '').replace(/,/g, '');
                  return !models.financial_info.report_income || Number(clean) > 1000 || 'El total de pasivos debe ser mayor a 1000';
                }
              ]"
            @update:model-value="models.financial_info.liabilities = $event"
          />
          <p v-else class="text-grey-6 mb-0">
            {{
              formatCurrencyString(models.financial_info.liabilities) ??
              'No registrado'
            }}
          </p>
        </div>

        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0 ellipsis"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Fecha de corte información financiera{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.financial_info.cutoff_date"
            :required="true"
            :option_calendar="optionsCalendar"
            @update:modelValue="models.financial_info.cutoff_date = $event"
            :rules="[
                (v: string) => useRules().is_required(v),
              ]"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.financial_info.cutoff_date ?? 'No registrado' }}
          </p>
        </div>
      </div>
      <q-separator class="q-mt-sm" />
    </section>

    <section class="q-mt-lg">
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Datos bancarios del titular
        </p>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Banco{{ ['create', 'edit'].includes(action) ? '*' : '' }}
          </p>
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :manual_option="banks"
            :map_options="true"
            :required="true"
            :default_value="models.financial_info.bank_holder_id"
            :auto_complete="true"
            @update:modelValue="models.financial_info.bank_holder_id = $event"
            :rules="[(val: string) => useRules().is_required(val),]"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.financial_info.bank_holder_id ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Número de cuenta{{ ['create', 'edit'].includes(action) ? '*' : '' }}
          </p>
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            required
            :default_value="models.financial_info.bank_account_number_holder"
            type="number"
            :rules="[
              (val: string) => useRules().only_alphanumeric(val),
              (val: string) => /^(?!0+$).*$/.test(val) || 'El valor no puede ser solo ceros',
              (val: string) => useRules().max_length(val, 20),
              (val: string) => useRules().min_length(val, 6),
            ]"
            @update:model-value="
              models.financial_info.bank_account_number_holder = $event
            "
          />
          <p v-else class="text-grey-6 mb-0">
            {{
              models.financial_info.bank_account_number_holder ??
              'No registrado'
            }}
          </p>
        </div>

        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Tipo de cuenta{{ ['create', 'edit'].includes(action) ? '*' : '' }}
          </p>
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :manual_option="bank_types"
            :map_options="true"
            :required="true"
            :default_value="models.financial_info.account_type_holder_id"
            :auto_complete="true"
            @update:modelValue="
              models.financial_info.account_type_holder_id = $event
            "
            :rules="[(val: string) => !!val || 'El tipo de cuenta es requerido']"
          />
          <p v-else class="text-grey-6 mb-0">
            {{
              models.financial_info.account_type_holder_id ?? 'No registrado'
            }}
          </p>
        </div>
      </div>
      <q-separator class="q-mt-sm" />
    </section>

    <section class="q-mt-lg">
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Datos bancarios del beneficiario
        </p>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Banco"
            :manual_option="banks"
            :map_options="true"
            :required="false"
            :default_value="models.financial_info.bank_beneficiary_id"
            :auto_complete="true"
            @update:modelValue="
              models.financial_info.bank_beneficiary_id = $event
            "
            :rules="[]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Banco</p>
            <p class="text-weight-medium no-margin">
              {{ models.financial_info.bank_beneficiary_id ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Número de cuenta"
            :required="false"
            :default_value="
              models.financial_info.bank_account_number_beneficiary
            "
            type="number"
            :rules="models.financial_info.bank_account_number_beneficiary ? [
              (val: string) => useRules().only_alphanumeric(val),
              (val: string) => /^(?!0+$).*$/.test(val) || 'El valor no puede ser solo ceros',
              (val: string) => useRules().max_length(val, 20),
              (val: string) => useRules().min_length(val, 6),
            ] : []"
            @update:model-value="
              models.financial_info.bank_account_number_beneficiary = $event
            "
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Número de cuenta</p>
            <p class="text-weight-medium no-margin">
              {{
                models.financial_info.bank_account_number_beneficiary ??
                'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Tipo de cuenta"
            :manual_option="bank_types"
            :map_options="true"
            :required="false"
            :default_value="models.financial_info.account_type_beneficiary_id"
            :auto_complete="true"
            @update:modelValue="
              models.financial_info.account_type_beneficiary_id = $event
            "
            :rules="[]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo de cuenta</p>
            <p class="text-weight-medium no-margin">
              {{
                models.financial_info.account_type_beneficiary_id ??
                'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Nombre del beneficiario"
            :required="false"
            :default_value="models.financial_info.beneficiary_name"
            :rules="models.financial_info.beneficiary_name ? [
              (v: string) => useRules().only_letters(v),
              (v: string) => useRules().min_length(v, 2),
              (v: string) => useRules().max_length(v, 250),
              (v: string) => useRules().no_consecutive_spaces(v),
            ] : []"
            @update:model-value="
              models.financial_info.beneficiary_name = $event
            "
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Nombre del beneficiario</p>
            <p class="text-weight-medium no-margin">
              {{ models.financial_info.beneficiary_name ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Número de cédula del beneficiario"
            :required="false"
            :default_value="models.financial_info.beneficiary_document_number"
            :rules="models.financial_info.beneficiary_document_number ? [
                (v: string) => useRules().only_number(v),
                (v: string) => useRules().non_starting_with(v, '0'),
                (v: string) => useRules().max_length(v, 10),
                (v: string) => useRules().min_length(v, 6),
                (v: string) => useRules().no_consecutive_spaces(v),
              ]: []"
            @update:model-value="
              models.financial_info.beneficiary_document_number = $event
            "
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Número de cédula del beneficiario
            </p>
            <p class="text-weight-medium no-margin">
              {{
                models.financial_info.beneficiary_document_number ??
                'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3 q-pa-none"></div>
      </div>
      <q-separator class="q-mt-sm" />
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import useFinanceForm from './FinanceForm'

// Composables
import { useRules } from '@/composables'

const props = withDefaults(
  defineProps<{
    action: 'create' | 'edit' | 'view'
    data?: any | null
  }>(),
  {}
)

const emits = defineEmits(['validate:form'])

const {
  models,
  formFinance,
  banks,
  bank_types,
  formatCurrencyString,
  optionsCalendar,
} = useFinanceForm(props)

defineExpose({
  validateForm: () => formFinance.value?.validate(),
})
</script>
