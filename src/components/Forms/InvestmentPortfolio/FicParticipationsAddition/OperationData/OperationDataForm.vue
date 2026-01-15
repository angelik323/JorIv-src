<template>
  <q-form ref="operationDataFormRef">
    <section class="q-mt-md">
      <div class="row items-end q-col-gutter-x-lg q-col-gutter-y-sm">

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="models.unit"
            label="Unidad"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.fic_participation_details"
            :rules="[
              (val: string) => is_required(val, 'La unidad es requerida'),
            ]"
            @update:model-value="models.unit = $event"
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
          <GenericSelectorComponent
            :default_value="models.currency_id"
            label="Moneda"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="selectOptions.currency_local"
            :rules="[
              (val: string) => is_required(val, 'La Moneda es requerida'),
            ]"
            @update:model-value="models.currency_id = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            label="Valor moneda"
            :default_value="infoModels.currency_value"
            disabled
            :rules="[]"
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
            disabled
            :rules="[]"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            label="Tipo de papel"
            :default_value="infoModels.paper_type_label"
            disabled
            :rules="[]"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            label="Número de participación"
            :default_value="models.participation_number"
            required
            disabled
            :rules="[]"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            label="Número de titulo"
            :default_value="models.title_id"
            required
            disabled
            :rules="[]"
          />
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            currencyLabel="Saldo participación en pesos"
            v-model="models.participation_balance_pesos"
            :currency="'USD'"
            :placeholder="'Ingrese un valor'"
            required
            disabled
            hideIcon
            :rules="[ 
              (v: string) => is_required(v), 
            ]"
          />
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            currencyLabel="Valor unidad día anterior"
            v-model="models.unit_value_previous_day"
            :currency="'USD'"
            :placeholder="'Ingrese un valor'"
            required
            disabled
            hideIcon
            :rules="[ 
              (v: string) => is_required(v), 
            ]"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            label="Saldo actual en unidades"
            :default_value="models.current_balance_units"
            required
            disabled
            :rules="[
              (val: string) => is_required(val, 'El saldo actual en unidades es requerido'),
            ]"
            @update:model-value="models.current_balance_units = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            currencyLabel="Valor adición"
            v-model="models.addition_value"
            :currency="'USD'"
            :placeholder="'Ingrese un valor'"
            required
            hideIcon
            :rules="[ 
              (v: string) => is_required(v), 
            ]"
            @update:model-value="models.addition_value = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            currencyLabel="Saldo actual participación en pesos"
            v-model="models.current_balance_pesos"
            :currency="'USD'"
            :placeholder="'Ingrese un valor'"
            required
            disabled
            hideIcon
            :rules="[ 
              (v: string) => is_required(v), 
            ]"
          />
        </div>

      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import { WriteActionType } from '@/interfaces/global'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'

import { IOperationDataForm } from '@/interfaces/customs'
import OperationDataForm from '@/components/Forms/InvestmentPortfolio/FicParticipationsAddition/OperationData/OperationDataForm'

const props = withDefaults(
  defineProps<{
    action: WriteActionType
    data: IOperationDataForm | null
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
  selectOptions,
  is_required,
  resetForm,
} = OperationDataForm(props, emits)

defineExpose({
  resetForm,
  validateForm: () => operationDataFormRef.value?.validate(),
})
</script>