<template>
  <q-form ref="basicDataFormRef" class="q-pa-xl">
    <section class="q-mt-md">
      <div
        class="row items-center justify-between q-px-md"
        v-if="action === 'create'"
      >
        <p class="q-mb-none mt-1 text-weight-medium">Motivo*</p>
        <RadioYesNo
          :options="cancellation_reason_types"
          v-model="models.reason_type"
        />
      </div>
      <q-separator class="q-my-lg" v-if="action === 'create'" />

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6" v-if="action === 'edit'">
          <GenericInputComponent
            label="Código de anulación"
            :default_value="models.reason_code"
            required
            disabled
          />
        </div>
        <div class="col-12 col-md-6">
          <GenericInputComponent
            label="Descripción"
            :default_value="models.description"
            required
            :rules="[
              (val: string) => useRules().is_required(val),
            (val: string) =>useRules().max_length(val,100)
            ]"
            @update:model-value="models.description = $event"
          />
        </div>
      </div>
      <div v-if="models.reason_type === 'anulacion'">
        <q-separator class="q-my-lg" />
        <div class="row items-center justify-between q-px-md">
          <p class="q-mb-none mt-1 text-weight-medium">Reporta DIAN*</p>
          <RadioYesNo v-model="models.has_reports_dian" />
        </div>
        <q-separator class="q-my-lg" />
        <div class="row items-center justify-between q-px-md">
          <p class="q-mb-none mt-1 text-weight-medium">
            Aplica devolución de impuestos*
          </p>
          <RadioYesNo v-model="models.is_applies_tax_refund" />
        </div>
      </div>
    </section>
  </q-form>
</template>
<script setup lang="ts">
//Componets
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import useBasicDataForm from '@/components/Forms/AccountsPayable/CancellationRejectionReasons/BasicDataForm'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'

//Composables
import { useRules } from '@/composables'

//Interfaces
import { ICancellationRejectionReasonsItem } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'

const props = withDefaults(
  defineProps<{
    data?: ICancellationRejectionReasonsItem | null
    action: ActionType
  }>(),
  {}
)

const { basicDataFormRef, models, cancellation_reason_types } =
  useBasicDataForm(props)

defineExpose({
  validateForm: () => basicDataFormRef.value?.validate(),
})
</script>
