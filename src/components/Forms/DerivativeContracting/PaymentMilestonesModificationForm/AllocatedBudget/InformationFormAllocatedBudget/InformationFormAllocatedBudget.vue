<template>
  <q-form ref="formElementRef">
    <section class="q-mt-md">

      <div class="q-mb-lg">
        <p class="text-black-90 text-weight-bold text-h6 q-mb-none">
          Información del nuevo hito
        </p>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericInput
            label="Hito"
            placeholder="-"
            :default_value="models.milestone"
            :disabled="action === 'view'"
            @update:model-value="models.milestone = $event"
          />
        </div>
        <div class="col-12 col-md-3">
          <GenericInput
            label="Tipo de pago"
            placeholder="-"
            :default_value="models.payment_type"
            :disabled="action === 'view'"
            @update:model-value="models.payment_type = $event"
          />
        </div>
        <div class="col-12 col-md-3">
          <GenericInput
            label="Fecha"
            placeholder="-"
            :default_value="models.date"
            :disabled="action === 'view'"
            @update:model-value="models.date = $event"
          />
        </div>
        <div class="col-12 col-md-3">
          <GenericInput
            label="Monto extranjero programo"
            placeholder="-"
            :default_value="models.foreign_amount"
            :disabled="action === 'view'"
            @update:model-value="models.foreign_amount = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            label="Valor hito programado COP"
            placeholder="-"
            :default_value="models.cop_value"
            :disabled="action === 'view'"
            @update:model-value="models.cop_value = $event"
          />
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// Components
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { IPaymentMilestoneForm } from '@/interfaces/customs/derivative-contracting/PaymentMilestonesModification'

// Logic
import useInformationForm from '@/components/Forms/DerivativeContracting/PaymentMilestonesModificationForm/InformationForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: IPaymentMilestoneForm | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IPaymentMilestoneForm | null): void
}>()

const { formElementRef, models } = useInformationForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
