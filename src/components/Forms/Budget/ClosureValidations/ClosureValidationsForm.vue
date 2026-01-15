<template>
  <q-form ref="formValidateElementRef" class="q-pa-lg">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-md">
        <!-- Nivel -->
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            required
            auto_complete
            clearable
            map_options
            display_value="id"
            first_filter_option="description"
            second_filter_option="level"
            :label="'Nivel'"
            :manual_option="budget_levels"
            :placeholder="'Seleccione'"
            :disabled="action === 'edit'"
            :rules="[
              (val: string) => useRules().is_required(val, 'El nivel es requerido'),
            ]"
            :default_value="models.level_id"
            @update:modelValue="models.level_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Nivel</p>
            <p class="text-weight-medium no-margin">
              {{ viewModel.level_description ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- Descripción Nivel -->
        <div class="col-12 col-md-6">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Descripción"
            placeholder="Descripción del nivel"
            :default_value="models.level_description"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Descripción</p>
            <p class="text-weight-medium no-margin">
              {{ viewModel.level_description ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- Código de movimiento cancelación -->
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            required
            auto_complete
            clearable
            map_options
            display_value="id"
            first_filter_option="movement_description"
            second_filter_option="movement_code"
            :label="'Código de movimiento cancelación'"
            :manual_option="code_movements"
            :placeholder="'Seleccione'"
            :rules="[
              (val: string) =>
                useRules().is_required(
                  val,
                  'El código de movimiento cancelación es requerido'
                ),
            ]"
            :default_value="models.cancellation_code_id"
            @update:modelValue="models.cancellation_code_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Código de movimiento cancelación
            </p>
            <p class="text-weight-medium no-margin">
              {{ viewModel.cancellation_movement_description ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- Descripción código cancelación -->
        <div class="col-12 col-md-6">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Descripción código"
            placeholder="Descripción del código"
            :default_value="models.cancellation_movement_description"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Descripción código</p>
            <p class="text-weight-medium no-margin">
              {{ viewModel.cancellation_movement_description ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- Código de movimiento constitución -->
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            required
            auto_complete
            clearable
            map_options
            display_value="id"
            first_filter_option="movement_description"
            second_filter_option="movement_code"
            :label="'Código de movimiento constitución'"
            :manual_option="code_movements"
            :placeholder="'Seleccione'"
            :rules="[
              (val: string) =>
                useRules().is_required(
                  val,
                  'El código de movimiento constitución es requerido'
                ),
            ]"
            :default_value="models.constitution_code_id"
            @update:modelValue="models.constitution_code_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Código de movimiento constitución
            </p>
            <p class="text-weight-medium no-margin">
              {{ viewModel.constitution_movement_description ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- Descripción código constitución -->
        <div class="col-12 col-md-6">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Descripción código"
            placeholder="Descripción del código"
            :default_value="models.constitution_movement_description"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Descripción código</p>
            <p class="text-weight-medium no-margin">
              {{ viewModel.constitution_movement_description ?? 'No registrado' }}
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
import { useClosureValidationsForm } from '@/components/Forms/Budget/ClosureValidations/ClosureValidationsForm'
// Interfaces & types
import { ActionType } from '@/interfaces/global'
import { IClosureValidationForm } from '@/interfaces/customs/budget/ClosureValidations'

// Composables
import { useRules } from '@/composables'
const props = withDefaults(
  defineProps<{
    action: ActionType
    data: IClosureValidationForm | null
  }>(),
  { action: 'create' }
)

const {
  formValidateElementRef,
  models,
  viewModel,
  budget_levels,
  code_movements,
  validateForm,
  getFormData,
} = useClosureValidationsForm(props)

defineExpose({
  validateForm,
  getFormData,
})
</script>

