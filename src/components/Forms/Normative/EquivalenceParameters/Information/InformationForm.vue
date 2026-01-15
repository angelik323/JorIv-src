<template>
  <q-form ref="formElementRef" aria-label="Formulario de datos básicos">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            :default_value="models.format"
            label="Formato"
            auto_complete
            map_options
            :manual_option="equivalency_parameters_formats"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El formato es requerido'),
            ]"
            @update:model-value="models.format = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            :default_value="models.concept"
            label="Concepto"
            auto_complete
            map_options
            :manual_option="equivalency_parameters_concepts"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El concepto es requerido'),
            ]"
            @update:model-value="models.concept = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            :default_value="models.concept_detail"
            label="Detalle concepto"
            auto_complete
            map_options
            :manual_option="conceptDetailOptions"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El detalle concepto es requerido'),
            ]"
            @update:model-value="models.concept_detail = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            :default_value="models.equivalence"
            label="Equivalencia"
            auto_complete
            map_options
            :manual_option="equivalenceOptions"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'La equivalencia es requerida'),
            ]"
            @update:model-value="models.equivalence = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="models.equivalence_name"
            label="Descripción equivalencia"
            placeholder="-"
            disabled
          />
        </div>

        <!-- <div class="col-12 col-md-4">
          <GenericSelectorComponent
            :default_value="models.concept"
            label="Descripción palabras clave"
            auto_complete
            map_options
            :manual_option="equivalency_parameters_concepts"
            required
            :disabled="action === 'edit'"
            :rules="[
              (val: string) => useRules().is_required(val, 'La descripción es requerida'),
            ]"
            @update:model-value="models.concept = $event"
          />
        </div> -->
      </div>
      <q-separator :class="action === 'create' ? 'q-mt-sm' : 'q-mt-lg'" />
    </section>
  </q-form>
</template>

<script lang="ts" setup>
import { WriteActionType } from '@/interfaces/global'
import { IEquivalenceParameterInformationForm } from '@/interfaces/customs/normative/EquivalenceParameters'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import { useRules } from '@/composables'
import useInformationForm from './InformationForm'

const props = withDefaults(
  defineProps<{
    action: WriteActionType
    data: IEquivalenceParameterInformationForm | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IEquivalenceParameterInformationForm | null): void
}>()

const {
  equivalency_parameters_formats,
  equivalency_parameters_concepts,
  conceptDetailOptions,
  equivalenceOptions,
  formElementRef,
  models,
} = useInformationForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
