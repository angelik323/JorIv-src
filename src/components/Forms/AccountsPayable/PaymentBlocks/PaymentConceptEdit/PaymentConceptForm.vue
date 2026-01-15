<template>
  <q-form ref="paymentConceptFormRef" class="q-px-lg">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6">
          <GenericInputComponent
            label="Código concepto de pago"
            type="text"
            :default_value="models.block_code"
            :required="false"
            :disabled="true"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericInputComponent
            label="Nombre concepto de pago"
            type="text"
            :default_value="models.block_name"
            :required="false"
            :disabled="true"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericInputComponent
            label="Tipo de obligacion"
            type="text"
            :default_value="models.obligation_type"
            :required="false"
            :disabled="true"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Desde rubro"
            :default_value="models.from_budget_item_id"
            :manual_option="budget_item_codes_payment_block"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :rules="[(val: string) => is_required(val, 'El rubro es requerido')]"
            @update:model-value="changeFromBudgetItem($event)"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Hasta rubro"
            :default_value="models.to_budget_item_id"
            :manual_option="budget_item_codes_payment_block"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :rules="[(val: string) => is_required(val, 'La rubro es requerida')]"
            @update:model-value="changeToBudgetItem($event)"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Desde recurso"
            :default_value="models.from_budget_resource_id"
            :manual_option="budget_resource_codes"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :rules="[(val: string) => is_required(val, 'El recurso es requerido')]"
            @update:model-value="changeFromBudgetResource($event)"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Desde recurso"
            :default_value="models.to_budget_resource_id"
            :manual_option="budget_resource_codes"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :rules="[(val: string) => is_required(val, 'El recurso es requerido')]"
            @update:model-value="changeToBudgetResource($event)"
          />
        </div>
      </div>
    </section>

    <q-separator />
  </q-form>
</template>

<script setup lang="ts">
// components
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'

// interfaces
import { IPaymentConceptUpdate } from '@/interfaces/customs/accounts-payable/PaymentBlocks'

// logic view
import usePaymentConceptForm from '@/components/Forms/AccountsPayable/PaymentBlocks/PaymentConceptEdit/PaymentConceptForm'

const emit = defineEmits(['update:data'])

const props = withDefaults(
  defineProps<{
    data?: IPaymentConceptUpdate
  }>(),
  {}
)

const {
  paymentConceptFormRef,
  models,

  // selects
  budget_item_codes_payment_block,
  budget_resource_codes,

  // rules
  is_required,

  // methods
  changeFromBudgetItem,
  changeToBudgetItem,
  changeFromBudgetResource,
  changeToBudgetResource,
} = usePaymentConceptForm(props, emit)

defineExpose({
  validateForm: () => paymentConceptFormRef.value?.validate(),
})
</script>
