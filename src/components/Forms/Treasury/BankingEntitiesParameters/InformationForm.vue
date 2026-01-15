<template>
  <q-form ref="formElementRef" class="q-pa-xl">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Banco"
            :default_value="models.bank_id"
            :manual_option="selectOptions.banks"
            map_options
            auto_complete
            :required="false"
            :rules="[]"
            @update:modelValue="models.bank_id = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericInput
            label="Descripcion"
            :default_value="models.description"
            :disabled="true"
            :rules="[(val: string) => max_length(val, 100)]"
            @update:model-value="models.description = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Movimiento de tesorería"
            :default_value="models.treasury_movement_code_id"
            :manual_option="selectOptions.treasury_movement_codes"
            map_options
            auto_complete
            :required="false"
            :rules="[]"
            @update:modelValue="models.treasury_movement_code_id = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Validar forma de recaudo"
            :default_value="models.validates_collection_method"
            :manual_option="selectOptions.validates_collection_method"
            map_options
            auto_complete
            :required="false"
            :rules="[]"
            @update:modelValue="models.validates_collection_method = $event"
          />
        </div>
        
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Tipo de comision"
            :default_value="models.commission_rate"
            :manual_option="selectOptions.commission_rate"
            map_options
            auto_complete
            :required="false"
            :disabled="!models.validates_collection_method"
            :rules="[]"
            @update:modelValue="models.commission_rate = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            label="Porcentaje de comision"
            :default_value="models.commission_percentage"
            required
            :disabled="!models.validates_collection_method || !(models.commission_rate == '% Comisión')"
            :rules="[
              (val: string) => is_required(val, 'El tipo de comision es requerido'),
              (val: number) => only_number_with_max_integers_and_decimals(`${val}`, 3, 5)
            ]"
            @update:model-value="models.commission_percentage = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            label="valor fijo"
            :default_value="models.fixed_value"
            required
            :disabled="!models.validates_collection_method || !(models.commission_rate == 'Valor Fijo')"
            :rules="[
              (val: string) => is_required(val, 'El valor fijo es requerido'),
              (val: number) => only_number_with_max_integers_and_decimals(`${val}`, 2, 5)
            ]"
            @update:model-value="models.fixed_value = $event"
          />
        </div>

        <div class="col-12">
          <GenericInput
            label="Observaciones"
            :default_value="models.observations"
            required
            :rules="[
              (val: string) => is_required(val, 'Las observaciones son requeridas'),
              (val: string) => max_length(val, 100)
            ]"
            @update:model-value="models.observations = $event"
          />
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import { WriteActionType } from '@/interfaces/global'
import useInformationForm from './InformationForm'
import { ICreateBankingEntitiesAccountingParametersCommissions } from '@/interfaces/customs/treasury/BankingEntitesAccountingParametersComissions'

const props = withDefaults(
  defineProps<{
    action: WriteActionType
    data: ICreateBankingEntitiesAccountingParametersCommissions | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: ICreateBankingEntitiesAccountingParametersCommissions | null): void
}>()

const {
  formElementRef,
  models,
  selectOptions,
  is_required,
  only_number_with_max_integers_and_decimals,
  max_length,
} = useInformationForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
