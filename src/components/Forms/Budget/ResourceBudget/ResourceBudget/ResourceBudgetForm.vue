<template>
  <q-form ref="formValidateElementRef" class="hide-arrows-number-input">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-md">
        <!-- Estructura recurso -->
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            required
            auto_complete
            clearable
            map_options
            :disabled="['edit'].includes(props.action)"
            :label="'Estructura de recurso'"
            :manual_option="account_structures"
            :placeholder="'Seleccione'"
            :rules="[
              (val) =>
                useRules().is_required(
                  val,
                  'La estructura de recurso es requerida'
                ),
            ]"
            :default_value="models.structure_resource"
            @update:modelValue="models.structure_resource = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Estructura de recurso</p>
            <p class="text-weight-medium no-margin">
              {{ viewModel.structure_resource ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- Código -->
        <div class="col-12 col-md-4">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            required
            type="number"
            :label="'Código'"
            :disabled="['edit'].includes(props.action)"
            placeholder="Inserte"
            :default_value="models.code"
            :max_length="'60'"
            :rules="[
              (val) => useRules().is_required(val, 'El código es requerido'),
              (val) => useRules().only_positive_value(val),
            ]"
            @update:modelValue="models.code = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Código</p>
            <p class="text-weight-medium no-margin">
              {{ viewModel.code ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- Descripción -->
        <div class="col-12 col-md-4">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            required
            :label="'Descripción'"
            placeholder="Inserte"
            :default_value="models.description"
            :max_length="'100'"
            :rules="[
              (val) =>
                useRules().is_required(val, 'La descripción es requerida'),
            ]"
            @update:modelValue="models.description = $event.toUpperCase()"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Descripción</p>
            <p class="text-weight-medium no-margin">
              {{ viewModel.description ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- Tipo -->
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            required
            auto_complete
            clearable
            map_options
            :label="'Tipo'"
            :disabled="['edit'].includes(props.action)"
            :manual_option="budget_item_types"
            :placeholder="'Seleccione'"
            :rules="[
              (val) => useRules().is_required(val, 'El tipo es requerido'),
            ]"
            :default_value="models.type"
            @update:modelValue="models.type = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo</p>
            <p class="text-weight-medium no-margin">
              {{ viewModel.type ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- Tipo de recurso -->
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            required
            auto_complete
            clearable
            map_options
            :label="'Tipo de recurso'"
            :manual_option="budget_resources_types"
            :placeholder="'Seleccione'"
            :rules="[
              (val) =>
                useRules().is_required(val, 'El tipo de recurso es requerido'),
            ]"
            :default_value="models.resource_type_id"
            @update:modelValue="models.resource_type_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo de recurso</p>
            <p class="text-weight-medium no-margin">
              {{ viewModel.resource_type_description ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- ¿Maneja cuenta bancaria? -->
        <div class="col-12 col-md-4">
          <q-checkbox
            v-if="['create', 'edit'].includes(action)"
            v-model="models.has_bank_account"
            label="¿Maneja cuenta bancaria?"
            color="orange"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">¿Maneja cuenta bancaria?</p>
            <p class="text-weight-medium no-margin">
              {{ viewModel.has_bank_account ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['edit'].includes(props.action)"
            required
            auto_complete
            clearable
            map_options
            :label="'Estado'"
            :manual_option="budget_items_statuses"
            :placeholder="'Seleccione'"
            :rules="[
              (val) => useRules().is_required(val, 'El estado es requerido'),
            ]"
            :default_value="models.status_id ?? ''"
            @update:modelValue="models.status_id = $event"
          />
          <div v-if="['view'].includes(props.action)" class="text-black-90">
            <p class="text-weight-bold no-margin">Estado</p>
            <p class="text-weight-medium no-margin">
              {{ viewModel.status_id === 1 ? 'Activo' : 'Inactivo' }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// Components
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
// Interfaces & types
import { ActionType } from '@/interfaces/global'
// Composables
import { useRules } from '@/composables'
import { IResourceBudgetForm } from '@/interfaces/customs/budget/ResourceBudget'
// logic view
import useResourceBudgetForm from '@/components/Forms/Budget/ResourceBudget/ResourceBudget/ResourceBudgetForm'
const emit = defineEmits(['update:modelValue'])

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IResourceBudgetForm
  }>(),
  { action: 'create' }
)

const {
  models,
  viewModel,
  budget_resources_types,
  budget_item_types,
  budget_items_statuses,
  account_structures,
  formValidateElementRef,
} = useResourceBudgetForm(props, emit)

defineExpose({
  validateForm: () => formValidateElementRef.value?.validate(),
  getFormData: () => models.value,
})
</script>
