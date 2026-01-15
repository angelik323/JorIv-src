<template>
  <q-form ref="formElementRef">
    <section class="q-mt-md">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4" v-if="['edit'].includes(action)">
          <GenericInput
            label="Código de comisión"
            disabled
            :default_value="models.code"
            required
            :rules="[]"
            @update:model-value="models.code = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            label="Nombre de comisión"
            :default_value="models.description"
            required
            :rules="[
              (val: string) => is_required(val, 'El nombre de comisión es requerido'),
              (val: string) => max_length(val, 30),
              (val: string) => only_alphanumeric(val),
            ]"
            @update:model-value="models.description = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Clase de comisión"
            :default_value="models.commission_class_catalog_id"
            :manual_option="commissions_class_catalog"
            map_options
            auto_complete
            required
            disabled
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
            disabled
            :rules="[(val: string) => is_required(val,  'El tipo de comisión es requerido')]"
            @update:modelValue="models.commission_type_catalog_id = $event"
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

// Interfaces
import { ITypeCommissionsInformationFormV2 } from '@/interfaces/customs/settlement-commissions/TypeCommissionsV2'
import { WriteActionType } from '@/interfaces/global'

// Logic view
import useBasicDataForm from '@/components/Forms/SettlementCommissions/TypeCommissions/v2/BasicData/BasicDataForm'

const props = withDefaults(
  defineProps<{
    action: WriteActionType
    data: ITypeCommissionsInformationFormV2 | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: ITypeCommissionsInformationFormV2 | null): void
}>()

const {
  formElementRef,
  models,
  is_required,
  max_length,
  only_alphanumeric,
  commissions_class_catalog,
  commissions_type_catalog,
} = useBasicDataForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
