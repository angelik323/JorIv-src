<template>
  <q-form ref="formElementRef" class="q-pa-lg">
    <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
      <!-- Código de estructura del plan de obra -->
      <div class="col-12 col-md-4">
        <GenericSelectorComponent
          v-if="['create', 'edit'].includes(action)"
          label="Código de estructura del plan de obra"
          :manual_option="workPlanOptions"
          map_options
          :required="true"
          :disabled="action === 'edit'"
          :default_value="models.structure_plan_code_id"
          :rules="[
            (v) =>
              useRules().is_required(
                String(v ?? ''),
                'El código de estructura de plan de obra es requerido'
              ),
          ]"
          @update:model-value="
            models.structure_plan_code_id = $event?.value ?? $event
          "
        />
      </div>

      <!-- Estructura -->
      <div class="col-12 col-md-4">
        <GenericInputComponent
          v-if="['create', 'edit'].includes(action)"
          label="Estructura"
          :manual_option="[{ label: models.structure }]"
          map_options
          :default_value="models.structure"
          :disabled="true"
          :clearable="false"
          :required="false"
          :rules="[]"
          @update:model-value="models.structure = $event"
        />
      </div>

      <!-- Uso -->
      <div class="col-12 col-md-4">
        <GenericInputComponent
          v-if="['create', 'edit'].includes(action)"
          label="Uso"
          :manual_option="[{ label: models.purpose }]"
          map_options
          :default_value="models.purpose"
          :disabled="true"
          :clearable="false"
          :required="false"
          :rules="[]"
          @update:model-value="models.purpose = $event"
        />
      </div>

      <!-- Tipo -->
      <div class="col-12 col-md-4">
        <GenericSelectorComponent
          v-if="['create', 'edit'].includes(action)"
          :label="'Tipo'"
          :manual_option="
            Object.values(WorkPlanType).map((type) => ({ label: type }))
          "
          map_options
          :required="true"
          :default_value="models.type"
          :rules="[(v: string | number) => useRules().is_required(String(v ?? ''), 'El tipo es requerido')]"
          @update:model-value="models.type = $event?.label ?? $event"
        />
      </div>

      <!-- Código -->
      <div class="col-12 col-md-4">
        <GenericInputComponent
          v-if="['create', 'edit'].includes(action)"
          :default_value="models.code"
          label="Código"
          placeholder="Inserte"
          :disabled="action === 'edit'"
          :required="false"
          :rules="[]"
          @update:model-value="models.code = $event"
        />
      </div>

      <!-- Nombre -->
      <div class="col-12 col-md-4">
        <GenericInputComponent
          v-if="['create', 'edit'].includes(action)"
          :default_value="models.name"
          label="Nombre"
          placeholder="Inserte"
          :required="true"
          :rules="[(v: string) => useRules().is_required(v, 'El nombre es requerido')]"
          @update:model-value="models.name = $event"
        />
      </div>

      <div class="col-12 col-md-4">
        <GenericSelectorComponent
          v-if="action === 'edit'"
          ref="statusRef"
          :default_value="Number(models.status_id)"
          label="Estado"
          :manual_option="default_statuses"
          auto_complete
          map_options
          required
          :rules="[(v: string) => useRules().is_required(v, 'El estado es requerido')]"
          @update:model-value="models.status_id = $event"
        />
      </div>
    </div>
  </q-form>
</template>

<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import useWorkPlansInformationForm from '@/components/Forms/DerivativeContracting/WorkPlans/InformationFormWorkPlan'

// Interfaces - constants
import { ActionType } from '@/interfaces/global/Action'
import {
  ITypeWorkPlanForm,
  WorkPlanType,
} from '@/interfaces/customs/derivative-contracting/WorkPlans'
import { default_statuses } from '@/constants'

// Composables
import { useRules } from '@/composables'

const emit = defineEmits<{
  (e: 'update:basic-data-form', value: ITypeWorkPlanForm | null): void
}>()

const props = withDefaults(
  defineProps<{
    action: ActionType
    basicDataForm?: ITypeWorkPlanForm | null
  }>(),
  {}
)

const { models, formElementRef, workPlanOptions } = useWorkPlansInformationForm(
  props,
  emit
)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
