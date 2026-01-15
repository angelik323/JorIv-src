<template>
  <q-form
    class="compliance-form"
    role="form"
    ref="complianceFormRef"
    aria-label="Formulario de cumplimiento"
  >
    <section aria-label="Sección de formulario de cumplimiento">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm eq-row">
        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="
              useUtils().getFormatNumber(formData.purchase_unit_value ?? 0)
            "
            label="Valor unidad de compra"
            placeholder="-"
            type="text"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="
              useUtils().getFormatNumber(
                formData.available_units_by_issuer ?? 0
              )
            "
            label="Cantidad acciones disponibles por emisor"
            placeholder="-"
            type="text"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.sale_quantity"
            label="Cantidad de acciones venta"
            placeholder="Inserte"
            type="text"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'La cantidad de acciones es requerida'),
              (val: string) => useRules().only_number_with_max_integers_and_decimals(val, 15, 6),
              (val: string) => Number(val) > 0 || 'El valor debe ser mayor a 0',
            ]"
            @update:model-value="
              formData.sale_quantity = $event.replace(',', '.')
            "
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="formData.sale_unit_value"
            label="Valor unidad de venta"
            placeholder="Inserte"
            type="text"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El valor de la unidad es requerido'),
              (val: string) => useRules().only_number_with_max_integers_and_decimals(val, 15, 2),
              (val: string) => Number(val) > 0 || 'El valor debe ser mayor a 0',
            ]"
            @update:model-value="
              formData.sale_unit_value = $event.replace(',', '.')
            "
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="
              useUtils().getFormatNumber(formData.sale_value ?? 0)
            "
            label="Valor venta"
            placeholder="-"
            type="text"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-3">
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

        <div class="col-12 col-md-3">
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

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="
              useUtils().getFormatNumber(formData.profit_or_loss_value ?? 0)
            "
            label="Valor utilidad / pérdida venta"
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

const {
  formData,
  complianceFormRef,
  resetForm,
  setCommissionFromEmitter,
  recalc,
  setPurchaseUnitValue,
  setAvailableUnitsByIssuerFromEmitter,
} = useComplianceForm()

defineExpose({
  resetForm,
  getValues: () => formData.value,
  validateForm: () => complianceFormRef.value?.validate(),
  setCommissionFromEmitter,
  recalc,
  setPurchaseUnitValue,
  setAvailableUnitsByIssuerFromEmitter,
})
</script>
<style src="./ComplianceForm.scss" lang="scss"></style>
