<template>
  <q-form ref="informationFormRef" aria-label="Formulario de información">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            v-if="!isView"
            label="ID Emisor"
            placeholder="Seleccione"
            :default_value="formData.emitter_id"
            :manual_option="emitterIdSelect"
            auto_complete
            map_options
            required
            :disabled="isEdit"
            :rules="[
              (v: string) => useRules().is_required(v, 'El campo ID Emisor es requerido'),
            ]"
            @update:modelValue="handleEmitterIdChange"
          />
          <div class="text-black-90" v-else>
            <p id="lbl-emitter-id" class="text-weight-bold no-margin">
              ID Emisor
            </p>
            <p
              class="text-weight-medium no-margin"
              aria-labelledby="lbl-emitter-id"
            >
              {{
                emitterIdSelect.find(
                  (item) => item.value === formData.emitter_id
                )?.label || '-'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <GenericInputComponent
            v-if="!isView"
            :default_value="formData.description_emitter_name || '-'"
            label="Descripción"
            placeholder="-"
            type="text"
            disabled
          />
          <div class="text-black-90" v-else>
            <p id="lbl-emitter-name" class="text-weight-bold no-margin">
              Descripción
            </p>
            <p
              class="text-weight-medium no-margin"
              aria-labelledby="lbl-emitter-name"
            >
              {{ formData.description_emitter_name || '-' }}
            </p>
          </div>
        </div>

        <div class="col-12">
          <q-separator class="q-my-md" />
        </div>

        <div class="col-12">
          <p class="text-weight-bold text-h6" aria-level="2" role="heading">
            Información del portafolio
          </p>
        </div>

        <div class="col-12" :class="isView ? 'col-md-3' : 'col-md-4'">
          <GenericSelectorComponent
            v-if="!isView"
            label="Código portafolio"
            placeholder="Seleccione"
            :default_value="formData.investment_portfolio_id"
            :manual_option="investment_portfolio"
            auto_complete
            map_options
            required
            :rules="[
              (v: string) => useRules().is_required(v, 'El campo Código portafolio es requerido'),
            ]"
            @update:modelValue="handlePortfolioIdChange"
          />
          <div class="text-black-90" v-else>
            <p id="lbl-portfolio-code" class="text-weight-bold no-margin">
              Código portafolio
            </p>
            <p
              class="text-weight-medium no-margin"
              aria-labelledby="lbl-portfolio-code"
            >
              {{ formData.portfolio_code || '-' }}
            </p>
          </div>
        </div>

        <div class="col-12" :class="isView ? 'col-md-3' : 'col-md-4'">
          <GenericInputComponent
            v-if="!isView"
            :default_value="formData.description_portfolio_name || '-'"
            label="Descripción"
            placeholder="-"
            type="text"
            disabled
          />
          <div class="text-black-90" v-else>
            <p id="lbl-portfolio-name" class="text-weight-bold no-margin">
              Descripción
            </p>
            <p
              class="text-weight-medium no-margin"
              aria-labelledby="lbl-portfolio-name"
            >
              {{ formData.description_portfolio_name || '-' }}
            </p>
          </div>
        </div>

        <div class="col-12" :class="isView ? 'col-md-3' : 'col-md-4'">
          <GenericInputComponent
            v-if="!isView"
            :default_value="formData.general_quota"
            label="Cupo general"
            placeholder="Inserte"
            type="text"
            required
            :rules="[
              (v: string) => useRules().only_number_with_max_integers_and_decimals(v, 15, 2),
              (v: string) => useRules().is_required(v, 'El campo Cupo general es requerido'),
            ]"
            @update:modelValue="formData.general_quota = $event"
          />
          <div class="text-black-90" v-else>
            <p id="lbl-general-quota" class="text-weight-bold no-margin">
              Cupo general
            </p>
            <p
              class="text-weight-medium no-margin"
              aria-labelledby="lbl-general-quota"
            >
              {{ formData.general_quota || '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3" v-if="isView">
          <p id="lbl-bank-accounts" class="text-weight-bold no-margin">
            Cuentas bancarias
          </p>

          <template
            v-if="formData.has_bank_accounts"
            aria-labelledby="lbl-bank-accounts"
          >
            <div
              v-for="acc in formData.issuing_banks"
              :key="acc.id"
              class="q-mb-xs"
            >
              <p class="text-weight-medium no-margin">
                {{ acc.coin_type }} - {{ acc.account_number }}
              </p>
            </div>
          </template>

          <p class="text-weight-medium no-margin" v-else>No</p>
        </div>

        <div
          class="row col-12 items-center justify-between q-px-md q-pl-lg"
          v-if="!isView"
        >
          <p
            id="lbl-has-bank-accounts"
            class="q-mb-none mt-1 text-weight-medium"
          >
            ¿Tiene cuentas bancarias?*
          </p>
          <RadioYesNo
            class="q-mt-none"
            :titleRadioTrue="'Si'"
            :titleRadioFalse="'No'"
            v-model="hasBankAccountsBool"
          />
        </div>

        <div class="col-12">
          <q-separator class="q-my-md" />
        </div>

        <div
          class="col-12"
          v-if="
            (isEditable && hasBankAccountsBool) ||
            (formData.has_bank_accounts && !isView)
          "
        >
          <p
            class=""
            :class="
              isView
                ? 'text-black-10 text-weight-bold'
                : 'text-grey-6 text-weight-medium'
            "
          >
            Cuentas bancarias
          </p>

          <div
            v-for="acc in bankAccountSelect"
            :key="acc.id"
            class="row items-center q-mb-md"
          >
            <q-checkbox
              v-model="selectedBankAccountIds"
              :val="acc.id"
              @update:model-value="handleBankAccountSelection"
              color="orange"
              dense
              class="q-mr-sm"
            />
            <span class="text-grey-10">
              {{ acc.account_name }} - {{ acc.account_number }}
            </span>
          </div>

          <div class="col-12">
            <q-separator class="q-mt-lg q-mb-md" />
          </div>
        </div>

        <div class="col-12">
          <p class="text-weight-bold text-h6" aria-level="2" role="heading">
            Tipos de inversión y papeles
          </p>
        </div>

        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            v-if="!isView"
            label="Tipo inversión"
            placeholder="Seleccione"
            :default_value="formData.type_of_investment"
            :manual_option="typeInvestmentSelect"
            auto_complete
            map_options
            required
            :rules="[
              (v: string) => useRules().is_required(v, 'El campo Tipo inversión es requerido'),
            ]"
            @update:modelValue="handleTypeInvestmentChange"
          />
          <div class="text-black-90" v-else>
            <p id="lbl-type-of-investment" class="text-weight-bold no-margin">
              Tipo inversión
            </p>
            <p
              class="text-weight-medium no-margin"
              aria-labelledby="lbl-type-of-investment"
            >
              {{ formData.type_of_investment || '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            v-if="!isView"
            label="Papeles"
            placeholder="Seleccione"
            :default_value="formData.paper_type_id"
            :manual_option="paperTypeSelect"
            auto_complete
            map_options
            required
            :rules="[
              (v: string) => useRules().is_required(v, 'El campo Papeles es requerido'),
            ]"
            @update:modelValue="formData.paper_type_id = $event"
          />
          <div class="text-black-90" v-else>
            <p id="lbl-papers" class="text-weight-bold no-margin">Papeles</p>
            <p
              class="text-weight-medium no-margin"
              aria-labelledby="lbl-papers"
            >
              {{ formData.Papers || '-' }}
            </p>
          </div>
        </div>

        <div class="col-12">
          <q-separator class="q-my-md" />
        </div>

        <div class="col-12">
          <p class="text-weight-bold text-h6" aria-level="2" role="heading">
            Emisión
          </p>
        </div>

        <div class="col-12 col-md-3" v-if="isView">
          <div class="col-12 col-md-3">
            <p id="lbl-has-emission-bool" class="text-weight-bold no-margin">
              ¿Tiene emisión?
            </p>
            <div aria-labelledby="lbl-has-emission-bool">
              <p class="text-weight-medium no-margin" v-if="!hasEmissionBool">
                No
              </p>
              <p class="text-weight-medium no-margin" v-else>Si</p>
            </div>
          </div>
        </div>

        <div
          class="row col-12 items-center justify-between q-px-md q-pl-lg"
          v-else
        >
          <p id="lbl-has-emission" class="q-mb-none mt-1 text-weight-medium">
            ¿Tiene emisión?*
          </p>
          <RadioYesNo
            class="q-mt-none"
            :titleRadioTrue="'Si'"
            :titleRadioFalse="'No'"
            v-model="hasEmissionBool"
          />
        </div>

        <div class="col-12" v-if="!isView">
          <q-separator class="q-my-md" />
        </div>

        <div
          class="col-12"
          :class="
            hasEmissionBool ? 'col-md-4' : isView ? 'col-md-3' : 'col-md-6'
          "
          v-if="hasEmissionBool"
        >
          <GenericInputComponent
            v-if="!isView"
            :default_value="formData.issue_value"
            label="Valor emisión"
            placeholder="Inserte"
            type="text"
            required
            :rules="[
              (v: string) => useRules().only_number_with_max_integers_and_decimals(v, 15, 2),
              (v: string) => useRules().is_required(v, 'El campo Valor emisión es requerido'),
            ]"
            @update:modelValue="formData.issue_value = $event"
          />
          <div class="text-black-90" v-else>
            <p id="lbl-issue-value" class="text-weight-bold no-margin">
              Valor emisión
            </p>
            <p
              class="text-weight-medium no-margin"
              aria-labelledby="lbl-issue-value"
            >
              {{ formatCurrencyString(formData.issue_value) }}
            </p>
          </div>
        </div>

        <div
          class="col-12"
          :class="
            hasEmissionBool ? 'col-md-4' : isView ? 'col-md-3' : 'col-md-6'
          "
        >
          <GenericInputComponent
            v-if="!isView"
            :default_value="
              hasEmissionBool
                ? formData.emission_percentage
                : formData.quota_generates
            "
            :label="hasEmissionBool ? '% Emisión*' : '% Cupo general*'"
            :disabled="disableEmissionPercentage"
            :placeholder="disableEmissionPercentage ? '-' : 'Inserte'"
            type="text"
            :rules="[
              (val: string) => useRules().max_value(val, 100),
              (val: string) => useRules().min_value(val, 0),
              (val: string) => useRules().only_positive_number(val),
            ]"
            @update:modelValue="
              hasEmissionBool
                ? (formData.emission_percentage = $event)
                : (formData.quota_generates = $event)
            "
          />
          <div class="text-black-90" v-else>
            <p id="lbl-emission-percentage" class="text-weight-bold no-margin">
              {{ hasEmissionBool ? '% Emisión' : '% Cupo general' }}
            </p>
            <p
              class="text-weight-medium no-margin"
              aria-labelledby="lbl-emission-percentage"
            >
              {{
                hasEmissionBool
                  ? `${formData.emission_percentage ?? 0}%`
                  : `${formData.quota_generates ?? 0}%`
              }}
            </p>
          </div>
        </div>

        <div
          class="col-12"
          :class="
            hasEmissionBool ? 'col-md-4' : isView ? 'col-md-3' : 'col-md-6'
          "
        >
          <GenericInputComponent
            v-if="!isView"
            :default_value="
              hasEmissionBool
                ? formData.absolute_value_of_issue
                : formData.absolute_value_general_quota
            "
            :disabled="disableAbsoluteValue"
            :label="
              hasEmissionBool
                ? 'Valor absoluto/Emisión*'
                : 'Valor absoluto/Cupo general*'
            "
            :placeholder="disableAbsoluteValue ? '-' : 'Inserte'"
            type="text"
            @update:modelValue="
              hasEmissionBool
                ? (formData.absolute_value_of_issue = $event)
                : (formData.absolute_value_general_quota = $event)
            "
          />
          <div class="text-black-90" v-else>
            <p id="lbl-absolute-value" class="text-weight-bold no-margin">
              {{
                hasEmissionBool
                  ? 'Valor absoluto/Emisión'
                  : 'Valor absoluto/Cupo general'
              }}
            </p>
            <p
              class="text-weight-medium no-margin"
              aria-labelledby="lbl-absolute-value"
            >
              {{
                formatCurrencyString(
                  hasEmissionBool
                    ? formData.absolute_value_of_issue
                    : formData.absolute_value_general_quota
                )
              }}
            </p>
          </div>
        </div>

        <div class="col-12">
          <q-separator :class="isView ? 'q-my-md' : 'q-mt-md q-mb-lg'" />
        </div>

        <div class="row col-12" v-if="isView">
          <div class="col-12">
            <p
              class="text-weight-bold text-h6 q-mb-md"
              aria-level="2"
              role="heading"
            >
              Historial de cupo y permiso emisor
            </p>
          </div>

          <div class="col-12 col-md-3 text-black-90">
            <p id="lbl-created-at" class="text-weight-bold no-margin">
              Fecha de creación
            </p>
            <p
              class="text-weight-medium no-margin"
              aria-labelledby="lbl-created-at"
            >
              {{ formData.history_quotas_issuing_Permit?.created_at || '-' }}
            </p>
          </div>

          <div class="col-12 col-md-3 text-black-90">
            <p id="lbl-creator-data" class="text-weight-bold no-margin">
              Creado por
            </p>
            <p
              class="text-weight-medium no-margin"
              aria-labelledby="lbl-creator-data"
            >
              {{ formData.history_quotas_issuing_Permit?.creator_data || '-' }}
            </p>
          </div>

          <div class="col-12 col-md-3 text-black-90">
            <p id="lbl-updated-at" class="text-weight-bold no-margin">
              Modificación
            </p>
            <p
              class="text-weight-medium no-margin"
              aria-labelledby="lbl-updated-at"
            >
              {{ formData.history_quotas_issuing_Permit?.updated_at || '-' }}
            </p>
          </div>

          <div class="col-12 col-md-3 text-black-90">
            <p id="lbl-update-data" class="text-weight-bold no-margin">
              Modificado por
            </p>
            <p
              class="text-weight-medium no-margin"
              aria-labelledby="lbl-update-data"
            >
              {{ formData.history_quotas_issuing_Permit?.update_data || '-' }}
            </p>
          </div>

          <div class="col-12">
            <q-separator class="q-mt-lg q-mb-lg" />
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
//Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
//Interface
import { ActionType } from '@/interfaces/global'
//Composables
import { useRules } from '@/composables'
//logica
import useInformationForm from './InformationForm'
//Props
const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: {}
  }>(),
  {}
)

const {
  isView,
  isEdit,
  formData,
  isEditable,
  emitterIdSelect,
  hasEmissionBool,
  paperTypeSelect,
  bankAccountSelect,
  informationFormRef,
  hasBankAccountsBool,
  investment_portfolio,
  disableAbsoluteValue,
  typeInvestmentSelect,
  formatCurrencyString,
  handleEmitterIdChange,
  selectedBankAccountIds,
  handlePortfolioIdChange,
  disableEmissionPercentage,
  handleBankAccountSelection,
  handleTypeInvestmentChange,
} = useInformationForm(props)

defineExpose({
  getValues: () => formData.value,
  validateForm: () => informationFormRef.value?.validate(),
})
</script>
