<template>
  <q-form ref="fulfillDataFormRef" class="q-pa-lg">
    <section class="q-mt-md">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12">
          <GenericSelectorComponent
            label="Cuenta contable"
            :default_value="models.legalization_account"
            :manual_option="account_structures_accounting_accounts"
            :map_options="true"
            :required="false"
            :rules="[]"
            @update:model-value="models.legalization_account = $event"
          />
        </div>

        <div class="col-12">
          <GenericSelectorComponent
            label="Tipo de comprobante"
            :default_value="models.voucher_type_id"
            :manual_option="receipt_types"
            :map_options="true"
            :required="false"
            :rules="[]"
            @update:model-value="models.voucher_type_id = $event"
          />
        </div>

        <div class="col-12">
          <GenericSelectorComponent
            label="Subtipo de comprobante"
            :default_value="models.subtype_voucher_id"
            :manual_option="sub_receipt_types"
            :map_options="true"
            :required="false"
            :rules="[]"
            @update:model-value="models.subtype_voucher_id = $event"
          />
        </div>

        <div class="col-12">
          <GenericDateInputComponent
            label="Fecha de cumplimiento"
            :default_value="models.date"
            required
            :rules="[
               (val: string) => useRules().is_required(val),
            ]"
            @update:model-value="models.date = $event"
          />
        </div>

        <div class="col-12">
          <GenericInputComponent
            label="Establezca una observación de cumplimiento"
            :default_value="models.observation"
            type="textarea"
            :rules="[
               (val: string) => useRules().max_length(val,250),
            ]"
          />
        </div>
      </div>
    </section>
  </q-form>
</template>
<script setup lang="ts">
//Componets
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'

//Interfaces
import { IOrpaFulfillDataForm } from '@/interfaces/customs/accounts-payable/OrpaFulfillmentCancelationNonTreasury'

// Composables
import { useRules } from '@/composables/useRules'

//Logic
import useFulfillDataForm from '@/components/Forms/AccountsPayable/OrpaFulfillmentCancelationNonTreasury/FulfillDataForm/FulfillDataForm'

const props = withDefaults(
  defineProps<{
    data?: IOrpaFulfillDataForm | null
  }>(),
  {}
)

const emits =
  defineEmits<(e: 'update:data', value: IOrpaFulfillDataForm | null) => void>()

const {
  fulfillDataFormRef,
  models,
  account_structures_accounting_accounts,
  receipt_types,
  sub_receipt_types,
} = useFulfillDataForm(props, emits)

defineExpose({
  validateForm: () => fulfillDataFormRef.value?.validate(),
})
</script>
