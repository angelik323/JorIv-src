<template>
  <q-form ref="basicDataFormRef" class="q-pa-lg">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12">
          <div class="row justify-between items-center">
            <p class="no-margin">Provisión de impuestos*</p>
            <RadioYesNo v-model="models.tax_provision" />
          </div>
          <q-separator class="q-my-sm" />
        </div>

        <div class="col-12">
          <div class="row justify-between items-center">
            <p class="no-margin">
              Fuente de recursos<span v-if="models.tax_provision === true"
                >*</span
              >
            </p>
            <RadioYesNo
              :is-disabled="!models.tax_provision"
              v-model="models.resource_source"
              :options="causation_resource_source"
            />
          </div>
          <q-separator class="q-my-sm" />
        </div>
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Fondo/Banco"
            :default_value="models.fund_or_bank_id"
            :manual_option="filteredFundBanks"
            :map_options="true"
            :required="models.tax_provision === true"
            :disabled="!models.tax_provision"
            @update:model-value="models.fund_or_bank_id = $event"
            :rules="[
                (val: string) => useRules().is_required(val),
              ]"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Cuenta/Plan"
            :default_value="models.plan_or_account_id"
            :manual_option="filteredPlanAccounts"
            :map_options="true"
            :required="models.tax_provision === true"
            :disabled="!models.tax_provision"
            @update:model-value="models.plan_or_account_id = $event"
            :rules="[
                (val: string) => useRules().is_required(val),
              ]"
          />
        </div>
      </div>
    </section>
  </q-form>
</template>
<script setup lang="ts">
//Componets
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

//Interfaces
import { ICausationWithoutPaymentInstructionsForm } from '@/interfaces/customs/accounts-payable/CausationWithoutPaymentInstructions'

// Composables
import { useRules } from '@/composables/useRules'

//Logic
import useBasicDataForm from '@/components/Forms/AccountsPayable/CausationWithoutPaymentInstructions/BasicDataForm'

const props = withDefaults(
  defineProps<{
    data?: ICausationWithoutPaymentInstructionsForm | null
    selectedBusinessId?: number | null
  }>(),
  {}
)

const emits =
  defineEmits<
    (
      e: 'update:data',
      value: ICausationWithoutPaymentInstructionsForm | null
    ) => void
  >()

const {
  basicDataFormRef,
  models,
  causation_resource_source,
  filteredFundBanks,
  filteredPlanAccounts,
} = useBasicDataForm(props, emits)

defineExpose({
  validateForm: () => basicDataFormRef.value?.validate(),
})
</script>
