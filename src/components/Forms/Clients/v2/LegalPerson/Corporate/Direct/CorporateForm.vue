<template>
  <div class="q-pa-lg">
    <q-form ref="formElementRef" aria-label="Formulario de datos corporativos">
      <section>
        <div class="q-mb-lg">
          <p class="text-black-90 text-weight-bold text-h6 q-mb-none">
            Información general de la empresa
          </p>
        </div>

        <div
          class="row"
          :class="
            action === 'create'
              ? 'q-col-gutter-x-lg q-col-gutter-y-sm'
              : 'q-col-gutter-lg'
          "
        >
          <div class="col-12 col-md-6">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.company_classification"
              label="Clasificación de la empresa"
              auto_complete
              map_options
              :manual_option="legal_people_company_classification"
              required
              :disabled="action === 'edit'"
              :rules="[
                (val: string) => useRules().is_required(val, 'La clasificación de la empresa es requerida'),
              ]"
              @update:model-value="models.company_classification = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">
                Clasificación de la empresa
              </p>
              <p class="text-weight-medium no-margin">
                {{ models.company_classification || 'No registrado' }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-6">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.ciiu_code"
              label="Código CIIU"
              auto_complete
              map_options
              :manual_option="ciius"
              required
              :disabled="action === 'edit'"
              :rules="[
                (val: string) => useRules().is_required(val, 'El código CIIU es requerido'),
              ]"
              @update:model-value="models.ciiu_code = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Código CIIU</p>
              <p class="text-weight-medium no-margin">
                {{ models.ciiu_code || 'No registrado' }}
              </p>
            </div>
          </div>
        </div>
        <q-separator :class="action === 'create' ? 'q-mt-sm' : 'q-mt-lg'" />

        <RadioYesNo
          v-model="models.is_registered_issuer_subject_to_disclosure"
          class="q-mt-md q-ml-sm"
          hasTitle
          title="¿La persona jurídica está inscrita en el registro nacional de emisores y además están sujetos a requisitos de revelación de información?"
          :hasSubtitle="false"
          required
          :is-disabled="['view'].includes(action)"
        />
        <q-separator class="q-mt-sm" />
      </section>

      <section class="q-mt-lg">
        <div class="q-mb-lg">
          <p class="text-black-90 text-weight-bold text-h6 q-mb-none">
            Información financiera
          </p>
        </div>

        <div
          class="row"
          :class="
            action === 'create'
              ? 'q-col-gutter-x-lg q-col-gutter-y-sm'
              : 'q-col-gutter-lg'
          "
        >
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
                  models.other_non_operational_income_concept || 'No registrado'
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
              <p class="text-weight-bold no-margin">Total egresos mensuales</p>
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
              :disabled="action === 'edit'"
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

          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.bank"
              label="Banco"
              auto_complete
              map_options
              :manual_option="banks"
              required
              :disabled="action === 'edit'"
              :rules="[
                (val: string) => useRules().is_required(val, 'El banco es requerido'),
              ]"
              @update:model-value="models.bank = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Banco</p>
              <p class="text-weight-medium no-margin">
                {{ models.bank || 'No registrado' }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.holder_account_type"
              label="Tipo de cuenta del titular"
              auto_complete
              map_options
              :manual_option="bank_types"
              required
              :disabled="action === 'edit'"
              :rules="[
                (val: string) => useRules().is_required(val, 'El tipo de cuenta es requerido'),
              ]"
              @update:model-value="models.holder_account_type = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">
                Tipo de cuenta del titular
              </p>
              <p class="text-weight-medium no-margin">
                {{ models.holder_account_type || 'No registrado' }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <GenericInputComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.holder_account_number"
              label="Número de cuenta del titular"
              required
              :rules="[
                (val: string) => useRules().is_required(val, 'El número de cuenta es requerido'),
                (val: string) => useRules().only_number(val),
                (val: string) => useRules().only_positive_number(val),
                (val: string) => useRules().max_length(val, 20),
              ]"
              @update:model-value="models.holder_account_number = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">
                Número de cuenta del titular
              </p>
              <p class="text-weight-medium no-margin">
                {{ models.holder_account_number || 'No registrado' }}
              </p>
            </div>
          </div>
        </div>
        <q-separator :class="action === 'create' ? 'q-mt-sm' : 'q-mt-lg'" />
      </section>

      <section class="q-mt-lg">
        <div class="q-mb-lg">
          <p class="text-black-90 text-weight-bold text-h6 q-mb-none">
            Origen de fondos
          </p>
        </div>

        <div
          class="row"
          :class="
            action === 'create'
              ? 'q-col-gutter-x-lg q-col-gutter-y-sm'
              : 'q-col-gutter-lg'
          "
        >
          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.source_of_funds"
              label="Origen de fondos"
              auto_complete
              map_options
              :manual_option="legal_people_fund_sources"
              required
              :disabled="action === 'edit'"
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

          <div v-if="models.source_of_funds === 'Otro'" class="col-12 col-md-4">
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
        </div>
        <q-separator :class="action === 'create' ? 'q-mt-sm' : 'q-mt-lg'" />
      </section>
    </q-form>
  </div>
</template>

<script lang="ts" setup>
import { ActionType } from '@/interfaces/global'
import { IDirectCorporateForm } from '@/interfaces/customs/clients/ClientDirectLegalPerson'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import InputMoneyComponent from '@/components/InputMoney/InputMoneyComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import { useRules } from '@/composables'
import useCorporateForm from '@/components/Forms/Clients/v2/LegalPerson/Corporate/Direct/CorporateForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: IDirectCorporateForm | null
  }>(),
  {}
)

const emits =
  defineEmits<(e: 'update:data', value: IDirectCorporateForm | null) => void>()

const {
  legal_people_company_classification,
  ciius,
  banks,
  bank_types,
  legal_people_fund_sources,
  formElementRef,
  models,
  formatCurrencyString,
} = useCorporateForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
