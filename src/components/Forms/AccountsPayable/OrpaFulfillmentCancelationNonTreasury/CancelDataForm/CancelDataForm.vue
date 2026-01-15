<template>
  <q-form ref="cancelDataFormRef" class="q-pa-lg">
    <section class="q-mt-md">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12">
          <GenericSelectorComponent
            label="Motivo anulación"
            :default_value="models.reason"
            :manual_option="cancellation_rejection_reasons"
            :map_options="true"
            required
            :rules="[(val: string) => useRules().is_required(val),]"
            @update:model-value="models.reason = $event"
          />
        </div>

        <div class="col-12">
          <GenericDateInputComponent
            label="Fecha de anulación"
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
            label="Observaciones cumplimiento"
            :default_value="models.observations"
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
import { IOrpaCancelDataForm } from '@/interfaces/customs/accounts-payable/OrpaFulfillmentCancelationNonTreasury'

// Composables
import { useRules } from '@/composables/useRules'

//Logic
import useCancelDataForm from '@/components/Forms/AccountsPayable/OrpaFulfillmentCancelationNonTreasury/CancelDataForm/CancelDataForm'

const props = withDefaults(
  defineProps<{
    data?: IOrpaCancelDataForm | null
  }>(),
  {}
)

const emits =
  defineEmits<(e: 'update:data', value: IOrpaCancelDataForm | null) => void>()

const { cancelDataFormRef, models, cancellation_rejection_reasons } =
  useCancelDataForm(props, emits)

defineExpose({
  validateForm: () => cancelDataFormRef.value?.validate(),
})
</script>
