<template>
  <q-form ref="formInformation" class="q-pa-xl">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <!-- Banco -->
        <div class="col-12 col-md-6">
          <p class="text-weight-medium mb-0">Banco</p>
          <GenericSelectorComponent
            :default_value="models.bank_id"
            @update:model-value="models.bank_id = $event"
            :manual_option="banks_initial_balance"
            map_options
            placeholder="Seleccione un banco"
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="false"
            :rules="[]"
          />
        </div>
        <!-- Descripción -->
        <div class="col-12 col-md-6">
          <p class="text-weight-medium mb-0">Descripción *</p>
          <GenericInputComponent
            :default_value="models.description"
            @update:model-value="models.description = $event"
            placeholder="Ingrese una descripción"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'La descripción es requerida'),
              (val: string) => useRules().max_length(val, 100)
            ]"
          />
        </div>
        <!-- Movimiento tesorería -->
        <div class="col-12 col-md-6">
          <p class="text-weight-medium mb-0">Movimiento tesoreria</p>
          <GenericSelectorComponent
            :default_value="models.treasury_movement_code_id"
            @update:model-value="models.treasury_movement_code_id = $event"
            :manual_option="treasury_movement_codes"
            map_options
            placeholder="Seleccione un movimiento de tesorería"
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="false"
            :rules="[]"
          />
        </div>
        <!-- ¿Válida Forma de Recaudo? -->
        <div class="col-12 col-md-6">
          <p class="text-weight-medium mb-0">¿Válida Forma de Recaudo?</p>
          <GenericSelectorComponent
            :default_value="models.validates_collection_method"
            @update:model-value="models.validates_collection_method = $event"
            :manual_option="validates_collection_method_options"
            map_options
            placeholder="Seleccione una opción"
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="false"
            :rules="[]"
          />
        </div>
        <!-- Tipo comisión -->
        <div class="col-12 col-md-4">
          <p class="text-weight-medium mb-0">Tipo comisión</p>
          <GenericSelectorComponent
            :default_value="models.commission_rate"
            @update:model-value="models.commission_rate = $event"
            :manual_option="commission_rate_options"
            map_options
            placeholder="Seleccione un tipo de comisión"
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="false"
            :rules="[]"
          />
        </div>
        <!-- Porcentaje comisión -->
        <div class="col-12 col-md-4">
          <p class="text-weight-medium mb-0">Porcentaje comisión *</p>
          <GenericInputComponent
            :default_value="models.commission_percentage"
            @update:model-value="models.commission_percentage = $event"
            placeholder="Ingrese porcentaje de comisión"
            type="text"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El porcentaje de comisión es requerido'),
              (val: string) => useRules().max_integer_decimal(val, 2, 5),
              (val: string) => useRules().max_length(val, 7),
              (val: string) => useRules().min_value(val, 0),
              (val: string) => useRules().max_value(val, 100)
            ]"
          />
        </div>
        <!-- Valor fijo -->
        <div class="col-12 col-md-4">
          <p class="text-weight-medium mb-0">Valor fijo *</p>
          <GenericInputComponent
            :default_value="models.fixed_value"
            @update:model-value="models.fixed_value = $event"
            placeholder="Ingrese valor fijo"
            type="text"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El valor fijo es requerido'),
              (val: string) => useRules().max_integer_decimal(val, 2, 5),
              (val: string) => useRules().max_length(val, 7),
              (val: string) => useRules().min_value(val, 0),
              (val: string) => useRules().max_value(val, 100)
            ]"
          />
        </div>
        <!-- Observaciones -->
        <div class="col-12 col-md-12">
          <p class="text-weight-medium mb-0">Observaciones *</p>
          <GenericInputComponent
            :default_value="models.observations"
            @update:model-value="models.observations = $event"
            placeholder="Ingrese observaciones"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'Las observaciones son requeridas'),
              (val: string) => useRules().max_length(val, 100)
            ]"
          />
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import { useRules } from '@/composables'
import useInformationForm from '@/components/Forms/Treasury/BankingEntitiesAccountingParametersCommissions/InformationForm'
import { ICreateBankingEntitiesAccountingParametersCommissions } from '@/interfaces/customs'

const props = withDefaults(
  defineProps<{
    action: 'create' | 'edit'
    data?: ICreateBankingEntitiesAccountingParametersCommissions | null
  }>(),
  {}
)

const {
  models,
  formInformation,
  banks_initial_balance,
  treasury_movement_codes,
  commission_rate_options,
  validates_collection_method_options,
} = useInformationForm(props)

defineExpose({
  validateForm: () => formInformation.value?.validate(),
})
</script>
