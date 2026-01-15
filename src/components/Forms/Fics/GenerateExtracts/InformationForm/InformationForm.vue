<template>
  <q-form ref="informationFormRef" aria-label="Formulario de datos básicos">
    <section aria-label="Sección de formulario de datos básicos">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="row col-12 items-center justify-between q-px-md">
          <p class="q-mb-none mt-1 text-weight-medium q-ml-md">
            Tipo de generación
          </p>
          <RadioYesNo
            v-model="formData.generation_type"
            class="q-mt-none"
            :options="radioOptions"
          />
        </div>

        <div class="col-12">
          <q-separator class="q-mt-sm q-mb-lg" />
        </div>

        <div class="col-12 col-md-4">
          <GenericDateInputComponent
            :default_value="dateToday"
            label="Fecha de registro"
            mask="YYYY-MM-DD"
            disabled
            required
            :rules="[]"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericDateInputComponent
            v-if="!isIndividual"
            :default_value="formData.period_from"
            label="Período desde"
            :mask="'YYYY-MM'"
            placeholder="AAAA-MM"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El período desde es requerido'),
            ]"
            @update:model-value="formData.period_from = $event"
          />

          <GenericSelectorComponent
            v-else
            :default_value="formData.period_from"
            label="Período desde"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="
              excludeSelectedYear(formData.period_to, selectOptions.years)
            "
            :rules="[
              (val: string) => useRules().is_required(val, 'El período desde es requerido'),
            ]"
            @update:model-value="formData.period_from = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericDateInputComponent
            v-if="!isIndividual"
            :default_value="formData.period_to"
            label="Período hasta"
            :mask="'YYYY-MM'"
            placeholder="AAAA-MM"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El período hasta es requerido'),
              (val: string) => useRules().validate_date_order(val, formData.period_from, isIndividual),
            ]"
            @update:model-value="formData.period_to = $event"
          />

          <GenericSelectorComponent
            v-else
            :default_value="formData.period_to"
            label="Período hasta"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="
              excludeSelectedYear(formData.period_from, selectOptions.years)
            "
            :rules="[
              (val: string) => useRules().is_required(val, 'El período hasta es requerido'),
              (val: string) => useRules().validate_date_order(val, formData.period_from, isIndividual),
            ]"
            @update:model-value="formData.period_to = $event"
          />
        </div>

        <div class="col-12">
          <q-separator class="q-mt-sm q-mb-lg" />
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            :default_value="formData.initial_fund_id"
            label="Fondo inicial"
            placeholder="Seleccione"
            auto_complete
            map_options
            :required="!isIndividual"
            :disabled="isIndividual"
            :manual_option="selectOptions.funds"
            :rules="[
              (val: string) => useRules().is_required(val, 'El fondo inicial es requerido'),
            ]"
            @update:model-value="onSelectInitialFund($event)"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            :default_value="formData.final_fund_id"
            label="Fondo final"
            placeholder="Seleccione"
            auto_complete
            map_options
            :required="!isIndividual"
            :disabled="isIndividual"
            :manual_option="selectOptions.funds"
            :rules="[
              (val: string) => useRules().is_required(val, 'El fondo inicial es requerido'),
            ]"
            @update:model-value="onSelectFinalFund($event)"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            :default_value="formData.identification_id"
            label="Identificación titular"
            placeholder="Seleccione"
            auto_complete
            map_options
            :required="isIndividual"
            :disabled="!isIndividual"
            :manual_option="selectOptions.third_parties"
            :rules="[
              (val: string) => useRules().is_required(val, 'El fondo final es requerido'),
            ]"
            @update:model-value="onSelectThirdParty($event)"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            :default_value="formData.fiduciary_investment_plan_id"
            label="Plan de inversión"
            placeholder="Seleccione"
            auto_complete
            map_options
            :required="false"
            :disabled="disablePlan"
            :manual_option="selectOptions.fiduciary_investment_plans"
            :rules="[
              (val: string) => useRules().is_required(val, 'El plan de inversión es requerido'),
            ]"
            @update:model-value="formData.fiduciary_investment_plan_id = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            :default_value="formData.business_trust_id"
            label="Negocio"
            placeholder="Seleccione"
            auto_complete
            map_options
            :required="false"
            :disabled="disableBusiness"
            :manual_option="selectOptions.business_trusts"
            :rules="[
              (val: string) => useRules().is_required(val, 'El negocio es requerido'),
            ]"
            @update:model-value="formData.business_trust_id = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            :default_value="formData.extract_type"
            label="Tipo de extracto"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.extract_types"
            :rules="[
              (val: string) => useRules().is_required(val, 'El tipo de extracto es requerido'),
            ]"
            @update:model-value="formData.extract_type = $event"
          />
        </div>

        <div class="col-12">
          <q-separator class="q-mt-md q-mb-lg" />
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// Components
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

// Composables
import { useRules } from '@/composables'

// Logic view
import useInformationForm from '@/components/Forms/Fics/GenerateExtracts/InformationForm/InformationForm'

const {
  formData,
  dateToday,
  disablePlan,
  radioOptions,
  isIndividual,
  selectOptions,
  disableBusiness,
  onSelectFinalFund,
  onSelectThirdParty,
  informationFormRef,
  onSelectInitialFund,
  excludeSelectedYear,
} = useInformationForm()

defineExpose({
  getValues: () => formData.value,
  validateForm: () => informationFormRef.value?.validate(),
})
</script>
