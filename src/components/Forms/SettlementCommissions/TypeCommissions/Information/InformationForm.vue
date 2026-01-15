<template>
  <q-form ref="formElementRef">
    <section class="q-mt-md">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Clase de comisión"
            :default_value="models.commission_class_catalog_id"
            :manual_option="commissions_class_catalog"
            map_options
            auto_complete
            required
            :rules="[(val: string) => is_required(val,  'La clase de comisión es requerida')]"
            @update:modelValue="models.commission_class_catalog_id = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Tipo de comisión"
            :default_value="models.commission_type_catalog_id"
            :manual_option="commissions_type_catalog"
            map_options
            auto_complete
            required
            :rules="[(val: string) => is_required(val,  'El tipo de comisión es requerido')]"
            @update:modelValue="models.commission_type_catalog_id = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            label="Descripción"
            :default_value="models.description"
            required
            :rules="[
              (val: string) => is_required(val, 'La descripción es requerida'),
              (val: string) => max_length(val, 50),
              (val: string) => only_alphanumeric(val),
            ]"
            @update:model-value="models.description = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <CurrencyInput
            v-if="
              models.commission_class_catalog_id === 1 &&
              models.commission_type_catalog_id === 1
            "
            v-model="models.value"
            :currency="'COP'"
            currencyLabel="Valor de la comisión"
            :rules="[
                (val: string) => is_required(val, 'La valor de la comisión es requerida'),
              ]"
            @update:model-value="models.value = $event"
          />
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'

// Interfaces
import { ITypeCommissionsInformationForm } from '@/interfaces/customs'
import { WriteActionType } from '@/interfaces/global'

// Logic view
import useInformationForm from '@/components/Forms/SettlementCommissions/TypeCommissions/Information/InformationForm'

const props = withDefaults(
  defineProps<{
    action: WriteActionType
    data: ITypeCommissionsInformationForm | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: ITypeCommissionsInformationForm | null): void
}>()

const {
  formElementRef,
  models,
  is_required,
  max_length,
  only_alphanumeric,
  commissions_class_catalog,
  commissions_type_catalog,
} = useInformationForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
