<template>
  <q-form ref="informationFormRef">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            :default_value="formData.collective_investment_fund_id"
            label="Fondo de inversión"
            :manual_option="funts_to_investment_plans"
            auto_complete
            map_options
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El fondo de inversión es requerido')
            ]"
            @update:model-value="
              formData.collective_investment_fund_id = $event
            "
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            :default_value="formData.fiduciary_investment_plan_id"
            label="Plan de inversión"
            :manual_option="fiduciary_investment_plans"
            auto_complete
            map_options
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El plan de inversión es requerido')
            ]"
            @update:model-value="formData.fiduciary_investment_plan_id = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="formData.fiduciary_investment_plan_description"
            label="Descripción plan de inversión"
            placeholder="-"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="formData.check_digit"
            label="Dígito de chequeo"
            placeholder="-"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="formData.participation_type"
            label="Tipo de participación"
            placeholder="-"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            :default_value="formData.treasurie_pay_form_id"
            label="Formas de pago"
            :manual_option="means_of_payments"
            auto_complete
            map_options
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'Las formas de pago son requeridas')
            ]"
            @update:model-value="formData.treasurie_pay_form_id = $event"
          />
        </div>

        <div class="col-12">
          <q-separator class="q-mb-lg" />
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'

// Composables
import { useRules } from '@/composables'

// Logic view
import useInformationForm from '@/components/Forms/Fics/GenericInvestmentPlans/InformationForm'

const {
  formData,
  means_of_payments,
  informationFormRef,
  funts_to_investment_plans,
  fiduciary_investment_plans,
} = useInformationForm()

defineExpose({
  getValues: () => formData.value,
  validateForm: () => informationFormRef.value?.validate(),
})
</script>
