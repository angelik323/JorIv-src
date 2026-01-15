<template>
  <q-form
    ref="formRef"
    aria-label="Formulario de datos básicos para englobe de títulos"
  >
    <div
      class="row q-col-gutter-x-lg"
      :class="props.action === 'view' ? 'items-start' : 'items-end'"
    >
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">Recurso</p>
          <p class="text-weight-medium q-mb-lg">
            {{ props.data?.budget_resource?.code }}
          </p>
        </template>
        <GenericSelectorComponent
          v-else
          :default_value="models.budget_resource_id"
          label="Recurso"
          auto_complete
          map_options
          required
          :manual_option="budget_resource_codes"
          :rules="[
              (val: string) => useRules().is_required(val, 'El recurso presupuestal es requerido'),
            ]"
          @update:modelValue="models.budget_resource_id = $event"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">
            Descripción recurso
          </p>
          <p class="text-weight-medium q-mb-lg">
            {{ props.data?.budget_resource?.description }}
          </p>
        </template>
        <GenericInputComponent
          v-else
          :default_value="selectedResource?.description"
          label="Descripción recurso"
          required
          disabled
          :rules="[]"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">Área</p>
          <p class="text-weight-medium q-mb-lg">
            {{ props.data?.responsability_area?.code }}
          </p>
        </template>
        <GenericSelectorComponent
          v-else
          :default_value="models.responsability_area_id"
          label="Área"
          auto_complete
          map_options
          required
          :manual_option="areas_resposabilities_codes"
          :rules="[
              (val: string) => useRules().is_required(val, 'El área presupuestal es requerida'),
            ]"
          @update:modelValue="models.responsability_area_id = $event"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">
            Descripción área
          </p>
          <p class="text-weight-medium q-mb-lg">
            {{ props.data?.responsability_area?.description }}
          </p>
        </template>
        <GenericInputComponent
          v-else
          :default_value="selectedArea?.description"
          label="Descripción área"
          required
          disabled
          :rules="[]"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">
            Tipo de documento presupuestal
          </p>
          <p class="text-weight-medium q-mb-lg">
            {{ props.data?.budget_document_type?.code }}
          </p>
        </template>
        <GenericSelectorComponent
          v-else
          :default_value="models.budget_document_type_id"
          label="Tipo de documento presupuestal"
          auto_complete
          map_options
          required
          :manual_option="budget_document_types"
          :rules="[
              (val: string) => useRules().is_required(val, 'El tipo de documento es requerido'),
            ]"
          @update:modelValue="models.budget_document_type_id = $event"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">
            Descripción tipo de documento presupuestal
          </p>
          <p class="text-weight-medium q-mb-lg">
            {{ props.data?.budget_document_type?.description }}
          </p>
        </template>
        <GenericInputComponent
          v-else
          :default_value="selectedDocumentType?.description"
          label="Descripción tipo de documento presupuestal"
          required
          disabled
          :rules="[]"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">
            Código de movimiento
          </p>
          <p class="text-weight-medium q-mb-lg">
            {{ props.data?.code_movement?.code }}
          </p>
        </template>
        <GenericSelectorComponent
          v-else
          :default_value="models.code_movement_id"
          label="Código de movimiento"
          auto_complete
          map_options
          required
          display_value="id"
          :manual_option="code_movements"
          :rules="[
              (val: string) => useRules().is_required(val, 'El código de movimiento es requerido'),
            ]"
          @update:modelValue="models.code_movement_id = $event"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">
            Descripción código de movimiento
          </p>
          <p class="text-weight-medium q-mb-lg">
            {{ props.data?.code_movement?.description }}
          </p>
        </template>
        <GenericInputComponent
          v-else
          :default_value="selectedMovementCode?.movement_description"
          label="Descripción código de movimiento"
          required
          disabled
          :rules="[]"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">
            Rubro presupuestal
          </p>
          <p class="text-weight-medium q-mb-lg">
            {{ props.data?.budget_item?.code }}
          </p>
        </template>
        <GenericSelectorComponent
          v-else
          :default_value="models.budget_item_id"
          label="Rubro presupuestal"
          auto_complete
          map_options
          required
          :manual_option="budget_item_codes"
          :rules="[
              (val: string) => useRules().is_required(val, 'El rubro presupuestal es requerido'),
            ]"
          @update:modelValue="models.budget_item_id = $event"
        />
      </div>
      <div class="col-12 col-md-3">
        <template v-if="props.action === 'view'">
          <p class="text-weight-bold no-margin text-black-90">
            Descripción rubro presupuestal
          </p>
          <p class="text-weight-medium q-mb-lg">
            {{ props.data?.budget_item?.description }}
          </p>
        </template>
        <GenericInputComponent
          v-else
          :default_value="selectedBudgetItem?.description"
          label="Descripción rubro presupuestal"
          required
          disabled
          :rules="[]"
        />
      </div>
    </div>
  </q-form>
</template>

<script lang="ts" setup>
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { IAccountingBudgetParameterItem } from '@/interfaces/customs/budget/BudgetAccountingHomologationParameters'

// Composables
import { useRules } from '@/composables/useRules'

// Logic
import useBudgetDataForm from '@/components/Forms/Budget/AccountingBudgetHomologationParameters/BudgetData/BudgetDataForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IAccountingBudgetParameterItem
  }>(),
  {}
)

const {
  models,
  formRef,
  selectedArea,
  code_movements,
  selectedResource,
  budget_item_codes,
  selectedBudgetItem,
  selectedDocumentType,
  selectedMovementCode,
  budget_resource_codes,
  budget_document_types,
  areas_resposabilities_codes,
} = useBudgetDataForm(props)

defineExpose({
  validateForm: () => formRef.value?.validate(),
  getFormData: () => models.value,
})
</script>
