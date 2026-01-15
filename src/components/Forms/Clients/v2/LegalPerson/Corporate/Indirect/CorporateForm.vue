<template>
  <div class="q-pa-lg">
    <q-form ref="formElementRef" aria-label="Formulario de datos corporativos">
      <section>
        <p class="text-black-90 text-weight-bold text-h6 q-mb-none">
          Información general de la empresa
        </p>
      </section>

      <section class="q-mt-lg">
        <EconomicActivitiesForm
          ref="economicActivitiesFormElementRef"
          :data="models.economic_activities"
          :action="action"
          :is-expanded="isEconomicActivitiesExpanded"
          @update:data="models.economic_activities = $event"
          @update:expanded="isEconomicActivitiesExpanded = $event"
        />
      </section>

      <section class="q-mt-lg">
        <q-expansion-item
          :model-value="isFinancialInformationExpanded"
          expand-icon-class="text-primary_fiduciaria"
          @update:model-value="isFinancialInformationExpanded = $event"
        >
          <template v-slot:header>
            <q-item-section>
              <span class="text-black-90 text-weight-bold text-h6">
                Información financiera
              </span>
            </q-item-section>
          </template>

          <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-sm">
            <div class="col-12 col-md-6">
              <InputMoneyComponent
                v-if="['create', 'edit'].includes(action)"
                :model-value="models.total_monthly_operational_income"
                label="Total ingresos operacionales mensuales"
                :max_integer_digits="15"
                :max_decimal_digits="2"
                required
                :rules="[
                  (val: string) => useRules().is_required(val, 'El total ingresos operacionales mensuales es requerido'),
                ]"
                @update:model-value="
                  ({ rawValue }) =>
                    (models.total_monthly_operational_income = rawValue)
                "
              />
              <div v-else class="text-black-90">
                <p class="text-weight-bold no-margin">
                  Total ingresos operacionales mensuales
                </p>
                <p class="text-weight-medium no-margin">
                  {{
                    formatCurrencyString(
                      models.total_monthly_operational_income
                    ) ?? 'No registrado'
                  }}
                </p>
              </div>
            </div>

            <div class="col-12 col-md-6">
              <InputMoneyComponent
                v-if="['create', 'edit'].includes(action)"
                :model-value="models.total_monthly_non_operational_income"
                label="Total ingresos no operacionales mensuales"
                :max_integer_digits="15"
                :max_decimal_digits="2"
                required
                :rules="[
                  (val: string) => useRules().is_required(val, 'El total ingresos no operacionales mensuales es requerido'),
                ]"
                @update:model-value="
                  ({ rawValue }) =>
                    (models.total_monthly_non_operational_income = rawValue)
                "
              />
              <div v-else class="text-black-90">
                <p class="text-weight-bold no-margin">
                  Total ingresos no operacionales mensuales
                </p>
                <p class="text-weight-medium no-margin">
                  {{
                    formatCurrencyString(
                      models.total_monthly_non_operational_income
                    ) ?? 'No registrado'
                  }}
                </p>
              </div>
            </div>

            <div class="col-12 col-md-6">
              <GenericInputComponent
                v-if="['create', 'edit'].includes(action)"
                :default_value="models.other_non_operational_income_concept"
                label="Concepto otros ingresos no operacionales"
                :rules="[
                  (val: string) => useRules().only_alphanumeric(val),
                  (val: string) => useRules().max_length(val, 60),
                ]"
                @update:model-value="
                  models.other_non_operational_income_concept = $event
                "
              />
              <div v-else class="text-black-90">
                <p class="text-weight-bold no-margin">
                  Concepto otros ingresos no operacionales
                </p>
                <p class="text-weight-medium no-margin">
                  {{
                    models.other_non_operational_income_concept ||
                    'No registrado'
                  }}
                </p>
              </div>
            </div>

            <div class="col-12 col-md-6">
              <InputMoneyComponent
                v-if="['create', 'edit'].includes(action)"
                :model-value="models.total_monthly_expenses"
                label="Total egresos mensuales"
                :max_integer_digits="15"
                :max_decimal_digits="2"
                required
                :rules="[
                  (val: string) => useRules().is_required(val, 'El total egresos mensuales es requerido'),
                ]"
                @update:model-value="
                  ({ rawValue }) => (models.total_monthly_expenses = rawValue)
                "
              />
              <div v-else class="text-black-90">
                <p class="text-weight-bold no-margin">
                  Total egresos mensuales
                </p>
                <p class="text-weight-medium no-margin">
                  {{
                    formatCurrencyString(models.total_monthly_expenses) ??
                    'No registrado'
                  }}
                </p>
              </div>
            </div>

            <div class="col-12 col-md-4">
              <InputMoneyComponent
                v-if="['create', 'edit'].includes(action)"
                :model-value="models.total_assets"
                label="Total activos"
                :max_integer_digits="15"
                :max_decimal_digits="2"
                required
                :rules="[
                  (val: string) => useRules().is_required(val, 'El total activos es requerido'),
                ]"
                @update:model-value="
                  ({ rawValue }) => (models.total_assets = rawValue)
                "
              />
              <div v-else class="text-black-90">
                <p class="text-weight-bold no-margin">Total activos</p>
                <p class="text-weight-medium no-margin">
                  {{
                    formatCurrencyString(models.total_assets) ?? 'No registrado'
                  }}
                </p>
              </div>
            </div>

            <div class="col-12 col-md-4">
              <InputMoneyComponent
                v-if="['create', 'edit'].includes(action)"
                :model-value="models.total_liabilities"
                label="Total pasivos"
                :max_integer_digits="15"
                :max_decimal_digits="2"
                required
                :rules="[
                  (val: string) => useRules().is_required(val, 'El total pasivos es requerido'),
                ]"
                @update:model-value="
                  ({ rawValue }) => (models.total_liabilities = rawValue)
                "
              />
              <div v-else class="text-black-90">
                <p class="text-weight-bold no-margin">Total pasivos</p>
                <p class="text-weight-medium no-margin">
                  {{
                    formatCurrencyString(models.total_liabilities) ??
                    'No registrado'
                  }}
                </p>
              </div>
            </div>

            <div class="col-12 col-md-4">
              <GenericDateInputComponent
                v-if="['create', 'edit'].includes(action)"
                :default_value="models.financial_information_cutoff_date"
                label="Fecha de corte información financiera"
                placeholder="AAAA/MM/DD"
                mask="YYYY-MM-DD"
                required
                :rules="[
                  (val: string) => useRules().is_required(val, 'La fecha de corte es requerida'),
                ]"
                @update:model-value="
                  models.financial_information_cutoff_date = $event
                "
              />
              <div v-else class="text-black-90">
                <p class="text-weight-bold no-margin">
                  Fecha de corte información financiera
                </p>
                <p class="text-weight-medium no-margin">
                  {{
                    models.financial_information_cutoff_date || 'No registrado'
                  }}
                </p>
              </div>
            </div>
          </div>
        </q-expansion-item>
      </section>

      <section class="q-mt-lg">
        <BankAccountsForm
          ref="bankAccountsFormElementRef"
          :data="models.bank_accounts"
          :action="action"
          :is-expanded="isBankAccountsExpanded"
          @update:data="models.bank_accounts = $event"
          @update:expanded="isBankAccountsExpanded = $event"
        />
      </section>

      <section class="q-mt-lg">
        <q-expansion-item
          :model-value="isSourceOfFundsExpanded"
          expand-icon-class="text-primary_fiduciaria"
          @update:model-value="isSourceOfFundsExpanded = $event"
        >
          <template v-slot:header>
            <q-item-section>
              <span class="text-black-90 text-weight-bold text-h6">
                Origen de fondos
              </span>
            </q-item-section>
          </template>

          <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-sm">
            <div class="col-12 col-md-4">
              <GenericSelectorComponent
                v-if="['create', 'edit'].includes(action)"
                :default_value="models.source_of_funds"
                label="Origen de fondos"
                auto_complete
                map_options
                :manual_option="legal_people_fund_sources"
                required
                :rules="[
                  (val: string) => useRules().is_required(val, 'El origen de fondos es requerido'),
                ]"
                @update:model-value="models.source_of_funds = $event"
              />
              <div v-else class="text-black-90">
                <p class="text-weight-bold no-margin">Origen de fondos</p>
                <p class="text-weight-medium no-margin">
                  {{ models.source_of_funds || 'No registrado' }}
                </p>
              </div>
            </div>

            <div
              v-if="models.source_of_funds === 'Otro'"
              class="col-12 col-md-4"
            >
              <GenericInputComponent
                v-if="['create', 'edit'].includes(action)"
                :default_value="models.another_source_of_funds"
                label="Otro"
                required
                :rules="[
                  (val: string) => useRules().is_required(val),
                  (val: string) => useRules().only_alphanumeric(val),
                  (val: string) => useRules().max_length(val, 50),
                ]"
                @update:model-value="models.another_source_of_funds = $event"
              />
              <div v-else class="text-black-90">
                <p class="text-weight-bold no-margin">Otro</p>
                <p class="text-weight-medium no-margin">
                  {{ models.another_source_of_funds || 'No registrado' }}
                </p>
              </div>
            </div>

            <div class="col-12">
              <RadioYesNo
                v-model="models.is_registered_issuer_subject_to_disclosure"
                class="q-pt-md q-pl-md"
                hasTitle
                title="¿La persona jurídica está inscrita en el registro nacional de emisores y además están sujetos a requisitos de revelación de información?"
                :hasSubtitle="false"
                required
                :is-disabled="['view'].includes(action)"
              />
            </div>
          </div>
          <q-separator :class="action === 'create' ? 'q-mt-sm' : 'q-mt-lg'" />
        </q-expansion-item>
      </section>
    </q-form>
  </div>
