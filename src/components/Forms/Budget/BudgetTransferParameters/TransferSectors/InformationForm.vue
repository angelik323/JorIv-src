<template>
  <q-form ref="formValidateElementRef" class="q-pa-lg">
    <section class="row q-col-gutter-x-md">
      <!-- Tipo de documento -->
      <div class="col-12 col-md-6">
        <GenericInputComponent
          label="Tipo de
        documento"
          placeholder="-"
          :default_value="
            getLabel(
              documentType ?? null,
              budget_document_transfer_type,
              'value',
              'label'
            )
          "
          disabled
        />
      </div>
      <div v-if="action !== 'create'" class="col-12 col-md-6">
        <GenericInputComponent
          label="Código"
          placeholder="-"
          :default_value="code ?? '-'"
          disabled
        />
      </div>
      <div v-else class="col-12 col-md-6"></div>

      <!-- Tabla traslados entre rubros -->
      <div class="col-12 mt-2">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :custom-columns="customsColumns"
          :hide-pagination="true"
          dense
        >
          <template #custom-header-action>
            <Button
              v-if="props.action !== 'view'"
              :outline="false"
              label="Agregar"
              left-icon="PlusCircle"
              color-icon="white"
              @click="handleAddRow"
            />
          </template>
          <template #from_budget_item_source_id="{ row }">
            <GenericSelectorComponent
              :manual_option="budget_item_codes_source_destination"
              map_options
              required
              clearable
              auto_complete
              :disabled="props.action === 'view'"
              :rules="[
                (val) =>
                  useRules().is_required(val, 'El área fuente es requerida'),
              ]"
              :default_value="row.from_budget_item_source_id"
              @update:modelValue="
                updateRow(row.id, 'from_budget_item_source_id', $event)
              "
            />
          </template>
          <template #from_description_item_source="{ row }">
            <GenericInputComponent
              :default_value="
                getLabel(
                  row.from_budget_item_source_id,
                  budget_item_codes_source_destination
                )
              "
              disabled
              placeholder="-"
            />
          </template>
          <template #to_budget_item_source_id="{ row }">
            <GenericSelectorComponent
              :manual_option="budget_item_codes_source_destination"
              map_options
              required
              clearable
              auto_complete
              :disabled="props.action === 'view'"
              :rules="[
                (val) =>
                  useRules().is_required(val, 'El área fuente es requerida'),
              ]"
              :default_value="row.to_budget_item_source_id"
              @update:modelValue="
                updateRow(row.id, 'to_budget_item_source_id', $event)
              "
            />
          </template>
          <template #to_description_item_source="{ row }">
            <GenericInputComponent
              :default_value="
                getLabel(
                  row.to_budget_item_source_id,
                  budget_item_codes_source_destination
                )
              "
              disabled
              placeholder="-"
            />
          </template>
          <template #from_budget_item_target_id="{ row }">
            <GenericSelectorComponent
              :manual_option="budget_item_codes_source_destination"
              map_options
              required
              clearable
              auto_complete
              :disabled="props.action === 'view'"
              :rules="[
                (val) =>
                  useRules().is_required(val, 'El área destino es requerida'),
              ]"
              :default_value="row.from_budget_item_target_id"
              @update:modelValue="
                updateRow(row.id, 'from_budget_item_target_id', $event)
              "
            />
          </template>
          <template #from_description_item_target="{ row }">
            <GenericInputComponent
              :default_value="
                getLabel(
                  row.from_budget_item_target_id,
                  budget_item_codes_source_destination
                )
              "
              disabled
              placeholder="-"
            />
          </template>
          <template #to_budget_item_target_id="{ row }">
            <GenericSelectorComponent
              :manual_option="budget_item_codes_source_destination"
              map_options
              required
              clearable
              auto_complete
              :disabled="props.action === 'view'"
              :rules="[
                (val) =>
                  useRules().is_required(val, 'El área destino es requerida'),
              ]"
              :default_value="row.to_budget_item_target_id"
              @update:modelValue="
                updateRow(row.id, 'to_budget_item_target_id', $event)
              "
            />
          </template>
          <template #to_description_item_target="{ row }">
            <GenericInputComponent
              :default_value="
                getLabel(
                  row.to_budget_item_target_id,
                  budget_item_codes_source_destination
                )
              "
              disabled
              placeholder="-"
            />
          </template>
          <!-- Acciones -->
          <template
            v-if="['create', 'edit'].includes(props.action)"
            #actions="{ row }"
          >
            <Button
              v-if="
                validateRouter(
                  'Budget',
                  'BudgetTransferParametersList',
                  'delete'
                ) && props.action !== 'view'
              "
              flat
              :outline="false"
              :left-icon="defaultIconsLucide.trash"
              color-icon="#f45100"
              tooltip="Eliminar"
              @click="handleDelete(row.id)"
            />
          </template>
        </TableList>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
//Core
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
//Interfaces
import type { IBudgetTransferSectorCreate } from '@/interfaces/customs/budget/BudgetTransferParameter'
import type { ActionType } from '@/interfaces/global/Action'
//Logic view
import useTransferSectorsForm from '@/components/Forms/Budget/BudgetTransferParameters/TransferSectors/InformationForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IBudgetTransferSectorCreate[]
    documentType?: number | string | null
    code?: string | null
  }>(),
  {}
)

const {
  formRef,
  models,
  tableProps,
  budget_item_codes_source_destination,
  customsColumns,
  defaultIconsLucide,
  budget_document_transfer_type,
  useRules,
  validateRouter,
  handleAddRow,
  handleDelete,
  getLabel,
  updateRow,
} = useTransferSectorsForm({
  action: props.action,
  data: props.data,
})

defineExpose({
  validateForm: () => formRef.value?.validate(),
  getFormData: () => models.value,
})
</script>
