<template>
  <q-form ref="operationDataFormRef">
    <section class="q-mt-md">
      <div class="row items-end q-col-gutter-x-lg q-col-gutter-y-sm">

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="models.unit_id"
            label="Unidad"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.fic_participation_value_foreign"
            :rules="[
              (val: string) => is_required(val, 'La unidad es requerida'),
            ]"
            @update:model-value="models.unit_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="models.portfolio_class"
            label="Clase cartera"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.class_portfolio"
            :rules="[
              (val: string) => is_required(val, 'La clase cartera es requerida'),
            ]"
            @update:model-value="models.portfolio_class = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            label="Tipo de papel"
            :default_value="infoModels.paper_type_label"
            required
            disabled
            :rules="[
              (val: string) => is_required(val, 'El tipo de papel es requerido'),
            ]"
            @update:model-value="infoModels.paper_type_label = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            label="Moneda origen"
            :default_value="infoModels.currency_label"
            required
            disabled
            :rules="[
              (val: string) => is_required(val, 'La Moneda origen es requerida'),
            ]"
            @update:model-value="models.currency_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            label="ISIN"
            :default_value="infoModels.isin_label"
            required
            disabled
            :rules="[
              (val: string) => is_required(val, 'ISIN es requerido'),
            ]"
            @update:model-value="models.isin_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="models.operation_type_id"
            label="Código de operación"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.operation_type"
            :rules="[
              (val: string) => is_required(val, 'El código de operación es requerido'),
            ]"
            @update:model-value="models.operation_type_id = $event"
          />
        </div>
        
        <div class="col-12 col-md-3">
          <GenericInput
            label="Descripción operación"
            :default_value="infoModels.operation_description"
            required
            disabled
            :rules="[]"
            @update:model-value="infoModels.operation_description = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            label="Número días operación de contado"
            :default_value="models.number_days"
            required
            type="number"
            min="0"
            max="5"
            :rules="[
              (v: string) => is_required(v, 'El número de días es requerido'),
              (v: string) => Number(v) > 1 || 'Debe ser mayor a 1',
              (v: string) => Number(v) <= 5 || 'Debe ser menor o igual a 5',
            ]"
            @update:model-value="models.number_days = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            label="Número de participación"
            :default_value="models.participation_number"
            required
            disabled
            :rules="[
              (v: string) => is_required(v, 'El número de participación es requerido'),
            ]"
            @update:model-value="models.participation_number = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            label="Número de título"
            :default_value="models.title_id"
            required
            disabled
            :rules="[
              (v: string) => is_required(v, 'El número de título es requerido'),
            ]"
            @update:model-value="models.title_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            label="Saldo moneda origen"
            :default_value="models.origin_currency_balance"
            disabled
            :rules="[
              (v: string) => is_required(v, 'El saldo de moneda origen es requerido'),
            ]"
            @update:model-value="models.origin_currency_balance = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            label="Valor unidad moneda origen"
            :default_value="models.value_unit_currency_origin"
            disabled
            :rules="[
              (v: string) => is_required(v, 'El valor unidad moneda origen es requerido'),
            ]"
            @update:model-value="models.value_unit_currency_origin = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            label="Saldo actual en unidades"
            :default_value="models.current_balance_units"
            disabled
            :rules="[
              (v: string) => is_required(v, 'El saldo actual en unidades es requerido'),
            ]"
            @update:model-value="models.current_balance_units = $event"
          />
        </div>

      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'

import { IDataOperationForeignCurrencyForm } from '@/interfaces/customs'
import OperationDataForm from '@/components/Forms/InvestmentPortfolio/FicParticipationsAddition/OperationDataForeignCurrency/OperationDataForm'

const props = withDefaults(
  defineProps<{
    data: IDataOperationForeignCurrencyForm | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
}>()

const {
  operationDataFormRef,
  models,
  infoModels,
  is_required,
  selectOptions,
  resetForm,
} = OperationDataForm(props, emits)

defineExpose({
  resetForm,
  getValues: () => infoModels.value,
  validateForm: () => operationDataFormRef.value?.validate(),
})
</script>