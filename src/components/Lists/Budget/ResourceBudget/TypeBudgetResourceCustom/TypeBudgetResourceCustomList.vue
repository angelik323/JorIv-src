<template>
  <section
    class="q-mt-lg q-mx-lg editable-table hide-arrows-number-input"
    ref="tableRef"
  >
    <TableList
      :title="tableProps.title"
      :loading="tableProps.loading"
      :columns="tableProps.columns"
      :rows="tableProps.rows"
      :custom-columns="customColumns"
      :hide-pagination="true"
      :rows-per-page-options="[0]"
    >
      <template v-if="actionModal === 'create'" #custom-header-action>
        <Button
          :outline="false"
          label="Agregar"
          size="md"
          color="orange"
          colorIcon="white"
          :left-icon="defaultIconsLucide.plusCircleOutline"
          @click="addEmptyRow()"
        />
      </template>
      <!-- Columna código -->
      <template #code="{ row }">
        <GenericInputComponent
          :disabled="['edit'].includes(actionModal)"
          :required="true"
          type="number"
          :default_value="row.code ?? ''"
          :rules="[
            (val) => useRules().is_required(val, 'El código es requerido'),
            (val) => useRules().max_length(val, 3),
            (val) => useRules().only_positive_value(val),
          ]"
          @update:model-value="row.code = $event"
        />
      </template>

      <!-- Columna descripción -->
      <template #description="{ row }">
        <GenericInputComponent
          :required="true"
          type="text"
          :default_value="row.description ?? ''"
          :rules="[
            (val) => useRules().is_required(val, 'La descripción es requerida'),
            (val) => useRules().max_length(val, 100),
          ]"
          @update:model-value="row.description = $event.toUpperCase()"
        />
      </template>

      <!-- Columna acciones -->
      <template v-if="actionModal === 'create'" #actions="{ row }">
        <Button
          :outline="false"
          :left-icon="defaultIconsLucide.trash"
          color="orange"
          flat
          colorIcon="#f45100"
          tooltip="Eliminar"
          @click="clearData(row.id)"
        />
      </template>

      <template #custom-no-data>
        <div class="row justify-center mt-4">
          <div>
            <img src="@/assets/images/icons/no_data_2.svg" alt="No data" />
          </div>
        </div>
        <p class="text-weight-bold text-h6 text-center">
          Actualmente no hay tipos de recurso
        </p>
        <p class="text-weight-light text-h6 text-center">
          Por favor, agregue uno para continuar el proceso
        </p>
      </template>
    </TableList>
  </section>
</template>

<script setup lang="ts">
// Components
import TableList from '@/components/table-list/TableList.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import Button from '@/components/common/Button/Button.vue'
// Interfaces
import { ActionType } from '@/interfaces/global'
import { IBudgetResourceType } from '@/interfaces/customs/budget/ResourceBudget'
// composables
import { useRules } from '@/composables'
// logic view
import useTypeBudgetResourceCustomList from '@/components/Lists/Budget/ResourceBudget/TypeBudgetResourceCustom/TypeBudgetResourceCustomList'

const props = defineProps<{
  actionModal: ActionType
  data: IBudgetResourceType
}>()

// Composable que contiene la lógica
const {
  tableProps,
  customColumns,
  defaultIconsLucide,
  clearData,
  getRowData,
  addEmptyRow,
  getAllRowsData,
  tableRef,
} = useTypeBudgetResourceCustomList(props)

defineExpose({
  getRowData,
  getAllRowsData,
  validateForm: () => tableRef.value?.validate(),
})
</script>
