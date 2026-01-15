<template>
  <q-form ref="formElementRef">
    <section class="q-mt-md">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericInput
            label="Tipo calificación"
            :default_value="models.type"
            required
            :disabled="props.action === 'edit'"
            :rules="[
              (val: string) =>
                is_required(val),
              (val: string) => max_length(val, 2),
              (val: string) => only_alphanumeric(val),
            ]"
            @update:model-value="models.type = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            label="Días de mora inicio"
            :default_value="models.days_start"
            required
            :rules="[
              (val: string) =>
                is_required(val),
              (val: string) => max_length(val, 5),
              (val: string) => only_number(val),
            ]"
            @update:model-value="models.days_start = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            label="Días de mora fin"
            :default_value="models.days_end"
            required
            :rules="[
              (val: string) =>
                is_required(val),
              (val: string) => max_length(val, 5),
              (val: string) => only_number(val),
              (val: number) =>
                is_major_than(
                  Number(models.days_start),
                  val,
                  'El valor de los días de mora fin no puede ser inferior al valor de los días de mora inicio'
                ),
              (val: number) => max_value(val, 10000),
            ]"
            @update:model-value="models.days_end = $event"
          />
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import { IPortfolioClassificationForm } from '@/interfaces/customs'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import useBasicDataForm from '@/components/Forms/SettlementCommissions/PortfolioClassification/BasicData'
import { ActionType } from '@/interfaces/global'

const props = withDefaults(
  defineProps<{
    data: IPortfolioClassificationForm | null
    action: ActionType
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IPortfolioClassificationForm | null): void
}>()

const {
  formElementRef,
  models,
  is_required,
  max_length,
  only_alphanumeric,
  only_number,
  is_major_than,
  max_value,
} = useBasicDataForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
