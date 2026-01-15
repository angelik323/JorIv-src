<template>
  <q-form ref="formRef">
    <div class="q-pa-md">
      <div class="text-h6 q-mb-md">Información del nuevo hito</div>
      
      <div class="row q-col-gutter-md">
        <!-- Hito -->
        <div class="col-12 col-md-3">
          <GenericInput
          default_value=""
            label="Hito"
            v-model="form.milestone_number"
            type="text"
            required
            readonly
            :rules="[
              (val: string) => useRules().is_required(val, 'Campo obligatorio'),
              (val: string) => /^[0-9]{1,3}$/.test(val) || 'Máximo 3 dígitos numéricos',
              (val: string) => Number(val) > 0 || 'Debe ser mayor a 0'
            ]"
          />
        </div>

        <!-- Tipo de pago -->
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
          default_value=""
            label="Tipo de pago"
            v-model="form.payment_type_id"
            :manual_option="paymentTypes"
            :map_options="true"
            required
            :rules="[(val: string) => useRules().is_required(val, 'Campo obligatorio')]"
          />
        </div>

        <!-- Fecha -->
        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            default_value=""
            label="Fecha"
            v-model="form.date"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'Campo obligatorio'),
              (val: string) => isValidDate(val) || 'La fecha no puede ser inferior a la fecha de suscripción'
            ]"
          />
        </div>

        <!-- Monto extranjero -->
        <div class="col-12 col-md-3" v-if="!isLocalCurrency">
          <CurrencyInput
            label="Monto extranjero"
            v-model="form.foreign_amount"
            currency="USD" 
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'Campo obligatorio'),
                (val: string) => cleanCurrencyToNumber(val) > 0 || 'Debe ser mayor a 0',
              (val: string) => checkMaxForeignAmount(val) || 'El acumulado supera el monto del contrato'
            ]"
          />
        </div>

        <!-- Valor hito programado COP -->
        <div class="col-12 col-md-3">
          <CurrencyInput
            label="Valor hito programado COP"
            v-model="form.local_amount"
            currency="COP"
            :disabled="!isLocalCurrency"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'Campo obligatorio'),
                (val: string) => cleanCurrencyToNumber(val) > 0 || 'Debe ser mayor a 0',
              (val: string) => checkMaxLocalAmount(val) || 'El acumulado supera el valor del contrato'
            ]"
          />
        </div>
      </div>

      <div class="row q-mt-md">
        <RadioYesNo
          v-model="form.apply_budget"
          has-title
          title="Aplica presupuesto?"
          :is-radio-button="true"
        />
      </div>

      <div class="row justify-center q-mt-lg q-gutter-md">
        <Button
          label="Cancelar"
          outline
          color="orange"
          class-custom="btn-filter custom"
          @click="$emit('cancel')"
        />
        <Button
          label="Añadir"
          size="md"
          unelevated
          :outline="false"
          color="orange"
          class="text-capitalize btn-filter custom"
          @click="handleSubmit"
        />
      </div>
    </div>
  </q-form>
</template>

<script setup lang="ts">

// Components
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import Button from '@/components/common/Button/Button.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

// Composables
import { useRules } from '@/composables/useRules'

// Logic
import useNewMilestoneForm from '@/components/Lists/DerivativeContracting/PaymentMilestonesModification/PaymentOrder/PaymentOrderList'

const props = defineProps<{
  contractSubscriptionDate: string
  isLocalCurrency: boolean
  contractValue: number
  foreignValue: number
  trm: number
  currentTotalLocal: number
  currentTotalForeign: number
  milestoneNumber: string
}>()

const emits = defineEmits(['submit', 'cancel'])

const {
  formRef,
  form,
  paymentTypes,
  isValidDate,
  checkMaxForeignAmount,
  checkMaxLocalAmount,
  resetForm,
  handleSubmit,
  cleanCurrencyToNumber
} = useNewMilestoneForm(props, emits)

defineExpose({
  validateForm: () => formRef.value?.validate(),
  resetForm
})
</script>
