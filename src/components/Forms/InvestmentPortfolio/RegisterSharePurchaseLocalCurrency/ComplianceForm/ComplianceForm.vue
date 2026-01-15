<template>
  <q-form ref="complianceFormRef">
    <section aria-label="Sección de formulario de cumplimiento">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="formData.quantity_units"
            label="Cantidad de unidades"
            placeholder="Inserte"
            type="text"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'La cantidad de unidades es requerida'),
              (val: string) => useRules().only_number_with_max_integers_and_decimals(val, 15, 6),
            ]"
            @update:model-value="formData.quantity_units = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="formData.unit_value"
            label="Valor unidad"
            placeholder="Inserte"
            type="text"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El valor de la unidad es requerido'),
              (val: string) => useRules().only_number_with_max_integers_and_decimals(val, 15, 6),
            ]"
            @update:model-value="formData.unit_value = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="
              useUtils().getFormatNumber(formData.purchase_value ?? 0)
            "
            label="Valor compra"
            placeholder="-"
            type="text"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericInputComponent
            :default_value="
              useUtils().getFormatNumber(formData.commission_value ?? 0)
            "
            label="Valor comisión"
            placeholder="-"
            type="text"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericInputComponent
            :default_value="
              useUtils().getFormatNumber(formData.total_operation_value ?? 0)
            "
            label="Valor total operación"
            placeholder="-"
            type="text"
            disabled
            required
          />
        </div>
      </div>

      <q-separator class="q-my-lg" />
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'

import { useRules, useUtils } from '@/composables'

import useComplianceForm from './ComplianceForm'

const { formData, resetForm, complianceFormRef } = useComplianceForm()

defineExpose({
  resetForm,
  getValues: () => formData.value,
  validateForm: () => complianceFormRef.value?.validate(),
})
</script>
