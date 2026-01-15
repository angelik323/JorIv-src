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

      <!-- Tabla traslados entre áreas -->
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
          <template #from_area_source_id="{ row }">
            <GenericSelectorComponent
              :manual_option="areas_resposabilities_codes"
              map_options
              required
              clearable
              auto_complete
              :disabled="props.action === 'view'"
              :rules="[
                (val) =>
                  useRules().is_required(val, 'El área fuente es requerida'),
              ]"
              :default_value="row.from_area_source_id"
              @update:modelValue="
                updateRow(row.id, 'from_area_source_id', $event)
              "
            />
          </template>
          <template #from_description_area_source="{ row }">
            <GenericInputComponent
              :default_value="
                getLabel(
                  row?.from_area_source_id,
                  areas_resposabilities_codes,
                  'value',
                  'description'
                )
              "
              disabled
              placeholder="-"
            />
          </template>
          <template #to_area_source_id="{ row }">
            <GenericSelectorComponent
              :manual_option="areas_resposabilities_codes"
              map_options
              required
              clearable
              auto_complete
              :disabled="props.action === 'view'"
              :rules="[
                (val) =>
                  useRules().is_required(val, 'El área fuente es requerida'),
              ]"
              :default_value="row.to_area_source_id"
              @update:modelValue="
                updateRow(row.id, 'to_area_source_id', $event)
              "
            />
          </template>
          <template #to_description_area_source="{ row }">
            <GenericInputComponent
              :default_value="
                getLabel(
                  row.to_area_source_id,
                  areas_resposabilities_codes,
                  'value',
                  'description'
                )
              "
              disabled
              placeholder="-"
            />
          </template>
          <template #from_area_target_id="{ row }">
            <GenericSelectorComponent
              :manual_option="areas_resposabilities_codes"
              map_options
              required
              clearable
              auto_complete
              :disabled="props.action === 'view'"
              :rules="[
                (val) =>
                  useRules().is_required(val, 'El área destino es requerida'),
              ]"
              :default_value="row.from_area_target_id"
              @update:modelValue="
                updateRow(row.id, 'from_area_target_id', $event)
              "
            />
          </template>
          <template #from_description_area_target="{ row }">
            <GenericInputComponent
              :default_value="
                getLabel(
                  row.from_area_target_id,
                  areas_resposabilities_codes,
                  'value',
                  'description'
                )
              "
              disabled
              placeholder="-"
            />
          </template>
          <template #to_area_target_id="{ row }">
            <GenericSelectorComponent
              :manual_option="areas_resposabilities_codes"
              map_options
              required
              clearable
              auto_complete
              :disabled="props.action === 'view'"
              :rules="[
                (val) =>
                  useRules().is_required(val, 'El área destino es requerida'),
              ]"
              :default_value="row.to_area_target_id"
              @update:modelValue="
                updateRow(row.id, 'to_area_target_id', $event)
              "
            />
          </template>
          <template #to_description_area_target="{ row }">
            <GenericInputComponent
              :default_value="
                getLabel(
                  row.to_area_target_id,
                  areas_resposabilities_codes,
                  'value',
                  'description'
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
import type { ActionType } from '@/interfaces/global/Action'
import type { IBudgetTransferAreaCreate } from '@/interfaces/customs/budget/BudgetTransferParameter'
//Logic view
import useTransferAreasForm from '@/components/Forms/Budget/BudgetTransferParameters/TransferAreas/InformationForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IBudgetTransferAreaCreate[]
    documentType?: number | string | null
    code?: string | null
  }>(),
  {}
)

const {
  tableProps,
  areas_resposabilities_codes,
  customsColumns,
  defaultIconsLucide,
  formRef,
  models,
  budget_document_transfer_type,
  useRules,
  validateRouter,
  getLabel,
  handleAddRow,
  handleDelete,
  updateRow,
} = useTransferAreasForm({
  action: props.action,
  data: props.data,
})

defineExpose({
  validateForm: () => formRef.value?.validate(),
  getFormData: () => models.value.map(({ id, ...rest }) => rest),
})
</script>
