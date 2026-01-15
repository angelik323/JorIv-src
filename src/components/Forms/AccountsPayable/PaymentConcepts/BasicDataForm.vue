<template>
  <q-form ref="basicDataFormRef" class="q-pa-lg">
    <p class="text-black-90 text-subtitle1 text-weight-bold no-margin">
      Datos de entrada
    </p>
    <section class="q-mt-md">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Código de estructura"
            :manual_option="account_structures_payment_concepts"
            :map_options="true"
            :default_value="models.structure_id"
            required
            @update:model-value="models.structure_id = $event"
            :disabled="action === 'edit'"
            :rules="[
              (val: string) => useRules().is_required(val, 'El código de estructura es requerido'),
            ]"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            label="Finalidad"
            disabled
            :default_value="selectedStructure.purpose"
            required
          />
        </div>
        <div class="col-12 col-md-4">
          <GenericInputComponent
            label="Estructura"
            disabled
            :default_value="selectedStructure.structure"
            required
          />
        </div>
      </div>
      <q-separator class="q-my-sm" />
    </section>
    <p class="text-grey-90 text-subtitle1 text-weight-bold no-margin">
      Conceptos de pago
    </p>
    <section class="q-mt-md">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6">
          <GenericInputComponent
            label="Código concepto de pago"
            :default_value="models.concept_code"
            type="number"
            required
            :disabled="action === 'edit'"
            @update:model-value="models.concept_code = $event"
            :rules="[
              (val: string) => useRules().is_required(val, 'El código concepto de pago es requerido'),
              (val: string) => useRules().only_number(val),
               (val: string) => useRules().max_length(val,conceptCodeLength)
  
            ]"
          />
        </div>
        <div class="col-12 col-md-6">
          <GenericInputComponent
            label="Nombre concepto de pago"
            :default_value="models.concept_name"
            required
            @update:model-value="models.concept_name = $event"
            :rules="[
              (val: string) => useRules().is_required(val, 'El nombre concepto de pago es requerido'),
              (val: string) => useRules().only_alphanumeric(val),
              (val: string) => useRules().min_length(val,1),
              (val: string) => useRules().max_length(val,80)
            ]"
          />
        </div>
      </div>
      <div class="row items-center justify-between q-px-md">
        <p class="q-mb-none mt-1 text-weight-medium">Tipo*</p>
        <RadioYesNo
          v-model="models.concept_type"
          :options="payment_concept_types"
          :is-disabled="action === 'edit'"
        />
      </div>
      <q-separator class="q-my-sm" />
      <div class="row items-center justify-between q-px-md">
        <p class="q-mb-none mt-1 text-weight-medium">Naturaleza*</p>
        <RadioYesNo
          v-model="models.nature_type"
          :options="payment_concept_nature_types"
          :is-disabled="action === 'edit'"
        />
      </div>
      <q-separator class="q-my-sm q-mb-lg" />
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Tipo de actividad"
            :manual_option="payment_concept_activity_types"
            :map_options="true"
            :default_value="models.activity_type"
            @update:model-value="models.activity_type = $event"
            :required="false"
            :rules="[]"
            :clearable="false"
          />
        </div>
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Tipo de obligación"
            :manual_option="payment_concept_obligation_types"
            :map_options="true"
            :default_value="models.obligation_type"
            @update:model-value="models.obligation_type = $event"
            :required="false"
            :rules="[]"
            :clearable="false"
          />
        </div>
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Manejo pensional"
            :manual_option="payment_concept_pension_types"
            :map_options="true"
            :default_value="models.pension_type"
            @update:model-value="models.pension_type = $event"
            :disabled="!obligationTypeIsPensional"
            :required="obligationTypeIsPensional"
            :rules="obligationTypeIsPensional?[(val: string) => useRules().is_required(val, 'El manejo pensional es requerido')]:[]"
            :clearable="false"
          />
        </div>
      </div>
      <q-separator class="q-my-lg" />
      <div class="row items-center justify-between q-px-md">
        <p class="q-mb-none mt-1 text-weight-medium">¿Liquida impuestos?*</p>
        <RadioYesNo
          v-model="models.liquidates_taxes"
          :is-disabled="liquidatedTaxedIsDisabled"
        />
      </div>
      <q-separator class="q-my-sm" />
      <div class="row items-center justify-between q-px-md">
        <p class="q-mb-none mt-1 text-weight-medium">¿Es un anticipo?*</p>
        <RadioYesNo
          v-model="models.is_advance"
          :is-disabled="isAdvanceIsDisabled"
        />
      </div>
    </section>
  </q-form>
</template>
<script setup lang="ts">
// Componets
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

// Composables
import { useRules } from '@/composables'

// Interfaces
import { IPaymentConceptsForm } from '@/interfaces/customs/accounts-payable/PaymentConcepts'
import { ActionType } from '@/interfaces/global'

// Logic
import useBasicDataForm from '@/components/Forms/AccountsPayable/PaymentConcepts/BasicDataForm'

const props = withDefaults(
  defineProps<{
    data?: IPaymentConceptsForm | null
    action: ActionType
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'update:data', value: IPaymentConceptsForm | null): void
}>()

const {
  basicDataFormRef,
  models,
  account_structures_payment_concepts,
  payment_concept_types,
  payment_concept_nature_types,
  payment_concept_activity_types,
  payment_concept_obligation_types,
  payment_concept_pension_types,
  selectedStructure,
  conceptCodeLength,
  obligationTypeIsPensional,
  liquidatedTaxedIsDisabled,
  isAdvanceIsDisabled,
} = useBasicDataForm(props, emits)

defineExpose({
  validateForm: () => basicDataFormRef.value?.validate(),
})
</script>
