<template>
  <q-form ref="informationFormRef">
    <div class="q-mx-lg q-col-gutter-md">
      <p class="text-h5 text-weight-bold">Crear fondo consolidador</p>
      <div class="col q-col-gutter-sm">
        <GenericInputComponent
          ref="initialBalanceRef"
          label="Código fondo"
          :default_value="formData.code"
          placeholder="Inserte"
          class_name="q-pt-none"
          type="text"
          :required="true"
          @update:modelValue="formData.code = $event"
          :rules="[
                (val: string) => useRules().is_required(val, 'El saldo inicial es requerido.'),
                (val: string) => useRules().only_number_with_decimals(val),
                (val: string) => useRules().only_number_with_max_integers_and_decimals(val, 15, 2),
              ]"
        />

        <GenericInputComponent
          ref="finalBalanceRef"
          label="Descripción fondo"
          :default_value="formData.description"
          placeholder="Inserte"
          class_name="q-pt-none"
          type="text"
          :required="true"
          @update:modelValue="formData.description = $event"
          :rules="[
                (val: string) => useRules().is_required(val, 'El saldo final es requerido.')
              ]"
        />
        <GenericSelectorComponent
          label="Negocio"
          class_name="q-pt-none"
          :default_value="String(formData.business_trust_id)"
          :manual_option="business_trusts"
          :required="true"
          :rules="[(val: string) => useRules().is_required(val, 'El negocio es requerido')]"
          @update:modelValue="formData.business_trust_id = $event"
        />
      </div>
    </div>
  </q-form>
</template>

<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'

// Interfaces
import { useRules } from '@/composables'

// Logic view
import useInformationForm from '@/components/Forms/Fics/ConsolidatedInvestment/information/InformationForm'

const {
  formData,
  finalBalanceRef,
  initialBalanceRef,
  informationFormRef,
  business_trusts,
} = useInformationForm()

defineExpose({
  validateForm: () => informationFormRef.value?.validate(),
  getPayload: () => ({
    code: formData.value.code,
    description: formData.value.description,
    business_trust_id: formData.value.business_trust_id,
  }),
})
</script>
