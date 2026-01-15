<template>
  <q-form ref="bankResponseAssignFormElementRef" class="q-pa-md">
    <div class="row q-col-gutter-lg">
      <div class="col-xs-12 col-sm-12 col-md-12">
        <RadioYesNo
          v-model="models.status"
          class="q-mt-none"
          @update:modelValue="handleUpdateStatus($event)"
          :options="bank_response_status_options"
          :required="true"
          :rules="[(v: string) => useRules().is_required(v, 'El campo estado es requerido')]"
        />
      </div>

      <div class="col-xs-12 col-sm-12 col-md-12">
        <GenericSelectorComponent
          :disabled="models.status !== 10"
          label="Causal de devolución"
          :default_value="models.reason_id"
          :manual_option="reasons_bank_return"
          map_options
          first_filter_option="label"
          second_filter_option="label"
          auto_complete
          :required="models.status === 10"
          :rules="models.status === 10 ? [(v: string) => useRules().is_required(v, 'El campo causal de devolución es requerido cuando Rechazar es seleccionado')] : []"
          @update:model-value="handleUpdateReason($event)"
        />
      </div>

      <div class="col-xs-12 col-sm-12 col-md-12">
        <GenericInput
          label="Descripción Causal"
          :default_value="models.observations"
          placeholder="-"
          :required="false"
          @update:model-value="models.observations = $event"
          :rules="[]"
        />
      </div>
    </div>

    <q-separator class="q-mt-md" />

    <div class="flex justify-center q-mt-md q-gutter-md">
      <Button
        label="Cancelar"
        size="md"
        unelevated
        :outline="true"
        color="orange"
        class="text-capitalize btn-filter custom"
        @click="$emit('close:modal')"
      />
      <Button
        label="Aceptar"
        size="md"
        unelevated
        :outline="false"
        color="orange"
        class="text-capitalize btn-filter custom"
        @click="onSubmit"
      />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import useBankResponseAssignForm from './BankResponseAssignForm'
import { bank_response_status_options } from '@/constants'

const emit = defineEmits<{
  (e: 'close:modal'): void
  (e: 'update:table-status'): void
}>()

const {
  models,
  bankResponseAssignFormElementRef,
  reasons_bank_return,

  handleUpdateStatus,
  handleUpdateReason,
  onSubmit,
  useRules,
} = useBankResponseAssignForm(emit)
</script>
