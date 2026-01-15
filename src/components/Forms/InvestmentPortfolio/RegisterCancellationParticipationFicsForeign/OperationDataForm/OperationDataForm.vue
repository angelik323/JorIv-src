<template>
  <q-form
    role="form"
    ref="operationDataFormRef"
    aria-label="Formulario de datos de operación"
  >
    <section aria-label="Sección de formulario de datos de operación">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="models.unit_id"
            label="Unidad"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.fic_participation_details"
            :rules="[
              (val: string) => useRules().is_required(val, 'La unidad es requerida'),
            ]"
            @update:model-value="handleChangeUnit"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="models.portfolio_class"
            label="Clase de cartera"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.class_portfolio"
            :rules="[
              (val: string) => useRules().is_required(val, 'La clase de cartera es requerida'),
            ]"
            @update:model-value="models.portfolio_class = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="models.paper_type_label"
            label="Código papel"
            placeholder="-"
            type="text"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="models.currency_label"
            label="Moneda"
            placeholder="-"
            type="text"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="models.isin_label"
            label="ISIN"
            placeholder="-"
            type="text"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="models.operation_type_id"
            label="Código operación"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.operation_type"
            :rules="[
              (val: string) => useRules().is_required(val, 'El código de operación es requerido'),
            ]"
            @update:model-value="models.operation_type_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="models.operation_type_description"
            label="Descripción operación"
            placeholder="-"
            type="text"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="models.number_days"
            label="Número días operación de contado"
            placeholder="Inserte"
            type="text"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El número de días de operación de contado es requerido'),
              (val: string) => useRules().only_number_greater_than_zero(val),
              (val: string) => useRules().min_value(val, 1),
              (val: string) => useRules().max_value(val, 5),
            ]"
            @update:model-value="models.number_days = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="models.participation_number"
            label="Número de participación"
            placeholder="-"
            type="text"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="models.title_id"
            label="Número de título"
            placeholder="-"
            type="text"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            :modelValue="models.balance_participation_currency_origin"
            label="Saldo participación moneda origen"
            placeholder="-"
            disabled
            required
          />
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            :modelValue="models.cancellation_value_origin_currency"
            label="Valor cancelación moneda origen"
            placeholder="-"
            disabled
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El valor cancelación moneda origen es requerido'),
            ]"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="models.balance_number_units"
            label="Saldo número de unidades"
            placeholder="-"
            type="text"
            disabled
            required
          />
        </div>

        <div class="col-12">
          <q-separator class="q-my-lg" />
        </div>
      </div>
    </section>
  </q-form>
</template>
<script lang="ts" setup>
import { useRules } from '@/composables'
import useOperationDataForm from './OperationDataForm'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'

const {
  models,
  selectOptions,
  operationDataFormRef,
  resetForm,
  handleChangeUnit,
} = useOperationDataForm()

defineExpose({
  resetForm,
  getValues: () => models.value,
  validateForm: () => operationDataFormRef.value?.validate(),
})
</script>
