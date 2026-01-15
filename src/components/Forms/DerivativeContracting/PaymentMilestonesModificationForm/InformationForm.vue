<template>
  <q-form ref="formElementRef">
    <section class="q-mt-md">
      <div class="q-mb-lg">
        <p class="text-black-90 text-weight-bold text-h6 q-mb-none">
          Información general del contrato
        </p>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericInput
            label="Negocio"
            placeholder="-"
            :default_value="models.BT_name"
            :disabled="action === 'view'"
            @update:model-value="models.BT_name = $event"
          />
        </div>
        <div class="col-12 col-md-3">
          <GenericInput
            label="Tipo de contrato"
            placeholder="-"
            :default_value="models.DT_contract_type"
            :disabled="action === 'view'"
            @update:model-value="models.DT_contract_type = $event"
          />
        </div>
        <div class="col-12 col-md-3">
          <GenericInput
            label="Estado"
            placeholder="-"
            :default_value="models.C_stage"
            :disabled="action === 'view'"
            @update:model-value="models.C_stage = $event"
          />
        </div>
        <div class="col-12 col-md-3">
          <GenericInput
            label="Fecha de suscripción"
            placeholder="-"
            :default_value="models.C_subscription_date"
            :disabled="action === 'view'"
            @update:model-value="models.C_subscription_date = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            label="Contratista"
            placeholder="-"
            :default_value="models.contractor"
            :disabled="action === 'view'"
            @update:model-value="models.contractor = $event"
          />
        </div>
        <div class="col-12 col-md-3">
          <GenericInput
            label="Moneda"
            placeholder="-"
            :default_value="models.currency"
            :disabled="action === 'view'"
            @update:model-value="models.currency = $event"
          />
        </div>
        <div class="col-12 col-md-3">
          <GenericInput
            label="Modalidad"
            placeholder="-"
            :default_value="models.DT_Modality"
            :disabled="action === 'view'"
            @update:model-value="models.DT_Modality = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            label="Número de contrato"
            placeholder="-"
            :default_value="models.C_number"
            :disabled="action === 'view'"
            @update:model-value="models.C_number = $event"
          />
        </div>
      </div>

      <div class="q-mb-lg">
        <p class="text-black-90 text-weight-bold text-h6 q-mb-none">
          Información del hito actual
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
        <InputMoneyComponent
            label="Monto extranjero programado"
            placeholder="-"
            v-model="models.foreign_amount"
            :disabled="action === 'view'"
            :hide_symbol="true"
          />
        </div>

        <div class="col-12 col-md-3">
          <InputMoneyComponent
            label="Valor hito programado COP"
            placeholder="-"
            :disabled="action === 'view'"
            :model-value="models.cop_value"
            :default_value="
              models.cop_value
                ? useUtils().formatCurrencyString(models.cop_value)
                : ''
            "
          />
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// Components
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import InputMoneyComponent from '@/components/InputMoney/InputMoneyComponent.vue'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { IPaymentMilestoneForm } from '@/interfaces/customs/derivative-contracting/PaymentMilestonesModification'

// Logic
import useInformationForm from '@/components/Forms/DerivativeContracting/PaymentMilestonesModificationForm/InformationForm'
import { useUtils } from '@/composables';

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
