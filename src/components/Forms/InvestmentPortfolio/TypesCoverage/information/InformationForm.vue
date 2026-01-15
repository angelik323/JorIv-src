<template>
  <q-form
    ref="formElementRef"
    aria-label="Formulario de datos básicos para tipo de cobertura"
  >
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="models.code"
            label="Código de cobertura"
            required
            :rules="[
              (val: string) => is_required(val, 'El código es requerido'),
              (val: string) => only_number(val),
              (val: string) => max_length(val, 3),
              (val: string) => no_leading_zeros(val),
            ]"
            :disabled="action === 'edit'"
            @update:model-value="models.code = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            :default_value="models.description"
            label="Descripción"
            required
            :rules="[
              (val: string) => is_required(val, 'La descripción es requerida'),
              (val: string) => max_length(val, 90),
              (val: string) => only_alphanumeric(val),
            ]"
            :disabled="action === 'edit'"
            @update:model-value="models.description = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            :default_value="models.operation_coverage_type_id"
            label="Tipo de cobertura"
            auto_complete
            map_options
            :manual_option="operation_coverage"
            required
            :rules="[(val: string) => is_required(val,  'El estado es requerido')]"
            @update:modelValue="models.operation_coverage_type_id = $event"
          />
        </div>

        <div
          class="row col-12 items-center justify-between q-px-md"
          v-if="models.operation_coverage_type_id != 0"
        >
          <p class="q-mb-none mt-1 text-weight-medium q-ml-m">
            Riesgos de mercado*
          </p>

          <RadioYesNo
            v-model="models.operation_coverage_type_element_id"
            class="q-mt-none"
            :isRadioButton="true"
            :hasTitle="false"
            :hasSubtitle="false"
            :options="operationCoverageSelected"
            :required="true"
          />
        </div>

        <div class="col-12">
          <q-separator class="q-my-lg" />
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

import { useInformationForm } from '@/components/Forms/InvestmentPortfolio/TypesCoverage/information/InformationForm'

import { WriteActionType } from '@/interfaces/global'
import { ITypesCoverageInformationForm } from '@/interfaces/customs'

const props = withDefaults(
  defineProps<{
    action: WriteActionType
    data: ITypesCoverageInformationForm | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: ITypesCoverageInformationForm | null): void
}>()

const {
  operation_coverage,
  formElementRef,
  models,
  operationCoverageSelected,
  is_required,
  max_length,
  no_leading_zeros,
  only_alphanumeric,
  only_number,
} = useInformationForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
