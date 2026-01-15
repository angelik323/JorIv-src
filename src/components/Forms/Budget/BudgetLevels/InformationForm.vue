<template>
  <div>
    <q-form ref="informationForm" class="q-pa-lg">
      <section>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-6">
            <GenericInput
              :disabled="action === 'edit'"
              ref="levelRef"
              placeholder="Inserte"
              label="Nivel"
              required
              :default_value="budget_level?.level ?? ''"
              :rules="[
                (val: string) => useRules().is_required(val, 'El nivel es requerido'),
                (val: string) => useRules().only_number(val),
                (val: string | number | null | undefined) => useRules().max_length(val, 3),
              ]"
              @update:modelValue="budget_level.level = $event"
            />
          </div>

          <div class="col-12 col-md-6">
            <GenericInput
              ref="descriptionRef"
              placeholder="Inserte"
              label="Descripción"
              required
              :default_value="
                (budget_level?.description ?? '').toString().toUpperCase()
              "
              :rules="[
                  (val: string) => useRules().is_required(val, 'La descripción es requerida'),
                  (val: string) => useRules().only_alphanumeric(val),
                  (val: string) => useRules().max_length(val, 100),
                ]"
              @update:modelValue="
                budget_level.description =
                  typeof $event === 'string' ? $event.toUpperCase() : $event
              "
            />
          </div>
          <div class="col-12 col-md-6">
            <GenericSelectorComponent
              ref="classRef"
              class_name="col-12"
              label="Clase"
              required
              :disabled="action === 'edit'"
              :default_value="budget_level?.class ?? ''"
              :manual_option="budget_classes"
              :rules="[(val: string) => useRules().is_required(val, 'La clase es requerida')]"
              @update:modelValue="budget_level.class = $event"
            />
          </div>
        </div>
      </section>
    </q-form>
  </div>
</template>
<script setup lang="ts">
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import useInformationForm from '@/components/Forms/Budget/BudgetLevels/InformationForm'
import { useRules } from '@/composables'
import { WriteActionType } from '@/interfaces/global'

const { action } = defineProps<{
  action: WriteActionType
}>()

const {
  informationForm,
  budget_level,
  budget_classes,
  levelRef,
  descriptionRef,
  classRef,
  validateForm,
  getFormData,
  setFormData,
  resetForm,
} = useInformationForm()

defineExpose({
  validateForm,
  getFormData,
  setFormData,
  resetForm,
})
</script>
