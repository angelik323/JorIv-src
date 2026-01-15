<template>
  <q-form ref="informationForm">
    <VCard :showBorder="false" class="no-mb-card">
      <template #content-card>
        <div class="q-pa-lg movements-table">
          <TableList
            :title="props.title"
            :columns="tableProps.columns"
            :rows="tableProps.rows"
            :custom-columns="customColumns"
            :hide-bottom="true"
            :hide-pagination="true"
            :rows-per-page-options="[0]"
            :loading="false"
          >
            <template v-if="action === 'create'" #custom-header-action>
              <div class="q-gutter-sm">
                <Button
                  :outline="false"
                  label="Agregar"
                  left-icon="PlusCircle"
                  color-icon="white"
                  :styleContent="{
                    'place-items': 'center',
                    'border-radius': '20px',
                    'font-size': '13px',
                  }"
                  @click="addRow"
                />
              </div>
            </template>

            <template #budget_level_level="{ row }">
              <GenericInput
                :default_value="row.budget_level.level"
                :placeholder="'Nivel'"
                :rules="[]"
                :disabled="true"
              />
            </template>

            <template #budget_level_description="{ row }">
              <GenericInput
                :default_value="row.budget_level.description"
                :placeholder="'Descripción nivel'"
                :rules="[]"
                :disabled="true"
              />
            </template>

            <template #class="{ row }">
              <GenericInput
                :default_value="row.class"
                :placeholder="'Clase'"
                :rules="[]"
                :disabled="true"
              />
            </template>

            <template #code_movement_code="{ row }">
              <GenericSelectorComponent
                :manual_option="movement_codes_source_destination"
                map_options
                clearable
                placeholder="Ingrese"
                required
                :default_value="row.code_movement.id || null"
                :rules="[
              (val: string) =>
                useRules().is_required(
                  val,
                  'El código de movimiento es requerido'
                ),
            ]"
                :disabled="false"
                @update:model-value="(val) => updateRowCode(row.id, val)"
              />
            </template>

            <template #code_movement_description="{ row }">
              <GenericInput
                :default_value="
                  getOptionLabel(
                    movement_codes_source_destination,
                    row.code_movement.id
                  )
                "
                :rules="[]"
                :disabled="true"
              />
            </template>

            <template #decrease_balance="{ row }">
              <div class="flex justify-center">
                <RadioYesNo
                  :model-value="!!row.decrease_balance"
                  @update:model-value="
                    (val) => toggleRowNature(row.id, 'decrease', val)
                  "
                  :is-radio-button="false"
                  :is-switch="false"
                />
              </div>
            </template>

            <template #increase_balance="{ row }">
              <div class="flex justify-center">
                <RadioYesNo
                  :model-value="!!row.increase_balance"
                  @update:model-value="
                    (val) => toggleRowNature(row.id, 'increase', val)
                  "
                  :is-radio-button="false"
                  :is-switch="false"
                  class-custom=""
                />
              </div>
            </template>

            <template v-if="action === 'create'" #actions="{ row }">
              <Button
                :left-icon="defaultIconsLucide.trash"
                color="orange"
                class-custom="custom"
                :outline="false"
                :flat="true"
                colorIcon="#f45100"
                :tooltip="'Eliminar'"
                @click="removeRow(row.id)"
              />
            </template>
          </TableList>
        </div>

        <section class="row justify-center q-gutter-sm">
          <Button
            outline
            label="Cancelar"
            size="md"
            unelevated
            color="orange"
            class="text-capitalize btn-filter custom"
            @click="$emit('cancel')"
          />

          <Button
            v-if="action === 'create'"
            :outline="false"
            label="Agregar"
            size="md"
            color="orange"
            class="text-capitalize btn-filter self-center custom"
            @click="onSubmit"
          />
          <Button
            v-else
            :outline="false"
            label="Actualizar"
            size="md"
            color="orange"
            unelevated
            class="text-capitalize btn-filter self-center custom"
            @click="onSubmit"
          />
        </section>
      </template>
    </VCard>
  </q-form>
</template>

<script setup lang="ts">
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import useInformationForm from '@/components/Forms/Budget/BudgetMovements/InformationForm'
import Button from '@/components/common/Button/Button.vue'
import { WriteActionType } from '@/interfaces/global'
import type { IBudgetMovementsList } from '@/interfaces/customs/budget/BudgetLevels'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import { useRules } from '@/composables'

const props = defineProps<{
  action?: WriteActionType
  editData?: IBudgetMovementsList | null
  title: string
  selectedBudgetLevelId?: number | null
}>()

defineExpose({
  validateForm: () => validateForm(),
  setFormData: (data: IBudgetMovementsList) => setFormData(data),
  addRow: () => addRow(),
  removeRow: (id: number) => removeRow(id),
  onSubmit: () => onSubmit(),
  resetForm: () => resetForm(),
})

const emit = defineEmits<{
  cancel: []
  submit: []
}>()

const {
  informationForm,
  movement_codes_source_destination,
  tableProps,
  customColumns,
  defaultIconsLucide,
  validateForm,
  onSubmit,
  resetForm,
  setFormData,
  addRow,
  removeRow,
  updateRowCode,
  toggleRowNature,
  getOptionLabel,
} = useInformationForm(props, emit)
</script>

<style
  lang="scss"
  scoped
  src="src/components/Forms/Budget/BudgetMovements/InformationForm.scss"
></style>
