<template>
  <q-form ref="informationFormRef">
    <div class="q-mx-lg q-col-gutter-md">
      <p class="text-h5 text-weight-bold">Agregar compartimento</p>
      <div class="col q-col-gutter-sm">
        <GenericSelectorComponent
          label="Fondo"
          class_name="q-pt-none"
          :default_value="formData.collective_investment_fund_id"
          :manual_option="funds"
          :required="true"
          :map_options="true"
          :first_filter_option="'label'"
          :second_filter_option="'label'"
          :rules="[(val: string) => useRules().is_required(val, 'El fondo es requerido')]"
          @update:modelValue="formData.collective_investment_fund_id = $event"
        />
      </div>
    </div>
  </q-form>
</template>

<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'

// Composables
import { useRules } from '@/composables'

// Logic view
import useInformationForm from '@/components/Forms/Fics/ConsolidatedInvestmentAssign/information/InformationForm'

const { formData, informationFormRef, funds } = useInformationForm()

defineExpose({
  validateForm: () => informationFormRef.value?.validate(),
  getPayload: () => ({
    collective_investment_fund_id: formData.value.collective_investment_fund_id,
  }),
})
</script>
