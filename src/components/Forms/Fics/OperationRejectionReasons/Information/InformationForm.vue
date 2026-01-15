<template>
  <q-form ref="formElementRef">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericInput
            label="Código"
            type="number"
            :default_value="models.code"
            required
            :disabled="action === 'edit'"
            :rules="[
              (val: string) => is_required(val, 'El código es requerido'),
              (val: string) => max_length(val, 4),
              (val: string) => no_leading_zeros(val),
            ]"
            @update:model-value="models.code = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            label="Descripción"
            :default_value="models.description"
            required
            :rules="[
              (val: string) => is_required(val, 'La descripción es requerida'),
              (val: string) => max_length(val, 150),
              (val: string) => only_alphanumeric(val),
            ]"
            @update:model-value="models.description = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            :disabled="['edit'].includes(props.action)"
            map_options
            auto_complete
            label="Estado"
            :required="false"
            :manual_option="default_statuses"
            :default_value="models.status"
            @update:modelValue="models.status = $event"
            :rules="[(val: string) => is_required(val,  'El estado es requerido')]"
          />
        </div>

        <div class="col-12">
          <q-separator class="q-my-sm q-mb-lg" />
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'

// Interfaces - Constants
import { IRejectionReasonInformationForm } from '@/interfaces/customs/fics/OperationRejectionReasons'
import { WriteActionType } from '@/interfaces/global'
import { default_statuses } from '@/constants'

// Logigc view
import useInformationForm from '@/components/Forms/Fics/OperationRejectionReasons/Information/InformationForm'

const props = withDefaults(
  defineProps<{
    action: WriteActionType
    data: IRejectionReasonInformationForm | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IRejectionReasonInformationForm | null): void
}>()

const {
  formElementRef,
  models,
  is_required,
  max_length,
  no_leading_zeros,
  only_alphanumeric,
} = useInformationForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