</template>

<script lang="ts" setup>
import { ActionType } from '@/interfaces/global'
import { IIndirectCorporateForm } from '@/interfaces/customs/clients/ClientIndirectLegalPerson'
import InputMoneyComponent from '@/components/InputMoney/InputMoneyComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import EconomicActivitiesForm from '@/components/Forms/Clients/v2/LegalPerson/Corporate/Indirect/EconomicActivities/EconomicActivitiesForm.vue'
import BankAccountsForm from '@/components/Forms/Clients/v2/LegalPerson/Corporate/Indirect/BankAccounts/BankAccountsForm.vue'

import { useRules } from '@/composables'
import useCorporateForm from './CorporateForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: IIndirectCorporateForm | null
  }>(),
  {}
)

const emits =
  defineEmits<
    (e: 'update:data', value: IIndirectCorporateForm | null) => void
  >()

const {
  legal_people_fund_sources,
  formElementRef,
  models,
  isEconomicActivitiesExpanded,
  isFinancialInformationExpanded,
  isBankAccountsExpanded,
  isSourceOfFundsExpanded,
  formatCurrencyString,
} = useCorporateForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>

<style scoped lang="scss">
:deep(.q-item__section--main span) {
  font-size: 1.125rem;
}

:deep(.q-table__title) {
  font-size: 1.125rem !important;
  font-weight: bold !important;
}

.q-expansion-item {
  :deep(.q-expansion-item__content) {
    padding-left: 16px;
    padding-right: 16px;
  }
}

.generator-card {
  width: 820px;
  max-width: 90vw;
  border-radius: 15px !important;
}
</style>
