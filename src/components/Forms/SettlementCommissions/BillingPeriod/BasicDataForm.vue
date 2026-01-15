<template>
  <q-form ref="formElementRef">
    <section class="q-mt-md">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div v-if="props.action === 'edit'" class="col-12 col-md-4">
          <GenericInputComponent
            label="Código del periodo"
            disabled
            :default_value="models.period_code"
            @update:model-value="models.period_code = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Nombre del negocio"
            :default_value="models.business_code"
            :manual_option="business_trusts_value_is_code"
            map_options
            auto_complete
            required
            :disabled="props.action === 'edit'"
            :rules="[(val: string) => is_required(val,  'El nombre del negocio es requerido')]"
            @update:modelValue="models.business_code = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericDateInputComponent
            label="Fecha inicial"
            :clearable="true"
            :required="true"
            :default_value="models.start_date"
            :rules="[
              (val: string) => is_required(val, 'La fecha inicial es requerida'),
            ]"
            @update:modelValue="models.start_date = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericDateInputComponent
            label="Fecha final"
            :clearable="true"
            :required="true"
            :default_value="models.end_date"
            :rules="[
              (val: string) => is_required(val, 'La fecha final es requerida'),
            ]"
            @update:modelValue="models.end_date = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Periodicidad"
            :default_value="models.periodicity"
            :manual_option="periodicities"
            map_options
            auto_complete
            required
            :rules="[(val: string) => is_required(val,  'La periodicidad es requerida')]"
            @update:modelValue="models.periodicity = $event"
          />
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'

// Interfaces
import { IBillingPeriodInformationForm } from '@/interfaces/customs/settlement-commissions/BillingPeriodV2'
import { WriteActionType } from '@/interfaces/global'

// Logic view
import useBasicDataForm from '@/components/Forms/SettlementCommissions/BillingPeriod/BasicDataForm'

const props = withDefaults(
  defineProps<{
    action: WriteActionType
    data: IBillingPeriodInformationForm | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IBillingPeriodInformationForm | null): void
}>()

const {
  formElementRef,
  models,
  is_required,
  business_trusts_value_is_code,
  periodicities,
} = useBasicDataForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
