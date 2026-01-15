<template>
  <q-form ref="formCorporative" class="q-pa-lg">
    <section>
      <div>
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Información general de la empresa
        </p>
        <p
          v-if="['create', 'edit'].includes(action)"
          class="text-grey-6 text-weight-medium q-mb-none"
        >
          Proporcione los datos necesarios de la empresa, tales como: la
          clasificación de la empresa, información financiera, origen de fondos,
          entre otros.
        </p>
      </div>
    </section>

    <section class="q-mt-lg">
      <div v-if="['create', 'edit'].includes(action)" class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Clasificación de la empresa
        </p>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Clasificación de la empresa{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :manual_option="legal_people_company_classification"
            :map_options="true"
            :required="true"
            :first_filter_option="'label'"
            :second_filter_option="'label'"
            :default_value="models.company_classification_corporative"
            :auto_complete="true"
            @update:modelValue="
              models.company_classification_corporative = $event
            "
            :rules="[(val: string) => !!val || 'La clasificación es requerida']"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.company_classification_corporative ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-6">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Código CIIU{{ ['create', 'edit'].includes(action) ? '*' : '' }}
          </p>
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :manual_option="ciius"
            :map_options="true"
            :required="true"
            :first_filter_option="'label'"
            :second_filter_option="'label'"
            :default_value="models.ciiu_code_corporative"
            :auto_complete="true"
            @update:modelValue="models.ciiu_code_corporative = $event"
            :rules="[(val: string) => !!val || 'El código CIIU es requerido']"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.ciiu_code_corporative ?? 'No registrado' }}
          </p>
        </div>
      </div>
      <q-separator class="q-mt-sm" />

      <RadioYesNo
        v-model="models.is_registered_national_registry_corporative"
        class="q-pt-md q-pl-sm"
        hasTitle
        title="¿La persona jurídica está inscrita en el registro nacional de
              emisores y además están sujetos a requisitos de revelación de
              información?"
        :hasSubtitle="false"
        :is-disabled="['view'].includes(action)"
      />
      <q-separator class="q-mt-sm" />
    </section>

    <section class="q-mt-lg">
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Información financiera
        </p>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6">
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
            v-model="models.total_monthly_operating_income_corporative"
            :currency="'COP'"
            :placeholder="''"
            currencyLabel=""
            :rules="[
                (v: string) => !!v || 'El total de ingresos operacionales es requerido',
                (v: string) => v.length >= 1 || 'Debe contener al menos 1 caracteres',
                (v: string) =>
                  v.length <= 30 || 'Debe contener como máximo 30 caracteres',
                (v: string) => useRules(). only_number_greater_than_zero(v) 
              ]"
          />
          <p v-else class="text-grey-6 mb-0">
            {{
              formatCurrencyString(
                models.total_monthly_operating_income_corporative
              ) ?? 'No registrado'
            }}
          </p>
        </div>

        <div class="col-12 col-md-6">
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
            v-model="models.total_monthly_not_operating_income_corporative"
            :currency="'COP'"
            :placeholder="''"
            currencyLabel=""
            :rules="[
                (v: string) => !!v || 'El total de ingresos no operacionales es requerido',
                (v: string) => v.length >= 1 || 'Debe contener al menos 1 caracteres',
                (v: string) =>
                  v.length <= 30 || 'Debe contener como máximo 30 caracteres',
                (v: string) => useRules(). only_number_greater_than_zero(v) 
              ]"
          />
          <p v-else class="text-grey-6 mb-0">
            {{
              formatCurrencyString(
                models.total_monthly_not_operating_income_corporative
              ) ?? 'No registrado'
            }}
          </p>
        </div>

        <div class="col-12 col-md-6">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Total egresos mensuales{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <CurrencyInput
            v-if="['create', 'edit'].includes(action)"
            v-model="models.total_monthly_expenses_corporative"
            :currency="'COP'"
            :placeholder="''"
            currencyLabel=""
            :rules="[
                (v: string) => !!v || 'El total de egresos mensuales es requerido',
                (v: string) => v.length >= 1 || 'Debe contener al menos 1 caracteres',
                (v: string) =>
                  v.length <= 30 || 'Debe contener como máximo 30 caracteres',
                (v: string) => useRules(). only_number_greater_than_zero(v) 
              ]"
          />
          <p v-else class="text-grey-6 mb-0">
            {{
              formatCurrencyString(models.total_monthly_expenses_corporative) ??
              'No registrado'
            }}
          </p>
        </div>

        <div class="col-12 col-md-6">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Concepto otros ingresos no operacionales mensuales
          </p>
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.item_other_monthly_income_corporative"
            :required="
              models.item_other_monthly_income_corporative ? true : false
            "
            :rules="
                models.item_other_monthly_income_corporative
                  ? [
                      (v: string) => useRules().only_letters(v),
                      (v: string) => useRules().max_length(v, 30),
                    ]
                  : []
              "
            @update:model-value="
              models.item_other_monthly_income_corporative = $event
            "
          />
          <p v-else class="text-grey-6 mb-0">
            {{
              models.item_other_monthly_income_corporative ?? 'No registrado'
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
            Total activos{{ ['create', 'edit'].includes(action) ? '*' : '' }}
          </p>
          <CurrencyInput
            v-if="['create', 'edit'].includes(action)"
            v-model="models.total_assets_corporative"
            :currency="'COP'"
            :placeholder="''"
            currencyLabel=""
            :rules="[
                (v: string) => !!v || 'El total de activos es requerido',
                (v: string) => v.length >= 1 || 'Debe contener al menos 1 caracteres',
                (v: string) =>
                  v.length <= 30 || 'Debe contener como máximo 30 caracteres',
                (v: string) => useRules(). only_number_greater_than_zero(v)
              ]"
          />
          <p v-else class="text-grey-6 mb-0">
            {{
              formatCurrencyString(models.total_assets_corporative) ??
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
            v-model="models.total_liabilities_corporative"
            :currency="'COP'"
            :placeholder="''"
            currencyLabel=""
            :rules="[
                (v: string) => !!v || 'El total de pasivos es requerido',
                (v: string) => v.length >= 1 || 'Debe contener al menos 1 caracteres',
                (v: string) =>
                  v.length <= 30 || 'Debe contener como máximo 30 caracteres',
                (v: string) => useRules(). only_number_greater_than_zero(v)
              ]"
          />
          <p v-else class="text-grey-6 mb-0">
            {{
              formatCurrencyString(models.total_liabilities_corporative) ??
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
            Fecha de corte de información financiera{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="
              models.cutoff_date_financial_information_corporative
            "
            :required="true"
            :rules="[
                  (val: string) => !!val || 'La fecha de corte es requerida',
                  (v: string) => date_before_or_equal_to_the_current_date(v)
                ]"
            @update:modelValue="
              models.cutoff_date_financial_information_corporative = $event
            "
          />
          <p v-else class="text-grey-6 mb-0">
            {{
              models.cutoff_date_financial_information_corporative ??
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
            Banco{{ ['create', 'edit'].includes(action) ? '*' : '' }}
          </p>
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :manual_option="banks"
            :map_options="true"
            :required="true"
            :first_filter_option="'label'"
            :second_filter_option="'label'"
            :default_value="models.bank_entity_corporative"
            :auto_complete="true"
            @update:modelValue="models.bank_entity_corporative = $event"
            :rules="[(val: string) => !!val || 'El banco es requerido']"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.bank_entity_corporative ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Tipo de cuenta del titular{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :manual_option="bank_types"
            :map_options="true"
            :required="true"
            :first_filter_option="'label'"
            :second_filter_option="'label'"
            :default_value="models.type_account_holder_corporative"
            :auto_complete="true"
            @update:modelValue="models.type_account_holder_corporative = $event"
            :rules="[(val: string) => !!val || 'El tipo de cuenta es requerido']"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.type_account_holder_corporative ?? 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
            "
          >
            Número de cuenta de titular{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            required
            :default_value="models.holder_account_number_corporative"
            type="number"
            :rules="[
              (val: string) => useRules().only_alphanumeric(val),
              (val: string) => /^(?!0+$).*$/.test(val) || 'El valor no puede ser solo ceros',
              (val: string) => useRules().max_length(val, 20),
              (val: string) => useRules().min_length(val, 6),
            ]"
            @update:model-value="
              models.holder_account_number_corporative = $event
            "
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.holder_account_number_corporative ?? 'No registrado' }}
          </p>
        </div>
      </div>
      <q-separator class="q-mt-sm" />
    </section>

    <section class="q-mt-lg">
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Origen de fondos
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
            Origen de los fondos{{
              ['create', 'edit'].includes(action) ? '*' : ''
            }}
          </p>
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :manual_option="legal_people_fund_sources"
            :map_options="true"
            :required="true"
            :first_filter_option="'label'"
            :second_filter_option="'label'"
            :default_value="models.origin_funds_corporative"
            :auto_complete="true"
            @update:modelValue="(val: string ) => {
                models.origin_funds_corporative = val
                if (val !== 'Otro') models.other_origin_funds_corporative = null
              }"
            :rules="[(val: string) => !!val || 'El origen es requerido']"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ models.origin_funds_corporative ?? 'No registrado' }}
          </p>
        </div>

        <template v-if="models.origin_funds_corporative === 'Otro'">
          <div class="col-12 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Escriba el origen de los fondos{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              required
              :default_value="models.other_origin_funds_corporative"
              :rules="[
                (v: string) => !!v || 'Este campo es requerido',
                (v: string) => /^[\p{L}\d ]*$/u.test(v) || 'Solo caracteres alfanuméricos',
                (v: string) => v.length <= 30 || 'Debe contener como máximo 30 caracteres',
              ]"
              @update:model-value="
                models.other_origin_funds_corporative = $event
              "
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.other_origin_funds_corporative ?? 'No registrado' }}
            </p>
          </div>
        </template>
      </div>
      <q-separator class="q-mt-sm" />
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import { useRules } from '@/composables'
import useCorporativeForm from './CorporativeForm'

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
  formCorporative,
  banks,
  bank_types,
  ciius,
  legal_people_company_classification,
  legal_people_fund_sources,
  date_before_or_equal_to_the_current_date,
  formatCurrencyString,
} = useCorporativeForm(props)

defineExpose({
  validateForm: () => formCorporative.value?.validate(),
})
</script>
