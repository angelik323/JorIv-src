<template>
  <q-form ref="basicDataFormRef" class="q-pa-lg">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div v-if="action === 'edit'" class="col-12 col-md-3">
          <GenericInputComponent
            label="Código del bloque"
            type="text"
            :default_value="models.block_code"
            :required="true"
            :disabled="true"
            :rules="[(val: string) => is_required(val, 'El código del bloque es requerido')]"
            @update:model-value="models.block_code = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            label="Nombre del bloque"
            type="text"
            :default_value="models.block_name"
            :required="true"
            :disabled="false"
            :rules="[
              (val: string) => is_required(val, 'El nombre del bloque es requerido'),
              (val: string) => max_length(val, 60),
              (val: string) => only_alphanumeric(val)
            ]"
            @update:model-value="models.block_name = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            label="Estructura contable"
            :default_value="models.accounting_structure_id"
            :manual_option="account_structures_accounting_concepts"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :rules="[(val: string) => is_required(val, 'La estructura contable es requerida')]"
            @update:model-value="models.accounting_structure_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            label="Estructura de pago"
            :default_value="models.payment_structure_id"
            :manual_option="account_structures_payment_concepts"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :rules="[(val: string) => is_required(val, 'La estructura de pago es requerida')]"
            @update:model-value="models.payment_structure_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            label="Requerimiento presupuestal"
            :default_value="models.budget_requirement_id"
            :manual_option="budget_structures"
            :auto_complete="true"
            :required="false"
            :map_options="true"
            :rules="[]"
            @update:model-value="models.budget_requirement_id = $event"
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
import { IPaymentBlockForm } from '@/interfaces/customs/accounts-payable/PaymentBlocks'
import { ActionType } from '@/interfaces/global'

// logic view
import useBasicDataForm from '@/components/Forms/AccountsPayable/PaymentBlocks/BasicData/BasicDataForm'

const emit = defineEmits(['update:data'])

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IPaymentBlockForm | null
  }>(),
  {}
)

const {
  basicDataFormRef,
  models,

  // selects
  account_structures_accounting_concepts,
  account_structures_payment_concepts,
  budget_structures,

  // rules
  is_required,
  max_length,
  only_alphanumeric,
} = useBasicDataForm(props, emit)

defineExpose({
  validateForm: () => basicDataFormRef.value?.validate(),
})
</script>
