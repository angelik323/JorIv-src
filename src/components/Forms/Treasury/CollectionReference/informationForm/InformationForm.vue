<template>
  <q-form ref="formElementRef" class="q-pa-xl">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">

        <div class="col-12 col-md-6">
          <GenericInput
            label="Bloque contable"
            :default_value="models.info_block_code"
            required
            disabled
            :rules="[]"
            @update:model-value="models.info_block_code = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericInput
            label="Codigo recaudo"
            :default_value="models.info_param_code"
            required
            disabled
            :rules="[]"
            @update:model-value="models.info_param_code = $event"
          />
        </div>

        <div class="col-12">
          <GenericSelectorComponent
            label="Origen"
            :default_value="models.origin_id"
            :manual_option="selectOptions.origin"
            map_options
            auto_complete
            required
            :rules="[(val: string) => is_required(val, 'El origen es requerido')]"
            @update:modelValue="models.origin_id = $event"
          />
        </div>

        <div class="col-12">
          <GenericInput
            label="Referencia bancaria"
            :default_value="models.bank_reference"
            :required="false"
            :rules="[]"
            @update:model-value="models.bank_reference = $event"
          />
        </div>

        <div class="col-12">
          <GenericInput
            label="Código de barras"
            :default_value="models.bar_code"
            :required="false"
            :rules="[]"
            @update:model-value="models.bar_code = $event"
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
import { ICollectionReferenceForm } from '@/interfaces/customs/treasury/CollectionReference'

import useInformationForm from './InformationForm'

const props = withDefaults(
  defineProps<{
    action: WriteActionType
    data: ICollectionReferenceForm | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: ICollectionReferenceForm | null): void
}>()

const { formElementRef, models, selectOptions, is_required } =
  useInformationForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>