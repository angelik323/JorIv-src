<template>
  <q-form ref="formInformation">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-md">
        <!-- Fila 1 -->
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            required
            auto_complete
            clearable
            map_options
            :disabled="props.action === 'edit'"
            :label="'Estructura presupuestal'"
            :manual_option="budget_item_structure"
            :placeholder="'Seleccione'"
            :rules="[
              (val) =>
                useRules().is_required(
                  val,
                  'La estructura presupuestal es requerida'
                ),
            ]"
            :default_value="models.budget_structure_id"
            @update:modelValue="models.budget_structure_id = $event"
          />
        </div>
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            required
            auto_complete
            clearable
            map_options
            :disabled="props.action === 'edit'"
            :label="'Estructura de recurso'"
            :manual_option="resource_catalog_structures"
            :placeholder="'Seleccione'"
            :rules="[
              (val) =>
                useRules().is_required(
                  val,
                  'La estructura de recurso es requerida'
                ),
            ]"
            :default_value="models.resource_structure_id"
            @update:modelValue="models.resource_structure_id = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            required
            auto_complete
            clearable
            map_options
            :disabled="props.action === 'edit'"
            :label="'Estructura contable'"
            :manual_option="chart_of_account_structures"
            :placeholder="'Seleccione'"
            :rules="[
              (val) =>
                useRules().is_required(
                  val,
                  'La estructura contable es requerida'
                ),
            ]"
            :default_value="models.accounting_structure_id ?? ''"
            @update:modelValue="models.accounting_structure_id = $event"
          />
        </div>

        <!-- Fila 2 -->
        <div class="col-12 col-md-4">
          <GenericInputComponent
            :disabled="props.action === 'edit'"
            @update:modelValue="models.code = $event"
            :label="'Código'"
            :required="true"
            placeholder="Inserte"
            max_length="60"
            :default_value="models.code"
            :rules="[
              (val) => useRules().is_required(val, 'El código es requerido'),
            ]"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            required
            :default_value="models.description"
            @update:modelValue="models.description = $event?.toUpperCase()"
            :label="'Descripción'"
            placeholder="Inserte"
            max_length="100"
            :rules="[
              (val) =>
                useRules().is_required(val, 'La descripción es requerida'),
            ]"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            :disabled="props.action === 'edit'"
            required
            auto_complete
            clearable
            map_options
            :label="'Tipo'"
            :manual_option="budget_item_types"
            :placeholder="'Seleccione'"
            :rules="[
              (val) => useRules().is_required(val, 'El tipo es requerido'),
            ]"
            :default_value="models.type ?? ''"
            @update:modelValue="models.type = $event"
          />
        </div>

        <!-- Fila 3 -->
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            :disabled="props.action === 'edit'"
            required
            auto_complete
            clearable
            map_options
            :label="'Naturaleza'"
            :manual_option="budget_item_nature"
            :placeholder="'Seleccione'"
            :rules="[
              (val) =>
                useRules().is_required(val, 'La naturaleza es requerida'),
            ]"
            :default_value="models.nature ?? ''"
            @update:modelValue="models.nature = $event"
          />
        </div>

        <div v-if="['edit'].includes(props.action)" class="col-12 col-md-4">
          <GenericSelectorComponent
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
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// Components
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import { useBudgetItemsForm } from '@/components/Forms/Budget/BudgetItems/BudgetItemsForm'
// Composables
import { useRules } from '@/composables'

// Interfaces & types
import { IBudgetItemsForm } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'

// Props
const props = defineProps<{
  action: ActionType
  data?: IBudgetItemsForm | null
}>()
const {
  models,
  budget_item_types,
  budget_item_nature,
  budget_item_structure,
  chart_of_account_structures,
  resource_catalog_structures,
  budget_items_statuses,
  getFormData,
  formInformation,
} = useBudgetItemsForm(props)
defineExpose({
  getFormData,
  models,
  validateForm: () => formInformation.value?.validate(),
})
</script>
