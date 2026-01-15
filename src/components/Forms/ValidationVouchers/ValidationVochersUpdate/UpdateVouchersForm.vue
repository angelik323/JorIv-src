<template>
  <q-form ref="formUpdateElementRef" class="q-pa-xl">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-xs-12 col-sm-12 col-md-4">
          <GenericInput
            label="Estado"
            :required="false"
            disabled
            placeholder="-"
            :default_value="models.status"
            :rules="[]"
            @update:model-value="models.status = $event"
          />
        </div>
      </div>

      <q-separator class="q-mb-lg q-mt-md" />

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-xs-12 col-sm-12 col-md-6">
          <GenericSelectorComponent
            label="Tipo de comprobante"
            :auto_complete="true"
            :map_options="true"
            :required="true"
            :default_value="models.receipt_type_id"
            :manual_option="receipt_types"
            :rules="[(v: string) => useRules().is_required(v, 'El campo Tipo de comprobante es requerido')]"
            @update:modelValue="models.receipt_type_id = $event"
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6">
          <GenericSelectorComponent
            label="Subtipo de comprobante"
            :auto_complete="true"
            :map_options="true"
            :required="true"
            :default_value="models.sub_receipt_type_id"
            :manual_option="sub_receipt_types ?? []"
            :rules="[(v: string) => useRules().is_required(v, 'El campo Subtipo de comprobante es requerido')]"
            @update:modelValue="models.sub_receipt_type_id = $event"
          />
        </div>
      </div>
    </section>
  </q-form>
</template>

<script lang="ts" setup>
import { useRules } from '@/composables'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import UpdateVouchersForm from './UpdateVouchersForm'

const {
  models,
  formUpdateElementRef,
  receipt_types,
  sub_receipt_types,
  setFormData,
} = UpdateVouchersForm()

const validateForm = () => formUpdateElementRef.value?.validate()

defineExpose({
  validateForm,
  setFormData,
})
</script>
