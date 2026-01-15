<template>
  <q-form ref="formElementRef" aria-label="Formulario de datos básicos">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6">
          <GenericDateInputComponent
            :default_value="models.date"
            label="Fecha de generación"
            required
            :rules="[
              (val: string) => is_required(val, 'La fecha de generación es requerida'),
            ]"
            @update:model-value="models.date = $event"
          />
        </div>
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            :default_value="models.fund"
            label="Fondo"
            auto_complete
            map_options
            :manual_option="funds"
            required
            :rules="[
              (val: string) => is_required(val, 'El fondo es requerido'),
            ]"
            @update:model-value="models.fund = $event"
          />
        </div>
      </div>
      <q-separator :class="action === 'create' ? 'q-mt-sm' : 'q-mt-lg'" />
    </section>
  </q-form>
</template>

<script lang="ts" setup>
import { WriteActionType } from '@/interfaces/global'
import { IFormatGenerationInformationForm } from '@/interfaces/customs/normative/FormatGeneration'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import useInformationForm from './InformationForm'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'

const props = defineProps<{
  action: WriteActionType
  data: IFormatGenerationInformationForm | null
  format_type: string
}>()

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IFormatGenerationInformationForm | null): void
}>()

const { formElementRef, models, funds, is_required } = useInformationForm(
  props,
  emits
)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
