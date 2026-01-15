<template>
  <q-form ref="basicDataFormRef" class="q-pa-lg">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div v-if="isEdit" class="col-12 col-md-4">
          <GenericInputComponent
            label="Código"
            type="text"
            :default_value="readOnlyCode"
            :required="false"
            :disabled="true"
            :rules="[]"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            label="Nombre"
            type="text"
            :default_value="models.name"
            :required="true"
            :disabled="false"
            :rules="[
              (val: string) => is_required(val, 'El nombre es requerido'),
              (val: string) => max_length(val, 60),
              (val: string) => only_alphanumeric(val),
            ]"
            @update:model-value="models.name = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Numeración"
            :default_value="models.numbering"
            :manual_option="numberingOptions"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :disabled="isEdit"
            :rules="[(val: string) => is_required(val, 'La numeración es requerida')]"
            @update:model-value="models.numbering = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Tipo de documento"
            :default_value="models.document_type"
            :manual_option="documentTypeOptions"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :disabled="isEdit"
            :rules="[(val: string) => is_required(val, 'El tipo de documento es requerido')]"
            @update:model-value="models.document_type = $event"
          />
        </div>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm mt-1">
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Tipo de operación"
            :default_value="models.operation_type"
            :manual_option="operationTypeOptions"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :disabled="isEdit"
            :rules="[(val: string) => is_required(val, 'El tipo de operación es requerido')]"
            @update:model-value="models.operation_type = $event"
          />
        </div>

        <div v-if="isEdit" class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Estado"
            :default_value="readOnlyStatusId"
            :manual_option="statusOptions"
            :auto_complete="false"
            :required="true"
            :map_options="true"
            :disabled="true"
            :rules="[]"
          />
        </div>
      </div>

      <div class="row mt-2">
        <div class="col-12">
          <p class="q-my-none text-weight-medium">Configuración</p>
        </div>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4 column">
          <RadioYesNo
            :modelValue="models.has_internal_consecutive"
            @update:modelValue="(val: boolean) => (models.has_internal_consecutive = val)"
            label="Consecutivo interno"
            :isRadioButton="false"
            :hasTitle="false"
            :hasSubtitle="false"
            class="q-mb-md"
          />
          <RadioYesNo
            :modelValue="models.has_client_consecutive"
            @update:modelValue="(val: boolean) => (models.has_client_consecutive = val)"
            label="Consecutivo cliente"
            :isRadioButton="false"
            :hasTitle="false"
            :hasSubtitle="false"
          />
        </div>

        <div class="col-12 col-md-4 column">
          <RadioYesNo
            :modelValue="models.has_order"
            @update:modelValue="(val: boolean) => (models.has_order = val)"
            label="Orden de pedido"
            :isRadioButton="false"
            :hasTitle="false"
            :hasSubtitle="false"
            class="q-mb-md"
          />
          <RadioYesNo
            :modelValue="models.has_other_references"
            @update:modelValue="(val: boolean) => (models.has_other_references = val)"
            label="Otras referencias"
            :isRadioButton="false"
            :hasTitle="false"
            :hasSubtitle="false"
          />
        </div>

        <div class="col-12 col-md-4 column">
          <RadioYesNo
            :modelValue="models.has_legalization_date"
            @update:modelValue="(val: boolean) => (models.has_legalization_date = val)"
            label="Fecha legalización"
            :isRadioButton="false"
            :hasTitle="false"
            :hasSubtitle="false"
            class="q-mb-md"
          />
          <RadioYesNo
            :modelValue="models.has_expiration_date"
            @update:modelValue="(val: boolean) => (models.has_expiration_date = val)"
            label="Fecha vencimiento"
            :isRadioButton="false"
            :hasTitle="false"
            :hasSubtitle="false"
          />
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

import {
  ITypeOfDocumentForm,
  ITypeOfDocumentItem,
} from '@/interfaces/customs/accounts-payable/TypeOfDocuments'
import { ActionType } from '@/interfaces/global'

import useBasicDataForm from '@/components/Forms/AccountsPayable/TypeOfDocuments/BasicDataForm'

const emit = defineEmits(['update:data'])

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: ITypeOfDocumentForm | ITypeOfDocumentItem | null
  }>(),
  {}
)

const {
  basicDataFormRef,
  models,
  numberingOptions,
  documentTypeOptions,
  operationTypeOptions,
  is_required,
  max_length,
  only_alphanumeric,


  isEdit,
  readOnlyCode,
  readOnlyStatusId,
  statusOptions,
} = useBasicDataForm(props, emit)

defineExpose({
  validateForm: () => basicDataFormRef.value?.validate(),
})
</script>
